import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Types
export type DeviceType = 'light' | 'fan';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: 'on' | 'off';
  powerWatts: number;
  runningTimeHours: number;
  lastChanged: string;
  roomId: string;
  roomName: string;
}

export interface RoomCamera {
  roomId: string;
  roomName: string;
  status: 'online' | 'offline';
  isOccupied: boolean;
  peopleCount: number;
  lastDetectionTime: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  roomId: string;
  roomName: string;
  title: string;
  description: string;
  status: 'active' | 'resolved';
}

export interface NotificationItem {
  id: string;
  type: 'energy' | 'device' | 'camera' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface RoomData {
  id: string;
  name: string;
  devices: Device[];
  camera: RoomCamera;
}

// Helpers to generate initial devices for a room
const createInitialDevices = (roomId: string, roomName: string): Device[] => {
  const devices: Device[] = [];
  // 3 Lights
  for (let i = 1; i <= 3; i++) {
    devices.push({
      id: `${roomId}-light-${i}`,
      name: `${roomName} Light ${i}`,
      type: 'light',
      status: i === 1 ? 'on' : 'off',
      powerWatts: i === 1 ? 15 : 0,
      runningTimeHours: Math.round((2.5 + i * 1.2) * 10) / 10,
      lastChanged: new Date(Date.now() - (1000 * 60 * (i * 15 + 10))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomId,
      roomName,
    });
  }
  // 2 Fans
  for (let i = 1; i <= 2; i++) {
    devices.push({
      id: `${roomId}-fan-${i}`,
      name: `${roomName} Fan ${i}`,
      type: 'fan',
      status: i === 1 ? 'on' : 'off',
      powerWatts: i === 1 ? 75 : 0,
      runningTimeHours: Math.round((4.0 + i * 2.1) * 10) / 10,
      lastChanged: new Date(Date.now() - (1000 * 60 * (i * 45 + 5))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomId,
      roomName,
    });
  }
  return devices;
};

// Initial state data
let rooms: RoomData[] = [
  {
    id: 'drawing',
    name: 'Drawing Room',
    devices: createInitialDevices('drawing', 'Drawing Room'),
    camera: {
      roomId: 'drawing',
      roomName: 'Drawing Room',
      status: 'online',
      isOccupied: true,
      peopleCount: 4,
      lastDetectionTime: '02:14 PM',
    }
  },
  {
    id: 'work1',
    name: 'Work Room 1',
    devices: createInitialDevices('work1', 'Work Room 1'),
    camera: {
      roomId: 'work1',
      roomName: 'Work Room 1',
      status: 'online',
      isOccupied: true,
      peopleCount: 6,
      lastDetectionTime: '02:22 PM',
    }
  },
  {
    id: 'work2',
    name: 'Work Room 2',
    devices: createInitialDevices('work2', 'Work Room 2'),
    camera: {
      roomId: 'work2',
      roomName: 'Work Room 2',
      status: 'online',
      isOccupied: false,
      peopleCount: 0,
      lastDetectionTime: '01:50 PM',
    }
  }
];

let alerts: Alert[] = [
  {
    id: 'alert-1',
    timestamp: '02:10 PM',
    severity: 'high',
    roomId: 'work2',
    roomName: 'Work Room 2',
    title: 'Room Empty but Devices ON',
    description: 'Work Room 2 is completely unoccupied but 2 devices are still running (Light 1 & Fan 1).',
    status: 'active',
  },
  {
    id: 'alert-2',
    timestamp: '01:30 PM',
    severity: 'low',
    roomId: 'drawing',
    roomName: 'Drawing Room',
    title: 'High Power Consumption',
    description: 'Cumulative drawing room load exceeded safety baseline thresholds (90 Watts).',
    status: 'resolved',
  }
];

let notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Possible Energy Waste',
    message: 'Work Room 2 is detected empty while Light 1 is ON.',
    timestamp: '5 min ago',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'camera',
    title: 'AI Camera Event',
    message: '4 people detected entering Drawing Room.',
    timestamp: '15 min ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'energy',
    title: 'Daily Limit Approaching',
    message: 'Office today energy usage has crossed 80% of daily target baseline.',
    timestamp: '1 hour ago',
    read: true,
  }
];

const generateUniqueId = (prefix: string) => {
  const rand = Math.floor(Math.random() * 100000000);
  return `${prefix}-${Date.now()}-${rand}`;
};

// Backend simulator simulation ticks
setInterval(() => {
  rooms = rooms.map(room => {
    // 1. Simulate minor wattage noise for active devices (e.g. ±1-2 Watts fluctuations)
    const updatedDevices = room.devices.map(dev => {
      if (dev.status === 'on') {
        const basePower = dev.type === 'light' ? 15 : 75;
        const noise = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const finalPower = Math.max(8, basePower + noise);
        const updatedRunTime = Math.round((dev.runningTimeHours + 0.01) * 100) / 100;
        
        return {
          ...dev,
          powerWatts: finalPower,
          runningTimeHours: updatedRunTime
        };
      }
      return dev;
    });

    // 2. Random occupancy updates for real-time engagement
    let updatedCamera = { ...room.camera };
    if (Math.random() > 0.85) {
      const isNowOccupied = Math.random() > 0.4;
      const newPeopleCount = isNowOccupied ? Math.floor(Math.random() * 6) + 1 : 0;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      updatedCamera = {
        ...room.camera,
        isOccupied: isNowOccupied,
        peopleCount: newPeopleCount,
        lastDetectionTime: nowStr,
      };

      // Trigger alerts/notifications if empty and devices are ON
      const activeDevicesCount = updatedDevices.filter(d => d.status === 'on').length;
      if (!isNowOccupied && activeDevicesCount > 0) {
        const newAlertId = generateUniqueId('alert');
        const newAlert: Alert = {
          id: newAlertId,
          timestamp: nowStr,
          severity: 'medium',
          roomId: room.id,
          roomName: room.name,
          title: 'Room Empty but Devices ON',
          description: `${room.name} was left empty with ${activeDevicesCount} devices active. Possible energy waste detected.`,
          status: 'active'
        };

        alerts = [newAlert, ...alerts];

        const newNotif: NotificationItem = {
          id: generateUniqueId('notif'),
          type: 'alert',
          title: 'Possible Energy Waste',
          message: `${room.name} is unoccupied but devices are running.`,
          timestamp: 'Just now',
          read: false
        };
        notifications = [newNotif, ...notifications];
      } else if (isNowOccupied) {
        const newNotif: NotificationItem = {
          id: generateUniqueId('notif'),
          type: 'camera',
          title: 'AI Occupancy Update',
          message: `${newPeopleCount} people detected in ${room.name}.`,
          timestamp: 'Just now',
          read: false
        };
        notifications = [newNotif, ...notifications];
      }
    }

    return {
      ...room,
      devices: updatedDevices,
      camera: updatedCamera
    };
  });
}, 3500);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: GET current state
  app.get("/api/state", (req, res) => {
    res.json({
      success: true,
      rooms,
      alerts,
      notifications
    });
  });

  // API Route: POST toggle device
  app.post("/api/device/toggle", (req, res) => {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: "Missing deviceId" });
    }

    let matchedDevice: Device | null = null;

    rooms = rooms.map(room => {
      const hasDevice = room.devices.some(d => d.id === deviceId);
      if (!hasDevice) return room;

      const updatedDevices = room.devices.map(d => {
        if (d.id === deviceId) {
          const nextStatus = d.status === 'on' ? 'off' : 'on';
          const basePower = d.type === 'light' ? 15 : 75;
          const updatedPower = nextStatus === 'on' ? basePower : 0;
          const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          matchedDevice = {
            ...d,
            status: nextStatus,
            powerWatts: updatedPower,
            lastChanged: nowTimeStr,
          };
          return matchedDevice;
        }
        return d;
      });

      // Trigger warning check
      const anyOn = updatedDevices.some(d => d.status === 'on');
      const emptyRoom = !room.camera.isOccupied;
      
      if (emptyRoom && anyOn) {
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newAlertId = generateUniqueId('alert-dev');
        const newAlert: Alert = {
          id: newAlertId,
          timestamp: nowStr,
          severity: 'medium',
          roomId: room.id,
          roomName: room.name,
          title: 'Room Empty but Devices ON',
          description: `${room.name} has devices active while empty.`,
          status: 'active'
        };
        const alreadyExists = alerts.some(a => a.roomId === room.id && a.status === 'active' && a.title === 'Room Empty but Devices ON');
        if (!alreadyExists) {
          alerts = [newAlert, ...alerts];
        }
      }

      return {
        ...room,
        devices: updatedDevices
      };
    });

    if (!matchedDevice) {
      return res.status(404).json({ success: false, error: "Device not found" });
    }

    // Generate broadcast notification
    const newNotif: NotificationItem = {
      id: generateUniqueId('notif-dev'),
      type: 'device',
      title: 'Device State Broadcast',
      message: `${(matchedDevice as Device).name} was turned ${(matchedDevice as Device).status.toUpperCase()}.`,
      timestamp: 'Just now',
      read: false
    };
    notifications = [newNotif, ...notifications];

    res.json({
      success: true,
      device: matchedDevice,
      rooms,
      alerts,
      notifications
    });
  });

  // API Route: POST toggle room occupancy
  app.post("/api/room/occupancy", (req, res) => {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ success: false, error: "Missing roomId" });
    }

    rooms = rooms.map(room => {
      if (room.id !== roomId) return room;
      const nextOccupied = !room.camera.isOccupied;
      const count = nextOccupied ? 3 : 0;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (nextOccupied) {
        alerts = alerts.map(a => {
          if (a.roomId === roomId && a.title === 'Room Empty but Devices ON') {
            return { ...a, status: 'resolved' };
          }
          return a;
        });
      }

      return {
        ...room,
        camera: {
          ...room.camera,
          isOccupied: nextOccupied,
          peopleCount: count,
          lastDetectionTime: nowStr,
        }
      };
    });

    res.json({
      success: true,
      rooms,
      alerts,
      notifications
    });
  });

  // API Route: POST resolve alert
  app.post("/api/alert/resolve", (req, res) => {
    const { alertId } = req.body;
    if (!alertId) {
      return res.status(400).json({ success: false, error: "Missing alertId" });
    }

    const item = alerts.find(a => a.id === alertId);
    alerts = alerts.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a);

    if (item) {
      const newNotif: NotificationItem = {
        id: generateUniqueId('notif-res'),
        type: 'alert',
        title: 'Alert Resolved',
        message: `Alert: "${item.title}" in ${item.roomName} resolved.`,
        timestamp: 'Just now',
        read: false
      };
      notifications = [newNotif, ...notifications];
    }

    res.json({
      success: true,
      alerts,
      notifications
    });
  });

  // API Route: POST read notification(s)
  app.post("/api/notifications/read", (req, res) => {
    const { notificationId, all } = req.body;

    if (all) {
      notifications = notifications.map(n => ({ ...n, read: true }));
    } else if (notificationId) {
      notifications = notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    }

    res.json({
      success: true,
      notifications
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

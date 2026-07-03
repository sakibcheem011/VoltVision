import { RoomData, Alert, NotificationItem, Device } from '../models/types';
import { generateUniqueId } from '../utils/helpers';

// Helper to generate initial devices for a room
const createInitialDevices = (roomId: string, roomName: string): Device[] => {
  const devices: Device[] = [];
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

class IoTService {
  public rooms: RoomData[] = [];
  public alerts: Alert[] = [];
  public notifications: NotificationItem[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    this.rooms = [
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

    this.alerts = [
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

    this.notifications = [
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
  }

  public getRooms() {
    return this.rooms;
  }

  public getAlerts() {
    return this.alerts;
  }

  public getNotifications() {
    return this.notifications;
  }
  
  public getRoomById(id: string) {
    return this.rooms.find(r => r.id === id);
  }
  
  public getDeviceById(id: string) {
    for (const r of this.rooms) {
      const dev = r.devices.find(d => d.id === id);
      if (dev) return dev;
    }
    return null;
  }
  
  public getAllDevices() {
    return this.rooms.flatMap(r => r.devices);
  }

  public addAlert(alert: Alert) {
    const existing = this.alerts.find(a => a.roomId === alert.roomId && a.status === 'active' && a.title === alert.title);
    if (!existing) {
      this.alerts = [alert, ...this.alerts];
      return true;
    }
    return false;
  }

  public addNotification(notification: NotificationItem) {
    this.notifications = [notification, ...this.notifications];
  }

  public resolveAlert(alertId: string) {
    const item = this.alerts.find(a => a.id === alertId);
    if (item) {
      this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a);
      this.addNotification({
        id: generateUniqueId('notif-res'),
        type: 'alert',
        title: 'Alert Resolved',
        message: `Alert: "${item.title}" in ${item.roomName} resolved.`,
        timestamp: 'Just now',
        read: false
      });
      return true;
    }
    return false;
  }
  
  public markNotificationsRead(notificationId?: string, all?: boolean) {
    if (all) {
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    } else if (notificationId) {
      this.notifications = this.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    }
  }

  public toggleDevice(deviceId: string) {
    let matchedDevice: Device | null = null;
    let anyChanged = false;

    this.rooms = this.rooms.map(room => {
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
      anyChanged = true;
      return {
        ...room,
        devices: updatedDevices
      };
    });

    if (matchedDevice) {
      this.addNotification({
        id: generateUniqueId('notif-dev'),
        type: 'device',
        title: 'Device State Broadcast',
        message: `${(matchedDevice as Device).name} was turned ${(matchedDevice as Device).status.toUpperCase()}.`,
        timestamp: 'Just now',
        read: false
      });
    }

    return matchedDevice;
  }

  public toggleRoomOccupancy(roomId: string) {
    let roomFound = false;
    this.rooms = this.rooms.map(room => {
      if (room.id !== roomId) return room;
      roomFound = true;
      const nextOccupied = !room.camera.isOccupied;
      const count = nextOccupied ? 3 : 0;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (nextOccupied) {
        this.alerts = this.alerts.map(a => {
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
    return roomFound;
  }
}

export const iotService = new IoTService();

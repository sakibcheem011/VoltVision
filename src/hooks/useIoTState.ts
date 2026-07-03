import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, RoomCamera, Alert, NotificationItem, RoomData, DeviceType } from '../types';

// Helper to generate initial devices for a room
const createInitialDevices = (roomId: string, roomName: string): Device[] => {
  const devices: Device[] = [];
  // 3 Lights
  for (let i = 1; i <= 3; i++) {
    devices.push({
      id: `${roomId}-light-${i}`,
      name: `${roomName} Light ${i}`,
      type: 'light',
      status: i === 1 ? 'on' : 'off', // some initially on
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

// Initial Room setup
const initialRoomsList = (): RoomData[] => [
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
      lastDetectionTime: '01:50 PM', // Empty, but note that the default state has devices turned ON, which triggers the AI Camera warning!
    }
  }
];

// Initial Alerts
const initialAlertsList = (): Alert[] => [
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

// Initial Notifications
const initialNotificationsList = (): NotificationItem[] => [
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

export function useIoTState() {
  const [rooms, setRooms] = useState<RoomData[]>(initialRoomsList);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlertsList);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotificationsList);
  
  // Simulation controllers
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLiveConnection, setIsLiveConnection] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Real-time chart values tracking
  const [livePowerData, setLivePowerData] = useState<{ time: string; value: number }[]>([
    { time: '14:15', value: 165 },
    { time: '14:16', value: 172 },
    { time: '14:17', value: 170 },
    { time: '14:18', value: 168 },
    { time: '14:19', value: 180 },
    { time: '14:20', value: 175 },
    { time: '14:21', value: 182 },
    { time: '14:22', value: 180 },
    { time: '14:23', value: 185 },
    { time: '14:24', value: 180 },
  ]);

  // Initial mount check to detect and sync with live backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setRooms(data.rooms);
            setAlerts(data.alerts);
            setNotifications(data.notifications);
            setIsBackendConnected(true);
          }
        }
      } catch (err) {
        console.warn('Live backend server not connected yet. Running mock API simulation.');
        setIsBackendConnected(false);
      }
    };
    checkBackend();
  }, []);

  // Handle simulated "Socket.IO" event emission updates or poll active backend
  useEffect(() => {
    if (!isLiveConnection || isLoading || isError || isEmpty) return;

    const interval = setInterval(async () => {
      if (isBackendConnected) {
        // Connected to backend simulator: Poll state to sync background updates (e.g. Socket.IO simulation on backend)
        try {
          const res = await fetch('/api/state');
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setRooms(data.rooms);
              setAlerts(data.alerts);
              setNotifications(data.notifications);
            }
          }
        } catch (err) {
          console.error('Error polling backend state, reverting to mock API state:', err);
          setIsBackendConnected(false);
        }
      } else {
        // Offline / disconnected backend fallback: Simulate updates on client side
        setRooms(prevRooms => {
          return prevRooms.map(room => {
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

              // Trigger alerts/notifications if empty and devices are ON (Energy Waste Warning!)
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

                setAlerts(prev => [newAlert, ...prev]);

                const newNotif: NotificationItem = {
                  id: generateUniqueId('notif'),
                  type: 'alert',
                  title: 'Possible Energy Waste',
                  message: `${room.name} is unoccupied but devices are running.`,
                  timestamp: 'Just now',
                  read: false
                };
                setNotifications(prev => [newNotif, ...prev]);
              } else if (isNowOccupied) {
                const newNotif: NotificationItem = {
                  id: generateUniqueId('notif'),
                  type: 'camera',
                  title: 'AI Occupancy Update',
                  message: `${newPeopleCount} people detected in ${room.name}.`,
                  timestamp: 'Just now',
                  read: false
                };
                setNotifications(prev => [newNotif, ...prev]);
              }
            }

            return {
              ...room,
              devices: updatedDevices,
              camera: updatedCamera
            };
          });
        });
      }

      // Update Live charts data
      setLivePowerData(prev => {
        // Calculate current total power
        const currentPower = rooms.reduce((sum, r) => 
          sum + r.devices.reduce((dSum, d) => dSum + (d.status === 'on' ? d.powerWatts : 0), 0)
        , 0);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const nextData = [...prev.slice(1), { time: timeStr, value: currentPower }];
        return nextData;
      });

    }, 3500);

    return () => clearInterval(interval);
  }, [rooms, isLiveConnection, isLoading, isError, isEmpty, isBackendConnected]);

  // API Call: Toggle device ON/OFF (Asynchronous and backend-driven)
  const toggleDevice = useCallback(async (deviceId: string) => {
    // 1. Attempt to post request to Backend Simulator API
    try {
      const res = await fetch('/api/device/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Display ONLY the updated device and states returned by backend
          setRooms(data.rooms);
          setAlerts(data.alerts);
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend server not connected. Simulating via mock API response...');
    }

    // 2. Until backend is connected, use mock API response simulation (latency simulated)
    // Delay state change by 350ms to mimic server round-trip latency.
    await new Promise(resolve => setTimeout(resolve, 350));

    setRooms(prevRooms => {
      let isChanged = false;
      const nextRooms = prevRooms.map(room => {
        const hasDevice = room.devices.some(d => d.id === deviceId);
        if (!hasDevice) return room;

        isChanged = true;
        const updatedDevices = room.devices.map(d => {
          if (d.id === deviceId) {
            const nextStatus = d.status === 'on' ? 'off' : 'on';
            const basePower = d.type === 'light' ? 15 : 75;
            const updatedPower = nextStatus === 'on' ? basePower : 0;
            const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return {
              ...d,
              status: nextStatus,
              powerWatts: updatedPower,
              lastChanged: nowTimeStr,
            };
          }
          return d;
        });

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
          setAlerts(prev => {
            const alreadyExists = prev.some(a => a.roomId === room.id && a.status === 'active' && a.title === 'Room Empty but Devices ON');
            return alreadyExists ? prev : [newAlert, ...prev];
          });
        }

        return {
          ...room,
          devices: updatedDevices
        };
      });

      if (isChanged) {
        const matchedDevice = prevRooms.flatMap(r => r.devices).find(d => d.id === deviceId);
        if (matchedDevice) {
          const stateLabel = matchedDevice.status === 'on' ? 'OFF' : 'ON';
          const newNotif: NotificationItem = {
            id: generateUniqueId('notif-dev'),
            type: 'device',
            title: 'Device State Broadcast',
            message: `${matchedDevice.name} was turned ${stateLabel}.`,
            timestamp: 'Just now',
            read: false
          };
          setNotifications(prev => [newNotif, ...prev]);
        }
      }

      return nextRooms;
    });
  }, []);

  // Set occupancy manually (wired to backend or fallback simulation)
  const toggleRoomOccupancy = useCallback(async (roomId: string) => {
    try {
      const res = await fetch('/api/room/occupancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRooms(data.rooms);
          setAlerts(data.alerts);
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          return;
        }
      }
    } catch (err) {
      // Ignored: fallback to offline simulation
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const nextOccupied = !room.camera.isOccupied;
      const count = nextOccupied ? 3 : 0;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (nextOccupied) {
        setAlerts(prevAlerts => prevAlerts.map(a => {
          if (a.roomId === roomId && a.title === 'Room Empty but Devices ON') {
            return { ...a, status: 'resolved' };
          }
          return a;
        }));
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
    }));
  }, []);

  // API Call: Resolve alert
  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      const res = await fetch('/api/alert/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAlerts(data.alerts);
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          return;
        }
      }
    } catch (err) {
      // Ignored: fallback to offline simulation
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    const item = alerts.find(a => a.id === alertId);
    if (item) {
      setNotifications(prev => [{
        id: generateUniqueId('notif-res'),
        type: 'alert',
        title: 'Alert Resolved',
        message: `Alert: "${item.title}" in ${item.roomName} resolved.`,
        timestamp: 'Just now',
        read: false
      }, ...prev]);
    }
  }, [alerts]);

  // Notifications API helpers
  const markNotificationRead = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          return;
        }
      }
    } catch (err) {
      // Ignored: fallback to offline simulation
    }

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          return;
        }
      }
    } catch (err) {
      // Ignored: fallback to offline simulation
    }

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // System triggers for preview purposes
  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const triggerError = () => {
    setIsError(true);
  };

  const recoverFromError = () => {
    setIsError(false);
  };

  const triggerEmpty = () => {
    setIsEmpty(prev => !prev);
  };

  // Derive global metrics from rooms & devices
  const allDevices = isEmpty ? [] : rooms.flatMap(r => r.devices);
  const totalDevices = allDevices.length;
  const devicesOn = allDevices.filter(d => d.status === 'on').length;
  
  // Calculate total power
  const currentPowerWatts = allDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.powerWatts : 0), 0);

  // Today energy usage kWh (sum of baseline running hours + dynamic increases)
  // Let's compute a gorgeous, proportional baseline:
  // Baseline is around 12.4 kWh, increases over time
  const totalHoursOn = allDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.runningTimeHours : 0), 0);
  const todayEnergyKwh = Math.round((12.45 + (totalHoursOn * 0.05)) * 100) / 100;
  
  // Cost = kWh * 12 BDT rate
  const estimatedCostToday = Math.round((todayEnergyKwh * 12) * 100) / 100;

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return {
    rooms: isEmpty ? [] : rooms,
    allDevices,
    alerts,
    notifications,
    livePowerData,
    metrics: {
      totalDevices,
      devicesOn,
      currentPowerWatts,
      todayEnergyKwh,
      estimatedCostToday,
      activeAlertsCount,
    },
    isLoading,
    isError,
    isEmpty,
    isLiveConnection,
    setIsLiveConnection,
    isBackendConnected,
    toggleDevice,
    toggleRoomOccupancy,
    resolveAlert,
    markNotificationRead,
    markAllNotificationsRead,
    triggerLoading,
    triggerError,
    recoverFromError,
    triggerEmpty,
  };
}

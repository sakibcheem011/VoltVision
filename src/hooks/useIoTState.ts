import { useState, useEffect, useCallback } from 'react';
import { Device, Alert, NotificationItem, RoomData } from '../types';

export function useIoTState() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Simulation controllers
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLiveConnection, setIsLiveConnection] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Real-time chart values tracking
  const [livePowerData, setLivePowerData] = useState<{ time: string; value: number }[]>([]);
  
  // Metrics from backend
  const [metricsData, setMetricsData] = useState({
    todayEnergyKwh: 0,
    estimatedCostToday: 0
  });

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchBackendData = useCallback(async () => {
    try {
      const [stateRes, usageRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/api/state`),
        fetch(`${API_BASE}/api/usage`),
        fetch(`${API_BASE}/api/history`)
      ]);

      if (stateRes.ok && usageRes.ok && historyRes.ok) {
        const stateData = await stateRes.json();
        const usageData = await usageRes.json();
        const historyData = await historyRes.json();

        if (stateData.success) {
          setRooms(stateData.rooms);
          setAlerts(stateData.alerts);
          setNotifications(stateData.notifications);
          
          setMetricsData({
            todayEnergyKwh: usageData.todayEnergyKwh,
            estimatedCostToday: usageData.estimatedCostToday
          });
          
          // Only update history once initially, then we will append to it on the client
          // to create a rolling chart, or we could just use the backend history if it updates.
          // Since backend mock history is static, we will append locally for the chart effect,
          // OR we can just use the backend data. The requirements say:
          // "energy analytics, and power usage must all come from the backend."
          // If the backend history is static, we can append new power readings to it.
          setLivePowerData(prev => {
            if (prev.length === 0) return historyData;
            
            const currentPower = usageData.currentPowerWatts;
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            return [...prev.slice(1), { time: timeStr, value: currentPower }];
          });

          setIsBackendConnected(true);
          setIsError(false);
          setIsEmpty(stateData.rooms.length === 0);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
        setIsBackendConnected(false);
      }
    } catch (err) {
      console.error('Backend connection error:', err);
      setIsError(true);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial mount check to detect and sync with live backend
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Handle polling updates
  useEffect(() => {
    if (!isLiveConnection || isLoading || isError || isEmpty) return;

    const interval = setInterval(() => {
      fetchBackendData();
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveConnection, isLoading, isError, isEmpty, fetchBackendData]);

  // API Call: Toggle device ON/OFF
  const toggleDevice = useCallback(async (deviceId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/device/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRooms(data.rooms);
          setAlerts(data.alerts);
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          setIsError(false);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error('Error toggling device:', err);
      setIsError(true);
    }
  }, []);

  // Set occupancy manually
  const toggleRoomOccupancy = useCallback(async (roomId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/room/occupancy`, {
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
          setIsError(false);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error('Error toggling occupancy:', err);
      setIsError(true);
    }
  }, []);

  // API Call: Resolve alert
  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/alert/resolve`, {
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
          setIsError(false);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error('Error resolving alert:', err);
      setIsError(true);
    }
  }, []);

  // Notifications API helpers
  const markNotificationRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          setIsError(false);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
      setIsError(true);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setIsBackendConnected(true);
          setIsError(false);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
      setIsError(true);
    }
  }, []);

  // System triggers for preview purposes
  const triggerLoading = () => {
    setIsLoading(true);
    fetchBackendData();
  };

  const triggerError = () => {
    setIsError(true);
  };

  const recoverFromError = () => {
    setIsError(false);
    setIsLoading(true);
    fetchBackendData();
  };

  const triggerEmpty = () => {
    setIsEmpty(prev => !prev);
  };

  // Derive some lightweight counts from the source of truth (backend rooms state)
  const allDevices = isEmpty ? [] : rooms.flatMap(r => r.devices);
  const totalDevices = allDevices.length;
  const devicesOn = allDevices.filter(d => d.status === 'on').length;
  const currentPowerWatts = allDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.powerWatts : 0), 0);
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
      todayEnergyKwh: metricsData.todayEnergyKwh,
      estimatedCostToday: metricsData.estimatedCostToday,
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

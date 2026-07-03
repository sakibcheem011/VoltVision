import { Request, Response } from 'express';
import { iotService } from '../services/iotService';
import { getIO } from '../socket';

// Compatibility APIs for the frontend

export const getState = (req: Request, res: Response) => {
  res.json({
    success: true,
    rooms: iotService.getRooms(),
    alerts: iotService.getAlerts(),
    notifications: iotService.getNotifications()
  });
};

export const toggleDevice = (req: Request, res: Response) => {
  const { deviceId } = req.body;
  if (!deviceId) {
    res.status(400).json({ success: false, error: "Missing deviceId" });
    return;
  }

  const device = iotService.toggleDevice(deviceId);
  if (!device) {
    res.status(404).json({ success: false, error: "Device not found" });
    return;
  }

  try {
    const io = getIO();
    io.emit('device_updated', device);
  } catch(e) {}

  res.json({
    success: true,
    device,
    rooms: iotService.getRooms(),
    alerts: iotService.getAlerts(),
    notifications: iotService.getNotifications()
  });
};

export const toggleOccupancy = (req: Request, res: Response) => {
  const { roomId } = req.body;
  if (!roomId) {
    res.status(400).json({ success: false, error: "Missing roomId" });
    return;
  }

  const found = iotService.toggleRoomOccupancy(roomId);
  if (!found) {
    res.status(404).json({ success: false, error: "Room not found" });
    return;
  }

  res.json({
    success: true,
    rooms: iotService.getRooms(),
    alerts: iotService.getAlerts(),
    notifications: iotService.getNotifications()
  });
};

export const resolveAlert = (req: Request, res: Response) => {
  const { alertId } = req.body;
  if (!alertId) {
    res.status(400).json({ success: false, error: "Missing alertId" });
    return;
  }

  const resolved = iotService.resolveAlert(alertId);
  if (!resolved) {
    res.status(404).json({ success: false, error: "Alert not found or already resolved" });
    return;
  }

  res.json({
    success: true,
    alerts: iotService.getAlerts(),
    notifications: iotService.getNotifications()
  });
};

export const readNotifications = (req: Request, res: Response) => {
  const { notificationId, all } = req.body;

  iotService.markNotificationsRead(notificationId, all);

  res.json({
    success: true,
    notifications: iotService.getNotifications()
  });
};

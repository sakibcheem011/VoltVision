import { Request, Response } from 'express';
import { iotService } from '../services/iotService';
import { getIO } from '../socket';

export const getSystemStatus = (req: Request, res: Response) => {
  const rooms = iotService.getRooms();
  const allDevices = iotService.getAllDevices();
  const totalDevices = allDevices.length;
  const devicesOn = allDevices.filter(d => d.status === 'on').length;
  const currentPowerWatts = allDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.powerWatts : 0), 0);
  
  res.json({
    status: 'online',
    totalDevices,
    devicesOn,
    currentPowerWatts,
    activeAlerts: iotService.getAlerts().filter(a => a.status === 'active').length,
    timestamp: new Date().toISOString()
  });
};

export const getDevices = (req: Request, res: Response) => {
  res.json(iotService.getAllDevices());
};

export const getRooms = (req: Request, res: Response) => {
  res.json(iotService.getRooms());
};

export const getCameras = (req: Request, res: Response) => {
  const cameras = iotService.getRooms().map(r => r.camera);
  res.json(cameras);
};

export const getAlerts = (req: Request, res: Response) => {
  res.json(iotService.getAlerts());
};

export const getUsage = (req: Request, res: Response) => {
  const allDevices = iotService.getAllDevices();
  const currentPowerWatts = allDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.powerWatts : 0), 0);
  const totalHoursOn = allDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.runningTimeHours : 0), 0);
  const todayEnergyKwh = Math.round((12.45 + (totalHoursOn * 0.05)) * 100) / 100;
  const estimatedCostToday = Math.round((todayEnergyKwh * 12) * 100) / 100;

  res.json({
    currentPowerWatts,
    todayEnergyKwh,
    estimatedCostToday,
    currency: 'BDT'
  });
};

export const getHistory = (req: Request, res: Response) => {
  // Mock history data
  res.json([
    { time: '14:15', value: 165 },
    { time: '14:16', value: 172 },
    { time: '14:17', value: 170 },
    { time: '14:18', value: 168 },
    { time: '14:19', value: 180 },
  ]);
};

export const getRoomById = (req: Request, res: Response) => {
  const room = iotService.getRoomById(req.params.id as string);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json(room);
};

export const toggleDeviceRest = (req: Request, res: Response) => {
  const { id } = req.params;
  const device = iotService.toggleDevice(id as string);
  if (!device) {
    res.status(404).json({ error: 'Device not found' });
    return;
  }

  try {
    const io = getIO();
    io.emit('device_updated', device);
  } catch(e) {}

  res.json(device);
};

import { Router } from 'express';
import {
  getState,
  toggleDevice,
  toggleOccupancy,
  resolveAlert,
  readNotifications
} from '../controllers/compatibilityController';
import {
  getSystemStatus,
  getDevices,
  getRooms,
  getCameras,
  getAlerts,
  getUsage,
  getHistory,
  getRoomById,
  toggleDeviceRest
} from '../controllers/apiController';

const router = Router();

// ==========================================
// Compatibility Routes (Frontend)
// ==========================================
router.get('/state', getState);
router.post('/device/toggle', toggleDevice);
router.post('/room/occupancy', toggleOccupancy);
router.post('/alert/resolve', resolveAlert);
router.post('/notifications/read', readNotifications);

// ==========================================
// New Standard REST APIs
// ==========================================
router.get('/status', getSystemStatus);
router.get('/devices', getDevices);
router.get('/rooms', getRooms);
router.get('/cameras', getCameras);
router.get('/alerts', getAlerts);
router.get('/usage', getUsage);
router.get('/history', getHistory);
router.get('/room/:id', getRoomById);
router.post('/device/:id/toggle', toggleDeviceRest);

export default router;

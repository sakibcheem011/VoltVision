import { iotService } from '../services/iotService';
import { generateUniqueId } from '../utils/helpers';
import { getIO } from '../socket';

export const checkAlerts = () => {
  const rooms = iotService.getRooms();
  let hasNewAlerts = false;

  rooms.forEach(room => {
    const activeDevicesCount = room.devices.filter(d => d.status === 'on').length;
    
    // Rule 1: Room Empty and Devices ON
    if (!room.camera.isOccupied && activeDevicesCount > 0) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newAlert = {
        id: generateUniqueId('alert'),
        timestamp: nowStr,
        severity: 'medium' as const,
        roomId: room.id,
        roomName: room.name,
        title: 'Room Empty but Devices ON',
        description: `${room.name} was left empty with ${activeDevicesCount} devices active. Possible energy waste detected.`,
        status: 'active' as const
      };

      const added = iotService.addAlert(newAlert);
      if (added) {
        hasNewAlerts = true;
        iotService.addNotification({
          id: generateUniqueId('notif'),
          type: 'alert',
          title: 'Possible Energy Waste',
          message: `${room.name} is unoccupied but devices are running.`,
          timestamp: 'Just now',
          read: false
        });
        
        try {
          const io = getIO();
          io.emit('alert_generated', newAlert);
        } catch(e) {}
      }
    }
  });

  return hasNewAlerts;
};

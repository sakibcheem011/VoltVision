import { iotService } from '../services/iotService';
import { checkAlerts } from '../alerts';
import { getIO } from '../socket';
import { generateUniqueId } from '../utils/helpers';

export const startSimulator = () => {
  // Update state every 20 seconds
  setInterval(() => {
    let hasChanges = false;
    let rooms = iotService.getRooms();

    rooms.forEach(room => {
      // 1. Simulate minor wattage noise for active devices (e.g. ±1-2 Watts fluctuations)
      room.devices.forEach(dev => {
        if (dev.status === 'on') {
          const basePower = dev.type === 'light' ? 15 : 75;
          const noise = Math.floor(Math.random() * 5) - 2; // -2 to +2
          dev.powerWatts = Math.max(8, basePower + noise);
          dev.runningTimeHours = Math.round((dev.runningTimeHours + 0.01) * 100) / 100;
          hasChanges = true;
        }
      });

      // 2. Random occupancy updates for real-time engagement
      if (Math.random() > 0.85) {
        const isNowOccupied = Math.random() > 0.4;
        const newPeopleCount = isNowOccupied ? Math.floor(Math.random() * 6) + 1 : 0;
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        room.camera.isOccupied = isNowOccupied;
        room.camera.peopleCount = newPeopleCount;
        room.camera.lastDetectionTime = nowStr;
        hasChanges = true;

        if (isNowOccupied) {
          iotService.addNotification({
            id: generateUniqueId('notif'),
            type: 'camera',
            title: 'AI Occupancy Update',
            message: `${newPeopleCount} people detected in ${room.name}.`,
            timestamp: 'Just now',
            read: false
          });
          try {
            const io = getIO();
            io.emit('camera_updated', { roomId: room.id, isOccupied: isNowOccupied, peopleCount: newPeopleCount });
          } catch(e) {}
        }
      }
    });

    if (hasChanges) {
      checkAlerts(); // Trigger alert check
      
      try {
        const io = getIO();
        io.emit('state_updated', {
          rooms: iotService.getRooms(),
          alerts: iotService.getAlerts()
        });
      } catch(e) {}
    }

  }, 20000);
};

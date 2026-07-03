export type DeviceType = 'light' | 'fan';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: 'on' | 'off';
  powerWatts: number; // current consumption
  runningTimeHours: number; // in hours
  lastChanged: string; // ISO string or short text
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

export type ActiveTab = 
  | 'dashboard' 
  | 'devices' 
  | 'rooms' 
  | 'energy' 
  | 'alerts' 
  | 'camera' 
  | 'hardware'
  | 'settings';

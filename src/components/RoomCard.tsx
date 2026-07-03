import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Fan, Clock, Power, ShieldAlert, Users, Compass } from 'lucide-react';
import { RoomData, Device } from '../types';

interface RoomCardProps {
  rooms: RoomData[];
  toggleDevice: (deviceId: string) => void;
  toggleRoomOccupancy: (roomId: string) => void;
  onInspectDevice: (device: Device) => void;
}

export default function RoomCard({
  rooms,
  toggleDevice,
  toggleRoomOccupancy,
  onInspectDevice,
}: RoomCardProps) {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        // Calculate room totals
        const totalRoomPower = room.devices.reduce((sum, d) => sum + (d.status === 'on' ? d.powerWatts : 0), 0);
        const activeDevicesCount = room.devices.filter(d => d.status === 'on').length;
        
        // AI Energy Waste Condition: Unoccupied and any device is running!
        const isEnergyWaste = !room.camera.isOccupied && activeDevicesCount > 0;

        return (
          <div
            key={room.id}
            id={`room-card-${room.id}`}
            className="rounded-2xl bg-neutral-900/45 backdrop-blur-md border border-neutral-800/80 p-6 flex flex-col justify-between shadow-[0_15px_35px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            {/* Background warning tint when energy waste detected */}
            {isEnergyWaste && (
              <div className="absolute inset-0 bg-red-500/[0.025] border border-red-500/20 rounded-2xl pointer-events-none" />
            )}

            {/* Room Header Info */}
            <div className="flex items-start justify-between border-b border-neutral-800/60 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{room.name}</h3>
                <div className="flex items-center space-x-2 mt-1.5">
                  <div className={`h-2 w-2 rounded-full ${room.camera.status === 'online' ? 'bg-green-500' : 'bg-neutral-500'}`} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    AI CAMERA • {room.camera.status === 'online' ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              {/* Occupancy Indicator Toggle */}
              <button
                onClick={() => toggleRoomOccupancy(room.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150 ${
                  room.camera.isOccupied 
                    ? 'bg-blue-600/10 text-blue-400 border-blue-500/25 hover:bg-blue-600/15' 
                    : 'bg-neutral-800 text-neutral-400 border-neutral-750 hover:bg-neutral-750'
                }`}
                title="Click to manually toggle Room Occupancy simulation"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{room.camera.isOccupied ? `OCCUPIED (${room.camera.peopleCount})` : 'EMPTY'}</span>
              </button>
            </div>

            {/* Warning Energy Waste badge (AI Camera Monitoring integration) */}
            {isEnergyWaste && (
              <div className="mb-4 flex items-center space-x-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-bounce" />
                <div className="text-left">
                  <div className="text-[9px] font-bold tracking-wider uppercase leading-none">ENERGY WASTE ALARM</div>
                  <span className="text-[10px] text-red-300 font-medium">Room empty but devices are ON!</span>
                </div>
              </div>
            )}

            {/* Devices grid within Room */}
            <div className="space-y-3.5 flex-1 mb-5">
              {room.devices.map((device) => {
                const isOn = device.status === 'on';
                const isLight = device.type === 'light';
                
                return (
                  <div
                    key={device.id}
                    id={`device-card-${device.id}`}
                    className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                      isOn 
                        ? isLight 
                          ? 'bg-blue-500/[0.05] border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.12)]'
                          : 'bg-green-500/[0.05] border-green-500/30 shadow-[0_0_15px_-3px_rgba(34,197,94,0.12)]'
                        : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700/60'
                    }`}
                  >
                    {/* Device Icon + Name (clickable to inspect details) */}
                    <div 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => onInspectDevice(device)}
                      title="Inspect full device specs"
                    >
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                        isOn 
                          ? isLight 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                            : 'bg-green-500/20 text-green-400 border-green-400/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                      }`}>
                        {isLight ? (
                          <Lightbulb className={`w-4 h-4 ${isOn ? 'animate-pulse' : ''}`} />
                        ) : (
                          <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1.2s' }} />
                        )}
                      </div>

                      <div className="text-left">
                        <span className="block text-xs font-bold text-white leading-tight">
                          {device.name}
                        </span>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isOn ? 'bg-white/10 text-neutral-200' : 'bg-neutral-950 text-neutral-500'
                          }`}>
                            {isOn ? `${device.powerWatts} W` : 'OFF'}
                          </span>
                          
                          <div className="flex items-center space-x-1 text-neutral-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-mono">{device.runningTimeHours}h</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Control Button */}
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all ${
                        isOn 
                          ? isLight 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500'
                            : 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-500'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700'
                      }`}
                      aria-label={`Toggle ${device.name}`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Room Footer Analytics */}
            <div className="border-t border-neutral-800/60 pt-4 mt-auto flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <div className="flex items-center space-x-1">
                <span>Active load:</span>
                <span className="font-bold text-white">{totalRoomPower} Watts</span>
              </div>
              <span className="text-neutral-500">
                Last detect: {room.camera.lastDetectionTime}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

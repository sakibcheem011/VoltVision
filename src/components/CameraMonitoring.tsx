import React from 'react';
import { Cctv, ShieldCheck, ShieldAlert, Users, CalendarClock, Power, Play, Pause, RefreshCw } from 'lucide-react';
import { RoomData, Device } from '../types';

interface CameraMonitoringProps {
  rooms: RoomData[];
  toggleRoomOccupancy: (roomId: string) => void;
  toggleDevice: (deviceId: string) => void;
}

export default function CameraMonitoring({
  rooms,
  toggleRoomOccupancy,
  toggleDevice,
}: CameraMonitoringProps) {
  
  return (
    <div className="space-y-6">
      
      {/* Intro Overview Panel */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <Cctv className="w-5 h-5 text-blue-400" />
            <span>AI-Powered Occupancy Camera Monitoring</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-normal">
            Computer Vision edge-nodes continuously analyze motion and thermal thresholds. 
            This system cross-references real-time occupancy counts with active loads to flag potential resource waste, helping achieve LEED-level energy saving audits automatically.
          </p>
        </div>
        <div className="flex items-center space-x-2.5 bg-neutral-950 border border-neutral-800/80 px-4 py-2.5 rounded-xl font-mono text-xs text-neutral-400">
          <span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
          <span>EDGE NEURAL NETWORKS ACTIVE</span>
        </div>
      </div>

      {/* Camera Feed Grids */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const isOccupied = room.camera.isOccupied;
          const peopleCount = room.camera.peopleCount;
          const activeDevices = room.devices.filter(d => d.status === 'on');
          const activeDevicesCount = activeDevices.length;
          
          // Energy Waste Trigger!
          const isEnergyWaste = !isOccupied && activeDevicesCount > 0;

          return (
            <div
              key={room.id}
              className={`rounded-2xl bg-neutral-950 border transition-all duration-300 overflow-hidden flex flex-col shadow-2xl ${
                isEnergyWaste 
                  ? 'border-red-500/30 bg-gradient-to-b from-red-950/5 to-neutral-950 shadow-red-950/10' 
                  : 'border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              
              {/* Mock Video Stream Box */}
              <div className="relative aspect-video bg-neutral-900 border-b border-neutral-850 flex items-center justify-center overflow-hidden group">
                
                {/* 1. Diagonal grid line aesthetics for CAD/Security feel */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none" 
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                    backgroundSize: '16px 16px',
                  }}
                />
                
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-30" />

                {/* 2. Top HUD overlays */}
                <div className="absolute top-3 left-3 flex items-center space-x-2 text-[9px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5 text-neutral-300">
                  <span className={`h-1.5 w-1.5 rounded-full ${room.camera.status === 'online' ? 'bg-red-500 animate-ping' : 'bg-neutral-600'}`} />
                  <span>{room.camera.status === 'online' ? 'REC' : 'STANDBY'}</span>
                </div>

                <div className="absolute top-3 right-3 text-[9px] font-mono bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5 text-neutral-400">
                  CAM_0{room.id === 'drawing' ? '1' : room.id === 'work1' ? '2' : '3'} • 1080P • 30FPS
                </div>

                {/* 3. Center Crosshair targeting mockup */}
                <div className="absolute h-8 w-8 border border-neutral-700/50 rounded-full flex items-center justify-center pointer-events-none">
                  <div className="h-1 w-1 bg-neutral-600 rounded-full" />
                </div>
                <div className="absolute w-12 h-[1px] bg-neutral-700/30 pointer-events-none" />
                <div className="absolute h-12 w-[1px] bg-neutral-700/30 pointer-events-none" />

                {/* 4. Mock Bounding Box representing AI Tracking */}
                {isOccupied && (
                  <div 
                    className="absolute border border-green-500/50 bg-green-500/5 animate-pulse rounded p-1"
                    style={{
                      left: '25%',
                      top: '25%',
                      width: '45%',
                      height: '50%',
                    }}
                  >
                    <span className="absolute top-1 left-1 font-mono text-[8px] font-bold text-green-400 bg-black/80 px-1 py-0.5 rounded leading-none">
                      HUMAN_ENTITY • [{peopleCount} DETECTED]
                    </span>
                    <div className="absolute -top-1.5 -left-1.5 h-3 w-3 border-t-2 border-l-2 border-green-500" />
                    <div className="absolute -top-1.5 -right-1.5 h-3 w-3 border-t-2 border-r-2 border-green-500" />
                    <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b-2 border-l-2 border-green-500" />
                    <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b-2 border-r-2 border-green-500" />
                  </div>
                )}

                {/* Camera Offline layout overlay */}
                {room.camera.status === 'offline' && (
                  <div className="absolute inset-0 bg-neutral-950/90 z-20 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-bold text-neutral-500 font-mono tracking-widest uppercase">CONNECTION FAILED</span>
                    <span className="text-[10px] text-neutral-600 font-mono">RECONNING EDGE FEED IN PROGRESS...</span>
                  </div>
                )}

                {/* Camera Text Display label */}
                <div className="absolute bottom-3 left-3 text-[10px] font-mono bg-black/75 px-2 py-1 rounded text-white font-semibold">
                  ZONE: {room.name.toUpperCase()}
                </div>

                {/* Interactive Simulation Panel on Hover */}
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3.5">
                  <button
                    onClick={() => toggleRoomOccupancy(room.id)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>FORCE OCCUPANCY</span>
                  </button>
                </div>

              </div>

              {/* Feed Meta Info */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Visual state summaries */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Occupancy state */}
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-850">
                    <span className="block text-[10px] font-mono text-neutral-500 uppercase leading-none mb-1.5">OCCUPANCY TYPE</span>
                    <div className="flex items-center space-x-2">
                      <Users className={`w-4 h-4 ${isOccupied ? 'text-blue-400' : 'text-neutral-500'}`} />
                      <span className="text-xs font-bold text-white">
                        {isOccupied ? `Occupied (${peopleCount} Pax)` : 'Vacant'}
                      </span>
                    </div>
                  </div>

                  {/* Last Detected */}
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-850">
                    <span className="block text-[10px] font-mono text-neutral-500 uppercase leading-none mb-1.5">LAST RECORDED</span>
                    <div className="flex items-center space-x-2">
                      <CalendarClock className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-200 font-mono">
                        {room.camera.lastDetectionTime}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Possible Energy Waste Diagnostic */}
                {isEnergyWaste ? (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 space-y-1.5">
                    <div className="flex items-center space-x-2 text-red-400">
                      <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="text-xs font-bold tracking-wide">POSSIBLE ENERGY WASTE</span>
                    </div>
                    <p className="text-[10px] text-red-300 leading-normal font-sans">
                      Computer vision detected 0 human entities, but <span className="font-semibold text-white font-mono">{activeDevicesCount} devices</span> are currently consuming <span className="font-semibold text-white font-mono">{activeDevices.reduce((sum, d) => sum + d.powerWatts, 0)}W</span>. Click to shut down all room items:
                    </p>

                    <div className="pt-1.5 flex flex-wrap gap-2">
                      {activeDevices.map(d => (
                        <button
                          key={d.id}
                          onClick={() => toggleDevice(d.id)}
                          className="px-2 py-1 bg-red-600/20 text-red-300 hover:bg-red-600/35 border border-red-500/30 rounded-lg text-[9px] font-mono font-bold uppercase transition-all"
                        >
                          OFF: {d.name.split(' ').slice(-2).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/15 flex items-center space-x-3.5 text-[11px] text-green-400">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span>Diagnostics clear. Zone is energy-optimized.</span>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

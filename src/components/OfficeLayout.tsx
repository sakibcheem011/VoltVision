import React from 'react';
import { Lightbulb, Fan, HelpCircle, Eye } from 'lucide-react';
import { RoomData, Device } from '../types';

interface OfficeLayoutProps {
  rooms: RoomData[];
  toggleDevice: (deviceId: string) => void;
}

export default function OfficeLayout({ rooms, toggleDevice }: OfficeLayoutProps) {
  // Find devices safely
  const getDeviceStatus = (roomId: string, type: 'light' | 'fan', index: number): Device | undefined => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return undefined;
    const filtered = room.devices.filter(d => d.type === type);
    return filtered[index];
  };

  return (
    <div className="rounded-2xl bg-neutral-950 border border-neutral-800/80 p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.95)]">
      
      {/* Title Header with interactive legends */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/60 pb-5 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-400 animate-pulse" />
            <span>Interactive Floor Layout Schematic</span>
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Realtime 2D CAD blueprint projection • Hover to identify & click to toggle
          </p>
        </div>

        {/* Blueprint Legends */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            <span>Light ON</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <span>Fan ON</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-5 bg-orange-600/30 border border-orange-500/40 rounded-sm" />
            <span>Doors</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 bg-neutral-800 border border-neutral-700 rounded-xs" />
            <span>Chairs/Furniture</span>
          </div>
        </div>
      </div>

      {/* Blueprint Container */}
      <div className="relative w-full overflow-x-auto select-none">
        {/* Dynamic dark architecture grid mesh */}
        <div 
          className="min-w-[800px] h-[480px] bg-neutral-900/10 border border-neutral-800/50 rounded-2xl relative"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* ==================== DRAWING ROOM ==================== */}
          <div className="absolute left-[3%] top-[5%] w-[34%] h-[90%] border-2 border-neutral-800 rounded-xl bg-neutral-950/40 p-4">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1 mb-2">
              <span className="text-xs font-bold font-mono text-neutral-400 tracking-wider">01 DRAWING ROOM</span>
              <span className="text-[9px] font-mono text-neutral-500">4.5m x 8.0m</span>
            </div>

            {/* Furniture Placement: Sofa/Drawing Room chairs + conference tables */}
            {/* Center Table */}
            <div className="absolute left-[25%] top-[40%] w-[50%] h-[18%] bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center">
              <span className="text-[9px] font-mono text-neutral-600">Drawing Desk</span>
            </div>
            {/* Soft Chairs around Table */}
            <div className="absolute left-[12%] top-[45%] h-5 w-5 bg-neutral-800 border border-neutral-700 rounded-full" title="Armchair" />
            <div className="absolute right-[12%] top-[45%] h-5 w-5 bg-neutral-800 border border-neutral-700 rounded-full" title="Armchair" />
            <div className="absolute left-[30%] top-[28%] h-5 w-5 bg-neutral-800 border border-neutral-700 rounded-full" title="Armchair" />
            <div className="absolute left-[60%] top-[28%] h-5 w-5 bg-neutral-800 border border-neutral-700 rounded-full" title="Armchair" />
            <div className="absolute left-[30%] top-[65%] h-5 w-5 bg-neutral-800 border border-neutral-700 rounded-full" title="Armchair" />
            <div className="absolute left-[60%] top-[65%] h-5 w-5 bg-neutral-800 border border-neutral-700 rounded-full" title="Armchair" />

            {/* Door: Drawing Room main entrance (bottom right of drawing room) */}
            <div className="absolute right-[-2px] bottom-[15%] w-1 h-[14%] bg-orange-500 border border-orange-400 rounded-sm" title="Swing Door" />

            {/* IoT Device Overlays (Drawing Room) */}
            {/* Light 1 (Top Left) */}
            {(() => {
              const d = getDeviceStatus('drawing', 'light', 0);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[15%] top-[15%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Light 2 (Center) */}
            {(() => {
              const d = getDeviceStatus('drawing', 'light', 1);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[47%] top-[45%] p-2 rounded-full border transition-all z-10 ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Light 3 (Bottom Right) */}
            {(() => {
              const d = getDeviceStatus('drawing', 'light', 2);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute right-[15%] top-[75%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Fan 1 (Upper Center) */}
            {(() => {
              const d = getDeviceStatus('drawing', 'fan', 0);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[47%] top-[18%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-green-400/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                </button>
              );
            })()}

            {/* Fan 2 (Lower Center) */}
            {(() => {
              const d = getDeviceStatus('drawing', 'fan', 1);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[47%] top-[72%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-green-400/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                </button>
              );
            })()}
          </div>


          {/* ==================== WORK ROOM 1 ==================== */}
          <div className="absolute left-[39%] top-[5%] w-[28%] h-[90%] border-2 border-neutral-800 rounded-xl bg-neutral-950/40 p-4">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1 mb-2">
              <span className="text-xs font-bold font-mono text-neutral-400 tracking-wider">02 WORK ROOM 1</span>
              <span className="text-[9px] font-mono text-neutral-500">3.6m x 8.0m</span>
            </div>

            {/* Furniture Placement: Work desks and chairs */}
            {/* Long Desk Left Side */}
            <div className="absolute left-[10%] top-[25%] w-[25%] h-[50%] bg-neutral-900 border border-neutral-800 rounded-sm flex flex-col justify-around py-2">
              <span className="text-[8px] font-mono text-neutral-600 text-center block">Desk A</span>
            </div>
            {/* Long Desk Right Side */}
            <div className="absolute right-[10%] top-[25%] w-[25%] h-[50%] bg-neutral-900 border border-neutral-800 rounded-sm flex flex-col justify-around py-2">
              <span className="text-[8px] font-mono text-neutral-600 text-center block">Desk B</span>
            </div>
            {/* Desk Chairs */}
            <div className="absolute left-[38%] top-[30%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute left-[38%] top-[45%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute left-[38%] top-[60%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            
            <div className="absolute right-[38%] top-[30%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute right-[38%] top-[45%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute right-[38%] top-[60%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />

            {/* Door: Connecting door to drawing room or hallway (left wall) */}
            <div className="absolute left-[-2px] bottom-[15%] w-1 h-[14%] bg-orange-500 border border-orange-400 rounded-sm" />

            {/* IoT Device Overlays (Work Room 1) */}
            {/* Light 1 (Top Left) */}
            {(() => {
              const d = getDeviceStatus('work1', 'light', 0);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[18%] top-[14%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Light 2 (Middle Right) */}
            {(() => {
              const d = getDeviceStatus('work1', 'light', 1);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute right-[18%] top-[45%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Light 3 (Bottom Left) */}
            {(() => {
              const d = getDeviceStatus('work1', 'light', 2);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[18%] top-[76%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Fan 1 (Upper Center) */}
            {(() => {
              const d = getDeviceStatus('work1', 'fan', 0);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[44%] top-[25%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-green-400/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                </button>
              );
            })()}

            {/* Fan 2 (Lower Center) */}
            {(() => {
              const d = getDeviceStatus('work1', 'fan', 1);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[44%] top-[65%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-green-400/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                </button>
              );
            })()}
          </div>


          {/* ==================== WORK ROOM 2 ==================== */}
          <div className="absolute right-[3%] top-[5%] w-[28%] h-[90%] border-2 border-neutral-800 rounded-xl bg-neutral-950/40 p-4">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1 mb-2">
              <span className="text-xs font-bold font-mono text-neutral-400 tracking-wider">03 WORK ROOM 2</span>
              <span className="text-[9px] font-mono text-neutral-500">3.6m x 8.0m</span>
            </div>

            {/* Furniture Placement: Work desks and chairs */}
            {/* Desk Block Middle */}
            <div className="absolute left-[15%] top-[35%] w-[70%] h-[30%] bg-neutral-900 border border-neutral-800 rounded-sm flex flex-wrap items-center justify-around p-1">
              <span className="text-[8px] font-mono text-neutral-600 block w-full text-center">Center Island Table</span>
            </div>
            {/* Desk Chairs */}
            <div className="absolute left-[25%] top-[25%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute left-[46%] top-[25%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute left-[68%] top-[25%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            
            <div className="absolute left-[25%] top-[68%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute left-[46%] top-[68%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />
            <div className="absolute left-[68%] top-[68%] h-4.5 w-4.5 bg-neutral-850 border border-neutral-700 rounded-xs" />

            {/* Door: Entrance (bottom left of Work Room 2) */}
            <div className="absolute left-[-2px] bottom-[15%] w-1 h-[14%] bg-orange-500 border border-orange-400 rounded-sm" />

            {/* IoT Device Overlays (Work Room 2) */}
            {/* Light 1 (Top Right) */}
            {(() => {
              const d = getDeviceStatus('work2', 'light', 0);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute right-[18%] top-[14%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Light 2 (Middle Left) */}
            {(() => {
              const d = getDeviceStatus('work2', 'light', 1);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[18%] top-[45%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Light 3 (Bottom Right) */}
            {(() => {
              const d = getDeviceStatus('work2', 'light', 2);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute right-[18%] top-[76%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              );
            })()}

            {/* Fan 1 (Upper Center) */}
            {(() => {
              const d = getDeviceStatus('work2', 'fan', 0);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[44%] top-[18%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-green-400/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                </button>
              );
            })()}

            {/* Fan 2 (Lower Center) */}
            {(() => {
              const d = getDeviceStatus('work2', 'fan', 1);
              const isOn = d?.status === 'on';
              return d && (
                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`absolute left-[44%] top-[72%] p-2 rounded-full border transition-all ${
                    isOn 
                      ? 'bg-green-400/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400'
                  }`}
                  title={`${d.name}: ${isOn ? 'ON' : 'OFF'}`}
                >
                  <Fan className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

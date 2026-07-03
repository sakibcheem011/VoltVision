import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Power, Lightbulb, Fan, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Device } from '../types';

interface DeviceDrawerProps {
  device: Device | null;
  onClose: () => void;
  toggleDevice: (deviceId: string) => void;
}

export default function DeviceDrawer({ device, onClose, toggleDevice }: DeviceDrawerProps) {
  if (!device) return null;

  const isLight = device.type === 'light';
  const isOn = device.status === 'on';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-55 overflow-hidden">
        
        {/* Backdrop glass blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Drawer Body Container */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ translateX: '100%' }}
            animate={{ translateX: 0 }}
            exit={{ translateX: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800/80 p-6 flex flex-col h-full shadow-2xl justify-between"
          >
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-neutral-850 pb-5 mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                    isOn 
                      ? isLight ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' : 'bg-green-500/10 text-green-400 border-green-500/25'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    {isLight ? <Lightbulb className="w-5 h-5" /> : <Fan className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{device.name}</h3>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{device.roomName}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-xl transition-all text-neutral-400 hover:text-white"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Info Blocks */}
              <div className="space-y-6">
                
                {/* 1. Quick Control Box */}
                <div className="p-4.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/50 flex items-center justify-between">
                  <div className="text-left">
                    <span className="block text-xs font-bold text-white">Power State Switch</span>
                    <span className="text-[10px] text-neutral-500 font-medium">Toggle load state on dev gate</span>
                  </div>

                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isOn 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isOn ? 'ACTIVE (ON)' : 'STANDBY (OFF)'}</span>
                  </button>
                </div>

                {/* 2. Device Parameters List */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Device parameters</h4>
                  
                  <div className="divide-y divide-neutral-850 bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden text-xs">
                    
                    {/* Device ID */}
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-neutral-500 font-mono">NODE IDENTIFIER</span>
                      <span className="font-mono text-neutral-200 font-semibold">{device.id}</span>
                    </div>

                    {/* Room Name */}
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-neutral-500">PARENT ZONE</span>
                      <span className="font-bold text-white">{device.roomName}</span>
                    </div>

                    {/* Device Type */}
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-neutral-500">HARDWARE TYPE</span>
                      <span className="font-semibold text-neutral-200 capitalize">{device.type}</span>
                    </div>

                    {/* Power watts */}
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-neutral-500">CURRENT DRAW</span>
                      <span className="font-bold font-mono text-blue-400">
                        {isOn ? `${device.powerWatts} W` : '0 W (Standby)'}
                      </span>
                    </div>

                    {/* Cumulative running hours */}
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-neutral-500">AGGREGATE RUN-TIME</span>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="font-bold font-mono text-white">{device.runningTimeHours} hrs</span>
                      </div>
                    </div>

                    {/* Last Changed */}
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-neutral-500">LAST TELEMETRY UPDATE</span>
                      <span className="font-mono font-semibold text-neutral-400">{device.lastChanged}</span>
                    </div>

                  </div>
                </div>

                {/* Technical Diagnostic Note */}
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start space-x-3.5">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left space-y-1">
                    <span className="block text-xs font-bold text-white font-sans">Edge IoT Diagnostics</span>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      The current node is linked via an end-to-end Socket.IO connection. Local actions automatically emit events to notify surrounding sensors.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer with telemetry details */}
            <div className="border-t border-neutral-850 pt-5 mt-auto flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>SECURE TERMINAL</span>
              </div>
              <span>VER 4.1.2</span>
            </div>

          </motion.div>
        </div>

      </div>
    </AnimatePresence>
  );
}

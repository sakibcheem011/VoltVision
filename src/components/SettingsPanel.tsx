import React, { useState } from 'react';
import { Settings, User, Server, Radio, Database, ShieldAlert, Cpu, HardDrive, RefreshCw } from 'lucide-react';

interface SettingsPanelProps {
  isLiveConnection: boolean;
  setIsLiveConnection: (live: boolean) => void;
  triggerLoading: () => void;
  triggerError: () => void;
  triggerEmpty: () => void;
  isEmptyState: boolean;
}

export default function SettingsPanel({
  isLiveConnection,
  setIsLiveConnection,
  triggerLoading,
  triggerError,
  triggerEmpty,
  isEmptyState,
}: SettingsPanelProps) {
  const [powerAlertLimit, setPowerAlertLimit] = useState<number>(150);
  const [autoSettle, setAutoSettle] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      
      {/* Intro branding banner */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl mt-0.5">
            <Settings className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-white tracking-tight">System Settings & Calibration Panel</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Calibrate baseline thresholds, monitor edge websocket connections, and simulate environment variables on behalf of the developer sandbox.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Profile & Gateway Credentials */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800/80 p-5 space-y-4 shadow-xl">
          <div className="border-b border-neutral-850 pb-3 flex items-center space-x-2.5">
            <User className="w-4.5 h-4.5 text-blue-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">User & Station Profile</h4>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-850 space-y-1">
              <span className="block text-[9px] font-mono text-neutral-500 uppercase">Current Station</span>
              <span className="font-bold text-white text-xs">Sector-4 Main Office Terminal</span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-850 space-y-1">
              <span className="block text-[9px] font-mono text-neutral-500 uppercase">Operator Email</span>
              <span className="font-mono text-neutral-300">sak1234567890cj@gmail.com</span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-850 space-y-1">
              <span className="block text-[9px] font-mono text-neutral-500 uppercase">System Role</span>
              <span className="text-green-400 font-bold">Enterprise Administrator</span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-850 space-y-1">
              <span className="block text-[9px] font-mono text-neutral-500 uppercase">Station License</span>
              <span className="font-mono text-neutral-400">AEGIS-IOT-ENTERPRISE-PRO-9882A</span>
            </div>
          </div>
        </div>

        {/* Column 2: Web Server & Integration Details */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800/80 p-5 space-y-4 shadow-xl">
          <div className="border-b border-neutral-850 pb-3 flex items-center space-x-2.5">
            <Server className="w-4.5 h-4.5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Integration Architecture</h4>
          </div>

          <div className="space-y-3 text-xs text-left">
            <p className="text-neutral-400 leading-normal text-[11px]">
              This smart dashboard is fully decoupled from the business server. All UI components are wired to consume live REST endpoints and Socket.IO messages.
            </p>

            <div className="divide-y divide-neutral-850 bg-neutral-900 border border-neutral-850 rounded-xl overflow-hidden font-mono text-[11px]">
              <div className="p-2.5 flex justify-between">
                <span className="text-neutral-500">CLIENT RUNTIME</span>
                <span className="text-neutral-300">VITE 6.2 / REACT 19</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-neutral-500">WEBSOCKET CLIENT</span>
                <span className="text-neutral-300">SOCKET.IO V4.x</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-neutral-500">STYLES PACK</span>
                <span className="text-neutral-300">TAILWIND CSS V4.1</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-neutral-500">DATABASES</span>
                <span className="text-neutral-300">REST API PROXIED</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-850 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className={`w-4 h-4 ${isLiveConnection ? 'text-green-500 animate-pulse' : 'text-neutral-500'}`} />
                <span className="font-bold text-white text-[11px]">Telemetry broadcast</span>
              </div>
              <button
                onClick={() => setIsLiveConnection(!isLiveConnection)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
                  isLiveConnection 
                    ? 'bg-neutral-850 text-neutral-300 hover:bg-neutral-800' 
                    : 'bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-500/25'
                }`}
              >
                {isLiveConnection ? 'PAUSE FEED' : 'CONNECT'}
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Sandbox triggers & calibration */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800/80 p-5 space-y-4 shadow-xl">
          <div className="border-b border-neutral-850 pb-3 flex items-center space-x-2.5">
            <Database className="w-4.5 h-4.5 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Calibration Controls</h4>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            
            {/* Range limit */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">POWER ALARM Baseline:</span>
                <span className="text-blue-400 font-bold">{powerAlertLimit} Watts</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                value={powerAlertLimit}
                onChange={(e) => setPowerAlertLimit(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Auto-settle toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-850">
              <div>
                <span className="block text-xs font-bold text-white">Auto-Clear resolved</span>
                <span className="text-[10px] text-neutral-500 font-medium">Remove green logs automatically</span>
              </div>
              <input
                type="checkbox"
                checked={autoSettle}
                onChange={() => setAutoSettle(!autoSettle)}
                className="h-4 w-4 text-blue-600 rounded bg-neutral-950 border-neutral-800 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Loader/empty sandbox helper row */}
            <div className="space-y-2 pt-2">
              <span className="block text-[10px] font-mono text-neutral-500 uppercase">SIMULATE ERROR STATE</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={triggerLoading}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:text-white rounded-lg transition-all font-mono text-[10px]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>LOADER (2s)</span>
                </button>
                <button
                  onClick={triggerEmpty}
                  className={`flex items-center justify-center space-x-2 py-2 px-3 border rounded-lg transition-all font-mono text-[10px] ${
                    isEmptyState 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/15' 
                      : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:text-white'
                  }`}
                >
                  <span>{isEmptyState ? 'POPULATE' : 'EMPTY LIST'}</span>
                </button>
              </div>

              <button
                onClick={triggerError}
                className="w-full py-2.5 bg-red-600/10 hover:bg-red-600/15 border border-red-500/25 text-red-400 hover:text-red-300 font-mono text-[10px] font-bold rounded-lg transition-all"
              >
                SIMULATE SERVER GATEWAY CRASH (500 ERROR)
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

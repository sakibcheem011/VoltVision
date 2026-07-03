import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  DoorOpen, 
  BarChart3, 
  AlertTriangle, 
  Cctv, 
  Settings, 
  Zap, 
  X,
  Radio,
  Database,
  Workflow
} from 'lucide-react';
import { ActiveTab } from '../types';

const logoPath = '/src/assets/images/voltvision_logo_1783118335137.jpg';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLiveConnection: boolean;
  setIsLiveConnection: (live: boolean) => void;
  isBackendConnected?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isLiveConnection,
  setIsLiveConnection,
  isBackendConnected = false,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices' as ActiveTab, label: 'Devices', icon: Cpu },
    { id: 'rooms' as ActiveTab, label: 'Rooms', icon: DoorOpen },
    { id: 'energy' as ActiveTab, label: 'Energy Analytics', icon: BarChart3 },
    { id: 'camera' as ActiveTab, label: 'Camera Monitoring', icon: Cctv },
    { id: 'alerts' as ActiveTab, label: 'Alerts Logs', icon: AlertTriangle },
    { id: 'hardware' as ActiveTab, label: 'Hardware Architecture', icon: Workflow },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-45 w-72 bg-neutral-950/80 backdrop-blur-2xl border-r border-neutral-800/60 text-neutral-300 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:flex lg:flex-col lg:h-screen`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800/60">
          <div className="flex items-center space-x-3">
            <div id="sidebar-logo-container" className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center p-1">
              <img 
                src={logoPath} 
                alt="VoltVision Logo" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">VoltVision</h1>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Enterprise Core</span>
            </div>
          </div>
          <button 
            className="lg:hidden text-neutral-400 hover:text-white p-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false); // close mobile sidebar
                }}
                className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.1)]'
                    : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-400' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Socket.IO Status Feed Panel */}
        <div className="p-4 border-t border-neutral-800/60 bg-neutral-900/20 space-y-3">
          {/* API Connection Indicator */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className={`w-4 h-4 ${isBackendConnected ? 'text-blue-400' : 'text-neutral-500'}`} />
              <span className="text-[11px] font-semibold text-neutral-300 font-mono">SIMULATION API</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
              isBackendConnected 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-neutral-800 text-neutral-500 border border-neutral-700/50'
            }`}>
              {isBackendConnected ? 'Connected' : 'Offline'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className={`w-4 h-4 ${isLiveConnection ? 'text-green-500 animate-pulse' : 'text-neutral-500'}`} />
                <span className="text-xs font-semibold text-neutral-300 font-mono">SOCKET.IO FEED</span>
              </div>
              <span className={`h-2 w-2 rounded-full ${isLiveConnection ? 'bg-green-500' : 'bg-neutral-500'} shadow`} />
            </div>
            
            <p className="text-[11px] text-neutral-500 leading-normal">
              {isLiveConnection 
                ? 'Listening to real-time telemetry streaming on dev gateway...'
                : 'Connection paused. Click to resume receiving telemetry stream.'
              }
            </p>

            <button
              onClick={() => setIsLiveConnection(!isLiveConnection)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all duration-150 ${
                isLiveConnection 
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750' 
                  : 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/20'
              }`}
            >
              {isLiveConnection ? 'PAUSE TELEMETRY' : 'CONNECT SOCKET'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

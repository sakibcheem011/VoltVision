import React, { useState, useEffect } from 'react';
import { Menu, ShieldAlert, Wifi, RefreshCw, AlertTriangle, Trash2, Cpu, User, Power, Terminal } from 'lucide-react';
import { NotificationItem } from '../types';
import NotificationDropdown from './NotificationDropdown';

interface NavbarProps {
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isLiveConnection: boolean;
  // Controls for mocking states
  triggerLoading: () => void;
  triggerError: () => void;
  recoverFromError: () => void;
  triggerEmpty: () => void;
  isErrorState: boolean;
  isEmptyState: boolean;
}

export default function Navbar({
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
  sidebarOpen,
  setSidebarOpen,
  isLiveConnection,
  triggerLoading,
  triggerError,
  recoverFromError,
  triggerEmpty,
  isErrorState,
  isEmptyState,
}: NavbarProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showSimMenu, setShowSimMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/65 backdrop-blur-xl border-b border-neutral-800/60 py-4 px-6 flex items-center justify-between">
      
      {/* Left side: mobile toggle + date & time */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2.5 bg-neutral-900 border border-neutral-850 rounded-xl hover:bg-neutral-800 transition-colors text-neutral-300"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Date and dynamic clock */}
        <div className="hidden sm:block">
          <div className="flex items-center space-x-2.5 text-neutral-400 font-mono text-[11px] uppercase tracking-wider leading-none mb-1">
            <span>{date}</span>
            <span className="h-1 w-1 bg-neutral-700 rounded-full" />
            <span className="text-neutral-500">SYSTEM TIME</span>
          </div>
          <span className="text-lg font-bold text-white font-mono tracking-tight leading-none">
            {time || 'Loading time...'}
          </span>
        </div>
      </div>

      {/* Right side: system actions and states */}
      <div className="flex items-center space-x-3.5">
        
        {/* State simulator helper trigger */}
        <div className="relative">
          <button
            onClick={() => setShowSimMenu(!showSimMenu)}
            className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs font-semibold font-mono hover:bg-yellow-500/15 transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden md:inline">SIMULATE STATES</span>
          </button>

          {showSimMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSimMenu(false)} />
              <div className="absolute right-0 mt-3 w-64 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3.5">
                <div className="border-b border-neutral-800/60 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Dev Sandbox</h4>
                  <p className="text-[10px] text-neutral-500 font-normal">Test the app against live error, loading, and empty states.</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      triggerLoading();
                      setShowSimMenu(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:bg-neutral-900 border border-neutral-850 hover:text-white text-left font-medium"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    <span>Trigger Loader State (2s)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isErrorState) {
                        recoverFromError();
                      } else {
                        triggerError();
                      }
                      setShowSimMenu(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-left font-medium border ${
                      isErrorState 
                        ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/15' 
                        : 'text-neutral-300 hover:bg-neutral-900 border-neutral-850 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>{isErrorState ? 'Recover from Error' : 'Trigger Error State'}</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerEmpty();
                      setShowSimMenu(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-left font-medium border ${
                      isEmptyState 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/15' 
                        : 'text-neutral-300 hover:bg-neutral-900 border-neutral-850 hover:text-white'
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-cyan-400" />
                    <span>{isEmptyState ? 'Populate Devices' : 'Trigger Empty State'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* System Network Connection Status Badge */}
        <div className="flex items-center space-x-2.5 bg-neutral-900/60 border border-neutral-850 rounded-xl px-3.5 py-2">
          <Wifi className={`w-4 h-4 ${isLiveConnection ? 'text-green-400 animate-pulse' : 'text-neutral-500'}`} />
          <div className="text-left hidden xs:block">
            <div className="text-[9px] font-mono font-semibold text-neutral-500 leading-none uppercase">Gateway</div>
            <span className="text-xs font-bold text-neutral-200">{isLiveConnection ? 'ONLINE' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Notification dropdown icon */}
        <NotificationDropdown
          notifications={notifications}
          markNotificationRead={markNotificationRead}
          markAllNotificationsRead={markAllNotificationsRead}
        />

        {/* User profile dropdown avatar mockup */}
        <div className="flex items-center space-x-3.5 pl-1.5 border-l border-neutral-800/60">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-400">
            <User className="w-5 h-5" />
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-green-500 ring-2 ring-neutral-950" />
          </div>
          <div className="text-left hidden lg:block">
            <span className="block text-xs font-bold text-white">Security Console</span>
            <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider">sak123456@gmail.com</span>
          </div>
        </div>

      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Bell, Check, Trash2, ShieldAlert, Cpu, Cctv, Info } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export default function NotificationDropdown({
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'device':
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'camera':
        return <Cctv className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors duration-150 text-neutral-300 hover:text-white"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-neutral-950 animate-bounce" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-neutral-800/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-500/25">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/40">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  No notifications recorded
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-4 flex items-start space-x-3 transition-colors duration-150 cursor-pointer ${
                      notif.read ? 'hover:bg-neutral-900/40' : 'bg-blue-500/5 hover:bg-blue-500/10'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-neutral-900 border border-neutral-800/50 mt-0.5 flex-shrink-0`}>
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{notif.title}</span>
                        <span className="text-[10px] font-mono text-neutral-500">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">{notif.message}</p>
                    </div>

                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer view alerts redirection */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-900/20 text-center">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                REALTIME BACKEND SYNC ACTIVE
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

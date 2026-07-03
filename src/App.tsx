import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  Cpu, 
  Search, 
  SlidersHorizontal, 
  Power, 
  Clock, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

// Custom Hooks
import { useIoTState } from './hooks/useIoTState';

// Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { BeamsBackground } from './components/ui/beams-background';

// Sub-view Components
import OverviewCards from './components/OverviewCards';
import RoomCard from './components/RoomCard';
import OfficeLayout from './components/OfficeLayout';
import EnergyCharts from './components/EnergyCharts';
import CameraMonitoring from './components/CameraMonitoring';
import AlertsPanel from './components/AlertsPanel';
import HardwareArchitecture from './components/HardwareArchitecture';
import SettingsPanel from './components/SettingsPanel';
import DeviceDrawer from './components/DeviceDrawer';

// Shared Types
import { ActiveTab, Device } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Search & Filter state for the Devices sub-tab
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<'all' | 'light' | 'fan'>('all');
  const [deviceRoomFilter, setDeviceRoomFilter] = useState<'all' | 'drawing' | 'work1' | 'work2'>('all');
  const [deviceStatusFilter, setDeviceStatusFilter] = useState<'all' | 'on' | 'off'>('all');

  // Load the comprehensive simulated IoT state engine
  const iot = useIoTState();

  // If selecting a device, retrieve the freshest state from the iot hook
  const activeSelectedDevice = selectedDevice 
    ? iot.allDevices.find(d => d.id === selectedDevice.id) || selectedDevice 
    : null;

  return (
    <BeamsBackground className="min-h-screen text-neutral-200 font-sans flex overflow-hidden">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isLiveConnection={iot.isLiveConnection}
        setIsLiveConnection={iot.setIsLiveConnection}
        isBackendConnected={iot.isBackendConnected}
      />

      {/* Main Right Side layout wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* 2. Top Navigation Bar */}
        <Navbar
          notifications={iot.notifications}
          markNotificationRead={iot.markNotificationRead}
          markAllNotificationsRead={iot.markAllNotificationsRead}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isLiveConnection={iot.isLiveConnection}
          triggerLoading={iot.triggerLoading}
          triggerError={iot.triggerError}
          recoverFromError={iot.recoverFromError}
          triggerEmpty={iot.triggerEmpty}
          isErrorState={iot.isError}
          isEmptyState={iot.isEmpty}
        />

        {/* 3. Dynamic content stage */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* STATE A: Simulated API Loading View */}
            {iot.isLoading && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 space-y-4"
              >
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
                <div className="text-center">
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono">RETRIEVING TELEMETRY FLOW...</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 font-sans">Connecting to mock REST API and established Socket.IO clusters...</p>
                </div>
              </motion.div>
            )}

            {/* STATE B: Simulated API Server-Crash (500 Error) View */}
            {!iot.isLoading && iot.isError && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 space-y-6 max-w-lg mx-auto text-center"
              >
                <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-500 rounded-full animate-bounce">
                  <AlertTriangle className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono">IoT Gateway Error (500)</h2>
                  <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                    The dashboard client failed to establish contact with the live gateway cluster. The socket pipeline has exited with code <span className="font-mono text-red-400 font-bold">GATEWAY_CONN_ERR</span>.
                  </p>
                </div>
                <div className="flex space-x-3.5 pt-2">
                  <button
                    onClick={() => iot.recoverFromError()}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 border border-red-500 text-white font-semibold rounded-xl text-xs font-mono transition-all shadow-lg shadow-red-500/15"
                  >
                    RECONNECT PIPELINE
                  </button>
                  <button
                    onClick={() => iot.triggerLoading()}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 font-semibold rounded-xl text-xs font-mono transition-all"
                  >
                    RUN INTERFACE PROBE
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATE C: Empty State (No devices registered) */}
            {!iot.isLoading && !iot.isError && iot.isEmpty && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 space-y-6 max-w-md mx-auto text-center"
              >
                <div className="p-4 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded-full">
                  <Database className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No IoT Devices Provisioned</h3>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    The localized Sector database contains 0 active terminals. Re-populate the system list by clicking the button below.
                  </p>
                </div>
                <button
                  onClick={() => iot.triggerEmpty()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-lg"
                >
                  PROVISION WORKPLACE BASICS
                </button>
              </motion.div>
            )}

            {/* NORMAL STATE D: Connected and data is populated */}
            {!iot.isLoading && !iot.isError && !iot.isEmpty && (
              <motion.div
                key="content-tabs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* TAB 1: OVERALL DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    
                    {/* Welcome Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/15 to-transparent border border-blue-500/10 p-6 rounded-2xl">
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Smart Workplace Overview</h2>
                        <p className="text-xs text-neutral-400 mt-1">
                          VoltVision Server is aggregating live feeds from Drawing Room and dual Work Rooms.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2.5 bg-neutral-900/60 border border-neutral-850 px-3.5 py-2 rounded-xl">
                        <span className="h-2 w-2 rounded-full bg-green-500 shadow shadow-green-500/80" />
                        <span className="text-xs font-mono font-bold text-neutral-300">CORE STATUS: STABLE</span>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <OverviewCards metrics={iot.metrics} />

                    {/* Visual floor map */}
                    <OfficeLayout 
                      rooms={iot.rooms} 
                      toggleDevice={iot.toggleDevice} 
                    />

                    {/* Rooms & Alerts summaries split */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                      
                      {/* Left: Rooms overview cards */}
                      <div className="xl:col-span-8 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-400">Zone Modules</h3>
                          <button 
                            onClick={() => setActiveTab('rooms')}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                          >
                            <span>Inspect Rooms</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <RoomCard
                          rooms={iot.rooms}
                          toggleDevice={iot.toggleDevice}
                          toggleRoomOccupancy={iot.toggleRoomOccupancy}
                          onInspectDevice={setSelectedDevice}
                        />
                      </div>

                      {/* Right: Realtime Alerts Sidebar feed preview */}
                      <div className="xl:col-span-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-400">Recent Alerts Log</h3>
                          <button 
                            onClick={() => setActiveTab('alerts')}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                          >
                            <span>Full Log</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-5 space-y-4">
                          {iot.alerts.filter(a => a.status === 'active').slice(0, 3).length === 0 ? (
                            <div className="py-12 text-center text-neutral-500 text-xs font-mono">
                              No active alarms registered.
                            </div>
                          ) : (
                            iot.alerts.filter(a => a.status === 'active').slice(0, 3).map((alert) => (
                              <div
                                key={alert.id}
                                className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/25 space-y-2 text-left"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wide">
                                    {alert.severity} SEVERITY
                                  </span>
                                  <span className="text-[9px] font-mono text-neutral-500">
                                    {alert.timestamp}
                                  </span>
                                </div>
                                <span className="block text-xs font-bold text-white leading-normal">
                                  {alert.title}
                                </span>
                                <p className="text-[11px] text-neutral-400 leading-normal">
                                  {alert.description}
                                </p>
                                <button
                                  onClick={() => iot.resolveAlert(alert.id)}
                                  className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-[10px] font-mono font-bold border border-red-500/20"
                                >
                                  DISMISS ALERT
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* TAB 2: DETAILED MASTER DEVICE TERMINAL */}
                {activeTab === 'devices' && (
                  <div className="space-y-6">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md">
                      
                      {/* Left Side: Search input */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="Search 15 devices by name or room..."
                          value={deviceSearch}
                          onChange={(e) => setDeviceSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                        />
                      </div>

                      {/* Right Side Filters */}
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                        
                        {/* Filter Type */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-neutral-500">TYPE:</span>
                          <select
                            value={deviceTypeFilter}
                            onChange={(e) => setDeviceTypeFilter(e.target.value as any)}
                            className="bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded-lg text-[11px] text-white focus:outline-none"
                          >
                            <option value="all">All types</option>
                            <option value="light">Lights only</option>
                            <option value="fan">Fans only</option>
                          </select>
                        </div>

                        {/* Filter Room */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-neutral-500">ZONE:</span>
                          <select
                            value={deviceRoomFilter}
                            onChange={(e) => setDeviceRoomFilter(e.target.value as any)}
                            className="bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded-lg text-[11px] text-white focus:outline-none"
                          >
                            <option value="all">All rooms</option>
                            <option value="drawing">Drawing Room</option>
                            <option value="work1">Work Room 1</option>
                            <option value="work2">Work Room 2</option>
                          </select>
                        </div>

                        {/* Filter Status */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-neutral-500">STATUS:</span>
                          <select
                            value={deviceStatusFilter}
                            onChange={(e) => setDeviceStatusFilter(e.target.value as any)}
                            className="bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded-lg text-[11px] text-white focus:outline-none"
                          >
                            <option value="all">All states</option>
                            <option value="on">ON</option>
                            <option value="off">OFF</option>
                          </select>
                        </div>

                      </div>

                    </div>

                    {/* Devices grid layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
                      {iot.allDevices
                        .filter((dev) => {
                          const matchesSearch = dev.name.toLowerCase().includes(deviceSearch.toLowerCase()) || dev.roomName.toLowerCase().includes(deviceSearch.toLowerCase());
                          const matchesType = deviceTypeFilter === 'all' || dev.type === deviceTypeFilter;
                          const matchesRoom = deviceRoomFilter === 'all' || dev.roomId === deviceRoomFilter;
                          const matchesStatus = deviceStatusFilter === 'all' || dev.status === deviceStatusFilter;
                          return matchesSearch && matchesType && matchesRoom && matchesStatus;
                        })
                        .map((device) => {
                          const isOn = device.status === 'on';
                          return (
                            <div
                              key={device.id}
                              onClick={() => setSelectedDevice(device)}
                              className={`p-4.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-44 text-left relative group ${
                                isOn 
                                  ? device.type === 'light'
                                    ? 'bg-blue-500/[0.04] border-blue-500/30 shadow-[0_8px_20px_-8px_rgba(59,130,246,0.2)] hover:border-blue-500/50'
                                    : 'bg-green-500/[0.04] border-green-500/30 shadow-[0_8px_20px_-8px_rgba(34,197,94,0.2)] hover:border-green-500/50'
                                  : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60'
                              }`}
                            >
                              {/* Header category + power load */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
                                  {device.type.toUpperCase()}
                                </span>
                                
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  isOn ? 'bg-white/10 text-neutral-200 font-bold' : 'bg-neutral-950 text-neutral-600'
                                }`}>
                                  {isOn ? `${device.powerWatts} W` : 'OFF'}
                                </span>
                              </div>

                              {/* Center Device Name */}
                              <div className="my-auto">
                                <span className="block text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                                  {device.name}
                                </span>
                                <span className="block text-[10px] font-mono text-neutral-500 mt-1">
                                  {device.roomName}
                                </span>
                              </div>

                              {/* Footer status toggle + hours counter */}
                              <div className="border-t border-neutral-850/60 pt-3 mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-1.5 text-neutral-500 text-[10.5px] font-mono">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{device.runningTimeHours} hrs</span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent opening drawer when toggling
                                    iot.toggleDevice(device.id);
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isOn 
                                      ? device.type === 'light'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-green-600 border-green-500 text-white'
                                      : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                  </div>
                )}

                {/* TAB 3: DETAILED ROOMS STATUS */}
                {activeTab === 'rooms' && (
                  <div className="space-y-6">
                    <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
                      <h2 className="text-xl font-bold text-white tracking-tight">Zone Monitoring Console</h2>
                      <p className="text-xs text-neutral-400 mt-1">
                        Select occupancy configurations manually to simulate human presence. Sensors will dynamically adapt.
                      </p>
                    </div>

                    <RoomCard
                      rooms={iot.rooms}
                      toggleDevice={iot.toggleDevice}
                      toggleRoomOccupancy={iot.toggleRoomOccupancy}
                      onInspectDevice={setSelectedDevice}
                    />
                  </div>
                )}

                {/* TAB 4: POWER & ENERGY RECHARTS ANALYTICS */}
                {activeTab === 'energy' && (
                  <EnergyCharts
                    rooms={iot.rooms}
                    livePowerData={iot.livePowerData}
                  />
                )}

                {/* TAB 5: AI OCCUPANCY SECURITY CAMERAS */}
                {activeTab === 'camera' && (
                  <CameraMonitoring
                    rooms={iot.rooms}
                    toggleRoomOccupancy={iot.toggleRoomOccupancy}
                    toggleDevice={iot.toggleDevice}
                  />
                )}

                {/* TAB 6: LOGGED SECURITY ALERTS LOG */}
                {activeTab === 'alerts' && (
                  <AlertsPanel
                    alerts={iot.alerts}
                    resolveAlert={iot.resolveAlert}
                  />
                )}

                {/* TAB 7: HARDWARE ARCHITECTURE DOCUMENTATION */}
                {activeTab === 'hardware' && (
                  <HardwareArchitecture />
                )}

                {/* TAB 8: DEVELOPER WORKBENCH CALIBRATION */}
                {activeTab === 'settings' && (
                  <SettingsPanel
                    isLiveConnection={iot.isLiveConnection}
                    setIsLiveConnection={iot.setIsLiveConnection}
                    triggerLoading={iot.triggerLoading}
                    triggerError={iot.triggerError}
                    triggerEmpty={iot.triggerEmpty}
                    isEmptyState={iot.isEmpty}
                  />
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </main>

      </div>

      {/* 4. Sliding inspection details side drawer */}
      <DeviceDrawer
        device={activeSelectedDevice}
        onClose={() => setSelectedDevice(null)}
        toggleDevice={iot.toggleDevice}
      />

    </BeamsBackground>
  );
}

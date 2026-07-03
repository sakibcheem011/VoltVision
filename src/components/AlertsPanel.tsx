import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, SlidersHorizontal, Trash2, Clock, MapPin } from 'lucide-react';
import { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  resolveAlert: (alertId: string) => void;
}

export default function AlertsPanel({ alerts, resolveAlert }: AlertsPanelProps) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-400';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse';
      default:
        return 'bg-green-500/10 border-green-500/20 text-green-400';
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    return severityMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md">
        
        <div className="flex items-center space-x-3">
          <SlidersHorizontal className="w-5 h-5 text-neutral-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Filters & Logging Controls</h4>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          
          {/* Severity Group */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">SEVERITY:</span>
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              {['all', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev as any)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all ${
                    severityFilter === sev 
                      ? 'bg-blue-600 text-white' 
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Status Group */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">STATUS:</span>
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              {['all', 'active', 'resolved'].map((stat) => (
                <button
                  key={stat}
                  onClick={() => setStatusFilter(stat as any)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all ${
                    statusFilter === stat 
                      ? 'bg-blue-600 text-white' 
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Logs Table / List Container */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800/80 overflow-hidden shadow-2xl">
        
        {/* Table Header labels */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-900 border-b border-neutral-800 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-2">SEVERITY</div>
          <div className="col-span-3">LOCATION</div>
          <div className="col-span-3">ALERT THREAD</div>
          <div className="col-span-2 text-right">ACTION</div>
        </div>

        {/* Alert List Rows */}
        <div className="divide-y divide-neutral-800/40">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 font-mono text-xs">
              No matching diagnostic alerts found under current filters.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 md:px-6 md:py-4.5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-colors duration-150 ${
                  alert.status === 'active' ? 'bg-red-500/[0.015]' : 'bg-transparent'
                }`}
              >
                
                {/* 1. Timestamp */}
                <div className="col-span-1 md:col-span-2 flex items-center space-x-2 text-xs text-neutral-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-neutral-500 md:hidden" />
                  <span>{alert.timestamp}</span>
                </div>

                {/* 2. Severity Badge */}
                <div className="col-span-1 md:col-span-2">
                  <span className={`inline-flex items-center px-2 py-1 border rounded-lg text-[9px] font-mono font-bold uppercase tracking-wide ${getSeverityStyles(alert.severity)}`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {alert.severity}
                  </span>
                </div>

                {/* 3. Location */}
                <div className="col-span-1 md:col-span-3 flex items-center space-x-2 text-xs font-bold text-white">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>{alert.roomName}</span>
                </div>

                {/* 4. Description Title & Text */}
                <div className="col-span-1 md:col-span-3 space-y-1">
                  <span className="block text-xs font-bold text-white leading-normal">
                    {alert.title}
                  </span>
                  <p className="text-[11px] text-neutral-400 leading-normal font-sans">
                    {alert.description}
                  </p>
                </div>

                {/* 5. Status Badge & Resolve CTA */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                  <span className={`inline-flex items-center px-2.5 py-1 border rounded-lg text-[9px] font-mono font-bold uppercase tracking-wide ${getStatusStyles(alert.status)}`}>
                    {alert.status}
                  </span>

                  {alert.status === 'active' ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3.5 py-1.5 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                    >
                      RESOLVE
                    </button>
                  ) : (
                    <span className="p-1.5 text-green-500/50">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}

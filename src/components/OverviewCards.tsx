import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Power, Zap, Hourglass, DollarSign, AlertTriangle } from 'lucide-react';

interface OverviewMetrics {
  totalDevices: number;
  devicesOn: number;
  currentPowerWatts: number;
  todayEnergyKwh: number;
  estimatedCostToday: number;
  activeAlertsCount: number;
}

interface OverviewCardsProps {
  metrics: OverviewMetrics;
}

export default function OverviewCards({ metrics }: OverviewCardsProps) {
  
  const cards = [
    {
      id: 'total-devices',
      title: 'Total Devices',
      value: metrics.totalDevices,
      unit: '',
      subtitle: 'Registered IoT terminals',
      icon: Cpu,
      colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/15',
      glowColor: 'rgba(59, 130, 246, 0.15)',
    },
    {
      id: 'devices-on',
      title: 'Devices Currently ON',
      value: metrics.devicesOn,
      unit: ` / ${metrics.totalDevices}`,
      subtitle: 'Active power-drawing nodes',
      icon: Power,
      colorClass: metrics.devicesOn > 0 ? 'text-green-400 bg-green-500/10 border-green-500/15' : 'text-neutral-500 bg-neutral-900 border-neutral-800',
      glowColor: metrics.devicesOn > 0 ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
    },
    {
      id: 'current-power',
      title: 'Current Power Draw',
      value: metrics.currentPowerWatts,
      unit: ' W',
      subtitle: 'Aggregate load reading',
      icon: Zap,
      colorClass: metrics.currentPowerWatts > 150 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/15' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15',
      glowColor: metrics.currentPowerWatts > 150 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(6, 182, 212, 0.15)',
    },
    {
      id: 'today-energy',
      title: 'Today\'s Energy',
      value: metrics.todayEnergyKwh,
      unit: ' kWh',
      subtitle: 'Cumulative daily draw',
      icon: Hourglass,
      colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/15',
      glowColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      id: 'est-cost',
      title: 'Est. Electricity Cost',
      value: metrics.estimatedCostToday,
      unit: ' BDT',
      prefix: '৳',
      subtitle: 'Tariff calculated rate (৳12/kWh)',
      icon: DollarSign,
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15',
      glowColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      id: 'active-alerts',
      title: 'Active Alerts',
      value: metrics.activeAlertsCount,
      unit: '',
      subtitle: 'Requires supervisor review',
      icon: AlertTriangle,
      colorClass: metrics.activeAlertsCount > 0 ? 'text-red-400 bg-red-500/15 border-red-500/20 animate-pulse' : 'text-neutral-500 bg-neutral-900 border-neutral-800',
      glowColor: metrics.activeAlertsCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        
        return (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.025, translateY: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative overflow-hidden rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-5 flex flex-col justify-between cursor-pointer"
            style={{
              boxShadow: `0 10px 30px -15px rgba(0,0,0,0.7), inset 0 1px 1px 0 rgba(255,255,255,0.05), 0 0 15px -3px ${card.glowColor}`,
            }}
          >
            {/* Header / Icon */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 font-sans tracking-wide">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.colorClass} flex items-center justify-center transition-all duration-300`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            {/* Value (animated when changed) */}
            <div className="mb-1 flex items-baseline">
              {card.prefix && (
                <span className="text-sm font-semibold text-neutral-400 mr-0.5 font-mono">
                  {card.prefix}
                </span>
              )}
              
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={card.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="text-2xl font-bold font-mono text-white tracking-tight leading-none"
                >
                  {card.value}
                </motion.span>
              </AnimatePresence>

              <span className="text-xs font-semibold text-neutral-500 font-mono ml-0.5">
                {card.unit}
              </span>
            </div>

            {/* Subtitle description */}
            <span className="text-[10px] font-medium text-neutral-500 font-sans tracking-wide">
              {card.subtitle}
            </span>

            {/* Micro subtle card gradient background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}

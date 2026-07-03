import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { RoomData } from '../types';

interface EnergyChartsProps {
  rooms: RoomData[];
  livePowerData: { time: string; value: number }[];
}

export default function EnergyCharts({ rooms, livePowerData }: EnergyChartsProps) {
  // 1. Live power consumption is fed from the livePowerData state
  
  // 2. Today's Energy Usage data (mocked hourly log)
  const hourlyEnergyData = [
    { hour: '08:00', value: 2.1, limit: 5 },
    { hour: '09:00', value: 4.5, limit: 5 },
    { hour: '10:00', value: 6.8, limit: 7 },
    { hour: '11:00', value: 8.2, limit: 7 },
    { hour: '12:00', value: 7.9, limit: 7 },
    { hour: '13:00', value: 6.2, limit: 7 },
    { hour: '14:00', value: 8.9, limit: 7 },
    { hour: '15:00', value: 9.4, limit: 9 },
    { hour: '16:00', value: 7.1, limit: 9 },
    { hour: '17:00', value: 5.4, limit: 9 },
  ];

  // 3. Power Consumption by Room (Dynamically calculated based on live status)
  const roomDistributionData = rooms.map((room) => {
    const power = room.devices.reduce((sum, d) => sum + (d.status === 'on' ? d.powerWatts : 0), 0);
    return {
      name: room.name,
      value: power === 0 ? 5 : power, // prevent 0 slice rendering issues, use 5 as base placeholder
      actualPower: power,
    };
  });

  const ROOM_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  // 4. Electricity Cost Trend (weekly expenditure)
  const weeklyCostData = [
    { day: 'Mon', cost: 222 },
    { day: 'Tue', cost: 252 },
    { day: 'Wed', cost: 234 },
    { day: 'Thu', cost: 294 },
    { day: 'Fri', cost: 264 },
    { day: 'Sat', cost: 102 },
    { day: 'Sun', cost: 48 },
  ];

  // Custom tooltips for nice styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-950/95 border border-neutral-800 p-3 rounded-xl shadow-2xl font-mono text-xs">
          <p className="text-neutral-400 font-bold mb-1">{label || 'Reading'}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-white">
              <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ backgroundColor: p.color || p.fill }} />
              {p.name}: <span className="font-bold text-blue-400">{p.value} {p.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Chart Section 1: Live Telemetry + Hourly Cumulative */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Live Power Consumption Line Chart */}
        <div className="rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 flex flex-col justify-between shadow-xl">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Live Power Consumption (Telemetry)</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              Streaming aggregate Wattage from Socket.IO every 3.5s
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={livePowerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={10} fontStyle="italic" />
                <YAxis stroke="#737373" fontSize={10} unit="W" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Aggregate Load"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                  unit="W"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution Area Chart */}
        <div className="rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 flex flex-col justify-between shadow-xl">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Hourly Load Distribution (Today)</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              Comparison against enterprise target safety baseline
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyEnergyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="hour" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} unit="kWh" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Actual Consumption"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                  unit=" kWh"
                />
                <Line
                  type="monotone"
                  dataKey="limit"
                  name="Threshold Limit"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  unit=" kWh"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart Section 2: Room distribution Pie + Weekly cost Area/Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Power Distribution by Zone */}
        <div className="rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 flex flex-col justify-between shadow-xl xl:col-span-1">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Load Distribution by Zone</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              Proportion of active room wattages
            </span>
          </div>

          <div className="h-64 w-full flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={roomDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ROOM_COLORS[index % ROOM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-lg text-xs font-mono">
                        <p className="text-white font-bold">{data.name}</p>
                        <p className="text-blue-400">Power: {data.actualPower} W</p>
                      </div>
                    );
                  }
                  return null;
                }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend to match UI */}
            <div className="flex justify-center space-x-4 text-[10px] font-mono mt-2 flex-wrap">
              {roomDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-1.5 py-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ROOM_COLORS[index % ROOM_COLORS.length] }} />
                  <span className="text-neutral-300">{entry.name}:</span>
                  <span className="text-white font-bold">{entry.actualPower}W</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Cost trend */}
        <div className="rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 flex flex-col justify-between shadow-xl xl:col-span-2">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Weekly Cumulative Cost Breakdown</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              Calculated utility tariff expenditure over trailing 7 days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="day" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} prefix="৳" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="cost" 
                  name="Energy Cost" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  unit=" BDT"
                >
                  {weeklyCostData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.cost > 240 ? '#10b981' : '#059669'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

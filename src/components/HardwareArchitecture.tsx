import React from 'react';
import { 
  Cpu, 
  Lightbulb, 
  Fan, 
  Cctv, 
  Activity, 
  ArrowRight, 
  Layers, 
  Server, 
  Monitor, 
  MessageSquare, 
  Zap, 
  ShieldAlert, 
  HardDrive,
  CheckCircle2,
  Info
} from 'lucide-react';
import schematicPlaceholder from '../assets/images/hardware_schematic_placeholder_1783116125150.jpg';

export default function HardwareArchitecture() {
  const hardwareComponents = [
    {
      name: 'ESP32 Microcontroller',
      description: 'The core processor unit. A low-cost, low-power system on a chip (SoC) with integrated Wi-Fi & dual-mode Bluetooth. It hosts the physical state loop, listens to toggle events from VoltVision API, and switches the relays.',
      specs: 'Tensilica Xtensa dual-core 32-bit LX6 @ 240MHz, 520 KB SRAM, built-in 802.11 b/g/n Wi-Fi.',
      icon: Cpu,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Relay Modules',
      description: 'Electromagnetic and optocoupler-isolated switches. These safely bridge the low-voltage ESP32 GPIO pins (3.3V DC) with high-voltage mains AC circuits (110V/220V) to turn physical loads on or off.',
      specs: '5V Opto-isolated Relay Module, supporting 10A @ 250V AC / 30V DC per channel.',
      icon: Layers,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      name: 'Smart Lights (LED Loads)',
      description: 'Standard office illumination zones. Represented in our circuit as low-wattage LED lights. The controller monitors cumulative status and runtime to calculate precise energy-saving thresholds.',
      specs: '15W LED standard loads (equivalent to 100W incandescent), single-phase AC control.',
      icon: Lightbulb,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      name: 'Smart Fans (Inductive Loads)',
      description: 'HVAC circulation fans. These inductive loads draw higher initial inrush currents. Managed via robust switching relays or triac-based dimming speed-controller boards for modular power consumption.',
      specs: '75W Single-phase inductive ceiling/exhaust fan load, active snubbers included.',
      icon: Fan,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      name: 'AI Occupancy Camera',
      description: 'Edge AI detection platform (e.g., ESP32-CAM or Raspberry Pi Zero 2W). Runs lightweight local neural nets (like YOLOv8-nano or MobileNet-SSD) to detect humans and transmit counts without recording private video.',
      specs: 'OV2640 camera sensor running on-edge inference, transmitting person counts via JSON.',
      icon: Cctv,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      name: 'Power Supply Unit',
      description: 'Compact step-down AC-to-DC converters (like the HLK-PM01 or HLK-5M05). It draws electricity from the standard AC power mains to supply stable, clean DC power required for the microcontrollers and sensors.',
      specs: 'Input: 100-240V AC, Output: 5V DC @ 1A / 3.3V DC voltage regulators.',
      icon: Zap,
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    },
    {
      name: 'Current & Power Sensor',
      description: 'Telemetry readings. Non-invasive CT sensors (like SCT-013-000) or integrated chips (like the ACS712) continuously capture real current and voltage waveforms, translating them to raw watt usage.',
      specs: 'SCT-013 current transformer, up to 30A input, calibrated analog output to ESP32 ADC.',
      icon: Activity,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-widest">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">Physical Layer Specification</span>
            <span>•</span>
            <span>v1.0.4 Draft</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2 font-sans">
            Hardware Architecture
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Detailed engineering schematic concept, data flows, and physical device specs bridging smart workplace endpoints to the VoltVision Cloud Service.
          </p>
        </div>
      </div>

      {/* Visual Hardware Data Flow Diagram */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2.5 mb-6">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>VoltVision System Data Flow</span>
        </h2>

        {/* Visual Flow diagram container */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-center py-6">
          {/* Node 1: AI Camera */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/50 hover:border-purple-500/30 transition-colors">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 mb-3 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]">
              <Cctv className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-semibold text-white text-sm">AI Camera</h3>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider mt-1">Edge Inference</span>
            <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2">Detects people & occupancy locally</p>
          </div>

          {/* Flow Indicator 1 */}
          <div className="flex flex-col items-center justify-center text-neutral-600">
            <span className="text-[10px] font-mono text-neutral-500 mb-1">HTTP JSON</span>
            <div className="flex md:flex-row flex-col items-center justify-center">
              <ArrowRight className="w-5 h-5 text-purple-500 md:rotate-0 rotate-90" />
            </div>
          </div>

          {/* Node 2: ESP32 Controller */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/50 hover:border-emerald-500/30 transition-colors">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mb-3 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-white text-sm">ESP32 Controller</h3>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mt-1">IoT Controller</span>
            <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2">Switches relays and reads sensor telemetry</p>
          </div>

          {/* Flow Indicator 2 */}
          <div className="flex flex-col items-center justify-center text-neutral-600">
            <span className="text-[10px] font-mono text-neutral-500 mb-1">REST / WebSockets</span>
            <div className="flex md:flex-row flex-col items-center justify-center">
              <ArrowRight className="w-5 h-5 text-emerald-500 md:rotate-0 rotate-90" />
            </div>
          </div>

          {/* Node 3: Backend API */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/50 hover:border-blue-500/30 transition-colors">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-3 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-white text-sm">Backend API</h3>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mt-1">Express Server</span>
            <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2">Saves history logs and relays control loops</p>
          </div>
        </div>

        {/* Downwards and splitting outputs flow */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 mt-4 pt-4 border-t border-neutral-800/40">
          <div className="text-center text-xs text-neutral-500 font-mono flex items-center space-x-2">
            <span>Aggregated Outputs Broadcast</span>
            <span className="text-blue-500 animate-bounce">↓</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Consumer A: Web Dashboard */}
            <div className="flex items-center space-x-2 bg-neutral-950/80 border border-neutral-850 px-3 py-1.5 rounded-lg">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-neutral-300 font-medium">Web Dashboard</span>
            </div>
            {/* Consumer B: Discord Bot */}
            <div className="flex items-center space-x-2 bg-neutral-950/80 border border-neutral-850 px-3 py-1.5 rounded-lg">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-neutral-300 font-medium">Discord Bot Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: System Hardware Components & Deployment Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: System Hardware Components (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              System Hardware Components
            </h2>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded">
              7 Modules Defined
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hardwareComponents.map((component, idx) => {
              const Icon = component.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-neutral-900/20 hover:bg-neutral-900/40 border border-neutral-800/40 hover:border-neutral-700/50 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2.5 rounded-xl border ${component.color} transition-transform group-hover:scale-105`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-neutral-200 text-sm tracking-tight">
                        {component.name}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {component.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-850 text-[10px] font-mono text-neutral-500 flex flex-col space-y-1">
                    <span className="font-semibold text-neutral-400 uppercase tracking-wider">Device Specs:</span>
                    <span className="leading-normal">{component.specs}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deployment Notes (1/3 width) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Deployment Notes
          </h2>

          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-5 space-y-5">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-200">Demonstration Simulation</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  To provide an interactive prototype experience without requiring complex hardware, this project uses a background Node.js simulator running on the Express backend server to generate simulated real-time IoT events.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-200">Real Deployment Blueprint</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The architecture schematic displayed below represents a production-ready concept designed for standard commercial environments. By mounting custom ESP32 units behind light sockets and wall relay boxes, existing structures can easily become VoltVision compatible.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-200">Scalable Room Topology</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Only one unified core ESP32 controller node is required per zone or room. Additional rooms can scale independently by duplicating this controller schematic block, utilizing identical firmware but subscribing to unique room ID API topics.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Hardware Safety Specs panel */}
          <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 border border-neutral-800/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              Physical Safety Standards
            </h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Optocoupler isolation on all AC relays</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span>Flame-retardant ABS enclosures (IP65)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Fuse protection (3A fast-blow inline)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Circuit Schematic Preview */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
              <HardDrive className="w-5 h-5 text-blue-400" />
              <span>Circuit Schematic Preview</span>
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              Concept electronic schematics showing how ESP32 microcontrollers are wired with relay switches, local status LEDs, current sensors, and AC power blocks.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase rounded-lg">
            Coming Soon to Tinkercad
          </span>
        </div>

        {/* Blueprint display frame */}
        <div className="relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 flex flex-col items-center justify-center p-2 group">
          <img 
            src={schematicPlaceholder} 
            alt="VoltVision Hardware Schematic Blueprint Diagram" 
            className="w-full max-h-[480px] object-cover rounded-lg filter brightness-90 group-hover:brightness-100 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle overlay overlay with absolute centering */}
          <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4">
            <div className="p-4 rounded-2xl bg-neutral-900/95 border border-white/10 max-w-md shadow-2xl space-y-3">
              <Cpu className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
              <h3 className="font-bold text-white text-base">Wokwi / Tinkercad Circuit Schematic Preview</h3>
              <p className="text-xs text-neutral-400">
                A live, interactive Tinkercad / Wokwi virtual simulator screenshot showing absolute hardware wire mappings is currently being assembled by the engineering team.
              </p>
              <div className="pt-2">
                <span className="px-3 py-1.5 bg-neutral-950 rounded border border-neutral-800 text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Schematic Revision v1.0.4 Draft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Radio, ArrowRightLeft, Cpu, Activity } from 'lucide-react';

export default function HcSr04Sensor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [distanceCm, setDistanceCm] = useState<number>(100); // Interactive measuring range: 2cm to 400cm
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [triggerCount, setTriggerCount] = useState<number>(0);

  // Speed of sound = 343 m/s = 0.0343 cm/µs
  // Time = (Distance * 2) / 0.0343 => roughly Distance * 58.3 µs
  const timeOfFlightUs = Math.round(distanceCm * 58.31);

  // Auto trigger interval to simulate continuous measurement if trigger is off
  useEffect(() => {
    const interval = setInterval(() => {
      setTriggerCount(prev => (prev + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const runPulseTrigger = () => {
    setIsTriggering(true);
    setTimeout(() => {
      setIsTriggering(false);
    }, 1000);
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[400px] w-[250px] relative transition-all hover:shadow-md group" id="hc-sr04-sensor-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Sensor Module
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">HC-SR04 Sonar</h3>
        <p className="text-[11px] text-gray-400 font-medium">4-Pin Sonic Distance Transceiver</p>
      </div>

      {/* HC-SR04 Board Graphic representation matching user image perfectly */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-3 w-full h-[180px] select-none">
        
        {/* Sonar state display overlay */}
        <div className="absolute top-[3px] w-full bg-slate-950 border border-slate-800/80 rounded-md py-1.5 px-2 flex items-center justify-between text-[8px] font-mono text-zinc-300">
          <span className="text-zinc-500 font-extrabold flex items-center gap-0.5">
            <Radio className="w-2.5 h-2.5 text-blue-400 animate-pulse" /> ECHO PULSE:
          </span>
          <span className="text-blue-400 font-bold">{timeOfFlightUs} µs</span>
        </div>

        {/* HC-SR04 Blueprint SVG Layout */}
        <svg 
          width="155" 
          height="120" 
          viewBox="0 0 155 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm mt-7"
        >
          <defs>
            {/* Classic Royal Blue PCB Board of the HC-SR04 */}
            <linearGradient id="hcS04Pcb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e4e7c" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="75%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1b3a60" />
            </linearGradient>

            {/* Aluminum Barrel shroud */}
            <linearGradient id="sonicAlu" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Metallic transducer mesh pattern */}
            <pattern id="grillMesh" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#334155" />
              <circle cx="2" cy="2" r="1.1" fill="#64748b" />
              <rect x="0" y="0" width="4" height="4" stroke="#1e293b" strokeWidth="0.4" fill="none" />
            </pattern>

            {/* Crystal metal package gradient */}
            <linearGradient id="metalCrystal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* PCB OUTLINE (Standard 1:1 rectangular ratio, deep royal blue) */}
          <rect 
            x="4" 
            y="6" 
            width="147" 
            height="86" 
            rx="5" 
            fill="url(#hcS04Pcb)" 
            stroke="#1d3557" 
            strokeWidth="1.5"
          />

          {/* FOUR SCREW MOUNT HOLES ENCIRCLED IN CORNERS */}
          <g stroke="#ffffff" strokeWidth="0.5" opacity="0.4">
            {/* Top Left */}
            <circle cx="10" cy="12" r="3.2" fill="#334155" />
            <circle cx="10" cy="12" r="1.5" fill="#f1f5f9" />
            
            {/* Top Right */}
            <circle cx="145" cy="12" r="3.2" fill="#334155" />
            <circle cx="145" cy="12" r="1.5" fill="#f1f5f9" />

            {/* Bottom Left */}
            <circle cx="10" cy="86" r="3.2" fill="#334155" />
            <circle cx="10" cy="86" r="1.5" fill="#f1f5f9" />

            {/* Bottom Right */}
            <circle cx="145" cy="86" r="3.2" fill="#334155" />
            <circle cx="145" cy="86" r="1.5" fill="#f1f5f9" />
          </g>

          {/* LIGHT BLUE PCB ROUTING COPPER TRACES */}
          <g stroke="#93c5fd" strokeWidth="0.8" opacity="0.35" fill="none">
            <path d="M 64 25 L 68 35 L 75 45" />
            <path d="M 91 25 L 87 35 L 80 45" />
            <path d="M 68 85 L 68 75 L 50 65" />
            <path d="M 87 85 L 87 75 L 105 65" />
          </g>

          {/* SILVER METAL OVAL OSCILLATOR CRYSTAL PACKAGE (Top edge center) */}
          <rect 
            x="58" 
            y="12" 
            width="39" 
            height="17" 
            rx="6" 
            fill="url(#metalCrystal)" 
            stroke="#475569" 
            strokeWidth="0.8"
          />
          {/* Subtle crystal reflections */}
          <line x1="64" y1="14" x2="64" y2="27" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
          <line x1="88" y1="14" x2="88" y2="27" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />

          {/* WHITE IDENTIFICATION BRANDING TEXT */}
          <text 
            x="77.5" 
            y="43" 
            fill="#ffffff" 
            fontSize="9" 
            fontFamily="mono" 
            fontWeight="900" 
            textAnchor="middle" 
            letterSpacing="0.4"
            opacity="0.95"
          >
            HC-SR04
          </text>

          {/* FOUR PIN PORTS HEADER PADS at bottom center */}
          {/* Visual pitch connector plastic block */}
          <rect x="61" y="81" width="33" height="11" rx="1.5" fill="#18181b" stroke="#09090b" strokeWidth="0.8" />
          
          {/* Connector segmentation ridges */}
          <line x1="69" y1="81" x2="69" y2="92" stroke="#4b5563" strokeWidth="0.6" />
          <line x1="77.5" y1="81" x2="77.5" y2="92" stroke="#4b5563" strokeWidth="0.6" />
          <line x1="86" y1="81" x2="86" y2="92" stroke="#4b5563" strokeWidth="0.6" />

          {/* PIN LABELS (Printed in clear white) */}
          <g fill="#ffffff" fontSize="5.5" fontFamily="sans-serif" fontWeight="950" opacity="0.9" textAnchor="middle">
            <text x="65" y="73" transform="rotate(-90, 65, 73)">VCC</text>
            <text x="73.5" y="73" transform="rotate(-90, 73.5, 73)">TRIG</text>
            <text x="82" y="73" transform="rotate(-90, 82, 73)">ECHO</text>
            <text x="90.5" y="73" transform="rotate(-90, 90.5, 73)">GND</text>
          </g>

          {/* 4 SOLID LEADS EXTENDING OUT OF BLACK HOUSING */}
          {/* PIN 1: VCC */}
          <line 
            x1="65" y1="91" x2="65" y2="114" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'vcc' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('vcc')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 2: TRIG */}
          <line 
            x1="73.5" y1="91" x2="73.5" y2="114" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'trig' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('trig')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 3: ECHO */}
          <line 
            x1="82" y1="91" x2="82" y2="114" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'echo' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('echo')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 4: GND */}
          <line 
            x1="90.5" y1="91" x2="90.5" y2="114" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'gnd' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('gnd')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* TWO ENORMOUS METAL TRANSDUCER BARRELS (T & R) */}
          {/* LEFT CAN: TX Sonar Transmitter */}
          <g>
            <circle cx="34" cy="48" r="25" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="34" cy="48" r="24" fill="url(#sonicAlu)" stroke="#020617" strokeWidth="1" />
            <circle cx="34" cy="48" r="18" fill="url(#grillMesh)" />
            {/* Center microphone capsule piece */}
            <circle cx="34" cy="48" r="7.5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
            {/* Holographic lens flare */}
            <path d="M 24 38 A 15 15 0 0 1 44 38" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
            <text x="34" y="52" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="950" textAnchor="middle" opacity="0.15">T</text>
          </g>

          {/* RIGHT CAN: RX Sonar Receiver */}
          <g>
            <circle cx="121" cy="48" r="25" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="121" cy="48" r="24" fill="url(#sonicAlu)" stroke="#020617" strokeWidth="1" />
            <circle cx="121" cy="48" r="18" fill="url(#grillMesh)" />
            {/* Center microphone receiver piece */}
            <circle cx="121" cy="48" r="7.5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
            {/* Holographic lens flare */}
            <path d="M 111 38 A 15 15 0 0 1 131 38" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
            <text x="121" y="52" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="950" textAnchor="middle" opacity="0.15">R</text>
          </g>

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'vcc' && (
            <rect x="60" y="109" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'trig' && (
            <rect x="68.5" y="109" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'echo' && (
            <rect x="77" y="109" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'gnd' && (
            <rect x="85.5" y="109" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Dynamic ping animations triggered continuously */}
        {(isTriggering || triggerCount === 0) && (
          <div className="absolute left-[5px] top-[45px] flex flex-col items-center pointer-events-none w-[50px]">
            <span className="text-[7px] text-blue-500 font-extrabold animate-bounce bg-blue-50 px-1 py-0.2 rounded border border-blue-150 shadow-sm">40kHz TX🔊</span>
            <div className="w-8 h-8 rounded-full border border-blue-500/60 animate-ping absolute top-4" />
          </div>
        )}

        {(isTriggering || triggerCount === 2) && (
          <div className="absolute right-[5px] top-[45px] flex flex-col items-center pointer-events-none w-[50px]">
            <span className="text-[7px] text-amber-600 font-extrabold animate-bounce bg-amber-50 px-1 py-0.2 rounded border border-amber-150 shadow-sm">RX🎤 ECHO</span>
            <div className="w-8 h-8 rounded-full border border-amber-500/50 animate-ping absolute top-4" />
          </div>
        )}

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1.2 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className="text-blue-400 font-extrabold text-[9px] uppercase">
              {hoveredTerminal === 'vcc' ? 'VCC (+5V Power)' : hoveredTerminal === 'trig' ? 'TRIG (Input Trigger)' : hoveredTerminal === 'echo' ? 'ECHO (Output Pulse)' : 'GND (System Ground)'}
            </span>
            <span className="text-[8px] text-slate-350">
              {hoveredTerminal === 'vcc' 
                ? 'Standard logic power rail input (5V DC stable)' 
                : hoveredTerminal === 'trig' 
                  ? 'Input: Send a 10µS high pulse to start sonar burst' 
                  : hoveredTerminal === 'echo' 
                    ? 'Output: Outputs high pulse matching roundtrip duration'
                    : 'Common ground return rail (0V)'}
            </span>
          </div>
        )}
      </div>

      {/* Slide & Trigger Controls */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto text-xs">
        
        {/* Distance Indicator */}
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-gray-400 uppercase font-extrabold text-[8px] flex items-center gap-1.5">
            <ArrowRightLeft className="w-3 h-3 text-blue-500" /> Sonic Target Dist.
          </span>
          <span className="text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shadow-sm">
            {distanceCm} cm
          </span>
        </div>

        {/* Slider */}
        <input 
          type="range"
          min="2"
          max="400"
          step="1"
          value={distanceCm}
          onChange={(e) => setDistanceCm(parseInt(e.target.value))}
          className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[7px] text-gray-400 font-extrabold uppercase">
          <span>Min (2cm)</span>
          <span>Max (400cm / 4m)</span>
        </div>

        {/* Live Timing Analysis Telemetry Panel */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold">
          <div className="flex justify-between">
            <span className="text-gray-400 text-[8.5px]">Time of Flight (ToF):</span>
            <span className="font-mono text-slate-800">{timeOfFlightUs.toLocaleString()} µs</span>
          </div>
          
          <div className="flex justify-between items-center border-t border-slate-50 pt-1">
            <button 
              onClick={runPulseTrigger} 
              disabled={isTriggering}
              className={`text-[8.5px] uppercase font-bold flex items-center gap-1 border rounded px-1.5 py-0.5 transition-colors cursor-pointer ${
                isTriggering 
                  ? 'bg-blue-105 border-blue-200 text-blue-700 animate-pulse' 
                  : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <Cpu className="w-2.5 h-2.5" /> 
              {isTriggering ? 'Pulsing...' : 'Simulate Echo Cycle'}
            </button>
            <span className="font-mono text-[8.5px] text-sky-700">Ready</span>
          </div>

          <div className="flex justify-between text-gray-700 pt-0.5">
            <span className="text-gray-400 text-[8.5px]">Calculation Code:</span>
            <span className="font-mono text-[8.5px] text-slate-500 font-medium">ToF / 58.0 = cm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

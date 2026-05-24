import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, RefreshCw } from 'lucide-react';

export default function Inductor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [inductance, setInductance] = useState<number>(150); // Value in microHenries (uH)
  const [frequency, setFrequency] = useState<number>(10000); // Frequency in Hz (10kHz default)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [time, setTime] = useState<number>(0);

  // SVG-based animation frame ticker for AC magnetic field pulsing
  const rAFRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isPlaying) {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      return;
    }

    const tick = () => {
      setTime(prev => (prev + 0.05) % (Math.PI * 2));
      rAFRef.current = requestAnimationFrame(tick);
    };
    rAFRef.current = requestAnimationFrame(tick);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [isPlaying]);

  // Calculations for Reactance: X_L = 2 * Pi * f * L
  const lHenries = inductance * 1e-6;
  const reactance = 2 * Math.PI * frequency * lHenries;
  
  // Stored Energy: E = 0.5 * L * I^2. With 5V peak AC input:
  const voltagePeak = 5.0; // Volts
  const currentPeak = voltagePeak / Math.max(0.1, reactance); // Peak AC current (Amps)
  const energyPeak = 0.5 * lHenries * (currentPeak * currentPeak); // Peak stored energy (Joules)

  // Double checking reactance display units
  const formattedReactance = reactance >= 1000
    ? `${(reactance / 1000).toFixed(2)} kΩ`
    : `${reactance.toFixed(1)} Ω`;

  const formattedCurrent = currentPeak >= 1
    ? `${currentPeak.toFixed(2)} A`
    : `${(currentPeak * 1000).toFixed(1)} mA`;

  const formattedEnergy = energyPeak >= 1e-3
    ? `${(energyPeak * 1000).toFixed(2)} mJ`
    : `${(energyPeak * 1e6).toFixed(2)} µJ`;

  // Dynamic pulsing magnetic flux opacity mapped to time
  const magneticFluxIntensity = isPlaying ? Math.abs(Math.sin(time)) : 0.3;

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group" id="inductor-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Passive Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Inductor (Coil)</h3>
        <p className="text-[11px] text-gray-400 font-medium font-sans">Toroidal / Axial Coil</p>
      </div>

      {/* Inductor Graphic Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Pulsing Magnetic Field Halo mapping AC currents */}
        <div 
          className="absolute rounded-full pointer-events-none transition-all duration-150"
          style={{
            width: '140px',
            height: '75px',
            top: '52px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(ellipse at center, rgba(217, 119, 6, ${magneticFluxIntensity * 0.18}) 0%, rgba(217, 119, 6, 0.04) 50%, rgba(255, 255, 255, 0) 80%)`,
            filter: 'blur(4px)',
          }}
        />

        {/* Inductor SVG Render referencing styling of the physical image perfectly */}
        <svg 
          width="130" 
          height="160" 
          viewBox="0 0 130 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Magnetic flux rings gradients */}
            <linearGradient id="magneticFluxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>

            {/* Core copper-brown metal gradient */}
            <linearGradient id="coreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a5a2a" />
              <stop offset="35%" stopColor="#b45309" />
              <stop offset="70%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Brass/Golden wire texture */}
            <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="20%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="85%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Shadow gradients */}
            <radialGradient id="ringShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="black" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* BACKGROUND MAGNETIC FIELD RINGS (Dynamic Pulsing) */}
          {isPlaying && (
            <g opacity={magneticFluxIntensity}>
              <ellipse cx="65" cy="80" rx="42" ry="15" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
              <ellipse cx="65" cy="80" rx="55" ry="24" stroke="#d97706" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.4" />
            </g>
          )}

          {/* TWO TERMINAL LEADS (Horizontal entry) */}
          {/* LEFT LEAD: Terminal 1 */}
          <path 
            d="M 10 80 Q 25 80, 32 80" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't1' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t1')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* RIGHT LEAD: Terminal 2 */}
          <path 
            d="M 98 80 Q 110 80, 120 80" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't2' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t2')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* MAIN INNER CORE (Brown iron core cylinder) */}
          <rect 
            x="24" 
            y="75" 
            width="82" 
            height="10" 
            rx="2.5" 
            fill="url(#coreGrad)" 
            stroke="#451a03" 
            strokeWidth="1"
          />

          {/* COPPED WIRE windings helicals (12 highly repeating turns) */}
          {/* Drawn as beautiful vertical oval wraps around the core */}
          <g>
            {/* Draw back/shadow-loops under core for 3D realism */}
            {[28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94].map((xOffset) => (
              <path
                key={`wire-back-${xOffset}`}
                d={`M ${xOffset + 2} 83 C ${xOffset} 83, ${xOffset} 77, ${xOffset + 2} 77`}
                stroke="#5d2f00"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            ))}

            {/* Draw prominent golden foreground wire turns */}
            {[26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92].map((xOffset, index) => (
              <g key={`wire-turn-${xOffset}`}>
                {/* 3D Wire segment rendering as volumetric oval rings */}
                <ellipse 
                  cx={xOffset + 2.5} 
                  cy="80" 
                  rx="2.5" 
                  ry="10.5" 
                  fill="url(#wireGrad)" 
                  stroke="#78350f" 
                  strokeWidth="0.8"
                />
                
                {/* Highlight line on each coil turn */}
                <line 
                  x1={xOffset + 1.2} 
                  y1="75" 
                  x2={xOffset + 1.2} 
                  y2="85" 
                  stroke="#fffbeb" 
                  strokeWidth="0.6" 
                  opacity="0.8" 
                />
              </g>
            ))}

            {/* Connect wire terminals into outer leads */}
            <path d="M 26 80 L 24 80" stroke="url(#wireGrad)" strokeWidth="3" />
            <path d="M 94.5 80 L 98 80" stroke="url(#wireGrad)" strokeWidth="3" />
          </g>

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 't1' && (
            <rect x="5" y="75" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 't2' && (
            <rect x="115" y="75" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {hoveredTerminal === 't1' ? 'LEAD 1 (Magnetic Entry)' : 'LEAD 2 (Magnetic Return)'}
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        {/* Header with values */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-750">
          <span className="text-gray-500 font-sans flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            L-Val: <span className="text-amber-700 font-mono font-bold">{inductance} µH</span>
          </span>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 transition-colors border cursor-pointer ${
              isPlaying 
                ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-150'
            }`}
          >
            <Zap className={`w-2.5 h-2.5 ${isPlaying ? 'fill-current animate-pulse' : ''}`} />
            {isPlaying ? 'AC Running' : 'AC Stopped'}
          </button>
        </div>

        {/* Inductance parameter slider */}
        <div className="flex flex-col">
          <div className="flex justify-between text-[8.5px] text-gray-400 font-semibold mb-0.5">
            <span>Coil Inductance</span>
            <span>10 - 1000 µH</span>
          </div>
          <input 
            type="range"
            min="10"
            max="1000"
            step="10"
            value={inductance}
            onChange={(e) => setInductance(parseInt(e.target.value))}
            className="w-full accent-amber-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Frequency parameter slider */}
        <div className="flex flex-col">
          <div className="flex justify-between text-[8.5px] text-gray-400 font-semibold mb-0.5">
            <span>AC Frequency</span>
            <span>{frequency >= 1000 ? `${(frequency / 1000).toFixed(0)} kHz` : `${frequency} Hz`}</span>
          </div>
          <input 
            type="range"
            min="100"
            max="50000"
            step="100"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full accent-amber-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Calculated Stats Grid */}
        <div className="grid grid-cols-2 gap-1 text-center mt-1">
          <div className="bg-white border border-slate-150 p-1 rounded-md">
            <div className="text-[8px] text-gray-400 uppercase font-extrabold">Reactance (X_L)</div>
            <div className="text-[10px] font-mono font-extrabold text-[#111827]">
              {formattedReactance}
            </div>
          </div>
          <div className="bg-white border border-slate-150 p-1 rounded-md">
            <div className="text-[8px] text-gray-400 uppercase font-extrabold">Stored Energy</div>
            <div className="text-[10px] font-mono font-extrabold text-amber-600">
              {formattedEnergy}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

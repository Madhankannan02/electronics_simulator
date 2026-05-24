import React, { useState } from 'react';
import { Shield, Zap, RotateCcw, Activity } from 'lucide-react';

interface DiodeProps {
  inputVoltage?: number
  currentMa?: number
  mode?: 'blocking' | 'forward'
}

export default function Diode({ inputVoltage = 0, currentMa = 0, mode = 'blocking' }: DiodeProps) {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  // Display-friendly values
  const formattedCurrent = currentMa >= 1000
    ? `${(currentMa / 1000).toFixed(2)} A`
    : currentMa > 0.05
      ? `${currentMa.toFixed(1)} mA`
      : '0.0 mA (Blocked)';

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group" id="normal-diode-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
          Active Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Rectifier Diode</h3>
        <p className="text-[11px] text-gray-400 font-medium">Standard Silicon 1N4007</p>
      </div>

      {/* Diode Visual representation - Horizontal axis */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Glow glow if conducting */}
        {mode === 'forward' && (
          <div 
            className="absolute rounded-full pointer-events-none transition-all duration-300"
            style={{
              width: '110px',
              height: '60px',
              top: '70px',
              background: `radial-gradient(ellipse at center, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.03) 60%, rgba(255, 255, 255, 0) 80%)`,
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Dynamic breakdown spark overlay - blocks reverse up to 1000V */}
        {inputVoltage < -6 && (
          <div className="absolute top-[30px] font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-205 pointer-events-none animate-pulse">
            Blocking: {Math.abs(inputVoltage).toFixed(0)}V / 1000V Max V_RRM
          </div>
        )}

        {/* Silicton Diode SVG - matches reference perfectly */}
        <svg 
          width="150" 
          height="100" 
          viewBox="0 0 150 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Plastic cylindrical capsule metallic gradient styling */}
            <linearGradient id="diodeBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="35%" stopColor="#1f2937" />
              <stop offset="70%" stopColor="#111827" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Standard cathode band (silver ring) gradient */}
            <linearGradient id="cathodeBand" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="85%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Inner silhouette shine layout */}
            <linearGradient id="diodeGloss" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* TWO HORIZONTAL WIRE LEADS */}
          {/* ANODE WIRE LEAD (Left leg, positive side) */}
          <path 
            d="M 10 50 L 45 50" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'anode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('anode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* CATHODE WIRE LEAD (Right leg, negative side) */}
          <path 
            d="M 105 50 L 140 50" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'cathode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('cathode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* BLACK CYLINDRICAL MAIN PLASTIC BODY */}
          <rect 
            x="42" 
            y="28" 
            width="66" 
            height="44" 
            rx="5" 
            fill="url(#diodeBody)" 
            stroke="#111827" 
            strokeWidth="1.2"
          />

          {/* SILVER CATHODE BAND (Indicating the polarity on the right-hand side) */}
          <rect 
            x="88" 
            y="28.5" 
            width="12" 
            height="43" 
            rx="1" 
            fill="url(#cathodeBand)" 
            stroke="#475569" 
            strokeWidth="0.5"
          />

          {/* Dynamic LED action indicator */}
          {mode === 'forward' && (
            <path 
              d="M 60 42 L 75 50 L 60 58 Z M 75 42 L 75 58" 
              stroke="#ef4444" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              className="animate-pulse"
            />
          )}

          {/* Laser-etched Part Inscription Code */}
          <text 
            x="64" 
            y="65" 
            fill="#94a3b8" 
            fontSize="7" 
            fontFamily="mono" 
            fontWeight="bold" 
            opacity="0.65"
            letterSpacing="0.2"
          >
            1N4007
          </text>

          {/* Top volumetric glare line on body */}
          <path 
            d="M 45 32 L 105 32" 
            stroke="url(#diodeGloss)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'anode' && (
            <rect x="5" y="45" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'cathode' && (
            <rect x="135" y="45" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className={hoveredTerminal === 'anode' ? 'text-emerald-400 font-extrabold text-[9px]' : 'text-amber-300 font-extrabold text-[9px]'}>
              {hoveredTerminal === 'anode' ? 'ANODE (A / External positive)' : 'CATHODE (K / Silver Polarity Stripe)'}
            </span>
            <span className="text-[8.5px] text-slate-350">
              {hoveredTerminal === 'anode' 
                ? 'Incoming positive signal charges through current barrier' 
                : 'Blocked/exit side of standard rectifying current'}
            </span>
          </div>
        )}
      </div>

      {/* Diode Simulation Console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        <div className="flex flex-col">
          <div className="flex justify-between text-[8.5px] text-gray-450 font-bold uppercase mb-0.5">
            <span>External Voltage Bias</span>
            <span className="font-mono text-slate-800 font-bold">{inputVoltage.toFixed(1)} V</span>
          </div>
        </div>

        {/* Calculated live status card container */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1.5 text-[10px] font-bold">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 uppercase font-extrabold text-[8px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-500" /> State
            </span>
            <span className={`px-1.5 py-0.5 rounded-full text-[8px] uppercase font-extrabold ${
              mode === 'forward' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse' 
                : 'bg-slate-100 text-slate-550 border border-slate-200'
            }`}>
              {mode === 'forward' ? 'CONDUCTING (ON)' : 'BLOCKING (OFF)'}
            </span>
          </div>

          <div className="flex justify-between text-gray-700 border-t border-slate-50 pt-1">
            <span className="text-gray-400 text-[8.5px]">Expected Forward Drop:</span>
            <span className="font-mono text-slate-800">~ 0.70 V</span>
          </div>

          <div className="flex justify-between text-gray-750">
            <span className="text-gray-400 text-[8.5px]">Diode Current (I_F):</span>
            <span className="font-mono text-slate-800">{formattedCurrent}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

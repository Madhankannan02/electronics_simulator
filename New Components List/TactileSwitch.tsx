import React, { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export default function TactileSwitch() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
          Electromechanical
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Tactile Switch</h3>
        <p className="text-[11px] text-gray-400 font-medium">Normally Open Push Button</p>
      </div>

      {/* Switch Visual Representation */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[185px]">
        {/* Spark/Contact aura */}
        {isPressed && (
          <div className="absolute w-[90px] h-[90px] rounded-full bg-emerald-500/10 border border-emerald-400/20 animate-pulse pointer-events-none" />
        )}

        {/* Tactile Switch SVG Render matching reference image perfectly */}
        <svg 
          width="110" 
          height="120" 
          viewBox="0 0 110 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Gray casing gradient */}
            <linearGradient id="switchCasing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" /> {/* pure light metallic */}
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" /> {/* dark iron */}
            </linearGradient>

            {/* Plunger button cap gradient */}
            <radialGradient id="plungerGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              {isPressed ? (
                <>
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="85%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </>
              )}
            </radialGradient>

            {/* Metal Terminal Pin pins */}
            <linearGradient id="switchTerminals" x1="15" y1="0" x2="95" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* FOUR CORNER BENT LEADS */}
          {/* Top-Left Pin (1A) */}
          <path 
            d="M 20 15 L 20 5" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === '1A' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('1A')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* Top-Right Pin (2A) */}
          <path 
            d="M 90 15 L 90 5" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === '2A' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('2A')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* Bottom-Left Pin (1B) */}
          <path 
            d="M 20 105 L 20 115" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === '1B' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('1B')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* Bottom-Right Pin (2B) */}
          <path 
            d="M 90 105 L 90 115" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === '2B' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('2B')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* MAIN SQUARE CASING */}
          <rect 
            x="12" y="15" width="86" height="90" 
            rx="8" 
            fill="url(#switchCasing)" 
            stroke="#475569" 
            strokeWidth="1.5" 
          />

          {/* 4 DARK CORNER PLASTIC ROUND RIVETS */}
          <circle cx="21" cy="24" r="5.5" fill="#334155" />
          <circle cx="89" cy="24" r="5.5" fill="#334155" />
          <circle cx="21" cy="96" r="5.5" fill="#334155" />
          <circle cx="89" cy="96" r="5.5" fill="#334155" />

          {/* COLLAR RING (button plunger rim) */}
          <circle 
            cx="55" cy="60" r="28" 
            fill="#64748b" 
            stroke="#334155" 
            strokeWidth="1" 
          />

          {/* CENTRAL BUTTON PLUNGER (CLICKABLE PLASTIC CAPSULE) */}
          <circle 
            cx="55" 
            cy="60" 
            r="23" 
            fill="url(#plungerGrad)" 
            stroke="#1e293b" 
            strokeWidth="1.5" 
            className="cursor-pointer hover:brightness-110 active:scale-95 origin-center transition-all"
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
          />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === '1A' && (
            <rect x="15" y="0" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === '2A' && (
            <rect x="85" y="0" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === '1B' && (
            <rect x="15" y="110" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === '2B' && (
            <rect x="85" y="110" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className="text-amber-300 text-[9px] uppercase font-bold">TERMINAL {hoveredTerminal}</span>
            <span className="text-[8.5px] text-slate-300">
              {['1A', '1B'].includes(hoveredTerminal) ? 'Pins 1A & 1B (Internally Joined Pair / A)' : 'Pins 2A & 2B (Internally Joined Pair / B)'}
            </span>
          </div>
        )}
      </div>

      {/* Button Switch interactive deck */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            {isPressed ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
            <span>Mechanical Action</span>
          </div>
          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${isPressed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
            {isPressed ? 'Closed / HIGH' : 'Open / LOW'}
          </span>
        </div>
        <p className="text-[10px] text-gray-500 text-center select-none font-medium mt-0.5">
          {isPressed ? '💡 Contacts bridged. Resistance = 0Ω' : '👆 Push down the center plunger to trigger'}
        </p>
      </div>
    </div>
  );
}

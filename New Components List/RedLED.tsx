import React, { useState } from 'react';
import { Lightbulb, Info } from 'lucide-react';

export default function RedLED() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [ledState, setLedState] = useState<'off' | 'on'>('on');
  const [brightness, setBrightness] = useState<number>(80); // percentage

  const isLit = ledState === 'on';

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
          Optoelectronic
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Light Emitting Diode</h3>
        <p className="text-[11px] text-gray-400 font-medium">Standard 5mm Red LED</p>
      </div>

      {/* Glossy LED Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Glow behind the LED bulb if turned on */}
        {isLit && (
          <>
            {/* Massive ambient background outer glow - centered precisely on the dome */}
            <div 
              className="absolute pointer-events-none transition-all duration-300 animate-pulse"
              style={{
                width: `${125 + brightness * 0.45}px`,
                height: `${125 + brightness * 0.45}px`,
                top: '52px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, rgba(239, 68, 68, ${(brightness / 100) * 0.82}) 0%, rgba(239, 68, 68, ${(brightness / 100) * 0.28}) 42%, rgba(239, 68, 68, 0) 70%)`,
                filter: `blur(${8 + brightness * 0.08}px)`,
                mixBlendMode: 'screen',
                opacity: 0.95,
              }}
            />
            {/* Blinding white-hot core inner super-glow - centered precisely on the dome */}
            <div 
              className="absolute pointer-events-none transition-all duration-300"
              style={{
                width: `${45 + brightness * 0.25}px`,
                height: `${45 + brightness * 0.25}px`,
                top: '52px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(254, 202, 202, 0.95) 20%, rgba(239, 68, 68, ${(brightness / 100) * 0.98}) 55%, rgba(239, 68, 68, 0) 100%)`,
                filter: 'blur(3.5px)',
                mixBlendMode: 'screen',
                opacity: 0.98,
              }}
            />
          </>
        )}

        {/* LED SVG Render matching the product image perfectly */}
        <svg 
          width="100" 
          height="160" 
          viewBox="0 0 100 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 select-none transition-all duration-200"
        >
          {/* DEFINITIONS for gradient overlays */}
          <defs>
            {/* Top glowing dome gradient */}
            <linearGradient id="ledTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              {isLit ? (
                <>
                  <stop offset="0%" stopColor="#ff5a5a" />
                  <stop offset="40%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#bd1c1c" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="50%" stopColor="#7f1d1d" />
                  <stop offset="100%" stopColor="#550707" />
                </>
              )}
            </linearGradient>

            {/* Dark unlit bottom cup gradient */}
            <linearGradient id="ledBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              {isLit ? (
                <>
                  <stop offset="0%" stopColor="#5a0505" />
                  <stop offset="100%" stopColor="#300202" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#400404" />
                  <stop offset="100%" stopColor="#210101" />
                </>
              )}
            </linearGradient>

            {/* High-efficiency inner light emission hot core */}
            <linearGradient id="ledInnerCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="35%" stopColor="#fca5a5" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="ledGlassReflect" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="30%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="metalLegs" x1="30" y1="0" x2="70" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* INTERNAL SOLID METAL FRAME inside the epoxy (posts/comb) */}
          <g opacity="0.6">
            {/* Cathode Anvil (wider left post) */}
            <path d="M41 68 L41 53 L34 50 L34 56 Z" fill="#94a3b8" />
            {/* Anode Post (thinner right post) */}
            <path d="M57 68 L57 55 L54 53 L54 55 Z" fill="#94a3b8" />
            {/* Tiny wire bond connection */}
            <path d="M38 52 C45 42, 50 48, 55 53" stroke="#e2e8f0" strokeWidth="0.8" fill="none" />
          </g>

          {/* METAL LEGS (TERMINALS) - Extended down */}
          {/* LEFT LEG: Cathode (Straight, shorter leg) */}
          <line 
            x1="41" y1="78" x2="41" y2="128" 
            stroke="#94a3b8" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'cathode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('cathode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* RIGHT LEG: Anode (Longer, with curved bend exactly like reference image) */}
          <path 
            d="M57 78 L57 91 C57 95, 62 95, 65 99 L65 135" 
            stroke="#94a3b8" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            fill="none"
            className={`cursor-pointer transition-all ${hoveredTerminal === 'anode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('anode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* REINFORCED METAL ENTRY GASKETS */}
          <rect x="38" y="76" width="6" height="4" fill="#94a3b8" rx="0.5" />
          <rect x="54" y="76" width="6" height="4" fill="#94a3b8" rx="0.5" />

          {/* MAIN EPOXY BODY (LED BULB) */}
          {/* Flattened bottom circle of body flange (Representing bottom dark rim) */}
          <ellipse cx="49" cy="74" rx="16.5" ry="4" fill="url(#ledBottomGrad)" />

          {/* Dark Bottom Base cup (Cylinder height from divider to bottom rim) */}
          <path d="M32.5 61 L32.5 74 C32.5 74, 32.5 75, 49 75 C65.5 75, 65.5 74, 65.5 74 L65.5 61 Z" fill="url(#ledBottomGrad)" />

          {/* Glowing Top Bullet Dome (y=30 to y=61) */}
          <path d="M32.5 61 C32.5 61, 32.5 30, 49 30 C65.5 30, 65.5 61, 65.5 61 Z" fill="url(#ledTopGrad)" />

          {/* High-efficiency inner neon core (Only when active) */}
          {isLit && (
            <path 
              d="M36 61 C36 61, 36 34, 49 34 C62 34, 62 61, 62 61 Z" 
              fill="url(#ledInnerCoreGrad)" 
              opacity={(brightness / 100) * 0.95}
            />
          )}

          {/* Elliptical illuminated divider separator inside bulb (Exactly like physical reference) */}
          <ellipse 
            cx="49" 
            cy="61" 
            rx="16.5" 
            ry="3" 
            fill={isLit ? "#ffccd5" : "#5a0505"} 
            stroke={isLit ? "#f43f5e" : "#210101"} 
            strokeWidth="0.5" 
            opacity={isLit ? 0.95 : 0.4} 
          />
          
          {/* Glossy Reflection Highlight */}
          <path d="M35 72 C35 72, 35 34, 45 34" stroke="url(#ledGlassReflect)" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'cathode' && (
            <rect x="36" y="123" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'anode' && (
            <rect x="60" y="130" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators overlaying nearby */}
        {hoveredTerminal && (
          <div className="absolute top-[125px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex items-center gap-1.5 animate-bounce">
            <span className={`w-2 h-2 rounded-full ${hoveredTerminal === 'anode' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {hoveredTerminal === 'anode' ? 'ANODE (Positive + / Longer Leg)' : 'CATHODE (Negative - / Flat Leg)'}
          </div>
        )}
      </div>

      {/* Interactive Controls inside the card */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>LED Tester</span>
          </div>
          <button 
            onClick={() => setLedState(prev => prev === 'on' ? 'off' : 'on')}
            className={`px-2 py-0.5 rounded font-extrabold text-[9px] tracking-wider uppercase border cursor-pointer transition-colors ${
              isLit 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
            }`}
          >
            {isLit ? 'Turn Off' : 'Turn On'}
          </button>
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-[10px] text-gray-400 font-bold">PWM State</span>
          <input 
            type="range"
            min="10"
            max="100"
            step="5"
            value={brightness}
            onChange={(e) => {
              setLedState('on');
              setBrightness(parseInt(e.target.value));
            }}
            className="flex-1 accent-red-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] font-mono font-bold text-gray-500 w-6 text-right">
            {brightness}%
          </span>
        </div>
      </div>
    </div>
  );
}

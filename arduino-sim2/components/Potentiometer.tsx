import React, { useState, useRef, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

export default function Potentiometer() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [value, setValue] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Standard potentiometer value is 10k max
  const maxResistance = 10000; 
  const currentResistance = (value / 100) * maxResistance;
  const simulatedVoltage = (value / 100) * 5.0;

  // Calculate rotation angle matching southwest start (approx -135deg to +135deg)
  const angle = -135 + (value / 100) * 270;

  // Drag hander for the dial
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateRotation(e);
  };

  const updateRotation = (e: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Dial center in SVG coordinate is cx="55", cy="55" (total resolution: 110 x 160)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * (55 / 160);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const cursorAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Normalize angle relative to pointing UP (0 degrees is straight UP)
    let angleFromUp = cursorAngleDeg + 90;
    while (angleFromUp < -180) angleFromUp += 360;
    while (angleFromUp > 180) angleFromUp -= 360;

    // Active range is [-135, 135]. To prevent 360-degree wrap-around jumps across the bottom dead-zone:
    let targetValue = ((angleFromUp + 135) / 270) * 100;
    
    if (angleFromUp < -135) {
      if (value > 50) {
        // Was high (near 100), dragged to low deadzone -> clamp to max (100)
        targetValue = 100;
      } else {
        // Was low (near 0), dragged to low deadzone -> clamp to min (0)
        targetValue = 0;
      }
    } else if (angleFromUp > 135) {
      if (value < 50) {
        // Was low (near 0), dragged to high deadzone -> clamp to min (0)
        targetValue = 0;
      } else {
        // Was high (near 100), dragged to high deadzone -> clamp to max (100)
        targetValue = 100;
      }
    }

    setValue(Math.min(100, Math.max(0, Math.round(targetValue))));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      updateRotation(e);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Passive / Sensor
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Potentiometer (Rotary)</h3>
        <p className="text-[11px] text-gray-400 font-medium">10kΩ Analog Dial</p>
      </div>

      {/* Potentiometer Graphic Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Glow behind the potentiometer */}
        <div 
          className="absolute rounded-full pointer-events-none transition-all duration-300"
          style={{
            width: '90px',
            height: '90px',
            top: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, rgba(14, 116, 144, 0.08) 0%, rgba(255, 255, 255, 0) 70%)`,
            filter: 'blur(4px)',
          }}
        />

        {/* Potentiometer SVG Render matching reference image perfectly */}
        <svg 
          ref={svgRef}
          width="110" 
          height="160" 
          viewBox="0 0 110 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Dark outer ring casing */}
            <linearGradient id="potOuterRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c3e50" />
              <stop offset="50%" stopColor="#1e2d3b" />
              <stop offset="100%" stopColor="#0f171e" />
            </linearGradient>

            {/* Inner blue rotator */}
            <radialGradient id="potInnerCap" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6ea3d4" />
              <stop offset="85%" stopColor="#568bc5" />
              <stop offset="100%" stopColor="#3c6b9b" />
            </radialGradient>

            {/* Metal pegs (Fixed gradientUnits to userSpaceOnUse to fix vertical lines vanishing) */}
            <linearGradient id="potLeads" x1="30" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* THREE METAL LEADS AT THE BOTTOM */}
          {/* LEFT LEAD: Terminal 1 (GND/VCC) */}
          <line 
            x1="38" y1="106" x2="38" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't1' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t1')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* CENTER LEAD: Wiper */}
          <line 
            x1="55" y1="106" x2="55" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'wiper' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('wiper')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* RIGHT LEAD: Terminal 2 (VCC/GND) */}
          <line 
            x1="72" y1="106" x2="72" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't2' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t2')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* OUTER POTENTIOMETER HOUSING DIAL */}
          <circle 
            cx="55" cy="55" r="44" 
            fill="url(#potOuterRing)" 
            stroke="#1a2632" 
            strokeWidth="2" 
          />

          {/* 6 BRIGHT METAL PERIMETER SCREWS/DOTS */}
          <circle cx="55" cy="19" r="2.5" fill="#5fa6d5" />  {/* Top */}
          <circle cx="86" cy="37" r="2.5" fill="#5fa6d5" />  {/* Top-Right */}
          <circle cx="86" cy="73" r="2.5" fill="#5fa6d5" />  {/* Bottom-Right */}
          <circle cx="24" cy="73" r="2.5" fill="#5fa6d5" />  {/* Bottom-Left */}
          <circle cx="24" cy="37" r="2.5" fill="#5fa6d5" />  {/* Top-Left */}
          <circle cx="55" cy="91" r="1.5" fill="#5fa6d5" opacity="0.3" />

          {/* ROTARY RING OF GEAR-RIDGE TICKS */}
          <g opacity="0.8">
            {Array.from({ length: 42 }).map((_, i) => {
              const tickAngle = -140 + i * 6.8;
              return (
                <line
                  key={i}
                  x1="55"
                  y1="21"
                  x2="55"
                  y2="25"
                  stroke="#1c2c3a"
                  strokeWidth="1.2"
                  transform={`rotate(${tickAngle}, 55, 55)`}
                />
              );
            })}
          </g>

          {/* INNER CAP (Rotatable part) */}
          <circle 
            cx="55" cy="55" r="32" 
            fill="url(#potInnerCap)" 
            stroke="#214061" 
            strokeWidth="1" 
            className="cursor-pointer active:scale-98 transition-transform origin-center"
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          />

          {/* INDICATOR POINTER (SIMPLE WHITE LINE POINTING ALONG SWEEP) */}
          <g transform={`rotate(${angle}, 55, 55)`} className="pointer-events-none">
            {/* Clean simple white pointer line pointing straight UP */}
            <line 
              x1="55" y1="48" 
              x2="55" y2="27" 
              stroke="#ffffff" 
              strokeWidth="3.2" 
              strokeLinecap="round" 
              opacity="0.95"
              className="drop-shadow-[0_1.2px_2px_rgba(0,0,0,0.6)]"
            />
          </g>

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 't1' && (
            <rect x="33" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'wiper' && (
            <rect x="50" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 't2' && (
            <rect x="67" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className="text-amber-300 text-[9px] uppercase font-bold">
              {hoveredTerminal === 't1' ? 'Terminal B (GND)' : hoveredTerminal === 'wiper' ? 'TERMINAL W (Wiper / Signal)' : 'Terminal A (VCC / 5V)'}
            </span>
            <span className="text-[8.5px] text-slate-300">
              {hoveredTerminal === 'wiper' 
                ? `Simulates variable divider signal: ${simulatedVoltage.toFixed(2)}V` 
                : hoveredTerminal === 't1' 
                  ? 'Standard Reference Ground (GND/0V)' 
                  : 'Standard Supply Voltage (VCC/5V)'}
            </span>
          </div>
        )}
      </div>

      {/* Potentiometer Interactive Controller Deck */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            <Settings className="w-3.5 h-3.5" />
            <span>Rotary Position (Drag Cap)</span>
          </div>
          <button 
            onClick={() => setValue(50)}
            className="text-[9px] text-gray-400 hover:text-[#1d70b8] transition-colors flex items-center gap-0.5 cursor-pointer font-extrabold"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            Reset
          </button>
        </div>

        {/* Angle slider */}
        <input 
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer my-1"
        />

        {/* Value feedback layout */}
        <div className="grid grid-cols-2 gap-1.5 text-center mt-0.5">
          <div className="bg-white border border-slate-150 p-1 rounded">
            <div className="text-[8px] text-gray-400 uppercase font-bold">Resistance</div>
            <div className="text-[10px] font-mono font-extrabold text-[#111827]">
              {currentResistance >= 1000 
                ? `${(currentResistance / 1000).toFixed(2)} kΩ` 
                : `${currentResistance.toFixed(0)} Ω`}
            </div>
          </div>
          <div className="bg-white border border-slate-150 p-1 rounded">
            <div className="text-[8px] text-gray-400 uppercase font-bold">Simulated V</div>
            <div className="text-[10px] font-mono font-extrabold text-[#1d70b8]">
              {simulatedVoltage.toFixed(2)} Volts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

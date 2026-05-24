import React, { useState } from 'react';
import { Zap, Battery as BatteryIcon, RotateCcw, Activity } from 'lucide-react';

export default function Battery() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const isSnapped = true;
  const [chargePercent, setChargePercent] = useState<number>(100); // 0% to 100%

  // Simulated internal chemistry behavior of a 9V Alkaline battery
  // Standard full alkaline charge is ~9.6V, nominal is 9.0V, discharged is around 4.8V - 5.4V
  const maxVoltage = 9.6;
  const minVoltage = 4.8;
  const currentVoltage = isSnapped 
    ? parseFloat((minVoltage + (chargePercent / 100) * (maxVoltage - minVoltage)).toFixed(2))
    : 0.0; // Snapped off/disconnected outputs 0V on the wires

  const rawBatteryPotential = parseFloat((minVoltage + (chargePercent / 100) * (maxVoltage - minVoltage)).toFixed(2));

  // Determine health level
  let healthText = 'Excellent';
  let healthColor = 'text-emerald-500 bg-emerald-50 border-emerald-150';
  if (chargePercent < 20) {
    healthText = 'Replace Battery';
    healthColor = 'text-red-600 bg-red-50 border-red-150 animate-pulse';
  } else if (chargePercent < 60) {
    healthText = 'Fair / Medium';
    healthColor = 'text-amber-600 bg-amber-50 border-amber-150';
  }

  // Position offset for the slide-apart snap connector
  const snapXOffset = isSnapped ? 0 : -18;

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[400px] w-[250px] relative transition-all hover:shadow-md group" id="battery-9v-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Power Source
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">9V Battery</h3>
        <p className="text-[11px] text-gray-400 font-medium">Alkaline PP3 Cell with Snap Clip</p>
      </div>

      {/* Battery Graphic Axis */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-2 w-full h-[180px] select-none">
        
        {/* Voltage/Power feedback indicator */}
        <div className="absolute top-[3px] w-full bg-slate-950 border border-slate-800/80 rounded-md py-1.5 px-2 flex items-center justify-between text-[8px] font-mono text-zinc-300">
          <span className="text-zinc-500 font-extrabold flex items-center gap-0.5">
            <Zap className={`w-2.5 h-2.5 ${isSnapped && chargePercent > 0 ? 'text-amber-400 animate-pulse' : 'text-zinc-650'}`} /> OUTPUT RED/BLK:
          </span>
          <span className={`${isSnapped && chargePercent > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500 font-bold'}`}>
            {currentVoltage.toFixed(2)} Volts
          </span>
        </div>

        {/* Horizontal Battery and Snap Connectors SVG */}
        <svg 
          width="200" 
          height="110" 
          viewBox="0 0 200 110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm mt-5"
        >
          <defs>
            {/* Charcoal black/grey main jacket finish */}
            <linearGradient id="batteryJacket" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="25%" stopColor="#1f2937" />
              <stop offset="75%" stopColor="#111827" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Industrial copper brass contact collar top casing */}
            <linearGradient id="batteryCopperCap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" /> {/* amber-600 */}
              <stop offset="30%" stopColor="#b45309" /> {/* amber-700 */}
              <stop offset="70%" stopColor="#92400e" /> {/* amber-800 */}
              <stop offset="100%" stopColor="#78350f" /> {/* amber-900 */}
            </linearGradient>

            {/* Silver metal snaps gradient */}
            <linearGradient id="silverTerminal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="75%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Black plastic snap backing header plate */}
            <linearGradient id="blackSnapPlate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#09090b" />
              <stop offset="100%" stopColor="#020202" />
            </linearGradient>
          </defs>

          {/* 1. MAIN BATTERY BODY (Stationary on the right) */}
          <g>
            {/* Behind base backing sheet */}
            <rect x="44" y="14" width="134" height="82" rx="4" fill="#0b0f19" opacity="0.15" />

            {/* Main Battery Capsule container - base body */}
            <rect x="45" y="15" width="132" height="80" rx="4.5" fill="none" />

            {/* Black Jacket Main Body (Right portion) */}
            <path 
              d="M 86 15 L 172.5 15 C 175 15, 177 17, 177 19.5 L 177 90.5 C 177 93, 175 95, 172.5 95 L 86 95 Z" 
              fill="url(#batteryJacket)" 
              stroke="#111827" 
              strokeWidth="0.8"
            />

            {/* Copper/Gold Collar Core Head (Left portion) */}
            <path 
              d="M 49.5 15 L 86 15 L 86 95 L 49.5 95 C 47 95, 45 93, 45 90.5 L 45 19.5 C 45 17, 47 15, 49.5 15 Z" 
              fill="url(#batteryCopperCap)" 
              stroke="#78350f" 
              strokeWidth="0.8"
            />

            {/* Elegant laser inscriptions on battery body */}
            {/* "9V" display letters in high contrast light grey typography */}
            <text 
              x="132" 
              y="63" 
              fill="#f1f5f9" 
              fontSize="24" 
              fontFamily="sans-serif" 
              fontWeight="900" 
              textAnchor="middle" 
              letterSpacing="0.8"
              opacity="0.9"
              transform="rotate(90, 132, 57)"
            >
              9V
            </text>

            <text 
              x="162" 
              y="55" 
              fill="#94a3b8" 
              fontSize="5.5" 
              fontFamily="mono" 
              fontWeight="bold" 
              textAnchor="middle"
              opacity="0.6"
              transform="rotate(90, 162, 55)"
            >
              ALKALINE CELL
            </text>

            {/* Polarity signs on the copper header face */}
            {/* Minus Sign (Upper) */}
            <g stroke="#78350f" strokeWidth="1.2" opacity="0.65">
              <circle cx="53" cy="33" r="5.5" fill="none" />
              <line x1="50" y1="33" x2="56" y2="33" />
            </g>

            {/* Plus Sign (Lower) */}
            <g stroke="#78350f" strokeWidth="1.2" opacity="0.65">
              <circle cx="53" cy="73" r="5.5" fill="none" />
              <line x1="50" y1="73" x2="56" y2="73" />
              <line x1="53" y1="70" x2="53" y2="76" />
            </g>

            {/* 2. RECESSED TERMINAL SNAP STUDS (Sticking out of left edge at x=45) */}
            {/* Upper Snap Stud (Negative - octagon snap) */}
            <path 
              d="M 45 33 L 34 33" 
              stroke="url(#silverTerminal)" 
              strokeWidth="8.5" 
              strokeLinecap="square"
              className={`cursor-pointer transition-all ${hoveredTerminal === 'neg_stud' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
              onMouseEnter={() => setHoveredTerminal('neg_stud')}
              onMouseLeave={() => setHoveredTerminal(null)}
            />
            {/* Flanged crown stud detailing */}
            <rect 
              x="32" y="27" width="3" height="12" rx="0.5" 
              fill="url(#silverTerminal)" 
              stroke="#475569" strokeWidth="0.5"
            />

            {/* Lower Snap Stud (Positive - male snap cylinder stud) */}
            <path 
              d="M 45 73 L 34 73" 
              stroke="url(#silverTerminal)" 
              strokeWidth="6.5" 
              strokeLinecap="square"
              className={`cursor-pointer transition-all ${hoveredTerminal === 'pos_stud' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
              onMouseEnter={() => setHoveredTerminal('pos_stud')}
              onMouseLeave={() => setHoveredTerminal(null)}
            />
            {/* Male flared stud ring details */}
            <rect 
              x="32" y="68" width="3" height="10" rx="0.5" 
              fill="url(#silverTerminal)" 
              stroke="#475569" strokeWidth="0.5"
            />
          </g>

          {/* 3. INTERACTIVE SNAP CONNECTOR MODULE (Slides on x-axis based on state with wire guides) */}
          <g transform={`translate(${snapXOffset}, 0)`} className="transition-transform duration-300 ease-out">
            
            {/* Receiver snaps inside the cap plate block (overlapping studs if aligned) */}
            <g>
              {/* Top Socket receiver */}
              <rect x="23" y="25" width="10" height="16" rx="1.5" fill="url(#silverTerminal)" stroke="#475569" strokeWidth="0.6" />
              {/* Bottom Socket receiver */}
              <rect x="23" y="65" width="10" height="16" rx="1.5" fill="url(#silverTerminal)" stroke="#475569" strokeWidth="0.6" />
            </g>

            {/* Main Black Snap Plate Cap */}
            <rect 
              x="14" 
              y="11" 
              width="9" 
              height="88" 
              rx="2.5" 
              fill="url(#blackSnapPlate)" 
              stroke="#111827" 
              strokeWidth="1.2"
            />

            {/* Left circular plastic wire anchors */}
            <circle cx="14" cy="33" r="3" fill="#18181b" />
            <circle cx="14" cy="73" r="3" fill="#18181b" />

            {/* RED & BLACK FLEXIBLE WIRE LEADS EXTINGUISHING LEFT TO CARD BOUNDARY */}
            {/* Upper Cable wire (Negative - Black) */}
            <path 
              d="M 14 33 C -10 33, -5 50, 4 50 L 12 50" 
              stroke="#27272a" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              className={`cursor-pointer transition-all ${hoveredTerminal === 'black_wire' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
              onMouseEnter={() => setHoveredTerminal('black_wire')}
              onMouseLeave={() => setHoveredTerminal(null)}
            />
            {/* Black Connector Pin Header Cap tip */}
            <path d="M 10 50 L 5 50" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="1" y="47.5" width="4" height="5" rx="0.5" fill="#18181b" />

            {/* Lower Cable wire (Positive - Red) */}
            <path 
              d="M 14 73 C -10 73, -15 58, 4 58 L 12 58" 
              stroke="#ef4444" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              className={`cursor-pointer transition-all ${hoveredTerminal === 'red_wire' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
              onMouseEnter={() => setHoveredTerminal('red_wire')}
              onMouseLeave={() => setHoveredTerminal(null)}
            />
            {/* Red Connector Pin Header Cap tip */}
            <path d="M 10 58 L 5 58" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="1" y="55.5" width="4" height="5" rx="0.5" fill="#ef4444" />

            {/* Connection terminal target hover squares */}
            {hoveredTerminal === 'black_wire' && (
              <rect x="0" y="45" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
            )}
            {hoveredTerminal === 'red_wire' && (
              <rect x="0" y="53" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
            )}
          </g>
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[138px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9.5px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className={`${
              hoveredTerminal.includes('pos_stud') || hoveredTerminal === 'red_wire' ? 'text-emerald-400' : 'text-zinc-400'
            } font-extrabold text-[9px] uppercase`}>
              {hoveredTerminal === 'pos_stud' ? 'Positive Stud (Anode +)' : 
               hoveredTerminal === 'neg_stud' ? 'Negative Stud (Cathode -)' :
               hoveredTerminal === 'red_wire' ? 'Red Wire (9V Anode Lead)' : 'Black Wire (0V Return/GND)'}
            </span>
            <span className="text-[8px] text-zinc-350">
              {hoveredTerminal === 'pos_stud' ? 'Female circular snap fits typical 9V battery connector' :
               hoveredTerminal === 'neg_stud' ? 'Hexagonal/octagonal snap studs for polarity locking' :
               hoveredTerminal === 'red_wire' ? `Carries positive power potential: +${rawBatteryPotential.toFixed(1)}V` : 
               'Return reference wire linked to ground / system common'}
            </span>
          </div>
        )}
      </div>

      {/* Battery Simulation Panel */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        {/* Battery Health Sweep slider */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <div className="flex justify-between text-[8px] text-gray-450 font-extrabold uppercase mb-0.5">
            <span>Battery Charge</span>
            <span className="font-mono text-slate-800 font-bold">{chargePercent}% Capacity</span>
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            step="1"
            value={chargePercent}
            onChange={(e) => setChargePercent(parseInt(e.target.value))}
            className="w-full accent-slate-700 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[7px] text-gray-400 mt-0.5">
            <span>Discharged (4.8V)</span>
            <button 
              onClick={() => { setChargePercent(100); }} 
              className="text-[7.5px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 transition-colors"
            >
              <RotateCcw className="w-1.5 h-1.5" /> Full (9.6V)
            </button>
            <span>Fresh (9.6V)</span>
          </div>
        </div>

        {/* Telemetry output block */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold mt-0.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-450 uppercase font-extrabold text-[8px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-500" /> Chemistry Potential
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[7.5px] uppercase font-extrabold border ${healthColor}`}>
              {healthText}
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-slate-50 text-gray-750">
            <span className="text-gray-400 text-[8.5px]">Open Circuit Voltage:</span>
            <span className="font-mono text-slate-800">{rawBatteryPotential.toFixed(2)} V</span>
          </div>

          <div className="flex justify-between text-gray-750">
            <span className="text-gray-400 text-[8.5px]">Clip Snapped Wire V:</span>
            <span className="font-mono text-slate-800">{currentVoltage.toFixed(2)} V</span>
          </div>
        </div>
      </div>
    </div>
  );
}

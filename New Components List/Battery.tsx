import React, { useState } from 'react';
import { Zap, Battery as BatteryIcon, RotateCcw, Activity } from 'lucide-react';

export default function Battery() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [isSnapped, setIsSnapped] = useState<boolean>(true);
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
  const snapXOffset = isSnapped ? 0 : -22;

  // Web Audio snap click synthesizer sound
  const playSnapSound = (snapped: boolean) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (snapped) {
        // Double metallic sound for snapping in
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } else {
        // Popping pop for snapping out
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.06);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }
    } catch (_) {
      // Ignore if user gestures policy restricts AudioContext
    }
  };

  const handleToggleSnap = () => {
    const nextState = !isSnapped;
    setIsSnapped(nextState);
    playSnapSound(nextState);
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[400px] w-[250px] relative transition-all hover:shadow-md group" id="battery-9v-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full animate-fade-in">
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
            <Zap className={`w-2.5 h-2.5 ${isSnapped && chargePercent > 0 ? 'text-rose-400 animate-pulse' : 'text-zinc-650'}`} /> OUTPUT RED/BLK:
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

            {/* Glowing terminal indicators */}
            <radialGradient id="positiveTermGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="negativeTermGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* DYNAMIC SHIELDING BRACKET LINKING TERMINAL CAVITIES (drawn behind) */}
          {isSnapped && (
            <path 
              d="M 58 33 Q 48 53 L 58 73" 
              stroke="#fbbf24" 
              strokeWidth="2.5" 
              strokeOpacity="0.3" 
              strokeDasharray="2,2" 
              fill="none" 
              className="animate-pulse"
            />
          )}

          {/* 1. MAIN BATTERY BODY (Stationary on the right side) */}
          <g>
            {/* Behind base backing sheet */}
            <rect x="64" y="14" width="130" height="82" rx="4" fill="#0b0f19" opacity="0.15" />

            {/* Main Battery Capsule container - base body */}
            <rect x="65" y="15" width="128" height="80" rx="4.5" fill="none" />

            {/* Black Jacket Main Body (Right portion) */}
            <path 
              d="M 106 15 L 189.5 15 C 192 15, 194 17, 194 19.5 L 194 90.5 C 194 93, 192 95, 189.5 95 L 106 95 Z" 
              fill="url(#batteryJacket)" 
              stroke="#111827" 
              strokeWidth="0.8"
            />

            {/* Copper/Gold Collar Core Head (Left portion) */}
            <path 
              d="M 69.5 15 L 106 15 L 106 95 L 69.5 95 C 67 95, 65 93, 65 90.5 L 65 19.5 C 65 17, 67 15, 69.5 15 Z" 
              fill="url(#batteryCopperCap)" 
              stroke="#78350f" 
              strokeWidth="0.8"
            />

            {/* Elegant laser inscriptions on battery body */}
            <text 
              x="152" 
              y="63" 
              fill="#f1f5f9" 
              fontSize="24" 
              fontFamily="sans-serif" 
              fontWeight="900" 
              textAnchor="middle" 
              letterSpacing="0.8"
              opacity="0.9"
              transform="rotate(90, 152, 63)"
              className="pointer-events-none selection:bg-transparent"
            >
              9V
            </text>

            <text 
              x="180" 
              y="55" 
              fill="#94a3b8" 
              fontSize="5.5" 
              fontFamily="mono" 
              fontWeight="bold" 
              textAnchor="middle"
              opacity="0.6"
              transform="rotate(90, 180, 55)"
              className="pointer-events-none selection:bg-transparent"
            >
              ALKALINE CELL
            </text>

            {/* Polarity symbols on the copper header face */}
            {/* Minus Sign Info Label (Upper) */}
            <g stroke="#78350f" strokeWidth="1.2" opacity="0.65" className="pointer-events-none">
              <circle cx="76" cy="33" r="5.5" fill="none" />
              <line x1="73" y1="33" x2="79" y2="33" />
            </g>

            {/* Plus Sign Info Label (Lower) */}
            <g stroke="#78350f" strokeWidth="1.2" opacity="0.65" className="pointer-events-none">
              <circle cx="76" cy="73" r="5.5" fill="none" />
              <line x1="73" y1="73" x2="79" y2="73" />
              <line x1="76" y1="70" x2="76" y2="76" />
            </g>

            {/* 2. REALISTIC AND PROPER TERMINALS (Left edge of copper cap at x=65) */}
            
            {/* UPPER TERMINAL: Female Pronged Octagonal Socket (Negative / Cathode -) */}
            <g 
              className="cursor-pointer group"
              onClick={handleToggleSnap}
              onMouseEnter={() => setHoveredTerminal('neg_stud')}
              onMouseLeave={() => setHoveredTerminal(null)}
            >
              <circle cx="58" cy="33" r="14" fill="url(#negativeTermGlow)" />
              {/* Back washer */}
              <circle cx="58" cy="33" r="7.5" fill="url(#silverTerminal)" stroke="#334155" strokeWidth="0.5" />
              {/* Octagonal spring leaves prong casing */}
              <polygon 
                points="52.5 28, 63.5 28, 66 33, 63.5 38, 52.5 38, 49 33" 
                fill="url(#silverTerminal)" 
                stroke="#1e293b" 
                strokeWidth="0.8"
                className={`transition-all ${hoveredTerminal === 'neg_stud' ? 'stroke-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]' : ''}`}
              />
              {/* Deep central hollow cavity */}
              <circle cx="58" cy="33" r="4.2" fill="#0f172a" stroke="#101827" strokeWidth="0.8" />
              {/* Inner clamping spring tabs */}
              <line x1="53.8" y1="33" x2="62.2" y2="33" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
              <line x1="58" y1="28.8" x2="58" y2="37.2" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
              <circle cx="58" cy="33" r="2.2" fill="#020617" />
              {/* Small "-" polarity marking overlay */}
              <text x="58" y="23" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="mono" textAnchor="middle" opacity="0.75" className="group-hover:opacity-100 transition-opacity drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">-</text>
            </g>

            {/* LOWER TERMINAL: Male Solid Cylindrical Stud (Positive / Anode +) */}
            <g
              className="cursor-pointer group"
              onClick={handleToggleSnap}
              onMouseEnter={() => setHoveredTerminal('pos_stud')}
              onMouseLeave={() => setHoveredTerminal(null)}
            >
              <circle cx="58" cy="73" r="14" fill="url(#positiveTermGlow)" />
              {/* Solid Base Ring collar washer */}
              <circle cx="58" cy="73" r="7.5" fill="url(#silverTerminal)" stroke="#334155" strokeWidth="0.5" />
              {/* Under-ring groove/neck slot */}
              <rect 
                x="54.5" y="70.5" width="7" height="5" 
                fill="#475569" 
                stroke="#1e293b" strokeWidth="0.5" 
              />
              {/* Rounded crown male stud protrusion */}
              <circle 
                cx="58" cy="73" r="5" 
                fill="url(#silverTerminal)" 
                stroke="#1e293b" 
                strokeWidth="0.8"
                className={`transition-all ${hoveredTerminal === 'pos_stud' ? 'stroke-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]' : ''}`}
              />
              {/* 3D Highlight sheen */}
              <circle cx="56.2" cy="71.2" r="2.2" fill="#f8fafc" opacity="0.85" />
              {/* Small "+" polarity marking overlay */}
              <text x="58" y="85" fill="#f43f5e" fontSize="7" fontWeight="bold" fontFamily="mono" textAnchor="middle" opacity="0.75" className="group-hover:opacity-100 transition-opacity drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">+</text>
            </g>
          </g>

          {/* STATIC WIRE PROBE PINS (Stay completely fixed on the left side of the card, never sliding) */}
          <g>
            {/* Black Connector Pin Header (GND) */}
            <path d="M 12 50 L 5 50" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="1" y="47.5" width="4" height="5" rx="0.5" fill="#18181b" />

            {/* Red Connector Pin Header (9V) */}
            <path d="M 10 58 L 5 58" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="1" y="55.5" width="4" height="5" rx="0.5" fill="#ef4444" />
          </g>

          {/* DYNAMIC SHIELDED FLEXIBLE PVC JUMPER WIRES (Stretching between card connector pins and the sliding cap) */}
          <g>
            {/* BLACK WIRE (Cathode GND Lead) - curved path that adapts dynamically to snapXOffset */}
            <path 
              d={`M 12 50 C ${-4 + snapXOffset * 0.25} 50, ${10 + snapXOffset * 0.45} 33, ${38 + snapXOffset} 33`}
              stroke="#27272a" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              className={`cursor-pointer transition-all ${hoveredTerminal === 'black_wire' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
              onMouseEnter={() => setHoveredTerminal('black_wire')}
              onMouseLeave={() => setHoveredTerminal(null)}
              onClick={handleToggleSnap}
            />

            {/* RED WIRE (Anode 9V Potential Lead) - curved path that adapts dynamically to snapXOffset */}
            <path 
              d={`M 12 58 C ${-4 + snapXOffset * 0.25} 58, ${10 + snapXOffset * 0.45} 73, ${38 + snapXOffset} 73`}
              stroke="#ef4444" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              className={`cursor-pointer transition-all ${hoveredTerminal === 'red_wire' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
              onMouseEnter={() => setHoveredTerminal('red_wire')}
              onMouseLeave={() => setHoveredTerminal(null)}
              onClick={handleToggleSnap}
            />
          </g>

          {/* 3. INTERACTIVE SNAP CONNECTOR MODULE (Slides on x-axis based on state with wire guides) */}
          <g 
            transform={`translate(${snapXOffset}, 0)`} 
            className="transition-transform duration-300 ease-out cursor-pointer group"
            onClick={handleToggleSnap}
            role="button"
            aria-label="Battery Cap Connection Clip"
            title="Click to snap or unsnap the connection cap"
            onMouseEnter={() => { if (!hoveredTerminal) setHoveredTerminal('cap_clip'); }}
            onMouseLeave={() => { if (hoveredTerminal === 'cap_clip') setHoveredTerminal(null); }}
          >
            {/* INVERTED OPPOSITION TERMINALS ON THE SNAP CAP CLIP (Matches reality: male fits female, female fits male) */}
            <g>
              {/* Upper Clip terminal: MALE cylinder stud (Negative side, inserts into battery female socket) */}
              <g opacity="0.95">
                {/* Silver base housing */}
                <rect x="43" y="29.5" width="11" height="7" rx="1.5" fill="url(#silverTerminal)" stroke="#475569" strokeWidth="0.6" />
                {/* Dynamic male protrusive crown */}
                <circle cx="53" cy="33" r="3.2" fill="url(#silverTerminal)" stroke="#334155" strokeWidth="0.6" />
                <circle cx="52" cy="31.8" r="1.1" fill="#ffffff" opacity="0.8" />
              </g>

              {/* Lower Clip terminal: FEMALE cup receiver socket (Positive side, snaps over battery male stud) */}
              <g opacity="0.95">
                {/* Silver cup base */}
                <rect x="43" y="65" width="11" height="16" rx="2" fill="url(#silverTerminal)" stroke="#475569" strokeWidth="0.8" />
                {/* Hollow core cavity representing socket */}
                <rect x="47.5" y="68" width="5.5" height="10" rx="1" fill="#18181b" stroke="#334155" strokeWidth="0.5" />
                {/* Small copper springs lines inside */}
                <line x1="48.5" y1="73" x2="51" y2="73" stroke="#b45309" strokeWidth="0.8" opacity="0.6" />
              </g>
            </g>

            {/* Main Black Snap Plate Cap */}
            <rect 
              x="34" 
              y="11" 
              width="9" 
              height="88" 
              rx="2.5" 
              fill="url(#blackSnapPlate)" 
              stroke="#111827" 
              strokeWidth="1.2"
              className="group-hover:stroke-amber-400 transition-colors"
            />

            {/* Left circular plastic wire injection/anchors holes */}
            <circle cx="38" cy="33" r="3.2" fill="#18181b" />
            <circle cx="38" cy="73" r="3.2" fill="#18181b" />

            {/* Visual helpers indicating clickable connectivity state */}
            {!isSnapped ? (
              <g className="animate-pulse">
                {/* Small indicator arrows signaling to click and slide right to lock */}
                <path d="M 48 45 L 52 49 L 48 53" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 48 57 L 52 61 L 48 65" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            ) : (
              <g opacity="0" className="opacity-0 group-hover:opacity-40 transition-opacity">
                {/* Snap locked bracket outlines */}
                <rect x="31" y="8" width="15" height="94" rx="4" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,2" />
              </g>
            )}
          </g>
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[138px] left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-mono text-[9.5px] font-bold py-1.5 px-3 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce" id="battery-terminal-tooltip">
            <span className={`${
              hoveredTerminal === 'pos_stud' || hoveredTerminal === 'red_wire' ? 'text-rose-400' : 'text-sky-450'
            } font-extrabold text-[9px] uppercase tracking-wider`}>
              {hoveredTerminal === 'pos_stud' ? 'Positive (Anode +) Male Stud' : 
               hoveredTerminal === 'neg_stud' ? 'Negative (Cathode -) Female Socket' :
               hoveredTerminal === 'red_wire' ? 'Red Wire (9V Anode Lead)' : 
               hoveredTerminal === 'black_wire' ? 'Black Wire (0V return / GND)' : 'Battery Snap Clip'}
            </span>
            <span className="text-[8px] text-zinc-300 font-medium whitespace-pre-wrap max-w-[210px] text-center leading-normal">
              {hoveredTerminal === 'pos_stud' ? 'Solid circular cylindrical stud. Snapped onto by female clip connector.' :
               hoveredTerminal === 'neg_stud' ? 'Pronged octagonal flower-petal socket cavity. Receives male clip stud.' :
               hoveredTerminal === 'red_wire' ? `Carries positive electrical output potential: +${rawBatteryPotential.toFixed(1)} Volts` : 
               hoveredTerminal === 'black_wire' ? 'Returns circuit common back current reference linked to ground.' :
               'Removable snap adapter cap. Click anywhere to attach or detach.'}
            </span>
          </div>
        )}
      </div>

      {/* Battery Simulation Panel */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        
        {/* Cap Connection Status & Toggle Button */}
        <div className="flex justify-between items-center bg-slate-100/60 p-2 rounded-lg border border-slate-200/50 mt-1 shadow-inner">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-400 uppercase font-extrabold tracking-wider">Connector Cap</span>
            <span className={`text-[9px] font-extrabold flex items-center gap-0.5 ${isSnapped ? 'text-emerald-600' : 'text-slate-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSnapped ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              {isSnapped ? 'CONNECTED' : 'DETACHED'}
            </span>
          </div>
          <button 
            onClick={handleToggleSnap}
            className={`px-2 py-1 rounded text-[8px] font-extrabold uppercase transition-all flex items-center gap-1 active:scale-95 cursor-pointer border ${
              isSnapped 
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:text-rose-700' 
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-2.5 h-2.5" />
            {isSnapped ? 'Unsnap Clip' : 'Snap Clip On'}
          </button>
        </div>

        {/* Battery Health Sweep slider */}
        <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-200/40">
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
          <div className="flex justify-between text-[7px] text-gray-400 mt-0.5 font-medium">
            <span>Empty (4.8V)</span>
            <button 
              onClick={() => { setChargePercent(100); }} 
              className="text-[7.5px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 transition-colors"
            >
              <RotateCcw className="w-1.5 h-1.5" /> Re-charge
            </button>
            <span>Fresh (9.6V)</span>
          </div>
        </div>

        {/* Telemetry output block */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold mt-0.5 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-450 uppercase font-extrabold text-[8px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-500" /> Chemistry Potential
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[7.5px] uppercase font-extrabold border ${healthColor}`}>
              {healthText}
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-slate-50 text-gray-750 font-medium">
            <span className="text-gray-400 text-[8.5px]">Open Circuit Voltage:</span>
            <span className="font-mono text-slate-800 font-bold">{rawBatteryPotential.toFixed(2)} V</span>
          </div>

          <div className="flex justify-between text-gray-750 font-medium">
            <span className="text-gray-400 text-[8.5px]">Clip Snapped Wire V:</span>
            <span className={`${isSnapped && chargePercent > 0 ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`}>
              <span className="font-mono">{currentVoltage.toFixed(2)} V</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

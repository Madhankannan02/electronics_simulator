import React, { useState } from 'react';
import { Radio, ArrowRightLeft, Database } from 'lucide-react';

export default function UltrasonicSensor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [distanceCm, setDistanceCm] = useState<number>(85); // 2cm to 300cm range

  // Ultrasonic math: Speed of sound is roughly 343 m/s (or 0.0343 cm/us)
  // Distance = (Time of Flight * 0.0343) / 2
  // Time of Flight (us) = (Distance * 2) / 0.0343 => roughly Distance * 58.3
  const timeOfFlightUs = Math.round(distanceCm * 58.309);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group animate-fade-in" id="ultrasonic-sensor-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
          Sensor Transceiver
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Ultrasonic Distance Sensor</h3>
        <p className="text-[11px] text-gray-400 font-medium">Parallax PING))) Proximity Module</p>
      </div>

      {/* Graphic Display representing board PING))) perfectly */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-3 w-full h-[180px] select-none">
        {/* Dynamic target block simulation panel */}
        <div className="absolute top-[3px] w-full bg-slate-900 border border-slate-700/80 rounded-md py-1.5 px-2.5 flex items-center justify-between text-[9px] font-mono text-zinc-300">
          <span className="text-zinc-500 font-extrabold flex items-center gap-0.5">
            <Radio className="w-2.5 h-2.5 text-teal-400 rotate-42 animate-pulse" /> SONAR STATE: ACTIVE
          </span>
          <span className="text-teal-400 font-bold">{distanceCm} cm</span>
        </div>

        {/* Dynamic Wave Travel simulation display */}
        <div className="absolute top-[32px] w-[130px] h-[34px] border border-dashed border-teal-500/20 rounded-md pointer-events-none flex items-center justify-center overflow-hidden bg-slate-950/5">
          {/* Echo Wave rings visualizer */}
          <div className="relative flex items-center gap-1.5 justify-center w-full">
            {/* Transmitter sonar ping */}
            <span className="text-[7px] text-teal-500 bg-teal-50/85 px-1 py-0.2 rounded border border-teal-200 font-bold animate-pulse">TX🔊</span>
            <div className="flex gap-0.5 animate-pulse">
              {[2, 4, 6].map(offset => (
                <span 
                  key={`pulse-${offset}`}
                  className="w-1.5 h-3.5 border-r-2 border-teal-400 rounded-full opacity-60 animate-ping"
                  style={{ animationDelay: `${offset * 120}ms` }}
                />
              ))}
            </div>
            
            {/* Sliding spacer matching distance scale */}
            <div className="w-5 bg-teal-500/10 h-0.5" />

            {/* Echo bounce incoming */}
            <div className="flex gap-0.5 rotate-180 animate-pulse">
              {[6, 4, 2].map(offset => (
                <span 
                  key={`echo-${offset}`}
                  className="w-1.5 h-3.5 border-r-2 border-amber-400 rounded-full opacity-55 animate-ping"
                  style={{ animationDelay: `${offset * 120}ms` }}
                />
              ))}
            </div>
            <span className="text-[7px] text-amber-600 bg-amber-50/85 px-1 py-0.2 rounded border border-amber-200 font-bold animate-pulse">RX🎤</span>
          </div>
        </div>

        {/* PING))) Sensor Board Graphic rendering */}
        <svg 
          width="135" 
          height="110" 
          viewBox="0 0 135 110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm mt-7"
        >
          <defs>
            {/* Parallax Teal PCB board */}
            <linearGradient id="pcbTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#085265" />
              <stop offset="60%" stopColor="#0a5c71" />
              <stop offset="100%" stopColor="#023b49" />
            </linearGradient>

            {/* Aluminum tube structure */}
            <linearGradient id="aluBarrel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="42%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* transducer gold internal cone */}
            <radialGradient id="goldCone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ca8a04" />
              <stop offset="45%" stopColor="#854d0e" />
              <stop offset="75%" stopColor="#3f2c00" />
              <stop offset="100%" stopColor="#1e1300" />
            </radialGradient>
          </defs>

          {/* THREE DOWNWARD MOUNTED TERMINAL WIRE LEADS */}
          {/* PIN 1: GND (Left Leg) */}
          <line 
            x1="57" y1="78" x2="57" y2="105" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'gnd' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('gnd')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 2: 5V (Center Leg) */}
          <line 
            x1="67" y1="78" x2="67" y2="105" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === '5v' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('5v')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 3: SIG (Right Leg) */}
          <line 
            x1="77" y1="78" x2="77" y2="105" 
            stroke="#cbd5e1" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'sig' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('sig')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* BOARD MAIN PCB BASE */}
          <rect 
            x="4" 
            y="6" 
            width="127" 
            height="72" 
            rx="4" 
            fill="url(#pcbTeal)" 
            stroke="#012d38" 
            strokeWidth="1.5"
          />

          {/* Shiny copper traces & PCB detail marks */}
          {/* Drill Holes */}
          <circle cx="10" cy="12" r="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
          <circle cx="125" cy="12" r="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
          <circle cx="10" cy="72" r="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />

          {/* Inscriptions & Branding text */}
          <text x="32" y="15" fill="#e2e8f0" fontSize="5.5" fontFamily="monospace" fontWeight="extrabold" opacity="0.65">28015 REV C</text>
          <text x="75" y="15" fill="#e2e8f0" fontSize="5" fontFamily="sans-serif" fontWeight="bold" opacity="0.55">WWW.PARALLAX.COM</text>
          <text x="67" y="47" fill="#ffffff" fontSize="9" fontFamily="sans-serif" fontWeight="extrabold" textAnchor="middle" opacity="0.95" letterSpacing="0.5">PING)))</text>

          {/* Black header housing box standard layout */}
          <rect x="52" y="68" width="31" height="10" rx="1" fill="#18181b" stroke="#09090b" strokeWidth="0.8" />
          <line x1="62.5" y1="68" x2="62.5" y2="78" stroke="#27272a" strokeWidth="1" />
          <line x1="72.5" y1="68" x2="72.5" y2="78" stroke="#27272a" strokeWidth="1" />

          {/* Pin labeling white bounding box */}
          <rect x="52" y="50" width="31" height="18" fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.8" />
          <line x1="62" y1="50" x2="62" y2="68" stroke="#e2e8f0" strokeWidth="0.6" opacity="0.8" />
          <line x1="72" y1="50" x2="72" y2="68" stroke="#e2e8f0" strokeWidth="0.6" opacity="0.8" />

          <text x="57" y="61" fill="#ffffff" fontSize="4.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.9">GND</text>
          <text x="67" y="61" fill="#ffffff" fontSize="4.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.9">5V</text>
          <text x="77" y="61" fill="#ffffff" fontSize="4.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.9">SIG</text>

          {/* ACT LED box and tiny indicators */}
          <rect x="61" y="22" width="12" height="7" rx="0.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
          <text x="67" y="27" fill="#ffffff" fontSize="4" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.7">ACT</text>

          {/* TWO ENORMOUS ALUMINUM BARREL CYLINDERS (T & R) */}
          {/* LEFT BARREL: Transmitter 'T' */}
          <circle cx="32" cy="44" r="23" fill="url(#aluBarrel)" stroke="#334155" strokeWidth="1.2" />
          <circle cx="32" cy="44" r="17" fill="url(#goldCone)" />
          <circle cx="32" cy="44" r="13" fill="#1e293b" opacity="0.95" />
          <text x="32" y="47" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="extrabold" textAnchor="middle" opacity="0.35">T</text>

          {/* RIGHT BARREL: Receiver 'R' */}
          <circle cx="102" cy="44" r="23" fill="url(#aluBarrel)" stroke="#334155" strokeWidth="1.2" />
          <circle cx="102" cy="44" r="17" fill="url(#goldCone)" />
          <circle cx="102" cy="44" r="13" fill="#1e293b" opacity="0.95" />
          <text x="102" y="47" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="extrabold" textAnchor="middle" opacity="0.35">R</text>

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'gnd' && (
            <rect x="52" y="100" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === '5v' && (
            <rect x="62" y="100" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'sig' && (
            <rect x="72" y="100" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className="text-teal-400 font-extrabold text-[9px] uppercase">
              {hoveredTerminal === 'gnd' ? 'GND (Ground/0V)' : hoveredTerminal === '5v' ? 'VCC Power (5V)' : 'SIG (Pulse Width Signal Pin)'}
            </span>
            <span className="text-[8.5px] text-slate-350">
              {hoveredTerminal === 'gnd' 
                ? 'Standard Reference ground' 
                : hoveredTerminal === '5v' 
                  ? 'Main module supply input (30-35mA typical consumption)' 
                  : 'Transmit trigger/echo out combined high-pulse'}
            </span>
          </div>
        )}
      </div>

      {/* Interactive Obstruction Distance Controller */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-gray-400 uppercase font-extrabold text-[8px] flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-teal-600" /> Simulated Distance
          </span>
          <span className="text-teal-700 font-mono font-bold bg-teal-50 px-1 py-0.2 rounded border border-teal-100">
            {distanceCm} cm
          </span>
        </div>

        {/* Obstacle slider */}
        <input 
          type="range"
          min="2"
          max="300"
          step="1"
          value={distanceCm}
          onChange={(e) => setDistanceCm(parseInt(e.target.value))}
          className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[7px] text-gray-400 font-bold uppercase">
          <span>Min (2cm)</span>
          <span>Max (3m / 300cm)</span>
        </div>

        {/* Dynamic computations output box */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold">
          <div className="flex justify-between text-gray-700">
            <span className="text-gray-400 text-[8.5px]">Ultrasonic Time of Flight:</span>
            <span className="font-mono text-[#111827]">{timeOfFlightUs.toLocaleString()} µs</span>
          </div>
          
          <div className="flex justify-between items-center text-gray-700 border-t border-slate-50 pt-1">
            <span className="text-gray-400 text-[8.5px] flex items-center gap-0.5">
              <Database className="w-3 h-3 text-teal-500" />
              Arduino pulseIn() duration:
            </span>
            <span className="font-mono text-teal-700 bg-teal-50 px-1 py-0.5 rounded border border-teal-100">
              {timeOfFlightUs} microseconds
            </span>
          </div>
          
          <div className="flex justify-between text-gray-750">
            <span className="text-gray-400 text-[8.5px]">Approx. Speed of Sound:</span>
            <span className="font-mono text-slate-800">343 m/s (~29.1 µs/cm)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

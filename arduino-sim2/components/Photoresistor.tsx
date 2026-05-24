import React, { useState } from 'react';
import { Sun, Moon, Database } from 'lucide-react';

export default function Photoresistor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [luxValue, setLuxValue] = useState<number>(300); // Lux range from 0 to 1000

  // Calculate high-fidelity photodiode resistance matching physical curves
  // R = 500k in dark, down to near 100 ohms in direct bright light
  const resistance = Math.max(150, Math.round(500000 / (1 + Math.pow(luxValue, 0.9))));

  // Simulate an Arduino Voltage Divider Circuit:
  // Vcc (5V) ---> LDR ---> Analog pin (A0) ---> 10k Ohm Resistor ---> GND
  // Vo = Vcc * [ R_pulldown / (R_LDR + R_pulldown) ] where R_pulldown = 10,000 Ohms
  const rPulldown = 10000;
  const simulatedVoltage = 5.0 * (rPulldown / (resistance + rPulldown));
  const adcValue = Math.min(1023, Math.max(0, Math.round((simulatedVoltage / 5.0) * 1023)));

  // Display-friendly formatting of resistance
  const formattedResistance = resistance >= 1000000
    ? `${(resistance / 1000000).toFixed(1)} MΩ`
    : resistance >= 1000
      ? `${(resistance / 1000).toFixed(1)} kΩ`
      : `${resistance} Ω`;

  // Dynamic light overlay alpha based on Lux
  const dynamicLightGlow = Math.min(0.6, (luxValue / 1000) * 0.7);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group" id="photoresistor-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
          Sensor Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Photoresistor (LDR)</h3>
        <p className="text-[11px] text-gray-400 font-medium font-sans">Cadmium-Sulfide Light Sensor</p>
      </div>

      {/* Photoresistor SVG Graphic Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Dynamic environmental sunlight glow behind the LDR */}
        <div 
          className="absolute rounded-full pointer-events-none transition-all duration-200"
          style={{
            width: '90px',
            height: '90px',
            top: '35px',
            background: `radial-gradient(circle, rgba(234, 179, 8, ${dynamicLightGlow}) 0%, rgba(234, 179, 8, 0.05) 55%, rgba(255, 255, 255, 0) 75%)`,
            filter: 'blur(12px)',
          }}
        />

        {/* LDR Ceramic design SVG matching the reference image perfectly */}
        <svg 
          width="100" 
          height="160" 
          viewBox="0 0 100 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Soft glazed terracotta ceramic base disc in 3D perspective angle */}
            <radialGradient id="ldrCeramicBase" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fbcfe8" /> {/* brighter matte top highlight */}
              <stop offset="25%" stopColor="#fed7aa" /> {/* peach/terracotta center */}
              <stop offset="80%" stopColor="#f97316" /> {/* deeper orange */}
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>

            {/* Glossy coat gradient */}
            <linearGradient id="ldrGlassGlare" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.45" />
              <stop offset="50%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* TWO VERTICAL LEADS */}
          {/* LEFT LEAD: Terminal 1 */}
          <line 
            x1="38" y1="88" x2="38" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't1' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t1')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* RIGHT LEAD: Terminal 2 */}
          <line 
            x1="62" y1="88" x2="62" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't2' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t2')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* LDR CERAMIC BASE DISC WHEEL */}
          <circle 
            cx="50" 
            cy="52" 
            r="26" 
            fill="url(#ldrCeramicBase)" 
            stroke="#9a3412" 
            strokeWidth="1.5"
          />

          {/* MEANDERING SERPENTINE COPPER/RED RESISTIVE TRACK (Symmetric serpentine waveform) */}
          <path 
            d="M 33 41 
               C 31 43, 31 46, 35 46
               C 42 46, 44 40, 50 40
               C 56 40, 58 46, 65 46
               C 69 46, 69 43, 67 41
               M 67 41 C 69 43, 69 48, 65 48
               C 58 48, 56 54, 50 54
               C 44 54, 42 48, 35 48
               C 31 48, 31 43, 33 41
               M 33 53
               C 31 55, 31 59, 35 59
               C 42 59, 44 65, 50 65
               C 56 65, 58 59, 65 59
               C 69 59, 69 55, 67 53
               M 67 53 C 69 55, 69 61, 65 61
               C 58 61, 56 67, 50 67
               C 44 67, 42 61, 35 61
               C 31 61, 31 55, 33 53" 
            stroke="#7f1d1d" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
            fill="none" 
            opacity="0.9"
          />

          {/* Clear protective epoxy resin gloss reflection coat */}
          <circle 
            cx="50" 
            cy="52" 
            r="24" 
            fill="url(#ldrGlassGlare)" 
          />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 't1' && (
            <rect x="33" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 't2' && (
            <rect x="57" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {hoveredTerminal === 't1' ? 'LEAD 1 (Voltage Out / Pin)' : 'LEAD 2 (VCC / Reference Pin)'}
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        {/* Lux status */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <span className="text-slate-500 font-sans flex items-center gap-1">
            {luxValue < 50 ? (
              <Moon className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            )}
            Light: <span className="text-amber-600">{luxValue} Lux</span>
          </span>
          <span className="font-mono text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-100 font-bold">
            {luxValue < 100 ? 'Dark Room' : luxValue < 600 ? 'Indoor Light' : 'Daylight ☀️'}
          </span>
        </div>

        {/* Ambient Light (Lux) Slider */}
        <div className="flex flex-col">
          <div className="flex justify-between text-[8px] text-gray-400 font-extrabold uppercase mb-0.5">
            <span>Dim (Darkness)</span>
            <span>Bright (Direct Sunlight)</span>
          </div>
          <input 
            type="range"
            min="0"
            max="1000"
            step="10"
            value={luxValue}
            onChange={(e) => setLuxValue(parseInt(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Calculated live telemetry */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold mt-0.5">
          <div className="flex justify-between text-gray-700">
            <span className="text-gray-400 text-[8.5px]">LDR Resistance:</span>
            <span className="font-mono text-[#111827]">{formattedResistance}</span>
          </div>
          
          <div className="flex justify-between items-center text-gray-700 border-t border-slate-50 pt-1">
            <span className="text-gray-400 text-[8.5px] flex items-center gap-0.5">
              <Database className="w-3 h-3 text-sky-500" />
              Arduino divider A0 reading:
            </span>
            <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded border border-sky-100">
              {adcValue} / 1023
            </span>
          </div>
          
          <div className="flex justify-between text-gray-750">
            <span className="text-gray-400 text-[8.5px]">Equivalent Voltage:</span>
            <span className="font-mono text-slate-800">{simulatedVoltage.toFixed(2)} Volts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

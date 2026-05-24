import React, { useState } from 'react';
import { Shield, Zap, RotateCcw } from 'lucide-react';

export default function ZenerDiode() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [zenerVoltage, setZenerVoltage] = useState<number>(5.1); // Typical Zener breakdown values: 3.3, 4.7, 5.1, 6.8
  const [inputVoltage, setInputVoltage] = useState<number>(0); // Source voltage from -10V to +10V

  // Calculate diode behavior
  // Forward bias vs Reverse bias
  let outputVoltage = 0;
  let diodeCurrent = 0; // Simulated Current in mA
  let mode: 'idle' | 'forward' | 'blocking' | 'breakdown' = 'idle';

  if (inputVoltage >= 0) {
    // Forward bias check (standard silicon diode drops ~0.7V)
    if (inputVoltage < 0.7) {
      outputVoltage = inputVoltage;
      diodeCurrent = inputVoltage * 0.5; // micro current
      mode = 'blocking';
    } else {
      outputVoltage = 0.7;
      diodeCurrent = (inputVoltage - 0.7) * 25; // 25mA per volt drop
      mode = 'forward';
    }
  } else {
    // Reverse bias (voltage is negative, e.g. -5.0V corresponds to magnitude of 5V)
    const reverseVoltageMagnitude = Math.abs(inputVoltage);
    if (reverseVoltageMagnitude < zenerVoltage) {
      outputVoltage = inputVoltage;
      diodeCurrent = 0.01; // tiny leakage current
      mode = 'blocking';
    } else {
      // Zener breakdown occurs! Clamps to negative Zener Voltage -Vz
      outputVoltage = -zenerVoltage;
      diodeCurrent = (reverseVoltageMagnitude - zenerVoltage) * 45; // high conduction
      mode = 'breakdown';
    }
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group" id="zener-diode-card">
      {/* Name and Meta */}
      <div className="w-full text-center">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Active Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Zener Diode</h3>
        <p className="text-[11px] text-gray-400 font-medium">Glass Encased Voltage Regulator</p>
      </div>

      {/* Zener Diode Visual Representation */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Glow if conducting in Forward active */}
        {mode === 'forward' && (
          <div 
            className="absolute rounded-full pointer-events-none transition-all duration-300"
            style={{
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0.05) 50%, rgba(255, 255, 255, 0) 75%)`,
              filter: 'blur(10px)',
            }}
          />
        )}

        {/* Electrical breakdown neon spark overlay */}
        {mode === 'breakdown' && (
          <div 
            className="absolute rounded-full pointer-events-none animate-pulse"
            style={{
              width: '110px',
              height: '110px',
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.08) 55%, rgba(255, 255, 255, 0) 80%)`,
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Dynamic breakdown spark text */}
        {mode === 'breakdown' && (
          <div className="absolute top-[40px] text-sky-500 animate-ping opacity-75 pointer-events-none">
            <Zap className="w-5 h-5 fill-current" />
          </div>
        )}

        {/* Zener Diode SVG - glass body design with horizontal wire leads */}
        <svg 
          width="110" 
          height="160" 
          viewBox="0 0 110 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Transparent reddish-orange glass capsule look */}
            <linearGradient id="zenerGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#fdba74" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            {/* Inner Silicon wafer die inside glass capsule */}
            <linearGradient id="siliconDie" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>

            {/* Shine gloss highlights for transparent glass */}
            <linearGradient id="glassGloss" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.45" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* TWO VERTICAL METAL WIRE LEADS */}
          {/* CATHODE WIRE LEAD: top pin */}
          <line 
            x1="55" y1="10" x2="55" y2="50" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'cathode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('cathode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* ANODE WIRE LEAD: bottom pin */}
          <line 
            x1="55" y1="110" x2="55" y2="150" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'anode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('anode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* GLASS EMBEDDED SILICON WAFER DIE IN CENTER */}
          <rect 
            x="51" 
            y="65" 
            width="8" 
            height="30" 
            rx="1" 
            fill="url(#siliconDie)" 
            stroke="#111827" 
            strokeWidth="0.5"
          />

          {/* GLASS ORANGE CAPSULE BODY */}
          <rect 
            x="38" 
            y="50" 
            width="34" 
            height="60" 
            rx="8" 
            fill="url(#zenerGlass)" 
            stroke="#c2410c" 
            strokeWidth="1.2"
          />

          {/* ACTIVE REGION BREAKDOWN ARC GLOW EFFECT */}
          {mode === 'breakdown' && (
            <ellipse cx="55" cy="80" rx="14" ry="20" fill="#38bdf8" opacity="0.35" className="animate-pulse" />
          )}

          {/* BLACK CATHODE POLARITY BAND (Always printed near negative block) */}
          {/* In vertical, Cathode is modeled at the top of the envelope */}
          <path 
            d="M 38 60 
               L 38 66 
               C 50 67, 60 67, 72 66 
               L 72 60 
               C 60 59, 50 59, 38 60 Z" 
            fill="#1e293b" 
            stroke="#0f172a" 
            strokeWidth="0.5"
          />

          {/* Glass glare highlight layer */}
          <path 
            d="M 42 54 
               L 42 106" 
            stroke="url(#glassGloss)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'cathode' && (
            <rect x="50" y="5" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'anode' && (
            <rect x="50" y="145" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className={hoveredTerminal === 'cathode' ? 'text-amber-300 font-extrabold text-[9px]' : 'text-sky-305 font-extrabold text-[9px]'}>
              {hoveredTerminal === 'cathode' ? 'CATHODE (K / Top Black Band)' : 'ANODE (A / Bottom)'}
            </span>
            <span className="text-[8.5px] text-slate-350">
              {hoveredTerminal === 'cathode' 
                ? 'Blocks unless forward conducting or in reverse breakdown' 
                : 'Enters standard forward path conduction'}
            </span>
          </div>
        )}
      </div>

      {/* Diode Simulation Console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        {/* Breakdown selector */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span>Zener V_z rating:</span>
          </div>
          <div className="flex gap-1 font-mono">
            {[3.3, 4.7, 5.1, 6.8].map(vz => (
              <button
                key={vz}
                onClick={() => setZenerVoltage(vz)}
                className={`px-1 text-[8.5px] font-bold rounded ${
                  zenerVoltage === vz 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-slate-50'
                }`}
              >
                {vz}V
              </button>
            ))}
          </div>
        </div>

        {/* Input Voltage Slider spanning negative(reverse) to positive(forward) */}
        <div className="flex flex-col">
          <div className="flex justify-between text-[8.5px] text-gray-400 font-semibold mb-0.5">
            <span>External Bias Voltage (Vin)</span>
            <span className="font-mono text-slate-800 font-bold">{inputVoltage.toFixed(1)} Volts</span>
          </div>
          <input 
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={inputVoltage}
            onChange={(e) => setInputVoltage(parseFloat(e.target.value))}
            className="w-full accent-orange-600 h-1 bg-slate-200 rounded-lg cursor-pointer animate-flicker"
          />
          <div className="flex justify-between text-[7.5px] text-gray-400 mt-0.5">
            <span>-10V Reverse (Vz)</span>
            <button onClick={() => setInputVoltage(0)} className="text-[7.5px] text-gray-400 flex items-center gap-0.5 hover:text-orange-550 transition-colors">
              <RotateCcw className="w-1.5 h-1.5" /> 0V
            </button>
            <span>+10V Forward</span>
          </div>
        </div>

        {/* Mode & Live Outputs and Calculations */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-gray-400 uppercase font-extrabold text-[8px]">Mode</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] uppercase ${
              mode === 'forward' 
                ? 'bg-orange-100 text-orange-700' 
                : mode === 'breakdown' 
                  ? 'bg-blue-100 text-blue-700 animate-pulse' 
                  : 'bg-slate-100 text-slate-600'
            }`}>
              {mode === 'forward' 
                ? 'Forward Conduction ⚡' 
                : mode === 'breakdown' 
                  ? 'ZENER BREAKDOWN 🔥' 
                  : 'Reverse Blocking 🛡️'}
            </span>
          </div>
          
          <div className="flex justify-between mt-0.5 text-gray-700">
            <span className="text-gray-400 text-[8.5px]">Clamped Vout:</span>
            <span className="font-mono text-slate-800">{outputVoltage.toFixed(2)} V</span>
          </div>
          
          <div className="flex justify-between text-gray-700">
            <span className="text-gray-400 text-[8.5px]">Diode Current:</span>
            <span className="font-mono text-slate-800">
              {diodeCurrent > 1000 
                ? `${(diodeCurrent / 1000).toFixed(2)} A` 
                : `${diodeCurrent.toFixed(1)} mA`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

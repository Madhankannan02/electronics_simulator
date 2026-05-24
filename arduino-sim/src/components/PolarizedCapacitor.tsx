import React, { useState, useEffect } from 'react';
import { Database, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

export default function PolarizedCapacitor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [voltage, setVoltage] = useState<number>(0); // Stored charge voltage
  const [inputVoltage, setInputVoltage] = useState<number>(5.0); // Simulated power source voltage
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [capacitanceValue, setCapacitanceValue] = useState<number>(100); // in uF (microfarads)

  const ratedVoltage = 16.0; // Rated max voltage of the capacitor

  // Charge/discharge differential math loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCharging) {
      interval = setInterval(() => {
        setVoltage(prev => {
          // If input exceeds current, charge towards input voltage
          if (prev < inputVoltage) {
            const chargeStep = Math.min(0.5, (inputVoltage - prev) * 0.2 + 0.05);
            return Math.min(inputVoltage, prev + chargeStep);
          }
          // If input is less, discharge down to input voltage
          else if (prev > inputVoltage) {
            const dischargeStep = Math.min(0.5, (prev - inputVoltage) * 0.2 + 0.05);
            return Math.max(inputVoltage, prev - dischargeStep);
          }
          return prev;
        });
      }, 40);
    } else if (voltage > 0) {
      // Natural slow dielectric self-discharge when disconnected
      interval = setInterval(() => {
        setVoltage(prev => {
          if (prev <= 0.05) return 0;
          return prev - 0.04;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isCharging, inputVoltage, voltage]);

  const handleDischarge = () => {
    setVoltage(0);
    setIsCharging(false);
  };

  // Determine if safety rating exceeded (overvoltage alert)
  const isOverVoltaged = voltage > ratedVoltage;

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group" id="polarized-capacitor-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Passive Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Polarized Capacitor</h3>
        <p className="text-[11px] text-gray-400 font-medium">Electrolytic Radial-Lead</p>
      </div>

      {/* Capacitor Body Graphics */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Spark/Electric Arc dynamic visualization */}
        {isCharging && !isOverVoltaged && (
          <div className="absolute top-[35px] text-sky-500 animate-ping opacity-60 pointer-events-none">
            <Zap className="w-6 h-6 fill-current" />
          </div>
        )}

        {/* Severe Overvoltage warning state glow */}
        {isOverVoltaged && (
          <div className="absolute top-[20px] bottom-[30px] w-[90px] bg-red-500/15 rounded-3xl animate-pulse blur-xl pointer-events-none border border-red-500/30" />
        )}

        {/* Capacitor SVG perfectly matching the classic vertical cylinder model */}
        <svg 
          width="100" 
          height="160" 
          viewBox="0 0 100 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 filter drop-shadow-sm transition-transform duration-300 ${
            isOverVoltaged ? 'animate-bounce scale-102' : ''
          }`}
        >
          <defs>
            {/* Dark cylindrical rubber cover sleeve */}
            <linearGradient id="electrolyticBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="15%" stopColor="#1e293b" />
              <stop offset="65%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Negative strip backdrop (Standard white/gray) */}
            <linearGradient id="negativeStripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Top metallic aluminum disk cover */}
            <radialGradient id="aluTop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
          </defs>

          {/* TWO PARALLEL RADIAL METAL LEADS */}
          {/* CATHODE (-) LEAD: Shorter left leg */}
          <line 
            x1="38" y1="110" x2="38" y2="138" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'cathode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('cathode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* ANODE (+) LEAD: Longer right leg */}
          <line 
            x1="62" y1="110" x2="62" y2="152" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'anode' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('anode')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* CYLINDER MAIN BOTTOM CAP (Slight lead rubber bung) */}
          <ellipse cx="50" cy="110" rx="25" ry="4" fill="#1e293b" />

          {/* MAIN CYLINDRICAL SLEEVE BODY (Standing tall) */}
          {/* Slices straight vertical with cylindrical bottom curved edge */}
          <path 
            d="M 25 35 
               L 25 108 
               A 25 8 0 0 0 75 108 
               L 75 35 
               Z" 
            fill="url(#electrolyticBody)" 
            stroke="#0f172a" 
            strokeWidth="1.2"
          />

          {/* TOP METAL DISC VENTING HEAD (Representing aluminum capsule top) */}
          <ellipse 
            cx="50" 
            cy="35" 
            rx="25" 
            ry="8" 
            fill="url(#aluTop)" 
            stroke="#64748b" 
            strokeWidth="1"
          />

          {/* Stamped security vent indentation markings (The classic 'K' or 'Y' shape) */}
          <path d="M 45 35 L 55 35 M 50 31 L 50 39" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" />

          {/* VERTICAL NEGATIVE TERMINAL STRIPE (On the left side) */}
          {/* Highlights exact position of polarized negative cathode pins */}
          <path 
            d="M 26 38 
               L 26 103 
               C 31 104, 34 104, 34 103 
               L 34 38 
               C 34 36, 31 36, 26 38" 
            fill="url(#negativeStripeGrad)" 
            opacity="0.85"
          />

          {/* Negative polarity indicators printed inside the vertical stripe (minus signs) */}
          <text x="30" y="53" fill="#1e293b" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">-</text>
          <text x="30" y="73" fill="#1e293b" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">-</text>
          <text x="30" y="93" fill="#1e293b" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">-</text>

          {/* Volume capacity & Rated voltage stamp labels printed on body */}
          <text x="56" y="58" fill="#94a3b8" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.8">{capacitanceValue}µF</text>
          <text x="56" y="72" fill="#d1d5db" fontSize="7" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.8">16V</text>
          <text x="56" y="86" fill="#94a3b8" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.6">PET</text>

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'cathode' && (
            <rect x="33" y="133" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'anode' && (
            <rect x="57" y="147" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className={hoveredTerminal === 'cathode' ? 'text-blue-400 font-extrabold text-[9px]' : 'text-emerald-400 font-extrabold text-[9px]'}>
              {hoveredTerminal === 'cathode' ? 'CATHODE (Negative Pin / -)' : 'ANODE (Positive Pin / +)'}
            </span>
            <span className="text-[8.5px] text-slate-350">
              {hoveredTerminal === 'cathode' 
                ? 'Standard ground rails or lower potential link' 
                : 'Connect to positive supply power / incoming signal'}
            </span>
          </div>
        )}
      </div>

      {/* Charge Simulation Console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Rating: <span className="text-blue-700">16V Max</span></span>
          </div>
          <button 
            onClick={handleDischarge}
            disabled={voltage === 0}
            className="px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5 bg-red-50 text-red-650 border border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            Discharge
          </button>
        </div>

        {/* Input Voltage Slider */}
        <div className="flex flex-col">
          <div className="flex justify-between text-[8.5px] text-gray-400 font-semibold mb-0.5">
            <span>Power Source Voltage (Vin)</span>
            <span className={inputVoltage > ratedVoltage ? 'text-red-500 font-bold' : ''}>
              {inputVoltage.toFixed(1)} Volts
            </span>
          </div>
          <input 
            type="range"
            min="1"
            max="24"
            step="0.5"
            value={inputVoltage}
            onChange={(e) => setInputVoltage(parseFloat(e.target.value))}
            className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Capacitance Selector */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Capacitance:</span>
          <div className="flex gap-1.5">
            {[10, 47, 100, 470].map(val => (
              <button
                key={val}
                onClick={() => setCapacitanceValue(val)}
                className={`px-1 text-[8.5px] font-mono font-bold rounded ${
                  capacitanceValue === val 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-slate-50'
                }`}
              >
                {val}µF
              </button>
            ))}
          </div>
        </div>

        {/* Charge action with live Voltage feedback */}
        <div className="flex items-center justify-between gap-2 mt-0.5 border-t border-slate-100 pt-2">
          <button
            onMouseDown={() => setIsCharging(true)}
            onMouseUp={() => setIsCharging(false)}
            onMouseLeave={() => setIsCharging(false)}
            onTouchStart={() => setIsCharging(true)}
            onTouchEnd={() => setIsCharging(false)}
            className={`flex-1 py-1 text-[10px] rounded font-bold cursor-pointer transition-colors border select-none ${
              isCharging 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
            }`}
          >
            {isCharging ? 'Charging...' : 'Hold to Connect'}
          </button>

          {/* Voltage Charge Meter */}
          <div className={`w-20 h-5 rounded-md relative overflow-hidden flex items-center justify-center font-mono text-[9px] font-extrabold border ${
            isOverVoltaged 
              ? 'bg-red-50 text-red-600 border-red-300 animate-pulse' 
              : 'bg-slate-200 text-slate-800 border-slate-300'
          }`}>
            <div 
              className={`absolute left-0 bottom-0 top-0 transition-all duration-100 ${
                isOverVoltaged ? 'bg-red-400' : 'bg-blue-400/80'
              }`} 
              style={{ width: `${Math.min(100, (voltage / ratedVoltage) * 100)}%` }}
            />
            <span className="relative z-10">{voltage.toFixed(1)} V</span>
          </div>
        </div>

        {/* Danger warning marquee for overvoltage */}
        {isOverVoltaged && (
          <div className="flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded-md text-[8.5px] text-red-700 font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>WARNING: Rated voltage (16V) exceeded! Risk of failure or swelling!</span>
          </div>
        )}
      </div>
    </div>
  );
}

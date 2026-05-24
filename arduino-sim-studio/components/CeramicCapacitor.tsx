import React, { useState, useEffect } from 'react';
import { Database, Zap, RefreshCw } from 'lucide-react';

export default function CeramicCapacitor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [voltage, setVoltage] = useState<number>(0); // Stored voltage up to 5V
  const [isCharging, setIsCharging] = useState<boolean>(false);

  // Capacitance value is fixed (e.g., 100nF)
  const capacitance = "100 nF"; 
  const code = "104"; // Standard capacitor code for 100nF

  // Simulation step
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCharging) {
      interval = setInterval(() => {
        setVoltage(prev => {
          if (prev >= 5) {
            setIsCharging(false);
            return 5;
          }
          return Math.min(5, prev + 0.25);
        });
      }, 50);
    } else if (voltage > 0) {
      // Slow safe self-discharge if not connected or intentional discharge
      interval = setInterval(() => {
        setVoltage(prev => {
          if (prev <= 0.05) return 0;
          return Math.max(0, prev - 0.02);
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isCharging, voltage]);

  const handleDischarge = () => {
    setVoltage(0);
    setIsCharging(false);
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full">
          Passive Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Ceramic Capacitor</h3>
        <p className="text-[11px] text-gray-400 font-medium">Non-polarized Ceramic Disc</p>
      </div>

      {/* Capacitor Graphic Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Glow if charged */}
        {voltage > 0.1 && (
          <div 
            className="absolute rounded-full pointer-events-none transition-all duration-300"
            style={{
              width: '80px',
              height: '80px',
              top: '25px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: `radial-gradient(circle, rgba(59, 130, 246, ${voltage / 5 * 0.4}) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(255, 255, 255, 0) 75%)`,
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Dynamic Spark / Energy Wave indicator */}
        {isCharging && (
          <div className="absolute top-[40px] text-blue-500 animate-ping opacity-60 pointer-events-none">
            <Zap className="w-6 h-6 fill-current" />
          </div>
        )}

        {/* Capacitor SVG Render matching the product image perfectly */}
        <svg 
          width="100" 
          height="160" 
          viewBox="0 0 100 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Blue gradients of the body */}
            <linearGradient id="capBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" /> {/* slate dark blue */}
              <stop offset="30%" stopColor="#1d4ed8" /> {/* royal blue */}
              <stop offset="70%" stopColor="#2563eb" /> {/* clean blue */}
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            <linearGradient id="capLeads" x1="30" y1="0" x2="70" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="capGloss" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* TWO PARALLEL WIRE LEADS */}
          {/* LEFT LEAD: Terminal 1 */}
          <line 
            x1="35" y1="88" x2="35" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't1' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t1')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* RIGHT LEAD: Terminal 2 */}
          <line 
            x1="65" y1="88" x2="65" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 't2' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('t2')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* BLUE CAPACITOR DISK BODY */}
          {/* Bulbous shaped path matching the image */}
          <path 
            d="M 22 55 
               C 10 30, 90 30, 78 55 
               C 74 65, 75 75, 74 85 
               C 74 90, 68 86, 50 86
               C 32 86, 26 90, 26 85 
               C 25 75, 26 65, 22 55 Z" 
            fill="url(#capBodyGrad)" 
          />

          {/* Light reflecting highlight on the upper left crescent */}
          <path 
            d="M 28 44 
               C 22 36, 42 26, 60 28" 
            stroke="url(#capGloss)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Capacitor model footprint marking code "104" on body */}
          <text 
            x="50" 
            y="65" 
            fill="#93c5fd" 
            fontFamily="sans-serif" 
            fontWeight="bold" 
            fontSize="10" 
            textAnchor="middle" 
            className="select-none tracking-wide"
          >
            104
          </text>

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 't1' && (
            <rect x="30" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 't2' && (
            <rect x="60" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            {hoveredTerminal === 't1' ? 'TERMINAL 1 (Non-Polarized Pin)' : 'TERMINAL 2 (Non-Polarized Pin)'}
          </div>
        )}
      </div>

      {/* Charge simulator console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            <Database className="w-3.5 h-3.5" />
            <span>Capacitance: <span className="text-blue-600">{capacitance}</span></span>
          </div>
          <button 
            onClick={handleDischarge}
            disabled={voltage === 0}
            className="px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Disrupt current loop / Discharge"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            Discharge
          </button>
        </div>

        {/* Charge action */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <button
            onMouseDown={() => setIsCharging(true)}
            onMouseUp={() => setIsCharging(false)}
            onMouseLeave={() => setIsCharging(false)}
            onTouchStart={() => setIsCharging(true)}
            onTouchEnd={() => setIsCharging(false)}
            className={`flex-1 py-1 px-2 text-[10px] rounded font-bold cursor-pointer transition-colors border select-none ${
              isCharging 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
            }`}
          >
            {isCharging ? 'Charging...' : 'Hold to Charge (5V)'}
          </button>

          {/* Voltage Charge Meter */}
          <div className="w-20 bg-slate-200 h-5 rounded-md relative overflow-hidden flex items-center justify-center font-mono text-[9px] font-extrabold text-slate-800 border border-slate-300">
            <div 
              className="absolute left-0 bottom-0 top-0 bg-blue-400/80 transition-all duration-100" 
              style={{ width: `${(voltage / 5) * 100}%` }}
            />
            <span className="relative z-10">{voltage.toFixed(2)} V</span>
          </div>
        </div>
      </div>
    </div>
  );
}

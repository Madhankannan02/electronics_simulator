import React, { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface BandColor {
  name: string;
  color: string;
  multiplier: number;
  value: number;
  tolerance?: string;
}

const BAND_COLORS: { [key: string]: BandColor } = {
  brown: { name: 'Brown', color: '#78350f', value: 1, multiplier: 10, tolerance: '±1%' },
  black: { name: 'Black', color: '#000000', value: 0, multiplier: 1, tolerance: '±2%' },
  red: { name: 'Red', color: '#ef4444', value: 2, multiplier: 100 },
  orange: { name: 'Orange', color: '#f97316', value: 3, multiplier: 1000 },
  yellow: { name: 'Yellow', color: '#eab308', value: 4, multiplier: 10000 },
  green: { name: 'Green', color: '#22c55e', value: 5, multiplier: 100000 },
  blue: { name: 'Blue', color: '#3b82f6', value: 6, multiplier: 1000000 },
  violet: { name: 'Violet', color: '#a855f7', value: 7, multiplier: 10000000 },
  grey: { name: 'Grey', color: '#64748b', value: 8, multiplier: 100000000 },
  white: { name: 'White', color: '#ffffff', value: 9, multiplier: 1000000000 },
  gold: { name: 'Gold', color: '#d97706', value: -1, multiplier: 0.1, tolerance: '±5%' },
  silver: { name: 'Silver', color: '#94a3b8', value: -1, multiplier: 0.01, tolerance: '±10%' },
};

export default function Resistor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  // Default active bands matching the reference image from bottom to top (reading wise: brown, black, red, gold)
  const [band1, setBand1] = useState<string>('brown');
  const [band2, setBand2] = useState<string>('black');
  const [band3, setBand3] = useState<string>('red');
  const [band4, setBand4] = useState<string>('gold');

  // Calculates resistor value in Ohms
  const b1Val = BAND_COLORS[band1].value;
  const b2Val = BAND_COLORS[band2].value;
  const multiplier = BAND_COLORS[band3].multiplier;
  const tolerance = BAND_COLORS[band4].tolerance ?? '±5%';

  const ohmValue = (b1Val * 10 + b2Val) * multiplier;
  
  const formatOhms = (ohms: number) => {
    if (ohms >= 1e6) {
      return `${(ohms / 1e6).toFixed(1).replace(/\.0$/, '')} MΩ`;
    }
    if (ohms >= 1000) {
      return `${(ohms / 1000).toFixed(1).replace(/\.0$/, '')} kΩ`;
    }
    return `${ohms.toFixed(0)} Ω`;
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Passive Component
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Resistor (Axial)</h3>
        <p className="text-[11px] text-gray-400 font-medium">4-Band Color Code</p>
      </div>

      {/* Resistor Visual Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[185px]">
        {/* Resistor SVG Render matching reference image */}
        <svg 
          width="100" 
          height="170" 
          viewBox="0 0 100 170" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Resistor body color gradients (tan/beige ceramic sleeve) */}
            <linearGradient id="resistorBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cf9f62" /> {/* dark beige */}
              <stop offset="25%" stopColor="#e5c185" /> {/* highlight tan */}
              <stop offset="70%" stopColor="#d5aa6d" /> 
              <stop offset="100%" stopColor="#9a6e38" /> {/* shadow bronze */}
            </linearGradient>

            <linearGradient id="metalWires" x1="45" y1="0" x2="55" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* TWO VERTICAL COPPER/TIN LEADS */}
          {/* TOP LEAD: Terminal 1 */}
          <line 
            x1="50" y1="5" x2="50" y2="45" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'top' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('top')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* BOTTOM LEAD: Terminal 2 */}
          <line 
            x1="50" y1="125" x2="50" y2="165" 
            stroke="#94a3b8" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'bottom' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('bottom')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* TAN BULB (WAISTED BODY) */}
          <path 
            d="M 50 35 
               C 58 35, 62 48, 62 55
               C 62 62, 58 68, 58 75
               C 58 82, 62 88, 62 95
               C 62 102, 58 115, 50 115
               C 42 115, 38 102, 38 95
               C 38 88, 42 82, 42 75
               C 42 68, 38 62, 38 55
               C 38 48, 42 35, 50 35 Z" 
            fill="url(#resistorBody)" 
          />

          {/* RING BANDS (Drawn on body at realistic elevations) */}
          {/* Band 1 - Top-most band (Gold tolerance is top/bottom. In image it is Gold at top, then Red, Black, Brown at bottom) */}
          {/* Active Band 4 (Gold, near top bulge) */}
          <rect 
            x="38.5" y="48" width="23" height="5.5" 
            fill={BAND_COLORS[band4].color} 
            rx="1" 
            className="cursor-pointer hover:stroke-white/80 hover:stroke-1"
          />

          {/* Active Band 3 (Red, center upper waist) */}
          <rect 
            x="41.5" y="65" width="17" height="6" 
            fill={BAND_COLORS[band3].color} 
            rx="0.5"
            className="cursor-pointer hover:stroke-white/80 hover:stroke-1"
          />

          {/* Active Band 2 (Black, lower waist center) */}
          <rect 
            x="41.5" y="78" width="17" height="6" 
            fill={BAND_COLORS[band2].color} 
            rx="0.5"
            className="cursor-pointer hover:stroke-white/80 hover:stroke-1"
          />

          {/* Active Band 1 (Brown, lower bulge) */}
          <rect 
            x="38.5" y="93" width="23" height="6" 
            fill={BAND_COLORS[band1].color} 
            rx="1"
            className="cursor-pointer hover:stroke-white/80 hover:stroke-1"
          />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'top' && (
            <rect x="45" y="0" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'bottom' && (
            <rect x="45" y="160" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {hoveredTerminal === 'top' ? 'TERMINAL 1 (Top Active Wire)' : 'TERMINAL 2 (Bottom Active Wire)'}
          </div>
        )}
      </div>

      {/* Calculator console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <div className="flex items-center gap-1 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Resistance Value</span>
          </div>
          <span className="font-mono text-xs font-extrabold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">
            {formatOhms(ohmValue)} ({tolerance})
          </span>
        </div>

        {/* Dynamic band swappers */}
        <div className="grid grid-cols-4 gap-1 mt-1 text-[9px] font-bold text-center text-gray-500">
          {/* Band 1 Selector */}
          <div className="flex flex-col gap-0.5">
            <span>Band 1</span>
            <select 
              value={band1} 
              onChange={(e) => setBand1(e.target.value)}
              className="bg-white border border-gray-200 rounded p-0.5 text-[8.5px] cursor-pointer"
            >
              <option value="brown">Brown (1)</option>
              <option value="red">Red (2)</option>
              <option value="orange">Orange (3)</option>
              <option value="yellow">Yellow (4)</option>
              <option value="green">Green (5)</option>
              <option value="blue">Blue (6)</option>
              <option value="violet">Violet (7)</option>
              <option value="white">White (9)</option>
            </select>
          </div>

          {/* Band 2 Selector */}
          <div className="flex flex-col gap-0.5">
            <span>Band 2</span>
            <select 
              value={band2} 
              onChange={(e) => setBand2(e.target.value)}
              className="bg-white border border-gray-200 rounded p-0.5 text-[8.5px] cursor-pointer"
            >
              <option value="black">Black (0)</option>
              <option value="brown">Brown (1)</option>
              <option value="red">Red (2)</option>
              <option value="orange">Orange (3)</option>
              <option value="yellow">Yellow (4)</option>
              <option value="green">Green (5)</option>
              <option value="violet">Violet (7)</option>
              <option value="white">White (9)</option>
            </select>
          </div>

          {/* Multiplier Selector (Band 3) */}
          <div className="flex flex-col gap-0.5">
            <span>Multiplier</span>
            <select 
              value={band3} 
              onChange={(e) => setBand3(e.target.value)}
              className="bg-white border border-gray-200 rounded p-0.5 text-[8.5px] cursor-pointer"
            >
              <option value="black">x1 Ω</option>
              <option value="brown">x10 Ω</option>
              <option value="red">x100 Ω</option>
              <option value="orange">x1k Ω</option>
              <option value="yellow">x10k Ω</option>
              <option value="green">x100k</option>
              <option value="blue">x1M Ω</option>
            </select>
          </div>

          {/* Tolerance Selector (Band 4) */}
          <div className="flex flex-col gap-0.5">
            <span>Tolerance</span>
            <select 
              value={band4} 
              onChange={(e) => setBand4(e.target.value)}
              className="bg-white border border-gray-200 rounded p-0.5 text-[8.5px] cursor-pointer"
            >
              <option value="gold">Gold (5%)</option>
              <option value="silver">Silver (10%)</option>
              <option value="brown">Brown (1%)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

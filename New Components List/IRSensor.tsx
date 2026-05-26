import React, { useState, useEffect } from 'react';
import { Eye, Signal, Shield, Play } from 'lucide-react';

export default function IRSensor() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [isReceiving, setIsReceiving] = useState<boolean>(false);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>('Power');
  const [timerCount, setTimerCount] = useState<number>(0);

  // NEC IR Codes key-value mapping
  const irKeyCodes: { [key: string]: { hex: string; binary: string } } = {
    'Power': { hex: '0x00FF45', binary: '00000000 11111111 01000101' },
    'Play/Pause': { hex: '0x00FF1C', binary: '00000000 11111111 00011100' },
    'Volume Up': { hex: '0x00FF09', binary: '00000000 11111111 00001001' },
    'Volume Down': { hex: '0x00FF15', binary: '00000000 11111111 00010101' }
  };

  const handleFireRemote = () => {
    setIsReceiving(true);
    setReceivedCode(null);
    setTimerCount(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReceiving) {
      interval = setInterval(() => {
        setTimerCount(prev => {
          if (prev >= 100) {
            setIsReceiving(false);
            setReceivedCode(irKeyCodes[selectedKey].hex);
            return 100;
          }
          return prev + 10;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isReceiving, selectedKey]);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[380px] w-[250px] relative transition-all hover:shadow-md group" id="ir-sensor-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Active Transceiver
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">IR Receiver Sensor</h3>
        <p className="text-[11px] text-gray-400 font-medium">38 kHz Demodulating Receiver</p>
      </div>

      {/* IR Graphic Display */}
      <div className="relative flex-1 flex items-center justify-center p-4 w-full h-[180px]">
        {/* Animated incoming infrared signal pulses */}
        {isReceiving && (
          <div className="absolute top-[3px] flex flex-col gap-1 items-center pointer-events-none animate-pulse">
            <span className="text-[9px] font-bold text-indigo-500 flex items-center gap-0.5 uppercase tracking-wider bg-indigo-50/80 p-0.5 px-1.5 rounded border border-indigo-100">
              <Signal className="w-2.5 h-2.5 animate-bounce" /> Carrier: 38kHz
            </span>
            <div className="w-24 h-0.5 bg-indigo-400 blur-[1px] animate-ping" />
            <div className="w-16 h-0.5 bg-indigo-300 blur-[0.8px] animate-ping" />
          </div>
        )}

        {/* Decoder Glow if successful */}
        {receivedCode && (
          <div 
            className="absolute rounded-full pointer-events-none transition-all duration-300"
            style={{
              width: '90px',
              height: '90px',
              top: '40px',
              background: `radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0.04) 50%, rgba(255, 255, 255, 0) 75%)`,
              filter: 'blur(6px)',
            }}
          />
        )}

        {/* IR Sensor TSOP-style SVG matches reference image perfectly */}
        <svg 
          width="100" 
          height="160" 
          viewBox="0 0 100 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-sm select-none"
        >
          <defs>
            {/* Dark charcoal body with glossy highlights */}
            <linearGradient id="irBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="30%" stopColor="#334155" />
              <stop offset="75%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Glossy round glass dome lens lens */}
            <radialGradient id="irLens" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="45%" stopColor="#1e293b" />
              <stop offset="85%" stopColor="#090d16" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Glossy lens reflection ring */}
            <linearGradient id="reflectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* THREE SYMMETRICALLY BENT WIRE LEADS (OUT, GND, VCC) */}
          {/* PIN 1: OUT (Left Leg) */}
          <path 
            d="M 33 80 Q 33 105, 22 108 L 22 148" 
            stroke="#94a3b8" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            fill="none"
            className={`cursor-pointer transition-all ${hoveredTerminal === 'out' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('out')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 2: GND (Center Leg) */}
          <line 
            x1="50" y1="80" x2="50" y2="148" 
            stroke="#94a3b8" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'gnd' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('gnd')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* PIN 3: VCC (Right Leg) */}
          <path 
            d="M 67 80 Q 67 105, 78 108 L 78 148" 
            stroke="#94a3b8" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            fill="none"
            className={`cursor-pointer transition-all ${hoveredTerminal === 'vcc' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('vcc')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* IR INTEGRATED BODY BOX */}
          <rect 
            x="24" 
            y="30" 
            width="52" 
            height="50" 
            rx="5" 
            fill="url(#irBody)" 
            stroke="#0f172a" 
            strokeWidth="1.2"
          />

          {/* FRONT SPHERICAL RECESS DOME LENS */}
          {/* Sits right in the center for photo-diode detection */}
          <circle 
            cx="50" 
            cy="52" 
            r="16" 
            fill="url(#irLens)" 
            stroke="#0f172a" 
            strokeWidth="1.4"
          />

          {/* Subtle reflection crescent highlight */}
          <path 
            d="M 38 46 A 14 14 0 0 1 60 42" 
            stroke="url(#reflectionGrad)" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Dynamic state LED indicator on receiver body */}
          {isReceiving && (
            <circle cx="50" cy="52" r="3.5" fill="#a5b4fc" className="animate-ping" />
          )}

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'out' && (
            <rect x="17" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'gnd' && (
            <rect x="45" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'vcc' && (
            <rect x="73" y="143" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[135px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className="text-indigo-400 font-extrabold text-[9px] uppercase">
              {hoveredTerminal === 'out' ? 'OUT (Signal Pin)' : hoveredTerminal === 'gnd' ? 'GND (Ground)' : 'VCC (Supply V / 5V)'}
            </span>
            <span className="text-[8.5px] text-slate-350">
              {hoveredTerminal === 'out' 
                ? 'Outputs parsed active low pulsestream' 
                : hoveredTerminal === 'gnd' 
                  ? 'Common system ground Reference (0V)' 
                  : 'Power input (standard 2.7V to 5.5V dc)'}
            </span>
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto text-xs">
        {/* Key Selection menu */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
          <span className="text-slate-500 font-sans flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-500" /> Remote Controller:
          </span>
          <select 
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            disabled={isReceiving}
            className="bg-white border border-slate-200 text-gray-700 text-[10px] font-bold py-0.5 px-1 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-40"
          >
            {Object.keys(irKeyCodes).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Trigger Transmit Button */}
        <button
          onClick={handleFireRemote}
          disabled={isReceiving}
          className={`w-full py-1.5 px-3 text-[10.5px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer select-none border transition-colors ${
            isReceiving 
              ? 'bg-indigo-100 text-indigo-600 border-indigo-200' 
              : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm'
          }`}
        >
          <Play className={`w-3.5 h-3.5 font-bold ${isReceiving ? 'animate-spin' : ''}`} />
          {isReceiving ? `Receiving Carrier stream... ${timerCount}%` : `Transmit code: '${selectedKey}'`}
        </button>

        {/* Display received telemetry */}
        <div className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col gap-1 text-[10px] font-bold">
          <div className="flex justify-between">
            <span className="text-gray-400 text-[8.5px] uppercase font-bold">Status:</span>
            <span className={isReceiving ? 'text-indigo-600 animate-pulse' : receivedCode ? 'text-emerald-600' : 'text-slate-400'}>
              {isReceiving ? 'Demodulating...' : receivedCode ? 'DATA RECEIVED SUCCESS' : 'Waiting for carrier...'}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-slate-50 pt-1">
            <span className="text-gray-400 text-[8.5px]">Parsed HEX:</span>
            <span className="font-mono text-[9px] text-[#111827] bg-slate-100 px-1 py-0.5 rounded">
              {receivedCode ? receivedCode : '0x------'}
            </span>
          </div>

          <div className="flex flex-col border-t border-slate-50 pt-1">
            <span className="text-gray-400 text-[8px] mb-0.5">Parsed Binary:</span>
            <span className="font-mono text-[8px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
              {receivedCode ? irKeyCodes[selectedKey].binary : '00000000 00000000 00000000'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

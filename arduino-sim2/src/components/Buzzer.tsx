import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio, Settings, Activity } from 'lucide-react';

export default function Buzzer() {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(2300); // Standard piezo buzzer peak frequency: 2300Hz
  const [volume, setVolume] = useState<number>(60); // Volume percentage

  // Web Audio refs for safe lifecycle management
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Initialize and start audio synthesiser
  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      // Resume context if suspended (browser security policy response)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Safeguard: Stop any prior oscillator node
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
        oscRef.current.disconnect();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      // For authentic, mechanical buzzer tone we use a "square" wave,
      // simulating standard piezo harmonic overdrive!
      osc.type = 'square';
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

      // Map scale. Set a sensible gain ceiling to preserve hearing
      const outputGain = isMuted ? 0 : (volume / 100) * 0.05;
      gain.gain.setValueAtTime(outputGain, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Web Audio Context not permitted or supported yet:', e);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
  };

  // Keep AudioNode properties in sync with state
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency]);

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      const outputGain = isMuted ? 0 : (volume / 100) * 0.05;
      gainRef.current.gain.setValueAtTime(outputGain, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Sync state or cleanup on unmount
  useEffect(() => {
    if (isActive) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isActive]);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[400px] w-[250px] relative transition-all hover:shadow-md group" id="piezo-buzzer-card">
      {/* Name and Meta */}
      <div className="w-full text-center mb-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
          Acoustic Transducer
        </span>
        <h3 className="font-sans font-bold text-gray-800 mt-2 text-sm">Active Buzzer</h3>
        <p className="text-[11px] text-gray-400 font-medium font-mono">Piezoelectric 3V - 12V DC</p>
      </div>

      {/* Visual representation of Piezo top view with output waves */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-2 w-full h-[185px] select-none">
        
        {/* Dynamic Wave Ripple Rings radiating from the central hole */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
            {/* Dynamic sounding concentric rings */}
            <div className="absolute w-[80px] h-[80px] rounded-full border-2 border-rose-500/20 animate-ping" />
            <div className="absolute w-[125px] h-[125px] rounded-full border border-rose-400/15 animate-ping [animation-delay:0.3s]" />
            <div className="absolute w-[165px] h-[165px] rounded-full border border-rose-300/10 animate-ping [animation-delay:0.6s]" />
          </div>
        )}

        {/* Live Audio Volume and Mute Indicators */}
        <div className="absolute top-[3px] w-full bg-slate-950 border border-slate-800/80 rounded-md py-1.5 px-2 flex items-center justify-between text-[8px] font-mono text-zinc-300">
          <span className="text-zinc-500 font-extrabold flex items-center gap-0.5">
            <Radio className={`w-2.5 h-2.5 ${isActive ? 'text-rose-500 animate-pulse' : 'text-zinc-650'}`} /> OSC OUT:
          </span>
          <span className={`${isActive ? 'text-rose-400 font-bold animate-pulse' : 'text-zinc-500'}`}>
            {isActive ? `${frequency} Hz Beep` : 'Silent'}
          </span>
        </div>

        {/* Round Piezo Buzzer SVG Render */}
        <svg 
          width="150" 
          height="145" 
          viewBox="0 0 150 145" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 filter drop-shadow-sm select-none transition-transform duration-100 ${
            isActive ? 'animate-bounce [animation-duration:120ms]' : ''
          }`}
        >
          <defs>
            {/* Dark cylindrical casing top-contour gradient */}
            <radialGradient id="buzzerBody" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#4b5563" />  {/* grey top highlight */}
              <stop offset="65%" stopColor="#1f2937" /> {/* charcoal casing */}
              <stop offset="100%" stopColor="#111827" /> {/* pure pitch black */}
            </radialGradient>

            {/* Inner glowing metallic brass piezo element */}
            <radialGradient id="piezoBrass" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />  {/* goldish shine */}
              <stop offset="60%" stopColor="#ca8a04" /> {/* burnished brass */}
              <stop offset="100%" stopColor="#854d0e" /> {/* dark bronze */}
            </radialGradient>
            
            {/* High contract glare specular */}
            <linearGradient id="glareSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* TWO LEADS EMERGING DOWN (Underneath the main body circle) */}
          {/* POSITIVE PIN LEAD (Left, y=105 to y=140) */}
          <line 
            x1="45" y1="95" x2="45" y2="136" 
            stroke="#94a3b8" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'pos' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('pos')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* NEGATIVE PIN LEAD (Right, y=105 to y=140) */}
          <line 
            x1="105" y1="95" x2="105" y2="136" 
            stroke="#94a3b8" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            className={`cursor-pointer transition-all ${hoveredTerminal === 'neg' ? 'stroke-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : ''}`}
            onMouseEnter={() => setHoveredTerminal('neg')}
            onMouseLeave={() => setHoveredTerminal(null)}
          />

          {/* MAIN CHARCOAL CIRCULAR CASING */}
          <circle 
            cx="75" 
            cy="65" 
            r="54" 
            fill="url(#buzzerBody)" 
            stroke="#0f172a" 
            strokeWidth="1.5" 
          />

          {/* Outer Ring boundary overlay for 3D depth */}
          <circle cx="75" cy="65" r="49" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" />

          {/* BRASS METAL PIEZO DIAPHRAGM (Inside the central opening pit) */}
          <circle cx="75" cy="65" r="14" fill="url(#piezoBrass)" stroke="#451a03" strokeWidth="1.2" />

          {/* Central Black air acoustic orifice hole */}
          <circle cx="75" cy="65" r="9" fill="#09090b" />

          {/* POLARITY LABELED CIRCLES (Matches physical reference perfectly) */}
          {/* Left (+) indicator */}
          <g opacity="0.85">
            <circle cx="45" cy="90" r="7.5" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            {/* Plus glyph */}
            <line x1="41.5" y1="90" x2="48.5" y2="90" stroke="#f8fafc" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="45" y1="86.5" x2="45" y2="93.5" stroke="#f8fafc" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Right (-) indicator */}
          <g opacity="0.85">
            <circle cx="105" cy="90" r="7.5" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            {/* Minus glyph */}
            <line x1="101.5" y1="90" x2="108.5" y2="90" stroke="#f8fafc" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Light Glare sheen mapping */}
          <circle cx="75" cy="65" r="54" fill="url(#glareSheen)" pointerEvents="none" />

          {/* Connection terminal target hover squares */}
          {hoveredTerminal === 'pos' && (
            <rect x="40" y="131" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
          {hoveredTerminal === 'neg' && (
            <rect x="100" y="131" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
          )}
        </svg>

        {/* Hover/Terminal Info Indicators */}
        {hoveredTerminal && (
          <div className="absolute top-[138px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9.5px] font-bold py-1 px-2.5 rounded-md shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center gap-0.5 animate-bounce">
            <span className={hoveredTerminal === 'pos' ? 'text-rose-400 font-extrabold text-[9px]' : 'text-zinc-400 font-extrabold text-[9px]'}>
              {hoveredTerminal === 'pos' ? 'POSITIVE PIN (+ / LONG LEG)' : 'NEGATIVE PIN (- / SHORT LEG)'}
            </span>
            <span className="text-[8px] text-zinc-350">
              {hoveredTerminal === 'pos' 
                ? 'External positive bias rail input (Recommended 5V - 12V DC)' 
                : 'Common ground node return return path (0V)'}
            </span>
          </div>
        )}
      </div>

      {/* Buzzer Simulation panel Dashboard */}
      <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5 mt-auto">
        
        {/* Trigger Toggle */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
          <span className="text-[10px] uppercase tracking-wider text-slate-450 font-extrabold flex items-center gap-1">
            <Activity className="w-3 h-3 text-rose-500" /> Sonic State
          </span>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-2.5 py-1 rounded text-[10px] uppercase font-extrabold cursor-pointer border transition-all ${
              isActive 
                ? 'bg-rose-500 text-white border-rose-600 shadow-md animate-pulse' 
                : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isActive ? 'Beep ON 🔊' : 'Beep OFF 🔇'}
          </button>
        </div>

        {/* Volume slider with active audio mute state */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-150 justify-between">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-rose-500" />}
          </button>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between text-[7px] text-gray-400 font-extrabold uppercase mb-0.5">
              <span>Buzzer Volume</span>
              <span>{isMuted ? 'Muted' : `${volume}%`}</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={volume}
              disabled={isMuted}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full accent-rose-600 h-1 bg-slate-200 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Adjusting Piezo mechanical Frequency */}
        <div className="flex flex-col mt-0.5">
          <div className="flex justify-between text-[7px] text-gray-450 font-extrabold uppercase mb-0.5">
            <span>Acoustic Pitch</span>
            <span className="font-mono text-zinc-700">{frequency} Hz</span>
          </div>
          <input 
            type="range"
            min="600"
            max="4000"
            step="50"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full accent-slate-700 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[6px] text-gray-400 mt-0.5">
            <span>600Hz (Bass)</span>
            <button 
              onClick={() => setFrequency(2300)} 
              className="text-[6.5px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 transition-colors"
            >
              <Settings className="w-1.5 h-1.5" /> Nominal (2300Hz)
            </button>
            <span>4kHz (Treble)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

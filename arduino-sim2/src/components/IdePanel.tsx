import React, { useEffect, useState, useRef } from 'react';
import { Play, Square, Code, Cpu, Terminal, Sparkles, RefreshCw } from 'lucide-react';
import { SimProgram, SIM_PROGRAMS } from '../types/index';

interface IdePanelProps {
  currentProgram: SimProgram;
  onSelectProgram: (prog: SimProgram) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onResetAndUpload: () => void;
  tickCounter: number;
  pinVoltages: { [pinId: string]: number };
}

export default function IdePanel({
  currentProgram,
  onSelectProgram,
  isRunning,
  onToggleRunning,
  onResetAndUpload,
  tickCounter,
  pinVoltages
}: IdePanelProps) {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Synchronize console logs to mock execution of the selected program
  useEffect(() => {
    if (!isRunning) {
      setConsoleLogs(prev => [...prev, '⚡ Simulation Standby.']);
      return;
    }

    if (tickCounter === 0) {
      setConsoleLogs([
        '🚀 Compiling Sketch...',
        '📦 Archiving objects...',
        '🔗 Linking libraries...',
        `💾 Sketch uses 944 bytes (2%) of program storage space. Maximum is 32256 bytes.`,
        `📟 Global variables use 9 bytes (0%) of dynamic memory.`,
        '🔌 Uploading code to ATmega328P...',
        '✅ Upload complete. Initializing serial channel...'
      ]);
      return;
    }

    // Format output logs depending on program
    let logMsg = '';
    if (currentProgram.id === 'blink_13') {
      const isHigh = (pinVoltages['pin_13'] ?? 0) > 3;
      logMsg = `[Tick ${tickCounter}] Pin 13 State set to: ${isHigh ? 'HIGH (5.0V)' : 'LOW (0.0V)'}`;
    } else if (currentProgram.id === 'knight_rider') {
      const activePins = Object.keys(pinVoltages).filter(pinId => pinVoltages[pinId] > 3 && pinId.startsWith('pin_'));
      const activeNames = activePins.map(p => p.replace('pin_', ''));
      logMsg = `[Scanner Loop] Active Node Level PWM ➔ [Pin ${activeNames.join(', ')}] HIGH`;
    } else if (currentProgram.id === 'pwm_fade') {
      const pin9v = (pinVoltages['pin_9'] ?? 0).toFixed(2);
      const pin11v = (pinVoltages['pin_11'] ?? 0).toFixed(2);
      logMsg = `[PWM Engine] Modulating Out ➔ Pin 9: ${pin9v}V | Pin 11: ${pin11v}V`;
    } else if (currentProgram.id === 'serial_monitor') {
      const sensorV = pinVoltages['pin_a0'] ?? 2.5;
      const adcVal = Math.round((sensorV / 5.0) * 1023);
      logMsg = `[Serial Port 9600] Sensor Read: A0 ➔ ADC: ${adcVal} | Voltage: ${sensorV.toFixed(2)}V`;
    }

    if (logMsg) {
      setConsoleLogs(prev => {
        const next = [...prev, logMsg];
        // Limit logs to keep system speedy
        if (next.length > 100) next.shift();
        return next;
      });
    }
  }, [tickCounter, isRunning, currentProgram.id]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const clearConsole = () => {
    setConsoleLogs(['🧹 Console cleared. Ready.']);
  };

  return (
    <div className="flex flex-col bg-[#1e293b] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl w-full h-[540px]">
      {/* IDE Top Bar */}
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="text-emerald-400 w-5 h-5" />
          <span className="text-slate-200 font-semibold text-sm tracking-tight">Onboard MCU Sketch Explorer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Program Selector Toolbar */}
      <div className="bg-[#111827] px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Cpu className="text-slate-400 w-4 h-4" />
          <select
            value={currentProgram.id}
            onChange={(e) => {
              const selected = SIM_PROGRAMS.find(p => p.id === e.target.value);
              if (selected) {
                onSelectProgram(selected);
              }
            }}
            className="bg-slate-800 text-slate-100 text-xs font-medium py-1 px-2.5 rounded border border-slate-700 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {SIM_PROGRAMS.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRunning}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold select-none transition-colors duration-150 ${
              isRunning
                ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-655/30 border border-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                Run
              </>
            )}
          </button>

          <button
            onClick={onResetAndUpload}
            className="flex items-center gap-1 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white px-3 py-1 rounded text-xs font-semibold border border-slate-700 select-none transition-colors duration-150"
            title="Reload, Compile and Upload default sketch"
          >
            <RefreshCw className="w-3 h-3" />
            Upload
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="flex-1 bg-[#1e2530] p-4 font-mono text-[11px] text-emerald-300 overflow-y-auto border-b border-slate-800 relative select-text selection:bg-slate-650 selection:text-white">
        <div className="absolute right-3 top-3 text-[10px] text-slate-500 font-sans tracking-tight pointer-events-none flex items-center gap-1 bg-slate-900/60 py-1 px-2 rounded backdrop-blur">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Arduino C++ Code (Read-Only Preview)
        </div>
        
        {currentProgram.code.split('\n').map((line, idx) => (
          <div key={idx} className="flex leading-relaxed">
            <span className="w-8 text-slate-500 text-right pr-3 select-none text-[10px] opacity-75">{idx + 1}</span>
            <pre className="flex-1 text-[#e2e8f0] font-mono">
              {line.replace(
                /(void|int|float|setup|loop|pinMode|digitalWrite|delay|analogWrite|analogRead|Serial|begin|print|println)/g,
                (m) => `<span class="text-emerald-400 font-semibold">${m}</span>`
              ).replace(
                /(OUTPUT|HIGH|LOW|INPUT|A0)/g,
                (m) => `<span class="text-amber-400 font-semibold">${m}</span>`
              ).replace(
                /(\/\/.*)/g,
                (m) => `<span class="text-slate-500 italic">${m}</span>`
              )}
            </pre>
          </div>
        ))}
      </div>

      {/* Compiler / Serial Port Logs */}
      <div className="h-[160px] bg-[#0b0f19] border-t border-slate-800 flex flex-col font-mono text-[11px]">
        {/* Terminal Header */}
        <div className="bg-[#0c111d] px-3 py-1.5 border-b border-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            Serial Monitor / Compiler Output (COM3)
          </div>
          <button 
            onClick={clearConsole}
            className="text-[10px] text-slate-500 hover:text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
          >
            Clear
          </button>
        </div>

        {/* Scrollable logs */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 text-slate-400 leading-normal select-text selection:bg-slate-700/60 selection:text-white">
          {consoleLogs.map((log, i) => {
            let color = 'text-slate-400';
            if (log.startsWith('🚀') || log.startsWith('✅') || log.startsWith('🔌')) {
              color = 'text-green-400 font-semibold';
            } else if (log.startsWith('[Tick') || log.startsWith('[Scanner')) {
              color = 'text-sky-300';
            } else if (log.startsWith('🧹') || log.startsWith('⚡')) {
              color = 'text-amber-400/80';
            } else if (log.startsWith('💾')) {
              color = 'text-slate-500';
            }
            return (
              <div key={i} className={`${color} tracking-wide`}>
                {log}
              </div>
            );
          })}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}

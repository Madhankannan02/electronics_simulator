import React from 'react';
import { PinConfig, BoardComponent } from '../types/index';
import { RadioReceiver, AlertCircle, Cpu, Zap, Activity, Info, Sliders } from 'lucide-react';

interface PinInspectorProps {
  selectedPin: PinConfig | null;
  selectedComponent: BoardComponent | null;
  pinVoltages: { [pinId: string]: number };
  onManualAnalogInput: (pinId: string, val: number) => void;
}

export default function PinInspector({
  selectedPin,
  selectedComponent,
  pinVoltages,
  onManualAnalogInput
}: PinInspectorProps) {
  
  // Render component view if a component is selected
  if (selectedComponent) {
    return (
      <div className="bg-[#1e293b] border border-slate-705/60 rounded-2xl p-5 text-slate-200 flex flex-col justify-between h-[540px] shadow-xl">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-700/60">
            <Cpu className="text-amber-400 w-6 h-6 animate-pulse" />
            <div>
              <h3 className="font-semibold text-slate-100 text-base">{selectedComponent.name}</h3>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Board Module</span>
            </div>
          </div>

          {/* Body */}
          <p className="text-slate-300 text-xs leading-relaxed mt-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            {selectedComponent.description}
          </p>

          <div className="mt-5 space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Specifications & Mechanics</h4>
            <ul className="space-y-2">
              {selectedComponent.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-405 flex items-center gap-1.5 opacity-80">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Click on other black headers or golden chips to inspect them.</span>
        </div>
      </div>
    );
  }

  // Render Pin View if a pin is selected (or default starting guide)
  return (
    <div className="bg-[#1e293b] border border-slate-705/60 rounded-2xl p-5 text-slate-200 flex flex-col justify-between h-[540px] shadow-xl">
      {selectedPin ? (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-700/60">
              <Zap className={`w-6 h-6 ${selectedPin.voltage > 1 ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
              <div>
                <h3 className="font-semibold text-slate-100 text-base">Pin {selectedPin.name}</h3>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  {selectedPin.type} {selectedPin.isPWM ? '➔ PWM Capable' : ''}
                </span>
              </div>
            </div>

            {/* Description detail */}
            <p className="text-slate-300 text-xs leading-relaxed mt-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              {selectedPin.hoverInfo}
            </p>

            {/* Simulated electrical readings */}
            <div className="mt-5 space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                Live Electrical Oscilloscope
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* Voltage Box */}
                <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-805 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Voltage</div>
                  <div className="text-2xl font-mono text-amber-400 font-bold mt-1">
                    {(pinVoltages[selectedPin.id] ?? 0).toFixed(2)}V
                  </div>
                </div>

                {/* State level indicator */}
                <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-805 text-center flex flex-col justify-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Signal</div>
                  <div className="mt-1 font-mono font-bold text-sm">
                    {(pinVoltages[selectedPin.id] ?? 0) > 2.5 ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">HIGH</span>
                    ) : (
                      <span className="text-slate-404 bg-slate-700/20 px-2 py-0.5 rounded border border-slate-700/50">LOW</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Analog manual overrides (e.g. for analog input pins) */}
              {selectedPin.id === 'pin_a0' && (
                <div className="mt-4 p-3.5 bg-sky-950/20 border border-sky-500/25 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sliders className="w-4 h-4 text-sky-450" />
                    <span className="text-xs font-semibold text-slate-200">Simulate Sensor Input (A0)</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 mb-3 leading-normal">
                    Adjust this slider to inject a live external voltage into A0. Run the &quot;Analog Sensor Read&quot; sketch next door to see the live results!
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={pinVoltages[selectedPin.id] ?? 0}
                      onChange={(e) => onManualAnalogInput(selectedPin.id, parseFloat(e.target.value))}
                      className="flex-1 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold bg-slate-900 px-2 py-0.5 rounded text-sky-305">
                      {(pinVoltages[selectedPin.id] ?? 0).toFixed(1)}V
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manual Pin Injector Guide */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-[10.5px] text-slate-400 leading-normal flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <span>
              If you run a program, pin values are controlled by the code logic. If stopped, pins default back to their baseline voltage levels.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center mb-4">
            <RadioReceiver className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm">Interactive Inspector Ready</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-[220px] leading-relaxed">
            Click on any header pin socket or solder joint on the beautiful board representation to inspect live electrical telemetry!
          </p>
        </div>
      )}

      {/* Footer layout */}
      {selectedPin && (
        <div className="pt-3 border-t border-slate-800 mt-4 text-[10px] text-slate-500 text-center select-none">
          Click any board module or IC to view schematic features.
        </div>
      )}
    </div>
  );
}

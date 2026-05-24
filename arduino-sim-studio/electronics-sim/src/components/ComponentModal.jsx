import React, { useState } from 'react';
import { COMPONENT_DEFINITIONS, BAND_COLORS, LED_COLORS } from '../data/componentDefs';

export default function ComponentModal({ component, onClose, onSave }) {
  const [props, setProps] = useState({ ...component.props });
  const def = COMPONENT_DEFINITIONS.find(d => d.type === component.type);

  const update = (key, val) => setProps(p => ({ ...p, [key]: val }));

  const handleSave = () => onSave(component.id, props);

  const renderContent = () => {
    switch (component.type) {
      case 'led': return <LEDConfig props={props} update={update} />;
      case 'resistor': return <ResistorConfig props={props} update={update} />;
      case 'pushbutton': return <PushbuttonConfig props={props} update={update} />;
      case 'potentiometer': return <PotentiometerConfig props={props} update={update} />;
      case 'capacitor_ceramic': return <CeramicCapConfig props={props} update={update} />;
      case 'capacitor_electrolytic': return <ElectrolyticCapConfig props={props} update={update} />;
      case 'diode': return <DiodeConfig props={props} update={update} />;
      case 'zener': return <ZenerConfig props={props} update={update} />;
      case 'inductor': return <InductorConfig props={props} update={update} />;
      case 'buzzer': return <BuzzerConfig props={props} update={update} />;
      case 'battery': return <BatteryConfig props={props} update={update} />;
      case 'photoresistor': return <PhotoresistorConfig props={props} update={update} />;
      case 'ir_sensor': return <IRSensorConfig props={props} update={update} />;
      case 'ultrasonic': return <UltrasonicConfig props={props} update={update} />;
      case 'hcsr04': return <HCSr04Config props={props} update={update} />;
      case 'arduino': return <ArduinoConfig props={props} update={update} />;
      default: return <div style={{ color: '#64748b', fontSize: 12 }}>No configuration available.</div>;
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111318',
          border: '1px solid #1e2433',
          borderRadius: 12,
          width: 460,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #1e2433',
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#0d0f14',
        }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 8,
            background: (def?.color || '#334155') + '22',
            border: `1px solid ${def?.color || '#334155'}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            {def?.icon || '⚡'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
              {def?.label || component.type}
            </div>
            <div style={{ fontSize: 10, color: '#475569' }}>{def?.description}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'none', border: 'none',
              color: '#475569', fontSize: 18, cursor: 'pointer',
              padding: '4px 8px', borderRadius: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {renderContent()}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #1e2433',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              background: 'transparent',
              border: '1px solid #1e2433',
              borderRadius: 6,
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 18px',
              background: '#1d4ed8',
              border: '1px solid #2563eb',
              borderRadius: 6,
              color: 'white',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI primitives ───────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 9, fontWeight: 700, color: '#475569',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: 10, paddingBottom: 6,
        borderBottom: '1px solid #1e2433',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SliderRow({ label, min, max, step = 1, value, onChange, unit = '', format }) {
  const display = format ? format(value) : `${value}${unit}`;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'monospace', fontWeight: 600 }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#2563eb' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#334155', marginTop: 2 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange, onLabel = 'ON', offLabel = 'OFF' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          padding: '4px 14px',
          borderRadius: 20,
          border: 'none',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 700,
          background: value ? '#166534' : '#1e2433',
          color: value ? '#4ade80' : '#475569',
          transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}
      >
        {value ? onLabel : offLabel}
      </button>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: '#0d0f14',
      border: '1px solid #1e2433',
      borderRadius: 6,
      padding: '8px 12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    }}>
      <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ─── Per-component config forms ─────────────────────────────────────────────

function LEDConfig({ props, update }) {
  const { color = '#ef4444', brightness = 80, on = true } = props;
  const fmtV = (v) => `${(v * 3.5 / 100).toFixed(2)}V`;

  return (
    <>
      <Section title="LED State">
        <ToggleRow label="Power" value={on} onChange={v => update('on', v)} onLabel="ON ●" offLabel="OFF ○" />
        <SliderRow label="Brightness (PWM)" min={0} max={100} value={brightness} onChange={v => update('brightness', v)} unit="%" />
        <StatCard label="Forward Voltage" value={`~2.1V`} />
        <StatCard label="If forward current" value={`${Math.round(brightness * 0.2)}mA`} />
      </Section>
      <Section title="LED Color">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {LED_COLORS.map(c => (
            <button
              key={c.hex}
              onClick={() => update('color', c.hex)}
              title={c.name}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 4px',
                background: color === c.hex ? '#1e2a3a' : '#0d0f14',
                border: `2px solid ${color === c.hex ? c.hex : '#1e2433'}`,
                borderRadius: 8, cursor: 'pointer',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: c.hex,
                boxShadow: `0 0 8px ${c.glow}`,
              }} />
              <span style={{ fontSize: 9, color: '#64748b', fontFamily: 'inherit' }}>{c.name}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 10, color: '#64748b' }}>Custom hex: </span>
          <input
            type="color"
            value={color}
            onChange={e => update('color', e.target.value)}
            style={{ marginLeft: 8, cursor: 'pointer', width: 50, height: 24, border: 'none', borderRadius: 4 }}
          />
          <span style={{ fontSize: 10, color: '#475569', marginLeft: 8, fontFamily: 'monospace' }}>{color}</span>
        </div>
      </Section>
    </>
  );
}

function ResistorConfig({ props, update }) {
  const { band1 = 'brown', band2 = 'black', band3 = 'red', band4 = 'gold' } = props;
  const ohmValue = (BAND_COLORS[band1]?.value || 1) * 10 + (BAND_COLORS[band2]?.value || 0);
  const total = ohmValue * (BAND_COLORS[band3]?.multiplier || 100);
  const fmt = v => v >= 1e6 ? `${(v/1e6).toFixed(1)} MΩ` : v >= 1000 ? `${(v/1000).toFixed(1)} kΩ` : `${v} Ω`;
  const band1Options = ['brown','red','orange','yellow','green','blue','violet','white'];
  const band2Options = ['black','brown','red','orange','yellow','green','violet','white'];
  const band3Options = ['black','brown','red','orange','yellow','green','blue'];
  const band4Options = ['gold','silver','brown'];

  const BandSelect = ({ label, value, options, onChange }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px',
              background: value === opt ? '#1e2a3a' : '#0d0f14',
              border: `1px solid ${value === opt ? (BAND_COLORS[opt]?.color || '#334155') : '#1e2433'}`,
              borderRadius: 4, cursor: 'pointer', fontSize: 9, color: '#94a3b8',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 2, background: BAND_COLORS[opt]?.color || '#000', border: '1px solid #475569' }} />
            {BAND_COLORS[opt]?.label?.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Section title="Color Bands">
        <BandSelect label="Band 1 (1st digit)" value={band1} options={band1Options} onChange={v => update('band1', v)} />
        <BandSelect label="Band 2 (2nd digit)" value={band2} options={band2Options} onChange={v => update('band2', v)} />
        <BandSelect label="Band 3 (Multiplier)" value={band3} options={band3Options} onChange={v => update('band3', v)} />
        <BandSelect label="Band 4 (Tolerance)" value={band4} options={band4Options} onChange={v => update('band4', v)} />
      </Section>
      <Section title="Calculated Value">
        <StatCard label="Resistance" value={fmt(total)} />
        <StatCard label="Tolerance" value={BAND_COLORS[band4]?.tolerance || '±5%'} />
      </Section>
    </>
  );
}

function PushbuttonConfig({ props, update }) {
  const { pressed = false } = props;
  return (
    <Section title="Switch State">
      <ToggleRow label="Button State" value={pressed} onChange={v => update('pressed', v)} onLabel="CLOSED (HIGH)" offLabel="OPEN (LOW)" />
      <StatCard label="Contact Resistance (closed)" value="0 Ω" />
      <StatCard label="Contact Resistance (open)" value="∞ Ω" />
      <StatCard label="Rated Voltage" value="12V DC" />
      <div style={{ marginTop: 10, padding: '8px 12px', background: '#0d1117', border: '1px solid #1e2433', borderRadius: 6, fontSize: 10, color: '#475569', lineHeight: 1.6 }}>
        Pins 1A & 1B are internally joined (side A). Pins 2A & 2B are internally joined (side B). Press button to bridge A to B.
      </div>
    </Section>
  );
}

function PotentiometerConfig({ props, update }) {
  const { value = 50 } = props;
  const resistance = Math.round((value / 100) * 10000);
  const voltage = ((value / 100) * 5).toFixed(2);
  return (
    <>
      <Section title="Wiper Position">
        <SliderRow label="Dial Position" min={0} max={100} value={value} onChange={v => update('value', Math.round(v))} unit="%" />
      </Section>
      <Section title="Electrical State">
        <StatCard label="Wiper Resistance" value={resistance >= 1000 ? `${(resistance/1000).toFixed(2)} kΩ` : `${resistance} Ω`} />
        <StatCard label="Simulated Vout" value={`${voltage} V`} />
        <StatCard label="Max Resistance" value="10 kΩ" />
        <StatCard label="Taper" value="Linear (B)" />
      </Section>
    </>
  );
}

function CeramicCapConfig({ props, update }) {
  const { voltage = 0 } = props;
  return (
    <>
      <Section title="Capacitor Info">
        <StatCard label="Capacitance" value="100 nF" />
        <StatCard label="Code" value="104" />
        <StatCard label="Type" value="Non-polarized" />
        <StatCard label="Dielectric" value="X7R Ceramic" />
      </Section>
      <Section title="Simulated Charge">
        <SliderRow label="Stored Voltage" min={0} max={5} step={0.1} value={voltage} onChange={v => update('voltage', parseFloat(v.toFixed(1)))} unit="V" />
        <StatCard label="Stored Energy" value={`${(0.5 * 100e-9 * voltage * voltage * 1e6).toFixed(2)} µJ`} />
      </Section>
    </>
  );
}

function ElectrolyticCapConfig({ props, update }) {
  const { capacitance = 100, voltage = 0 } = props;
  const capOptions = [10, 47, 100, 470, 1000];
  return (
    <>
      <Section title="Capacitance">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {capOptions.map(v => (
            <button
              key={v}
              onClick={() => update('capacitance', v)}
              style={{
                padding: '5px 12px', fontSize: 11, fontFamily: 'monospace',
                background: capacitance === v ? '#1e3a5f' : '#0d0f14',
                border: `1px solid ${capacitance === v ? '#2563eb' : '#1e2433'}`,
                borderRadius: 5, cursor: 'pointer', color: capacitance === v ? '#60a5fa' : '#475569',
              }}
            >
              {v}µF
            </button>
          ))}
        </div>
      </Section>
      <Section title="Charge Simulation">
        <SliderRow label="Stored Voltage" min={0} max={24} step={0.5} value={voltage} onChange={v => update('voltage', parseFloat(v.toFixed(1)))} unit="V" />
        {voltage > 16 && (
          <div style={{ padding: '8px 12px', background: '#2d0f0f', border: '1px solid #5a1a1a', borderRadius: 6, fontSize: 10, color: '#f87171', marginBottom: 8 }}>
            ⚠ WARNING: Rated voltage (16V) exceeded! Risk of failure or swelling!
          </div>
        )}
        <StatCard label="Capacitance" value={`${capacitance} µF`} />
        <StatCard label="Rated Voltage" value="16V Max" />
      </Section>
    </>
  );
}

function DiodeConfig({ props, update }) {
  const { inputVoltage = 0 } = props;
  const conducting = inputVoltage > 0.7;
  const current = conducting ? ((inputVoltage - 0.7) * 40).toFixed(1) : '0.0';
  return (
    <>
      <Section title="Bias Voltage">
        <SliderRow label="Applied Voltage (Vin)" min={-10} max={10} step={0.5} value={inputVoltage} onChange={v => update('inputVoltage', parseFloat(v.toFixed(1)))} unit="V" />
      </Section>
      <Section title="Diode State">
        <div style={{
          padding: '8px 12px',
          background: conducting ? '#0d2a0d' : '#0d0f14',
          border: `1px solid ${conducting ? '#16a34a' : '#1e2433'}`,
          borderRadius: 6, marginBottom: 8,
          fontSize: 11, fontWeight: 600,
          color: conducting ? '#4ade80' : '#64748b',
          textAlign: 'center',
        }}>
          {conducting ? '⚡ CONDUCTING (ON)' : '🛡 BLOCKING (OFF)'}
        </div>
        <StatCard label="Forward Drop" value="~0.70 V" />
        <StatCard label="Diode Current" value={`${current} mA`} />
        <StatCard label="Max Reverse Voltage" value="1000V (VRRM)" />
      </Section>
    </>
  );
}

function ZenerConfig({ props, update }) {
  const { zenerVoltage = 5.1, inputVoltage = 0 } = props;
  const vzOptions = [3.3, 4.7, 5.1, 6.8];
  const inBreakdown = Math.abs(inputVoltage) >= zenerVoltage && inputVoltage < 0;
  const inForward = inputVoltage > 0.7;
  return (
    <>
      <Section title="Zener Voltage">
        <div style={{ display: 'flex', gap: 8 }}>
          {vzOptions.map(v => (
            <button
              key={v}
              onClick={() => update('zenerVoltage', v)}
              style={{
                padding: '6px 12px', fontSize: 11, fontFamily: 'monospace',
                background: zenerVoltage === v ? '#3f2800' : '#0d0f14',
                border: `1px solid ${zenerVoltage === v ? '#d97706' : '#1e2433'}`,
                borderRadius: 5, cursor: 'pointer', color: zenerVoltage === v ? '#fbbf24' : '#475569',
              }}
            >
              {v}V
            </button>
          ))}
        </div>
      </Section>
      <Section title="Bias Simulation">
        <SliderRow label="Applied Voltage (Vin)" min={-10} max={10} step={0.5} value={inputVoltage} onChange={v => update('inputVoltage', parseFloat(v.toFixed(1)))} unit="V" />
        <div style={{
          padding: '8px 12px', borderRadius: 6, marginBottom: 8,
          background: inBreakdown ? '#0d1f3a' : inForward ? '#0d2a0d' : '#0d0f14',
          border: `1px solid ${inBreakdown ? '#2563eb' : inForward ? '#16a34a' : '#1e2433'}`,
          fontSize: 11, fontWeight: 600, textAlign: 'center',
          color: inBreakdown ? '#60a5fa' : inForward ? '#4ade80' : '#64748b',
        }}>
          {inBreakdown ? '🔥 ZENER BREAKDOWN' : inForward ? '⚡ Forward Conducting' : '🛡 Reverse Blocking'}
        </div>
        <StatCard label="Clamped Vout" value={inBreakdown ? `-${zenerVoltage}V` : inForward ? '0.70V' : `${inputVoltage.toFixed(1)}V`} />
      </Section>
    </>
  );
}

function InductorConfig({ props, update }) {
  const { inductance = 150, frequency = 10000 } = props;
  const lH = inductance * 1e-6;
  const reactance = 2 * Math.PI * frequency * lH;
  const fmtR = r => r >= 1000 ? `${(r/1000).toFixed(2)} kΩ` : `${r.toFixed(1)} Ω`;
  const fmtF = f => f >= 1000 ? `${(f/1000).toFixed(0)} kHz` : `${f} Hz`;
  return (
    <>
      <Section title="Inductor Parameters">
        <SliderRow label="Inductance" min={10} max={1000} step={10} value={inductance} onChange={v => update('inductance', Math.round(v))} unit=" µH" />
        <SliderRow label="AC Frequency" min={100} max={50000} step={100} value={frequency} onChange={v => update('frequency', Math.round(v))} format={fmtF} />
      </Section>
      <Section title="Calculated Values">
        <StatCard label="Reactance (XL)" value={fmtR(reactance)} />
        <StatCard label="Formula" value="XL = 2πfL" />
        <StatCard label="Peak current (5V)" value={`${((5 / Math.max(0.01, reactance)) * 1000).toFixed(1)} mA`} />
      </Section>
    </>
  );
}

function BuzzerConfig({ props, update }) {
  const { frequency = 2300, volume = 60, active = false } = props;
  return (
    <>
      <Section title="Buzzer Control">
        <ToggleRow label="Sonic State" value={active} onChange={v => update('active', v)} onLabel="BEEP ON 🔊" offLabel="SILENT 🔇" />
        <SliderRow label="Volume" min={0} max={100} value={volume} onChange={v => update('volume', Math.round(v))} unit="%" />
        <SliderRow label="Pitch / Frequency" min={600} max={4000} step={50} value={frequency} onChange={v => update('frequency', Math.round(v))} unit=" Hz" />
      </Section>
      <Section title="Specs">
        <StatCard label="Type" value="Active Piezoelectric" />
        <StatCard label="Operating Voltage" value="3V – 12V DC" />
        <StatCard label="Nominal Frequency" value="2300 Hz" />
        <StatCard label="Sound Pressure" value="≥85 dB" />
      </Section>
    </>
  );
}

function BatteryConfig({ props, update }) {
  const { chargePercent = 100 } = props;
  const voltage = (4.8 + (chargePercent / 100) * 4.8).toFixed(2);
  const health = chargePercent > 60 ? { label: 'Excellent', color: '#4ade80' } : chargePercent > 20 ? { label: 'Fair', color: '#fbbf24' } : { label: 'Replace', color: '#f87171' };
  return (
    <>
      <Section title="Battery Charge">
        <SliderRow label="Charge Level" min={0} max={100} value={chargePercent} onChange={v => update('chargePercent', Math.round(v))} unit="%" />
      </Section>
      <Section title="Battery State">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: '#64748b' }}>Health</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: health.color }}>{health.label}</span>
        </div>
        <StatCard label="Open Circuit Voltage" value={`${voltage} V`} />
        <StatCard label="Chemistry" value="Alkaline PP3" />
        <StatCard label="Full Charge" value="9.6V" />
        <StatCard label="Discharged" value="4.8V" />
      </Section>
    </>
  );
}

function PhotoresistorConfig({ props, update }) {
  const { luxValue = 300 } = props;
  const resistance = Math.max(150, Math.round(500000 / (1 + Math.pow(luxValue, 0.9))));
  const voltage = (5.0 * (10000 / (resistance + 10000))).toFixed(2);
  const adc = Math.round((parseFloat(voltage) / 5.0) * 1023);
  const fmtR = r => r >= 1e6 ? `${(r/1e6).toFixed(1)} MΩ` : r >= 1000 ? `${(r/1000).toFixed(1)} kΩ` : `${r} Ω`;
  return (
    <>
      <Section title="Light Environment">
        <SliderRow label="Ambient Light" min={0} max={1000} step={10} value={luxValue} onChange={v => update('luxValue', Math.round(v))} unit=" Lux" />
        <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 4 }}>
          {luxValue < 100 ? '🌙 Dark Room' : luxValue < 600 ? '💡 Indoor Light' : '☀️ Daylight'}
        </div>
      </Section>
      <Section title="Electrical Output">
        <StatCard label="LDR Resistance" value={fmtR(resistance)} />
        <StatCard label="A0 Voltage" value={`${voltage} V`} />
        <StatCard label="ADC Reading" value={`${adc} / 1023`} />
      </Section>
    </>
  );
}

function IRSensorConfig({ props, update }) {
  const { selectedKey = 'Power' } = props;
  const keys = ['Power', 'Play/Pause', 'Volume Up', 'Volume Down'];
  const codes = {
    'Power': '0x00FF45',
    'Play/Pause': '0x00FF1C',
    'Volume Up': '0x00FF09',
    'Volume Down': '0x00FF15',
  };
  return (
    <>
      <Section title="Remote Key">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {keys.map(k => (
            <button
              key={k}
              onClick={() => update('selectedKey', k)}
              style={{
                padding: '5px 10px', fontSize: 10, fontFamily: 'inherit',
                background: selectedKey === k ? '#1e1f5e' : '#0d0f14',
                border: `1px solid ${selectedKey === k ? '#4f46e5' : '#1e2433'}`,
                borderRadius: 5, cursor: 'pointer', color: selectedKey === k ? '#a5b4fc' : '#475569',
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </Section>
      <Section title="NEC IR Protocol">
        <StatCard label="Selected Key" value={selectedKey} />
        <StatCard label="HEX Code" value={codes[selectedKey]} />
        <StatCard label="Carrier Freq." value="38 kHz" />
        <StatCard label="Protocol" value="NEC (32-bit)" />
      </Section>
    </>
  );
}

function UltrasonicConfig({ props, update }) {
  const { distanceCm = 85 } = props;
  const tof = Math.round(distanceCm * 58.309);
  return (
    <>
      <Section title="Target Distance">
        <SliderRow label="Simulated Distance" min={2} max={300} value={distanceCm} onChange={v => update('distanceCm', Math.round(v))} unit=" cm" />
      </Section>
      <Section title="Calculated Output">
        <StatCard label="Distance" value={`${distanceCm} cm`} />
        <StatCard label="Time of Flight" value={`${tof.toLocaleString()} µs`} />
        <StatCard label="Speed of Sound" value="343 m/s" />
        <StatCard label="pulseIn() duration" value={`${tof} µs`} />
      </Section>
    </>
  );
}

function HCSr04Config({ props, update }) {
  const { distanceCm = 100 } = props;
  const tof = Math.round(distanceCm * 58.31);
  return (
    <>
      <Section title="Sonar Distance">
        <SliderRow label="Simulated Distance" min={2} max={400} value={distanceCm} onChange={v => update('distanceCm', Math.round(v))} unit=" cm" />
      </Section>
      <Section title="Sensor Output">
        <StatCard label="Distance" value={`${distanceCm} cm`} />
        <StatCard label="Echo Pulse Width" value={`${tof.toLocaleString()} µs`} />
        <StatCard label="Range" value="2cm – 400cm" />
        <StatCard label="Accuracy" value="±3mm" />
      </Section>
    </>
  );
}

function ArduinoConfig({ props, update }) {
  const { program = 'Blink' } = props;
  const programs = ['Blink', 'Fade', 'Knight Rider', 'Serial Monitor', 'Analog Read'];
  return (
    <>
      <Section title="Firmware Sketch">
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>Select Active Program:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {programs.map(p => (
              <button
                key={p}
                onClick={() => update('program', p)}
                style={{
                  padding: '7px 12px', textAlign: 'left', fontSize: 11,
                  background: program === p ? '#0d2a1e' : '#0d0f14',
                  border: `1px solid ${program === p ? '#16a34a' : '#1e2433'}`,
                  borderRadius: 5, cursor: 'pointer', color: program === p ? '#4ade80' : '#475569',
                  fontFamily: 'inherit',
                }}
              >
                {program === p ? '▶ ' : '  '}{p}
              </button>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Board Info">
        <StatCard label="MCU" value="ATmega328P" />
        <StatCard label="Clock" value="16 MHz" />
        <StatCard label="Flash" value="32 KB" />
        <StatCard label="I/O Voltage" value="5V" />
        <StatCard label="Analog Pins" value="A0–A5" />
        <StatCard label="Digital Pins" value="D0–D13" />
      </Section>
    </>
  );
}

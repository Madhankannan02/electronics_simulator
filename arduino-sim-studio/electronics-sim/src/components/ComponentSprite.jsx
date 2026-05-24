import React from 'react';
import { BAND_COLORS, LED_COLORS } from '../data/componentDefs';

export default function ComponentSprite({ comp, selected }) {
  const selStyle = selected ? {
    outline: '2px solid #f59e0b',
    outlineOffset: 3,
    borderRadius: 4,
  } : {};

  switch (comp.type) {
    case 'arduino': return <ArduinoSprite comp={comp} selStyle={selStyle} />;
    case 'led': return <LEDSprite comp={comp} selStyle={selStyle} />;
    case 'resistor': return <ResistorSprite comp={comp} selStyle={selStyle} />;
    case 'pushbutton': return <PushbuttonSprite comp={comp} selStyle={selStyle} />;
    case 'potentiometer': return <PotentiometerSprite comp={comp} selStyle={selStyle} />;
    case 'capacitor_ceramic': return <CeramicCapSprite comp={comp} selStyle={selStyle} />;
    case 'capacitor_electrolytic': return <ElectrolyticCapSprite comp={comp} selStyle={selStyle} />;
    case 'diode': return <DiodeSprite comp={comp} selStyle={selStyle} />;
    case 'zener': return <ZenerSprite comp={comp} selStyle={selStyle} />;
    case 'inductor': return <InductorSprite comp={comp} selStyle={selStyle} />;
    case 'buzzer': return <BuzzerSprite comp={comp} selStyle={selStyle} />;
    case 'battery': return <BatterySprite comp={comp} selStyle={selStyle} />;
    case 'photoresistor': return <PhotoresistorSprite comp={comp} selStyle={selStyle} />;
    case 'ir_sensor': return <IRSensorSprite comp={comp} selStyle={selStyle} />;
    case 'ultrasonic': return <UltrasonicSprite comp={comp} selStyle={selStyle} />;
    case 'hcsr04': return <HCSr04Sprite comp={comp} selStyle={selStyle} />;
    default: return <GenericSprite comp={comp} selStyle={selStyle} />;
  }
}

function Label({ text }) {
  return (
    <div style={{
      textAlign: 'center',
      fontSize: 9,
      fontWeight: 700,
      color: '#64748b',
      fontFamily: "'IBM Plex Mono', monospace",
      marginTop: 2,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {text}
    </div>
  );
}

function Wrapper({ children, selStyle, width }) {
  return (
    <div style={{ display: 'inline-block', ...selStyle }}>
      {children}
    </div>
  );
}

function ArduinoSprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="200" height="130" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="196" height="126" rx="5" fill="#1d70b8" stroke="#0f4a80" strokeWidth="1.5"/>
        <rect x="15" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="28" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="41" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="54" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="67" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="80" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="93" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="106" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="119" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="132" y="8" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="15" y="104" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="28" y="104" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="41" y="104" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="54" y="104" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="67" y="104" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="80" y="104" width="6" height="18" rx="1" fill="#0f3a60"/>
        <rect x="80" y="30" width="60" height="60" rx="4" fill="#111827"/>
        <circle cx="110" cy="60" r="18" fill="#222" stroke="#333" strokeWidth="1"/>
        <circle cx="110" cy="60" r="3" fill="#444"/>
        <text x="100" y="98" fill="#60a5fa" fontSize="7" fontFamily="monospace" fontWeight="700">ATmega328P</text>
        <text x="20" y="58" fill="white" fontSize="11" fontFamily="sans-serif" fontWeight="900">ARDUINO</text>
        <text x="20" y="72" fill="#93c5fd" fontSize="8" fontFamily="sans-serif" fontWeight="700">UNO R3</text>
        <circle cx="8" cy="60" r="4" fill="#22c55e" opacity="0.9"/>
      </svg>
      <Label text="Arduino Uno R3" />
    </Wrapper>
  );
}

function LEDSprite({ comp, selStyle }) {
  const { color = '#ef4444', on = true } = comp.props;
  const glowOpacity = on ? 0.7 : 0;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
        <defs>
          <radialGradient id={`lg_${comp.id}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity={on ? 0.9 : 0.2}/>
            <stop offset="40%" stopColor={color} stopOpacity={on ? 0.9 : 0.5}/>
            <stop offset="100%" stopColor={color} stopOpacity={on ? 0.6 : 0.3}/>
          </radialGradient>
        </defs>
        {on && (
          <circle cx="30" cy="38" r="22" fill={color} opacity="0.2"/>
        )}
        <line x1="22" y1="72" x2="22" y2="95" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="38" y1="72" x2="45" y2="95" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="30" cy="65" rx="14" ry="4" fill={on ? color : '#4b1818'} opacity={on ? 0.9 : 0.4}/>
        <path d="M 16 65 C 16 65, 16 38, 30 38 C 44 38, 44 65, 44 65 Z" fill={`url(#lg_${comp.id})`}/>
        {on && (
          <>
            <line x1="48" y1="32" x2="54" y2="26" stroke={color} strokeWidth="1.5" opacity="0.7"/>
            <line x1="50" y1="38" x2="58" y2="35" stroke={color} strokeWidth="1.5" opacity="0.7"/>
          </>
        )}
      </svg>
      <Label text={`LED · ${comp.props.color ? '' : 'Red'}`} />
    </Wrapper>
  );
}

function ResistorSprite({ comp, selStyle }) {
  const { band1 = 'brown', band2 = 'black', band3 = 'red', band4 = 'gold' } = comp.props;
  const b1 = BAND_COLORS[band1]?.color || '#78350f';
  const b2 = BAND_COLORS[band2]?.color || '#000';
  const b3 = BAND_COLORS[band3]?.color || '#ef4444';
  const b4 = BAND_COLORS[band4]?.color || '#d97706';
  const ohmValue = ((BAND_COLORS[band1]?.value || 1) * 10 + (BAND_COLORS[band2]?.value || 0)) * (BAND_COLORS[band3]?.multiplier || 100);
  const fmt = v => v >= 1e6 ? `${(v/1e6).toFixed(1)}MΩ` : v >= 1000 ? `${(v/1000).toFixed(1)}kΩ` : `${v}Ω`;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="110" height="50" viewBox="0 0 110 50" fill="none">
        <line x1="5" y1="25" x2="28" y2="25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="82" y1="25" x2="105" y2="25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <rect x="28" y="12" width="54" height="26" rx="4" fill="#d4a84b"/>
        <rect x="36" y="12" width="6" height="26" fill={b1} rx="1"/>
        <rect x="48" y="12" width="6" height="26" fill={b2} rx="1"/>
        <rect x="60" y="12" width="6" height="26" fill={b3} rx="1"/>
        <rect x="68" y="12" width="6" height="26" fill={b4} rx="1"/>
        <text x="55" y="46" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">{fmt(ohmValue)}</text>
      </svg>
      <Label text="Resistor" />
    </Wrapper>
  );
}

function PushbuttonSprite({ comp, selStyle }) {
  const { pressed } = comp.props;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <line x1="15" y1="10" x2="15" y2="3" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="65" y1="10" x2="65" y2="3" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="15" y1="70" x2="15" y2="77" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="65" y1="70" x2="65" y2="77" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <rect x="8" y="10" width="64" height="60" rx="5" fill="#cbd5e1"/>
        <circle cx="15" cy="18" r="5" fill="#334155"/>
        <circle cx="65" cy="18" r="5" fill="#334155"/>
        <circle cx="15" cy="62" r="5" fill="#334155"/>
        <circle cx="65" cy="62" r="5" fill="#334155"/>
        <circle cx="40" cy="40" r="22" fill="#64748b"/>
        <circle cx="40" cy="40" r="17" fill={pressed ? '#0f172a' : '#1e293b'}/>
        {pressed && <circle cx="40" cy="40" r="5" fill="#475569"/>}
      </svg>
      <Label text={pressed ? 'Closed' : 'Pushbutton'} />
    </Wrapper>
  );
}

function PotentiometerSprite({ comp, selStyle }) {
  const { value = 50 } = comp.props;
  const angle = -135 + (value / 100) * 270;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
        <line x1="28" y1="70" x2="28" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="40" y1="70" x2="40" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="52" y1="70" x2="52" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="40" cy="38" r="32" fill="#2c3e50"/>
        <circle cx="40" cy="38" r="24" fill="#4a8fcc"/>
        <g transform={`rotate(${angle}, 40, 38)`}>
          <line x1="40" y1="31" x2="40" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <text x="40" y="76" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">{Math.round(value * 100)}Ω</text>
      </svg>
      <Label text="Potentiometer" />
    </Wrapper>
  );
}

function CeramicCapSprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="60" height="90" viewBox="0 0 60 90" fill="none">
        <line x1="22" y1="60" x2="22" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="38" y1="60" x2="38" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <path d="M 12 35 C 5 15, 55 15, 48 35 C 44 48, 45 56, 44 60 C 44 63, 38 60, 30 60 C 22 60, 16 63, 16 60 C 15 56, 16 48, 12 35 Z" fill="#1d4ed8"/>
        <text x="30" y="44" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="700">104</text>
      </svg>
      <Label text="100nF Cap" />
    </Wrapper>
  );
}

function ElectrolyticCapSprite({ comp, selStyle }) {
  const { capacitance = 100 } = comp.props;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
        <line x1="22" y1="80" x2="22" y2="95" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="38" y1="80" x2="38" y2="98" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="30" cy="80" rx="18" ry="4" fill="#1e293b"/>
        <rect x="12" y="22" width="36" height="58" rx="0" fill="#1e293b" stroke="#0f172a" strokeWidth="1"/>
        <ellipse cx="30" cy="22" rx="18" ry="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1"/>
        <rect x="12" y="22" width="8" height="52" fill="#94a3b8" opacity="0.7"/>
        <text x="12" y="40" fill="#1e293b" fontSize="8" textAnchor="middle" fontWeight="bold">-</text>
        <text x="12" y="55" fill="#1e293b" fontSize="8" textAnchor="middle" fontWeight="bold">-</text>
        <text x="38" y="52" fill="#94a3b8" fontSize="6" textAnchor="middle" fontFamily="monospace">{capacitance}µF</text>
        <text x="38" y="62" fill="#64748b" fontSize="6" textAnchor="middle" fontFamily="monospace">16V</text>
      </svg>
      <Label text={`${capacitance}µF Cap`} />
    </Wrapper>
  );
}

function DiodeSprite({ comp, selStyle }) {
  const { inputVoltage = 0 } = comp.props;
  const conducting = inputVoltage > 0.7;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
        <line x1="5" y1="25" x2="40" y2="25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="80" y1="25" x2="115" y2="25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <rect x="38" y="10" width="44" height="30" rx="4" fill={conducting ? '#374151' : '#1f2937'} stroke="#111827" strokeWidth="1"/>
        <rect x="68" y="10.5" width="10" height="29" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5"/>
        {conducting && (
          <text x="58" y="29" fill="#22c55e" fontSize="9" textAnchor="middle">→</text>
        )}
        <text x="55" y="48" fill="#475569" fontSize="7" textAnchor="middle" fontFamily="monospace">1N4007</text>
      </svg>
      <Label text="Diode" />
    </Wrapper>
  );
}

function ZenerSprite({ comp, selStyle }) {
  const { zenerVoltage = 5.1, inputVoltage = 0 } = comp.props;
  const inBreakdown = Math.abs(inputVoltage) >= zenerVoltage && inputVoltage < 0;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="70" height="110" viewBox="0 0 70 110" fill="none">
        <line x1="35" y1="5" x2="35" y2="30" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="35" y1="80" x2="35" y2="105" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <rect x="22" y="28" width="26" height="52" rx="5" fill={inBreakdown ? '#f97316' : '#ea580c'} stroke="#c2410c" strokeWidth="1"/>
        <rect x="22" y="30" width="26" height="12" fill="#1e293b"/>
        <text x="35" y="58" fill={inBreakdown ? '#38bdf8' : '#fdba74'} fontSize="9" textAnchor="middle" fontFamily="monospace">{zenerVoltage}V</text>
      </svg>
      <Label text="Zener Diode" />
    </Wrapper>
  );
}

function InductorSprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
        <line x1="5" y1="25" x2="22" y2="25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="98" y1="25" x2="115" y2="25" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <rect x="18" y="21" width="84" height="8" rx="2" fill="#9a5a2a"/>
        {[22, 32, 42, 52, 62, 72, 82, 92].map(x => (
          <ellipse key={x} cx={x} cy="25" rx="5" ry="10" fill="#d97706" stroke="#78350f" strokeWidth="0.6"/>
        ))}
      </svg>
      <Label text="Inductor" />
    </Wrapper>
  );
}

function BuzzerSprite({ comp, selStyle }) {
  const { active = false } = comp.props;
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
        {active && (
          <>
            <circle cx="40" cy="40" r="35" stroke="#ef4444" strokeWidth="1" opacity="0.3" strokeDasharray="4,4"/>
            <circle cx="40" cy="40" r="42" stroke="#ef4444" strokeWidth="0.8" opacity="0.15" strokeDasharray="4,4"/>
          </>
        )}
        <line x1="27" y1="65" x2="27" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="53" y1="65" x2="53" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="30" fill="#1f2937" stroke="#0f172a" strokeWidth="1.5"/>
        <circle cx="40" cy="40" r="10" fill="#d97706" stroke="#451a03" strokeWidth="1"/>
        <circle cx="40" cy="40" r="6" fill="#09090b"/>
        <circle cx="27" cy="60" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
        <line x1="24" y1="60" x2="30" y2="60" stroke="white" strokeWidth="1"/>
        <line x1="27" y1="57" x2="27" y2="63" stroke="white" strokeWidth="1"/>
        <circle cx="53" cy="60" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
        <line x1="50" y1="60" x2="56" y2="60" stroke="white" strokeWidth="1"/>
      </svg>
      <Label text={active ? 'Buzzer ON' : 'Buzzer'} />
    </Wrapper>
  );
}

function BatterySprite({ comp, selStyle }) {
  const { chargePercent = 100 } = comp.props;
  const voltage = (4.8 + (chargePercent / 100) * 4.8).toFixed(1);
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="160" height="70" viewBox="0 0 160 70" fill="none">
        <path d="M 58 10 L 145 10 C 148 10, 150 12, 150 15 L 150 55 C 150 58, 148 60, 145 60 L 58 60 Z" fill="#1f2937"/>
        <path d="M 32 10 L 58 10 L 58 60 L 32 60 C 29 60, 27 58, 27 55 L 27 15 C 27 12, 29 10, 32 10 Z" fill="#d97706"/>
        <text x="110" y="40" fill="#f1f5f9" fontSize="20" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" transform="rotate(90 110 38)">9V</text>
        <line x1="27" y1="22" x2="15" y2="22" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="square"/>
        <line x1="27" y1="48" x2="15" y2="48" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="square"/>
        <text x="88" y="68" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">{voltage}V</text>
        <rect x="27" y="60" width={Math.round((chargePercent/100) * 116)} height="3" fill="#22c55e" rx="1"/>
      </svg>
      <Label text="9V Battery" />
    </Wrapper>
  );
}

function PhotoresistorSprite({ comp, selStyle }) {
  const { luxValue = 300 } = comp.props;
  const lightness = Math.round(luxValue / 10);
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
        <defs>
          <radialGradient id={`ldr_${comp.id}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fbcfe8"/>
            <stop offset="25%" stopColor="#fed7aa"/>
            <stop offset="80%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#b45309"/>
          </radialGradient>
        </defs>
        {luxValue > 100 && (
          <circle cx="35" cy="35" r="28" fill="#fbbf24" opacity={luxValue / 3000}/>
        )}
        <line x1="24" y1="60" x2="24" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="46" y1="60" x2="46" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="35" cy="35" r="22" fill={`url(#ldr_${comp.id})`} stroke="#9a3412" strokeWidth="1.5"/>
        <path d="M 20 26 C 19 28, 19 31, 22 31 C 28 31, 30 25, 35 25 C 40 25, 42 31, 48 31 C 51 31, 51 28, 50 26 M 50 26 C 51 28, 51 33, 48 33 C 42 33, 40 39, 35 39 C 30 39, 28 33, 22 33 C 19 33, 19 28, 20 26" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9"/>
      </svg>
      <Label text="LDR" />
    </Wrapper>
  );
}

function IRSensorSprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
        <line x1="20" y1="58" x2="12" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="35" y1="58" x2="35" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <line x1="50" y1="58" x2="58" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
        <rect x="10" y="18" width="50" height="40" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1"/>
        <circle cx="35" cy="36" r="14" fill="#090d16" stroke="#0f172a" strokeWidth="1.4"/>
        <path d="M 24 28 A 12 12 0 0 1 46 28" stroke="white" strokeWidth="1.2" opacity="0.25" fill="none"/>
      </svg>
      <Label text="IR Receiver" />
    </Wrapper>
  );
}

function UltrasonicSprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
        <line x1="50" y1="56" x2="50" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <line x1="62" y1="56" x2="62" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <line x1="74" y1="56" x2="74" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <rect x="4" y="4" width="132" height="52" rx="4" fill="#085265" stroke="#012d38" strokeWidth="1.5"/>
        <circle cx="34" cy="28" r="22" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
        <circle cx="34" cy="28" r="15" fill="#374151"/>
        <circle cx="34" cy="28" r="7" fill="#1e293b"/>
        <circle cx="106" cy="28" r="22" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
        <circle cx="106" cy="28" r="15" fill="#374151"/>
        <circle cx="106" cy="28" r="7" fill="#1e293b"/>
        <text x="70" y="35" fill="white" fontSize="8" textAnchor="middle" fontFamily="sans-serif" fontWeight="900">PING)))</text>
      </svg>
      <Label text="Ultrasonic Sensor" />
    </Wrapper>
  );
}

function HCSr04Sprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
        <line x1="50" y1="56" x2="50" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <line x1="62" y1="56" x2="62" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <line x1="74" y1="56" x2="74" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <line x1="86" y1="56" x2="86" y2="68" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
        <rect x="4" y="4" width="132" height="52" rx="4" fill="#1e4e7c" stroke="#1d3557" strokeWidth="1.5"/>
        <circle cx="34" cy="28" r="22" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
        <circle cx="34" cy="28" r="15" fill="#374151"/>
        <circle cx="34" cy="28" r="7" fill="#1e293b"/>
        <circle cx="106" cy="28" r="22" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
        <circle cx="106" cy="28" r="15" fill="#374151"/>
        <circle cx="106" cy="28" r="7" fill="#1e293b"/>
        <text x="70" y="35" fill="white" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="900">HC-SR04</text>
      </svg>
      <Label text="HC-SR04" />
    </Wrapper>
  );
}

function GenericSprite({ comp, selStyle }) {
  return (
    <Wrapper selStyle={selStyle}>
      <div style={{
        width: 80, height: 60,
        background: '#1e2433',
        border: '1px solid #334155',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
      }}>
        {comp.icon || '?'}
      </div>
      <Label text={comp.label} />
    </Wrapper>
  );
}

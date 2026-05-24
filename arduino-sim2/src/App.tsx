import React, { useState, useRef, useCallback, useEffect } from 'react';
import Battery from './components/Battery';
import Buzzer from './components/Buzzer';
import CeramicCapacitor from './components/CeramicCapacitor';
import Diode from './components/Diode';
import Inductor from './components/Inductor';
import IRSensor from './components/IRSensor';
import Photoresistor from './components/Photoresistor';
import PolarizedCapacitor from './components/PolarizedCapacitor';
import Potentiometer from './components/Potentiometer';
import RedLED from './components/RedLED';
import Resistor from './components/Resistor';
import TactileSwitch from './components/TactileSwitch';
import UltrasonicSensor from './components/UltrasonicSensor';
import ZenerDiode from './components/ZenerDiode';
import HcSr04Sensor from './components/HcSr04Sensor';

// ─── Types ───────────────────────────────────────────────────────────────────

type ComponentType =
  | 'Battery' | 'Buzzer' | 'CeramicCapacitor' | 'Diode'
  | 'Inductor' | 'IRSensor' | 'Photoresistor' | 'PolarizedCapacitor'
  | 'Potentiometer' | 'RedLED' | 'Resistor' | 'TactileSwitch'
  | 'UltrasonicSensor' | 'ZenerDiode' | 'HcSr04Sensor';

interface CanvasComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
}

interface Terminal {
  compId: string;
  termId: string;
  label: string;
  cx: number; // relative to component (px)
  cy: number;
}

interface Wire {
  id: string;
  from: Terminal;
  to: Terminal;
  color: string;
  points: [number, number][];
}

// ─── Component metadata ───────────────────────────────────────────────────────

const COMPONENT_META: Record<ComponentType, {
  label: string;
  icon: string;
  category: string;
  terminals: Array<{ id: string; label: string; cx: number; cy: number }>;
  width: number;
}> = {
  Battery: {
    label: '9V Battery', icon: '🔋', category: 'Power',
    terminals: [
      { id: 'pos', label: 'Positive (+)', cx: 14, cy: 108 },
      { id: 'neg', label: 'Negative (−)', cx: 14, cy: 100 },
    ],
    width: 250
  },
  RedLED: {
    label: 'Red LED', icon: '💡', category: 'Output',
    terminals: [
      { id: 'anode', label: 'Anode (+)', cx: 115, cy: 260 },
      { id: 'cathode', label: 'Cathode (−)', cx: 91, cy: 252 },
    ],
    width: 250
  },
  Resistor: {
    label: 'Resistor', icon: '⚡', category: 'Passive',
    terminals: [
      { id: 'top', label: 'Terminal 1', cx: 125, cy: 62 },
      { id: 'bottom', label: 'Terminal 2', cx: 125, cy: 270 },
    ],
    width: 250
  },
  Potentiometer: {
    label: 'Potentiometer', icon: '🎛️', category: 'Passive',
    terminals: [
      { id: 't1', label: 'Terminal B (GND)', cx: 88, cy: 295 },
      { id: 'wiper', label: 'Wiper (Signal)', cx: 108, cy: 295 },
      { id: 't2', label: 'Terminal A (VCC)', cx: 128, cy: 295 },
    ],
    width: 250
  },
  TactileSwitch: {
    label: 'Tactile Switch', icon: '🔘', category: 'Input',
    terminals: [
      { id: '1A', label: 'Pin 1A', cx: 70, cy: 62 },
      { id: '2A', label: 'Pin 2A', cx: 140, cy: 62 },
      { id: '1B', label: 'Pin 1B', cx: 70, cy: 175 },
      { id: '2B', label: 'Pin 2B', cx: 140, cy: 175 },
    ],
    width: 250
  },
  CeramicCapacitor: {
    label: 'Ceramic Cap', icon: '🔵', category: 'Passive',
    terminals: [
      { id: 't1', label: 'Terminal 1', cx: 103, cy: 262 },
      { id: 't2', label: 'Terminal 2', cx: 133, cy: 262 },
    ],
    width: 250
  },
  PolarizedCapacitor: {
    label: 'Electrolytic Cap', icon: '🔵', category: 'Passive',
    terminals: [
      { id: 'cathode', label: 'Cathode (−)', cx: 113, cy: 252 },
      { id: 'anode', label: 'Anode (+)', cx: 137, cy: 266 },
    ],
    width: 250
  },
  Diode: {
    label: 'Rectifier Diode', icon: '⬛', category: 'Active',
    terminals: [
      { id: 'anode', label: 'Anode (+)', cx: 58, cy: 175 },
      { id: 'cathode', label: 'Cathode (K)', cx: 192, cy: 175 },
    ],
    width: 250
  },
  ZenerDiode: {
    label: 'Zener Diode', icon: '⬛', category: 'Active',
    terminals: [
      { id: 'cathode', label: 'Cathode (K)', cx: 125, cy: 68 },
      { id: 'anode', label: 'Anode (+)', cx: 125, cy: 274 },
    ],
    width: 250
  },
  Inductor: {
    label: 'Inductor', icon: '🔄', category: 'Passive',
    terminals: [
      { id: 't1', label: 'Lead 1', cx: 68, cy: 204 },
      { id: 't2', label: 'Lead 2', cx: 188, cy: 204 },
    ],
    width: 250
  },
  Buzzer: {
    label: 'Piezo Buzzer', icon: '🔊', category: 'Output',
    terminals: [
      { id: 'pos', label: 'Positive (+)', cx: 96, cy: 274 },
      { id: 'neg', label: 'Negative (−)', cx: 157, cy: 274 },
    ],
    width: 250
  },
  IRSensor: {
    label: 'IR Receiver', icon: '👁️', category: 'Sensor',
    terminals: [
      { id: 'out', label: 'OUT (Signal)', cx: 97, cy: 265 },
      { id: 'gnd', label: 'GND', cx: 125, cy: 265 },
      { id: 'vcc', label: 'VCC (5V)', cx: 153, cy: 265 },
    ],
    width: 250
  },
  Photoresistor: {
    label: 'LDR Photoresistor', icon: '☀️', category: 'Sensor',
    terminals: [
      { id: 't1', label: 'Lead 1 (Vout)', cx: 113, cy: 262 },
      { id: 't2', label: 'Lead 2 (VCC)', cx: 137, cy: 262 },
    ],
    width: 250
  },
  UltrasonicSensor: {
    label: 'Ultrasonic PING)))', icon: '📡', category: 'Sensor',
    terminals: [
      { id: 'gnd', label: 'GND', cx: 132, cy: 262 },
      { id: '5v', label: '5V', cx: 143, cy: 262 },
      { id: 'sig', label: 'SIG', cx: 154, cy: 262 },
    ],
    width: 250
  },
  HcSr04Sensor: {
    label: 'HC-SR04 Ultrasonic', icon: '📡', category: 'Sensor',
    terminals: [
      { id: 'vcc', label: 'VCC', cx: 90, cy: 270 },
      { id: 'trig', label: 'TRIG', cx: 110, cy: 270 },
      { id: 'echo', label: 'ECHO', cx: 130, cy: 270 },
      { id: 'gnd', label: 'GND', cx: 150, cy: 270 },
    ],
    width: 250
  },
};

const WIRE_COLORS = ['#ef4444','#3b82f6','#22c55e','#eab308','#f97316','#a855f7','#e2e8f0','#374151'];

const CATEGORIES = ['Power', 'Output', 'Input', 'Passive', 'Active', 'Sensor'];

// ─── Component renderer ───────────────────────────────────────────────────────

function renderComponent(type: ComponentType) {
  switch (type) {
    case 'Battery': return <Battery />;
    case 'Buzzer': return <Buzzer />;
    case 'CeramicCapacitor': return <CeramicCapacitor />;
    case 'Diode': return <Diode />;
    case 'Inductor': return <Inductor />;
    case 'IRSensor': return <IRSensor />;
    case 'Photoresistor': return <Photoresistor />;
    case 'PolarizedCapacitor': return <PolarizedCapacitor />;
    case 'Potentiometer': return <Potentiometer />;
    case 'RedLED': return <RedLED />;
    case 'Resistor': return <Resistor />;
    case 'TactileSwitch': return <TactileSwitch />;
    case 'UltrasonicSensor': return <UltrasonicSensor />;
    case 'ZenerDiode': return <ZenerDiode />;
    case 'HcSr04Sensor': return <HcSr04Sensor />;
    default: return null;
  }
}

// ─── Smooth bezier wire path ──────────────────────────────────────────────────

function buildWirePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx1 = x1 + dx * 0.5;
  const cy1 = y1 + dy * 0.1;
  const cx2 = x1 + dx * 0.5;
  const cy2 = y1 + dy * 0.9;
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wiringFrom, setWiringFrom] = useState<{ comp: CanvasComponent; term: Terminal } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTerm, setHoveredTerm] = useState<{ compId: string; termId: string } | null>(null);
  const [selectedWireColor, setSelectedWireColor] = useState(WIRE_COLORS[0]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const [dragComp, setDragComp] = useState<{ id: string; startX: number; startY: number; compStartX: number; compStartY: number } | null>(null);
  const [idCounter, setIdCounter] = useState(1);
  const [wireCount, setWireCount] = useState(1);

  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const nextId = useCallback(() => {
    const id = `comp_${idCounter}`;
    setIdCounter(p => p + 1);
    return id;
  }, [idCounter]);

  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return { x: 0, y: 0 };
    const rect = wrapper.getBoundingClientRect();
    return {
      x: (clientX - rect.left + wrapper.scrollLeft) / zoom - pan.x,
      y: (clientY - rect.top + wrapper.scrollTop) / zoom - pan.y,
    };
  }, [zoom, pan]);

  // ── Add component from palette ────────────────────────────────────────────

  const addComponent = useCallback((type: ComponentType) => {
    const wrapper = wrapperRef.current;
    const cx = wrapper ? (wrapper.scrollLeft + wrapper.clientWidth / 2) / zoom : 600;
    const cy = wrapper ? (wrapper.scrollTop + wrapper.clientHeight / 2) / zoom : 400;
    const comp: CanvasComponent = {
      id: `comp_${idCounter}`,
      type,
      x: cx - 125 + Math.random() * 80 - 40,
      y: cy - 200 + Math.random() * 80 - 40,
    };
    setIdCounter(p => p + 1);
    setComponents(prev => [...prev, comp]);
    setSelectedId(comp.id);
  }, [idCounter, zoom]);

  // ── Drag component ────────────────────────────────────────────────────────

  const onCompMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (wiringFrom) return;
    e.stopPropagation();
    setSelectedId(id);
    const comp = components.find(c => c.id === id);
    if (!comp) return;
    setDragComp({ id, startX: e.clientX, startY: e.clientY, compStartX: comp.x, compStartY: comp.y });
  }, [components, wiringFrom]);

  useEffect(() => {
    if (!dragComp) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragComp.startX) / zoom;
      const dy = (e.clientY - dragComp.startY) / zoom;
      setComponents(prev => prev.map(c =>
        c.id === dragComp.id
          ? { ...c, x: dragComp.compStartX + dx, y: dragComp.compStartY + dy }
          : c
      ));
    };
    const onUp = () => setDragComp(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragComp, zoom]);

  // ── Canvas pan (middle mouse or space+drag) ───────────────────────────────

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y });
      e.preventDefault();
    } else if (!wiringFrom) {
      setSelectedId(null);
    }
    if (wiringFrom) setWiringFrom(null);
  }, [pan, wiringFrom]);

  useEffect(() => {
    if (!isPanning) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - panStart.x) / zoom;
      const dy = (e.clientY - panStart.y) / zoom;
      setPan({ x: panStart.px + dx, y: panStart.py + dy });
    };
    const onUp = () => setIsPanning(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isPanning, panStart, zoom]);

  // ── Track mouse for wire preview ──────────────────────────────────────────

  const onCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!wiringFrom) return;
    const pos = toCanvas(e.clientX, e.clientY);
    setMousePos(pos);
  }, [wiringFrom, toCanvas]);

  // ── Wire terminal click ───────────────────────────────────────────────────

  const onTerminalClick = useCallback((e: React.MouseEvent, comp: CanvasComponent, termDef: typeof COMPONENT_META[ComponentType]['terminals'][0]) => {
    e.stopPropagation();

    const term: Terminal = {
      compId: comp.id,
      termId: termDef.id,
      label: termDef.label,
      cx: termDef.cx,
      cy: termDef.cy,
    };

    if (!wiringFrom) {
      setWiringFrom({ comp, term });
      setMousePos({ x: comp.x + termDef.cx, y: comp.y + termDef.cy });
    } else {
      // Complete wire
      if (wiringFrom.comp.id === comp.id && wiringFrom.term.termId === termDef.id) {
        setWiringFrom(null);
        return;
      }
      const wire: Wire = {
        id: `wire_${wireCount}`,
        from: wiringFrom.term,
        to: term,
        color: selectedWireColor,
        points: [],
      };
      setWires(prev => [...prev, wire]);
      setWireCount(p => p + 1);
      setWiringFrom(null);
      setMousePos(null);
    }
  }, [wiringFrom, selectedWireColor, wireCount]);

  // ── Delete selected component ─────────────────────────────────────────────

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setComponents(prev => prev.filter(c => c.id !== selectedId));
    setWires(prev => prev.filter(w => w.from.compId !== selectedId && w.to.compId !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if (e.key === 'Escape') setWiringFrom(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelected]);

  // ── Delete wire ───────────────────────────────────────────────────────────

  const deleteWire = useCallback((wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
  }, []);

  // ── Zoom ──────────────────────────────────────────────────────────────────

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(z => Math.min(2, Math.max(0.3, z * factor)));
  }, []);

  // ── Wire coordinate helper ────────────────────────────────────────────────

  const getTermWorldPos = (compId: string, termId: string) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const meta = COMPONENT_META[comp.type];
    const term = meta.terminals.find(t => t.id === termId);
    if (!term) return { x: 0, y: 0 };
    return { x: comp.x + term.cx, y: comp.y + term.cy };
  };

  const selectedComp = components.find(c => c.id === selectedId);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f172a' }}>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>⚡</div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 13, letterSpacing: '0.02em', fontFamily: 'Sora, sans-serif' }}>CircuitCanvas</div>
            <div style={{ color: '#475569', fontSize: 9, letterSpacing: '0.08em', fontFamily: 'IBM Plex Mono, monospace' }}>INTERACTIVE SIMULATOR</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Wire color picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em' }}>WIRE</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {WIRE_COLORS.map(col => (
              <button
                key={col}
                onClick={() => setSelectedWireColor(col)}
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: col,
                  border: selectedWireColor === col ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer',
                  boxShadow: selectedWireColor === col ? `0 0 8px ${col}` : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

        {/* Actions */}
        {selectedId && (
          <button
            onClick={deleteSelected}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              background: 'rgba(239,68,68,0.15)', color: '#f87171',
              border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
              fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em',
            }}
          >
            DELETE
          </button>
        )}

        {wiringFrom && (
          <div style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
            background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
            border: '1px solid rgba(245,158,11,0.3)',
            fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em',
            animation: 'pulse 1s infinite',
          }}>
            ✦ Click target terminal — ESC to cancel
          </div>
        )}

        <button
          onClick={() => { setComponents([]); setWires([]); setSelectedId(null); setWiringFrom(null); }}
          style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
            background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            fontFamily: 'IBM Plex Mono, monospace',
          }}
        >
          CLEAR ALL
        </button>
      </div>

      {/* ── Component Palette ── */}
      <div className="palette">
        <div style={{ padding: '4px 2px 10px', color: '#334155', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em' }}>
          COMPONENT LIBRARY
        </div>
        {CATEGORIES.map(cat => {
          const items = (Object.entries(COMPONENT_META) as [ComponentType, typeof COMPONENT_META[ComponentType]][])
            .filter(([, m]) => m.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: '0.12em',
                padding: '4px 10px 6px',
                fontFamily: 'IBM Plex Mono, monospace',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                marginBottom: 4,
              }}>
                {cat}
              </div>
              {items.map(([type, meta]) => (
                <div
                  key={type}
                  className="palette-item"
                  onClick={() => addComponent(type)}
                  title={`Add ${meta.label} to canvas`}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Properties Panel ── */}
      <div className="props-panel">
        {selectedComp ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 6 }}>
                SELECTED COMPONENT
              </div>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14, fontFamily: 'Sora, sans-serif' }}>
                {COMPONENT_META[selectedComp.type].label}
              </div>
              <div style={{ color: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', marginTop: 3 }}>
                ID: {selectedComp.id}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 8 }}>
                TERMINALS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {COMPONENT_META[selectedComp.type].terminals.map(term => {
                  const isConnected = wires.some(w =>
                    (w.from.compId === selectedComp.id && w.from.termId === term.id) ||
                    (w.to.compId === selectedComp.id && w.to.termId === term.id)
                  );
                  return (
                    <div
                      key={term.id}
                      style={{
                        padding: '8px 10px', borderRadius: 8,
                        background: isConnected ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isConnected ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: isConnected ? '#22c55e' : '#475569',
                        flexShrink: 0,
                        boxShadow: isConnected ? '0 0 6px #22c55e' : 'none',
                      }} />
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 600 }}>{term.label}</div>
                        <div style={{ color: '#475569', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', marginTop: 1 }}>
                          {isConnected ? 'Connected' : 'Unconnected'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 8 }}>
                WIRES
              </div>
              {wires.filter(w => w.from.compId === selectedComp.id || w.to.compId === selectedComp.id).length === 0 ? (
                <div style={{ color: '#334155', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}>No connections yet</div>
              ) : (
                wires
                  .filter(w => w.from.compId === selectedComp.id || w.to.compId === selectedComp.id)
                  .map(w => {
                    const otherCompId = w.from.compId === selectedComp.id ? w.to.compId : w.from.compId;
                    const otherComp = components.find(c => c.id === otherCompId);
                    const myTermId = w.from.compId === selectedComp.id ? w.from.termId : w.to.termId;
                    const otherTermId = w.from.compId === selectedComp.id ? w.to.termId : w.from.termId;
                    return (
                      <div key={w.id} style={{
                        padding: '7px 10px', borderRadius: 8, marginBottom: 5,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: w.color, flexShrink: 0, boxShadow: `0 0 5px ${w.color}` }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#94a3b8', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {myTermId} → {otherComp ? COMPONENT_META[otherComp.type].label : '?'}.{otherTermId}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteWire(w.id)}
                          style={{ color: '#ef4444', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >×</button>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Component controls panel */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 10 }}>
                COMPONENT CONTROLS
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                overflow: 'hidden',
                transform: 'scale(0.85)',
                transformOrigin: 'top left',
                width: '117%',
              }}>
                {renderComponent(selectedComp.type)}
              </div>
            </div>

            <button
              onClick={deleteSelected}
              style={{
                width: '100%', padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                background: 'rgba(239,68,68,0.1)', color: '#f87171',
                border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer',
                fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em',
              }}
            >
              DELETE COMPONENT
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, opacity: 0.4 }}>
            <div style={{ fontSize: 36 }}>🖱️</div>
            <div style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', fontFamily: 'Sora, sans-serif', lineHeight: 1.6 }}>
              Click a component<br />to inspect & control it
            </div>
            <div style={{ color: '#475569', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', textAlign: 'center', lineHeight: 1.8 }}>
              Click terminals to<br />connect wires
            </div>
          </div>
        )}
      </div>

      {/* ── Canvas wrapper ── */}
      <div
        ref={wrapperRef}
        className="canvas-wrapper"
        onWheel={handleWheel}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        style={{ cursor: isPanning ? 'grabbing' : wiringFrom ? 'crosshair' : 'default', paddingBottom: 28 }}
      >
        {/* Zoom container */}
        <div
          ref={canvasRef}
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '0 0',
            position: 'relative',
          }}
        >
          {/* Canvas background */}
          <div className="canvas-area">

            {/* ── Wire SVG layer ── */}
            <svg
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}
            >
              {/* Placed wires */}
              {wires.map(wire => {
                const from = getTermWorldPos(wire.from.compId, wire.from.termId);
                const to = getTermWorldPos(wire.to.compId, wire.to.termId);
                const path = buildWirePath(from.x, from.y, to.x, to.y);
                return (
                  <path
                    key={wire.id}
                    d={path}
                    stroke={wire.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    style={{ filter: `drop-shadow(0 1px 4px ${wire.color}55)`, cursor: 'pointer', pointerEvents: 'stroke' }}
                    onClick={(e) => { e.stopPropagation(); deleteWire(wire.id); }}
                  >
                    <title>Click to delete wire ({wire.from.termId} → {wire.to.termId})</title>
                  </path>
                );
              })}

              {/* Preview wire */}
              {wiringFrom && mousePos && (
                <path
                  d={buildWirePath(
                    wiringFrom.comp.x + wiringFrom.term.cx,
                    wiringFrom.comp.y + wiringFrom.term.cy,
                    mousePos.x,
                    mousePos.y,
                  )}
                  stroke={selectedWireColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="8 5"
                  fill="none"
                  style={{ pointerEvents: 'none', opacity: 0.75 }}
                />
              )}

              {/* Wire mid-point dots */}
              {wires.map(wire => {
                const from = getTermWorldPos(wire.from.compId, wire.from.termId);
                const to = getTermWorldPos(wire.to.compId, wire.to.termId);
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                return (
                  <circle key={`dot_${wire.id}`} cx={mx} cy={my} r="3" fill={wire.color} opacity={0.6} />
                );
              })}
            </svg>

            {/* ── Components ── */}
            {components.map(comp => {
              const meta = COMPONENT_META[comp.type];
              const isSelected = selectedId === comp.id;

              return (
                <div
                  key={comp.id}
                  style={{
                    position: 'absolute',
                    left: comp.x,
                    top: comp.y,
                    zIndex: isSelected ? 50 : 10,
                    filter: isSelected ? 'drop-shadow(0 0 18px rgba(99,102,241,0.5))' : undefined,
                    transition: 'filter 0.2s',
                  }}
                  onMouseDown={(e) => onCompMouseDown(e, comp.id)}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(comp.id); }}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', inset: -6,
                      border: '2px solid rgba(99,102,241,0.6)',
                      borderRadius: 18,
                      pointerEvents: 'none',
                      zIndex: 100,
                      boxShadow: '0 0 0 1px rgba(99,102,241,0.2)',
                    }} />
                  )}

                  {/* Render component - NO controls shown inline */}
                  <div style={{ pointerEvents: isSelected ? 'auto' : 'none' }}>
                    <ComponentShell type={comp.type} />
                  </div>

                  {/* Terminal dots - always visible when not wiring, emphasized when wiring */}
                  {meta.terminals.map(term => {
                    const isWiringSource = wiringFrom?.comp.id === comp.id && wiringFrom.term.termId === term.id;
                    const isHovered = hoveredTerm?.compId === comp.id && hoveredTerm.termId === term.id;
                    const isConnected = wires.some(w =>
                      (w.from.compId === comp.id && w.from.termId === term.id) ||
                      (w.to.compId === comp.id && w.to.termId === term.id)
                    );

                    return (
                      <div
                        key={term.id}
                        style={{
                          position: 'absolute',
                          left: term.cx,
                          top: term.cy,
                          width: wiringFrom ? 16 : 10,
                          height: wiringFrom ? 16 : 10,
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: isWiringSource
                            ? 'rgba(245,158,11,0.9)'
                            : isConnected
                              ? 'rgba(34,197,94,0.7)'
                              : wiringFrom
                                ? 'rgba(99,102,241,0.6)'
                                : 'rgba(99,102,241,0.35)',
                          border: `2px solid ${isWiringSource ? '#fbbf24' : isConnected ? '#22c55e' : '#6366f1'}`,
                          cursor: 'crosshair',
                          zIndex: 200,
                          transition: 'all 0.15s',
                          boxShadow: wiringFrom && !isWiringSource
                            ? '0 0 10px rgba(99,102,241,0.6)'
                            : isConnected
                              ? '0 0 6px rgba(34,197,94,0.5)'
                              : 'none',
                          pointerEvents: 'all',
                        }}
                        onClick={(e) => onTerminalClick(e, comp, term)}
                        onMouseEnter={() => setHoveredTerm({ compId: comp.id, termId: term.id })}
                        onMouseLeave={() => setHoveredTerm(null)}
                      >
                        {/* Tooltip */}
                        {isHovered && (
                          <div style={{
                            position: 'absolute',
                            bottom: '130%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#0f172a',
                            color: 'white',
                            fontSize: 10,
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: 6,
                            whiteSpace: 'nowrap',
                            border: '1px solid rgba(255,255,255,0.12)',
                            pointerEvents: 'none',
                            zIndex: 500,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                          }}>
                            {term.label}
                            <div style={{
                              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                              borderWidth: '4px 4px 0', borderStyle: 'solid',
                              borderColor: '#0f172a transparent transparent',
                            }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Empty state */}
            {components.length === 0 && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }}>⚡</div>
                <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 18, fontFamily: 'Sora, sans-serif', opacity: 0.5 }}>
                  Start building your circuit
                </div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 8, fontFamily: 'IBM Plex Mono, monospace', opacity: 0.4 }}>
                  Add components from the left panel
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Zoom controls ── */}
      <div className="zoom-ctrl">
        <button
          onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
        >−</button>
        <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', minWidth: 36, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.1))}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
        >+</button>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
        >RESET</button>
      </div>

      {/* ── Status bar ── */}
      <div className="statusbar">
        <span>
          {components.length} component{components.length !== 1 ? 's' : ''}
        </span>
        <span>·</span>
        <span>
          {wires.length} wire{wires.length !== 1 ? 's' : ''}
        </span>
        {selectedComp && (
          <>
            <span>·</span>
            <span style={{ color: '#94a3b8' }}>
              Selected: {COMPONENT_META[selectedComp.type].label} ({selectedComp.id})
            </span>
          </>
        )}
        {wiringFrom && (
          <>
            <span>·</span>
            <span style={{ color: '#fbbf24' }}>
              Wiring from {COMPONENT_META[wiringFrom.comp.type].label}.{wiringFrom.term.label} — click a terminal to connect
            </span>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span>Scroll to zoom · Alt+drag to pan · DEL to delete · Click wire to remove</span>
      </div>
    </div>
  );
}

// Shell that renders component without its controls until selected
// We render it always (to preserve state) but only the visual part matters on canvas
function ComponentShell({ type }: { type: ComponentType }) {
  // Render component - controls are always rendered but on the canvas
  // only the visual appears; the right panel shows interactive controls separately
  return (
    <div style={{ pointerEvents: 'none' }}>
      {renderComponent(type)}
    </div>
  );
}

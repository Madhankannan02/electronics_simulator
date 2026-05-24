import React from 'react';
import { COMPONENT_DEFINITIONS } from '../data/componentDefs';

export default function PropertiesPanel({ component, onUpdate, onOpenModal, onDelete }) {
  const def = COMPONENT_DEFINITIONS.find(d => d.type === component.type);

  return (
    <div style={{
      width: 220,
      background: '#111318',
      borderLeft: '1px solid #1e2433',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #1e2433',
        background: '#0d0f14',
      }}>
        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Properties
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
          {def?.label || component.type}
        </div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
          {def?.description}
        </div>
      </div>

      {/* Pins */}
      {def?.pins && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e2433' }}>
          <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Pins
          </div>
          {def.pins.map((pin, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '3px 0',
              fontSize: 10, color: '#94a3b8',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#334155', border: '1px solid #475569',
                flexShrink: 0,
              }} />
              {pin}
            </div>
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div style={{ padding: '10px 14px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Current Values
        </div>
        {Object.entries(component.props).slice(0, 6).map(([key, val]) => (
          <div key={key} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 0',
            borderBottom: '1px solid #1e2433',
            fontSize: 10,
          }}>
            <span style={{ color: '#64748b', textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>
              {typeof val === 'boolean' ? (val ? 'ON' : 'OFF') :
               typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) :
               String(val).substring(0, 10)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid #1e2433',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <button
          onClick={onOpenModal}
          style={{
            width: '100%',
            padding: '8px',
            background: '#1e3a5f',
            color: '#60a5fa',
            border: '1px solid #2d4f7f',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          ⚙ Configure Component
        </button>
        <button
          onClick={onDelete}
          style={{
            width: '100%',
            padding: '6px',
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #1e2433',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 10,
            fontFamily: 'inherit',
          }}
        >
          ✕ Remove from Canvas
        </button>
      </div>
    </div>
  );
}

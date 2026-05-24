import React, { useState } from 'react';
import { COMPONENT_DEFINITIONS, CATEGORY_ORDER } from '../data/componentDefs';

const CATEGORY_ICONS = {
  'Microcontrollers': '🎛',
  'Basic': '⚡',
  'Passive': '〰',
  'Actuators': '🔊',
  'Power': '🔋',
  'Sensors': '📡',
};

export default function Sidebar() {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});

  const filtered = COMPONENT_DEFINITIONS.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = filtered.filter(c => c.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div style={{
      width: 200,
      background: '#111318',
      borderRight: '1px solid #1e2433',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid #1e2433' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          Components
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            width: '100%',
            background: '#0d0f14',
            border: '1px solid #1e2433',
            borderRadius: 6,
            padding: '5px 8px',
            fontSize: 11,
            color: '#94a3b8',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <button
              onClick={() => toggleCategory(cat)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#475569',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 13 }}>{CATEGORY_ICONS[cat]}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{cat}</span>
              <span style={{ color: '#334155', fontSize: 10 }}>{collapsed[cat] ? '▶' : '▼'}</span>
            </button>
            {!collapsed[cat] && items.map(comp => (
              <DraggableItem key={comp.type} comp={comp} />
            ))}
          </div>
        ))}
      </div>
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #1e2433',
        fontSize: 9,
        color: '#334155',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        Drag to canvas
        <br />Double-click to configure
      </div>
    </div>
  );
}

function DraggableItem({ comp }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('componentType', comp.type);
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px 6px 20px',
        cursor: 'grab',
        background: dragging ? '#1a2035' : 'transparent',
        borderLeft: dragging ? `2px solid ${comp.color}` : '2px solid transparent',
        transition: 'all 0.1s',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!dragging) {
          e.currentTarget.style.background = '#161b28';
          e.currentTarget.style.borderLeftColor = comp.color + '88';
        }
      }}
      onMouseLeave={e => {
        if (!dragging) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderLeftColor = 'transparent';
        }
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 5,
          background: comp.color + '22',
          border: `1px solid ${comp.color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {comp.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {comp.label}
        </div>
        <div style={{ fontSize: 9, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {comp.description}
        </div>
      </div>
    </div>
  );
}

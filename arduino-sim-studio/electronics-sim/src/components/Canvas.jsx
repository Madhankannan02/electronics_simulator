import React, { forwardRef, useRef, useState, useCallback } from 'react';
import ComponentSprite from './ComponentSprite';

const Canvas = forwardRef(function Canvas({
  components,
  selectedId,
  wires,
  dragOverCanvas,
  onSelect,
  onMove,
  onDrop,
  onDragOver,
  onDragLeave,
  onDoubleClick,
}, ref) {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const innerRef = useRef(null);

  const combinedRef = useCallback(node => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const handleComponentMouseDown = useCallback((e, id) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect(id);
    const comp = components.find(c => c.id === id);
    if (!comp) return;
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - rect.left - comp.x,
      y: e.clientY - rect.top - comp.y,
    });
  }, [components, onSelect]);

  const handleMouseMove = useCallback((e) => {
    if (!draggingId) return;
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, e.clientX - rect.left - dragOffset.x);
    const y = Math.max(0, e.clientY - rect.top - dragOffset.y);
    onMove(draggingId, x, y);
  }, [draggingId, dragOffset, onMove]);

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  return (
    <div
      ref={combinedRef}
      onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: dragOverCanvas
          ? 'radial-gradient(ellipse at center, #0f172a 0%, #0d0f14 100%)'
          : '#0d0f14',
        backgroundImage: `
          linear-gradient(rgba(30,36,51,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30,36,51,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        transition: 'background 0.2s',
        cursor: draggingId ? 'grabbing' : 'default',
      }}
    >
      {/* Drop zone hint */}
      {dragOverCanvas && (
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px dashed #2563eb55',
          borderRadius: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#0d0f14ee',
            padding: '12px 24px',
            borderRadius: 8,
            border: '1px solid #2563eb44',
            color: '#3b82f6',
            fontSize: 13,
            fontWeight: 600,
          }}>
            Drop component here
          </div>
        </div>
      )}

      {/* Empty state */}
      {components.length === 0 && !dragOverCanvas && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          gap: 12,
        }}>
          <div style={{ fontSize: 40, opacity: 0.15 }}>⚡</div>
          <div style={{ color: '#1e2433', fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.6 }}>
            Drag components from the sidebar<br />
            to start building your circuit
          </div>
        </div>
      )}

      {/* Render components */}
      {components.map(comp => (
        <div
          key={comp.id}
          style={{
            position: 'absolute',
            left: comp.x,
            top: comp.y,
            cursor: draggingId === comp.id ? 'grabbing' : 'grab',
            userSelect: 'none',
            zIndex: selectedId === comp.id ? 100 : 10,
          }}
          onMouseDown={e => handleComponentMouseDown(e, comp.id)}
          onDoubleClick={e => { e.stopPropagation(); onDoubleClick(comp.id); }}
        >
          <ComponentSprite
            comp={comp}
            selected={selectedId === comp.id}
          />
        </div>
      ))}
    </div>
  );
});

export default Canvas;

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import ComponentModal from './components/ComponentModal';
import { COMPONENT_DEFINITIONS } from './data/componentDefs';

export default function App() {
  const [canvasComponents, setCanvasComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalComponent, setModalComponent] = useState(null);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [wires, setWires] = useState([]);
  const canvasRef = useRef(null);
  const nextId = useRef(1);

  const selectedComponent = canvasComponents.find(c => c.id === selectedId) || null;

  const handleDropOnCanvas = useCallback((e) => {
    e.preventDefault();
    setDragOverCanvas(false);
    const type = e.dataTransfer.getData('componentType');
    if (!type) return;
    const def = COMPONENT_DEFINITIONS.find(d => d.type === type);
    if (!def) return;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    const x = e.clientX - canvasRect.left - 60;
    const y = e.clientY - canvasRect.top - 60;
    const id = `comp_${nextId.current++}`;
    setCanvasComponents(prev => [...prev, {
      id,
      type,
      x: Math.max(0, x),
      y: Math.max(0, y),
      props: { ...def.defaultProps },
      label: def.label,
    }]);
    setSelectedId(id);
  }, []);

  const handleComponentMove = useCallback((id, x, y) => {
    setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, x, y } : c));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    setCanvasComponents(prev => prev.filter(c => c.id !== selectedId));
    setWires(prev => prev.filter(w => w.fromId !== selectedId && w.toId !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const handleUpdateProps = useCallback((id, newProps) => {
    setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c));
  }, []);

  const handleOpenModal = useCallback((id) => {
    const comp = canvasComponents.find(c => c.id === id);
    if (comp) setModalComponent(comp);
  }, [canvasComponents]);

  const handleModalClose = useCallback(() => {
    setModalComponent(null);
  }, []);

  const handleModalSave = useCallback((id, newProps) => {
    handleUpdateProps(id, newProps);
    setModalComponent(null);
  }, [handleUpdateProps]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !modalComponent) {
        handleDeleteSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId, modalComponent, handleDeleteSelected]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'IBM Plex Mono', 'Courier New', monospace", background: '#0d0f14', color: '#e2e8f0', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          selectedComponent={selectedComponent}
          onDelete={handleDeleteSelected}
          onOpenModal={selectedId ? () => handleOpenModal(selectedId) : null}
          componentCount={canvasComponents.length}
        />
        <Canvas
          ref={canvasRef}
          components={canvasComponents}
          selectedId={selectedId}
          wires={wires}
          dragOverCanvas={dragOverCanvas}
          onSelect={setSelectedId}
          onMove={handleComponentMove}
          onDrop={handleDropOnCanvas}
          onDragOver={(e) => { e.preventDefault(); setDragOverCanvas(true); }}
          onDragLeave={() => setDragOverCanvas(false)}
          onDoubleClick={handleOpenModal}
        />
      </div>
      {selectedComponent && (
        <PropertiesPanel
          component={selectedComponent}
          onUpdate={(props) => handleUpdateProps(selectedComponent.id, props)}
          onOpenModal={() => handleOpenModal(selectedComponent.id)}
          onDelete={handleDeleteSelected}
        />
      )}
      {modalComponent && (
        <ComponentModal
          component={modalComponent}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

function TopBar({ selectedComponent, onDelete, onOpenModal, componentCount }) {
  return (
    <div style={{
      height: 48,
      background: '#111318',
      borderBottom: '1px solid #1e2433',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ArduinoSim Studio
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 11, color: '#475569' }}>
        {componentCount} component{componentCount !== 1 ? 's' : ''} on canvas
      </span>
      {selectedComponent && (
        <>
          <button
            onClick={onOpenModal}
            style={{
              padding: '4px 12px', fontSize: 11, fontWeight: 600,
              background: '#1e3a5f', color: '#60a5fa', border: '1px solid #2d4f7f',
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ⚙ Properties
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '4px 12px', fontSize: 11, fontWeight: 600,
              background: '#3f1515', color: '#f87171', border: '1px solid #5a1a1a',
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ✕ Delete
          </button>
        </>
      )}
    </div>
  );
}

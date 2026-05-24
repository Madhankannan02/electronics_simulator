import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './nodes/nodeTypes'
import { useCircuitStore } from './store/circuitStore'

export default function App() {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect
  } = useCircuitStore()

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f0f0f' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        defaultEdgeOptions={{
          style: { stroke: '#378ADD', strokeWidth: 2 },
        }}
      >
        <Background color="#222" gap={20} />
        <Controls />
        <MiniMap nodeColor="#378ADD" maskColor="rgba(0,0,0,0.6)" />
      </ReactFlow>
    </div>
  )
}

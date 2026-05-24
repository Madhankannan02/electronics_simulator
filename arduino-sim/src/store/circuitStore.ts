import { create } from 'zustand'
import {
  applyNodeChanges, applyEdgeChanges, addEdge,
  type Node, type Edge, type NodeChange, type EdgeChange, type Connection
} from 'reactflow'

interface CircuitStore {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect:     (connection: Connection) => void
  addNode:       (node: Node) => void
  updateNodeData:(id: string, data: Partial<any>) => void
}

export const useCircuitStore = create<CircuitStore>((set) => ({
  nodes: [
    {
      id: 'diode-test-1',
      type: 'diode',
      position: { x: 300, y: 200 },
      data: { inputVoltage: 5, currentMa: 172, mode: 'forward' }
    }
  ],
  edges: [],
  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),
  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),
  onConnect: (conn) =>
    set((s) => ({ edges: addEdge(conn, s.edges) })),
  addNode: (node) =>
    set((s) => ({ nodes: [...s.nodes, node] })),
  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      )
    })),
}))

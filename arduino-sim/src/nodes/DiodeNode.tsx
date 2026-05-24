import { Handle, Position, type NodeProps } from 'reactflow'
import Diode from '../components/Diode'

export interface DiodeNodeData {
  inputVoltage: number
  currentMa:    number
  mode:         'blocking' | 'forward'
  errorState?:  string | null
}

export function DiodeNode({ data, selected }: NodeProps<DiodeNodeData>) {
  return (
    <div style={{
      position: 'relative',
      outline: selected ? '2px solid #378ADD' : 'none',
      borderRadius: 16,
      boxShadow: data.errorState ? '0 0 0 2px #E24B4A' : undefined,
    }}>

      <Handle
        type="source"
        position={Position.Left}
        id="anode"
        style={{
          top: '42%', left: -6,
          width: 10, height: 10,
          background: '#1D9E75',
          border: '2px solid white',
          borderRadius: '50%',
        }}
      />

      <Diode
        inputVoltage={data.inputVoltage}
        currentMa={data.currentMa}
        mode={data.mode}
      />

      <Handle
        type="target"
        position={Position.Right}
        id="cathode"
        style={{
          top: '42%', right: -6,
          width: 10, height: 10,
          background: '#E24B4A',
          border: '2px solid white',
          borderRadius: '50%',
        }}
      />
    </div>
  )
}

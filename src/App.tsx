import { useState, useMemo } from 'react'
import { Vector2 } from './math/vector'

function App() {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  
  const vector = useMemo(() => new Vector2(position.x, position.y), [position])
  const length = useMemo(() => vector.length().toFixed(2), [vector])

  return (
    <div style={{ padding: '20px' }}>
      <h1>BeamSolver</h1>
      <p>Position: ({position.x}, {position.y})</p>
      <p>Length from origin: {length}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setPosition(p => ({ ...p, x: p.x + 10 }))}>Move Right</button>
        <button onClick={() => setPosition(p => ({ ...p, y: p.y + 10 }))}>Move Down</button>
      </div>

      <svg width="400" height="400" style={{ border: '1px solid #ccc' }}>
        {/* Inline SVG using state */}
        <line 
          x1="0" 
          y1="0" 
          x2={position.x} 
          y2={position.y} 
          stroke="blue" 
          strokeWidth="2" 
        />
        <circle 
          cx={position.x} 
          cy={position.y} 
          r="5" 
          fill="red" 
        />
      </svg>
    </div>
  )
}

export default App

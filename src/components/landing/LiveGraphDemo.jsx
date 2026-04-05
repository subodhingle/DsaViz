import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const NODES = [
  { id: 0, label: 'A', x: 160, y: 50  },
  { id: 1, label: 'B', x: 260, y: 80  },
  { id: 2, label: 'C', x: 300, y: 170 },
  { id: 3, label: 'D', x: 220, y: 230 },
  { id: 4, label: 'E', x: 110, y: 230 },
  { id: 5, label: 'F', x:  50, y: 160 },
  { id: 6, label: 'G', x:  80, y:  80 },
]
const EDGES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[0,3],[1,4],[2,5]]

function buildAdj() {
  const adj = {}
  NODES.forEach(n => { adj[n.id] = [] })
  EDGES.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a) })
  return adj
}

function computeBFS(source) {
  const adj = buildAdj()
  const frames = []
  const visited = new Set([source])
  const queue = [source]
  const path = []

  while (queue.length) {
    const node = queue.shift()
    path.push(node)
    frames.push({ visited: [...visited], current: node, path: [...path] })
    for (const nb of adj[node]) {
      if (!visited.has(nb)) {
        visited.add(nb)
        queue.push(nb)
        frames.push({ visited: [...visited], current: node, path: [...path] })
      }
    }
  }
  // hold final frame a bit
  for (let k = 0; k < 4; k++) frames.push(frames[frames.length - 1])
  return frames
}

export default function LiveGraphDemo() {
  const framesRef = useRef(computeBFS(0))
  const idxRef = useRef(0)
  const [frame, setFrame] = useState(framesRef.current[0])

  useEffect(() => {
    const tick = () => {
      idxRef.current += 1
      if (idxRef.current >= framesRef.current.length) {
        const src = Math.floor(Math.random() * NODES.length)
        framesRef.current = computeBFS(src)
        idxRef.current = 0
      }
      setFrame(framesRef.current[idxRef.current])
    }
    const t = setInterval(tick, 380)
    return () => clearInterval(t)
  }, [])

  const getNodeColor = (id) => {
    if (id === frame.current) return '#4F8CFF'
    if (frame.path?.includes(id)) return '#4BAF78'
    if (frame.visited?.includes(id)) return '#3A5A8A'
    return '#2A3441'
  }

  const isPathEdge = (a, b) => {
    const p = frame.path || []
    for (let i = 0; i < p.length - 1; i++) {
      if ((p[i] === a && p[i+1] === b) || (p[i] === b && p[i+1] === a)) return true
    }
    return false
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 360 280" preserveAspectRatio="xMidYMid meet">
        {/* Edge glow defs */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const na = NODES[a], nb = NODES[b]
          const onPath = isPathEdge(a, b)
          return (
            <line key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={onPath ? '#00ff88' : '#2d2d4e'}
              strokeWidth={onPath ? 2.5 : 1.5}
              strokeOpacity={onPath ? 1 : 0.6}
              filter={onPath ? 'url(#glow)' : undefined}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map(n => {
          const isCurrent = n.id === frame.current
          const color = getNodeColor(n.id)
          return (
            <g key={n.id}>
              {isCurrent && (
                <circle cx={n.x} cy={n.y} r={26} fill="rgba(0,245,255,0.12)" />
              )}
              <motion.circle
                cx={n.x} cy={n.y}
                animate={{ r: isCurrent ? 20 : 16, fill: color }}
                transition={{ duration: 0.25 }}
                stroke={isCurrent ? '#6EA8FF' : '#1A2130'}
                strokeWidth={isCurrent ? 2 : 1}
                style={{ filter: isCurrent ? 'drop-shadow(0 0 5px rgba(79,140,255,0.5))' : 'none' }}
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                fill="white" fontSize="11" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                {n.label}
              </text>
            </g>
          )
        })}

        {/* BFS label */}
        <text x="10" y="270" fill="#64748b" fontSize="9" fontFamily="monospace">
          BFS traversal — auto-replays
        </text>
      </svg>
    </div>
  )
}

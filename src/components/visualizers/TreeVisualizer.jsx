import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const V_GAP = 65

function layoutTree(node, x, y, spread) {
  if (!node) return []
  return [
    { ...node, x, y },
    ...layoutTree(node.left,  x - spread, y + V_GAP, Math.max(spread * 0.52, 24)),
    ...layoutTree(node.right, x + spread, y + V_GAP, Math.max(spread * 0.52, 24)),
  ]
}

function buildEdges(node, x, y, spread) {
  if (!node) return []
  const result = []
  if (node.left) {
    const nx = x - spread, ny = y + V_GAP
    result.push({ x1: x, y1: y, x2: nx, y2: ny, active: false })
    result.push(...buildEdges(node.left, nx, ny, Math.max(spread * 0.52, 24)))
  }
  if (node.right) {
    const nx = x + spread, ny = y + V_GAP
    result.push({ x1: x, y1: y, x2: nx, y2: ny, active: false })
    result.push(...buildEdges(node.right, nx, ny, Math.max(spread * 0.52, 24)))
  }
  return result
}

function getNodeStyle(val, highlight, path) {
  if (highlight.includes(val)) return {
    fill: '#4F8CFF', stroke: '#93C5FD', strokeW: 2,
    labelColor: '#FFFFFF', filter: 'url(#tree-glow)',
  }
  if (path.includes(val)) return {
    fill: '#5BCB8A', stroke: '#86EFAC', strokeW: 1.5,
    labelColor: '#FFFFFF', filter: undefined,
  }
  return {
    fill: '#1E2D3D', stroke: '#4A6080', strokeW: 1.5,
    labelColor: '#9DA7B3', filter: undefined,
  }
}

export default function TreeVisualizer() {
  const { steps, currentStep } = useStore()
  const step = steps[currentStep]

  if (!step?.tree) return (
    <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: '#6B7785' }}>
      Click <span className="mx-1" style={{ color: '#4F8CFF' }}>Run</span> to start
    </div>
  )

  const { tree, highlight = [], path = [] } = step
  const nodes = layoutTree(tree, 300, 44, 130)
  const edges = buildEdges(tree, 300, 44, 130)

  return (
    <div className="w-full h-full flex items-start justify-center p-2 overflow-auto">
      <svg width="600" height="340" viewBox="0 0 600 340" className="max-w-full">
        <defs>
          <filter id="tree-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#3A5070"
            strokeWidth={1.5}
            strokeOpacity={0.7}
            strokeLinecap="round"
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const s = getNodeStyle(n.val, highlight, path)
          const isActive = highlight.includes(n.val)
          return (
            <g key={i}>
              {/* Glow ring for active node */}
              {isActive && (
                <circle
                  cx={n.x} cy={n.y} r={28}
                  fill="rgba(79,140,255,0.1)"
                  stroke="rgba(79,140,255,0.3)"
                  strokeWidth={1}
                />
              )}

              <motion.circle
                cx={n.x} cy={n.y}
                animate={{ r: isActive ? 22 : 19, fill: s.fill }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                stroke={s.stroke}
                strokeWidth={s.strokeW}
                filter={s.filter}
              />

              <text
                x={n.x} y={n.y + 5}
                textAnchor="middle"
                fill={s.labelColor}
                fontSize="11"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {n.val}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

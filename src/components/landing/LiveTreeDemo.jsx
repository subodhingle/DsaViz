import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const VALUES = [50, 30, 70, 20, 40, 60, 80, 35]

function insert(root, val) {
  if (!root) return { val, left: null, right: null }
  if (val < root.val) return { ...root, left: insert(root.left, val) }
  return { ...root, right: insert(root.right, val) }
}

// Layout with bounded spread so nodes stay inside viewBox
function layout(node, x, y, spread, result = []) {
  if (!node) return result
  result.push({ val: node.val, x, y })
  layout(node.left,  x - spread, y + 52, Math.max(spread * 0.55, 18), result)
  layout(node.right, x + spread, y + 52, Math.max(spread * 0.55, 18), result)
  return result
}

function buildEdges(node, x, y, spread, result = []) {
  if (!node) return result
  if (node.left) {
    const cx = x - spread, cy = y + 52
    result.push({ x1: x, y1: y, x2: cx, y2: cy })
    buildEdges(node.left, cx, cy, Math.max(spread * 0.55, 18), result)
  }
  if (node.right) {
    const cx = x + spread, cy = y + 52
    result.push({ x1: x, y1: y, x2: cx, y2: cy })
    buildEdges(node.right, cx, cy, Math.max(spread * 0.55, 18), result)
  }
  return result
}

function inorder(node, out = []) {
  if (!node) return out
  inorder(node.left, out)
  out.push(node.val)
  inorder(node.right, out)
  return out
}

// Build tree once
let TREE = null
VALUES.forEach(v => { TREE = insert(TREE, v) })
const NODES = layout(TREE, 170, 28, 72)
const EDGES = buildEdges(TREE, 170, 28, 72)
const TRAVERSAL = inorder(TREE)

export default function LiveTreeDemo() {
  const idxRef = useRef(0)
  const [visitedSet, setVisitedSet] = useState(new Set())
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    const tick = () => {
      const val = TRAVERSAL[idxRef.current]
      setCurrent(val)
      setVisitedSet(prev => new Set([...prev, val]))
      idxRef.current += 1
      if (idxRef.current >= TRAVERSAL.length) {
        // pause then restart
        setTimeout(() => {
          idxRef.current = 0
          setVisitedSet(new Set())
          setCurrent(null)
        }, 1200)
      }
    }
    const t = setInterval(tick, 520)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 340 220" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="tglow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#2d2d4e" strokeWidth={1.5} strokeOpacity={0.7} />
        ))}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const isCurrent = n.val === current
          const isVisited = visitedSet.has(n.val)
          const fill = isCurrent ? '#4F8CFF' : isVisited ? '#4BAF78' : '#2A3441'
          return (
            <g key={i}>
              {isCurrent && (
                <circle cx={n.x} cy={n.y} r={24} fill="rgba(0,245,255,0.1)" />
              )}
              <motion.circle
                cx={n.x} cy={n.y}
                animate={{ r: isCurrent ? 19 : 15, fill }}
                transition={{ duration: 0.22 }}
                stroke={isCurrent ? '#6EA8FF' : isVisited ? '#3A9060' : '#374455'}
                strokeWidth={isCurrent ? 2 : 1}
                style={{ filter: isCurrent ? 'url(#tglow)' : 'none' }}
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                fill="white" fontSize="10" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                {n.val}
              </text>
            </g>
          )
        })}

        {/* Traversal label */}
        <text x="10" y="214" fill="#64748b" fontSize="9" fontFamily="monospace">
          Inorder traversal — auto-replays
        </text>
      </svg>
    </div>
  )
}

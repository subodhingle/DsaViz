import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Zap, Clock, HardDrive, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { algoInfo } from '../data/algoInfo'

// ── Inline SVG diagrams per category ─────────────────────────────────────────

function SortingDiagram({ color }) {
  const bars = [65, 25, 90, 40, 75, 15, 55, 80, 35, 60]
  const sorted = [15, 25, 35, 40, 55, 60, 65, 75, 80, 90]
  return (
    <svg viewBox="0 0 220 80" className="w-full" style={{ maxHeight: 80 }}>
      {/* Unsorted */}
      {bars.map((h, i) => (
        <rect key={i} x={i * 11 + 2} y={80 - h * 0.7} width={9} height={h * 0.7}
          rx={1.5} fill={i === 2 ? color : i === 0 ? '#E85D5D' : '#1E2D3D'}
          stroke={i === 2 ? color : '#2A3A50'} strokeWidth={0.5} />
      ))}
      {/* Arrow */}
      <text x={115} y={42} textAnchor="middle" fill="#3A5070" fontSize="14">→</text>
      {/* Sorted */}
      {sorted.map((h, i) => (
        <rect key={i} x={i * 11 + 120} y={80 - h * 0.7} width={9} height={h * 0.7}
          rx={1.5} fill="#5BCB8A" stroke="#3A9060" strokeWidth={0.5} />
      ))}
    </svg>
  )
}

function SearchingDiagram({ color }) {
  const arr = [12, 25, 38, 47, 56, 63, 71, 84, 92]
  const target = 63
  const found = 5
  return (
    <svg viewBox="0 0 220 70" className="w-full" style={{ maxHeight: 70 }}>
      {arr.map((v, i) => (
        <g key={i}>
          <rect x={i * 24 + 2} y={20} width={22} height={28} rx={3}
            fill={i === found ? color : i === 3 ? '#E6A23C' : '#1E2D3D'}
            stroke={i === found ? color : '#2A3A50'} strokeWidth={i === found ? 1.5 : 0.5} />
          <text x={i * 24 + 13} y={38} textAnchor="middle" fill={i === found ? '#fff' : '#5A7A9A'}
            fontSize="8" fontFamily="monospace" fontWeight={i === found ? '700' : '400'}>{v}</text>
        </g>
      ))}
      <text x={found * 24 + 13} y={58} textAnchor="middle" fill={color} fontSize="9">▲</text>
      <text x={found * 24 + 13} y={68} textAnchor="middle" fill={color} fontSize="7">found</text>
    </svg>
  )
}

function GraphDiagram({ color }) {
  const nodes = [
    { id: 0, x: 30,  y: 35, label: 'A' },
    { id: 1, x: 80,  y: 15, label: 'B' },
    { id: 2, x: 130, y: 35, label: 'C' },
    { id: 3, x: 80,  y: 60, label: 'D' },
    { id: 4, x: 180, y: 20, label: 'E' },
    { id: 5, x: 180, y: 55, label: 'F' },
  ]
  const edges = [[0,1],[1,2],[2,3],[3,0],[1,3],[2,4],[4,5],[2,5]]
  const visited = [0, 1, 3]
  const current = 2
  return (
    <svg viewBox="0 0 220 80" className="w-full" style={{ maxHeight: 80 }}>
      {edges.map(([a, b], i) => {
        const na = nodes[a], nb = nodes[b]
        const onPath = (a === 0 && b === 1) || (a === 1 && b === 2)
        return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
          stroke={onPath ? color : '#2A3A50'} strokeWidth={onPath ? 1.5 : 1} strokeOpacity={0.8} />
      })}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={11}
            fill={n.id === current ? color : visited.includes(n.id) ? '#2E5A8A' : '#1E2D3D'}
            stroke={n.id === current ? color : '#2A3A50'} strokeWidth={n.id === current ? 1.5 : 1} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="700">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

function TreeDiagram({ color }) {
  const nodes = [
    { v: 50, x: 110, y: 14 },
    { v: 30, x: 60,  y: 40 },
    { v: 70, x: 160, y: 40 },
    { v: 20, x: 35,  y: 66 },
    { v: 40, x: 85,  y: 66 },
    { v: 60, x: 135, y: 66 },
    { v: 80, x: 185, y: 66 },
  ]
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]
  const highlighted = [50, 30]
  const path = [20, 30, 40, 50]
  return (
    <svg viewBox="0 0 220 82" className="w-full" style={{ maxHeight: 82 }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#2A3A50" strokeWidth={1.2} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={12}
            fill={highlighted.includes(n.v) ? color : path.includes(n.v) ? '#5BCB8A' : '#1E2D3D'}
            stroke={highlighted.includes(n.v) ? color : '#2A3A50'} strokeWidth={highlighted.includes(n.v) ? 1.5 : 1} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="700">{n.v}</text>
        </g>
      ))}
    </svg>
  )
}

const DIAGRAMS = {
  sorting:   SortingDiagram,
  searching: SearchingDiagram,
  graph:     GraphDiagram,
  tree:      TreeDiagram,
}

// ── Complexity badge ──────────────────────────────────────────────────────────
function Badge({ label, value, color }) {
  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-lg"
      style={{ background: '#0D1117', border: '1px solid #1A2535' }}>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}</span>
      <span className="text-[9px] mt-0.5" style={{ color: '#3A5070' }}>{label}</span>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function AlgoInfoPanel({ algorithm }) {
  const info = algoInfo[algorithm]
  const [expanded, setExpanded] = useState(false)

  if (!info) return null

  const Diagram = DIAGRAMS[info.diagram]

  return (
    <motion.div
      key={algorithm}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col overflow-hidden"
      style={{ background: '#0B0F14', borderTop: '1px solid #1A2535' }}
    >
      {/* ── Collapsed header (always visible) ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="shrink-0 flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors"
        style={{ borderBottom: expanded ? '1px solid #1A2535' : 'none' }}
        onMouseEnter={e => e.currentTarget.style.background = '#0D1117'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {/* Color dot */}
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: info.color }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: '#C8DCF0' }}>{info.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: `${info.color}18`, color: info.color, border: `1px solid ${info.color}30` }}>
              {info.type}
            </span>
          </div>
          <p className="text-[10px] truncate mt-0.5" style={{ color: '#4A6080' }}>{info.tagline}</p>
        </div>

        {/* Complexity pills */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono" style={{ color: '#E6A23C' }}>⏱ {info.complexity.average}</span>
          <span className="text-[10px] font-mono" style={{ color: '#4F8CFF' }}>💾 {info.complexity.space}</span>
        </div>

        {expanded
          ? <ChevronUp size={13} style={{ color: '#3A5070', shrink: 0 }} />
          : <ChevronDown size={13} style={{ color: '#3A5070', shrink: 0 }} />
        }
      </button>

      {/* ── Expanded body ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
              <div className="p-4 space-y-4">

                {/* Diagram + description */}
                <div className="flex gap-4">
                  {/* SVG diagram */}
                  <div className="shrink-0 rounded-xl p-3 flex items-center justify-center"
                    style={{ background: '#0D1117', border: '1px solid #1A2535', width: 220 }}>
                    {Diagram && <Diagram color={info.color} />}
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-relaxed" style={{ color: '#7A9AB8' }}>
                      {info.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{ background: info.stable ? 'rgba(91,203,138,0.12)' : 'rgba(232,93,93,0.12)', color: info.stable ? '#5BCB8A' : '#E85D5D', border: `1px solid ${info.stable ? 'rgba(91,203,138,0.25)' : 'rgba(232,93,93,0.25)'}` }}>
                        {info.stable ? '✓ Stable' : '✗ Unstable'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{ background: info.inPlace ? 'rgba(79,140,255,0.12)' : 'rgba(167,139,250,0.12)', color: info.inPlace ? '#4F8CFF' : '#A78BFA', border: `1px solid ${info.inPlace ? 'rgba(79,140,255,0.25)' : 'rgba(167,139,250,0.25)'}` }}>
                        {info.inPlace ? '✓ In-Place' : '✗ Extra Space'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Complexity table */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2A3A50' }}>
                    Time & Space Complexity
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <Badge label="Best"    value={info.complexity.best}    color="#5BCB8A" />
                    <Badge label="Average" value={info.complexity.average} color="#E6A23C" />
                    <Badge label="Worst"   value={info.complexity.worst}   color="#E85D5D" />
                    <Badge label="Space"   value={info.complexity.space}   color="#4F8CFF" />
                  </div>
                </div>

                {/* Use cases */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2A3A50' }}>
                    Use Cases
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {info.useCases.map(u => (
                      <span key={u} className="text-[10px] px-2 py-0.5 rounded"
                        style={{ background: '#0D1117', color: '#5A7A9A', border: '1px solid #1A2535' }}>
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2A3A50' }}>
                      Advantages
                    </p>
                    <div className="space-y-1">
                      {info.pros.map(p => (
                        <div key={p} className="flex items-start gap-1.5">
                          <CheckCircle size={10} className="shrink-0 mt-0.5" style={{ color: '#5BCB8A' }} />
                          <span className="text-[10px] leading-relaxed" style={{ color: '#5A7A9A' }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2A3A50' }}>
                      Limitations
                    </p>
                    <div className="space-y-1">
                      {info.cons.map(c => (
                        <div key={c} className="flex items-start gap-1.5">
                          <XCircle size={10} className="shrink-0 mt-0.5" style={{ color: '#E85D5D' }} />
                          <span className="text-[10px] leading-relaxed" style={{ color: '#5A7A9A' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

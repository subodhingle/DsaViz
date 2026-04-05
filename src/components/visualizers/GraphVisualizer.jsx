import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'
import useStore from '../../store/useStore'

// ── Constants ────────────────────────────────────────────────────────────────
const SVG_W = 600
const SVG_H = 500
const MIN_ZOOM = 0.4
const MAX_ZOOM = 3.0
const ZOOM_STEP = 0.25

// ── Color helpers ─────────────────────────────────────────────────────────────
function nodeStyle(id, current, path, visited) {
  if (id === current) return {
    fill: '#4F8CFF', stroke: '#93C5FD', strokeW: 2.5,
    label: '#FFFFFF', r: 24, filter: 'url(#glow-active)',
  }
  if (path.includes(id)) return {
    fill: '#5BCB8A', stroke: '#86EFAC', strokeW: 2,
    label: '#FFFFFF', r: 22, filter: 'url(#glow-path)',
  }
  if (visited.includes(id)) return {
    fill: '#2E5A8A', stroke: '#5B8FC4', strokeW: 1.5,
    label: '#C8DCF0', r: 22, filter: undefined,
  }
  return {
    fill: '#1A2A3A', stroke: '#4A6A8A', strokeW: 1.5,
    label: '#8AAAC4', r: 22, filter: undefined,
  }
}

function edgeStyle(onPath, onVisited) {
  if (onPath)    return { stroke: '#5BCB8A', width: 2.5, opacity: 1 }
  if (onVisited) return { stroke: '#2E5A8A', width: 1.5, opacity: 0.9 }
  return           { stroke: '#2A4060',   width: 1.5, opacity: 0.7 }
}

// ── Legend ────────────────────────────────────────────────────────────────────
const LEGEND = [
  { color: '#4F8CFF', label: 'Current'  },
  { color: '#5BCB8A', label: 'Path'     },
  { color: '#2E5A8A', label: 'Visited'  },
  { color: '#1A2A3A', label: 'Unvisited'},
]

// ── Main component ────────────────────────────────────────────────────────────
export default function GraphVisualizer() {
  const { steps, currentStep, graphData } = useStore()
  const step = steps[currentStep]
  const { nodes, edges } = graphData

  // Zoom / pan state
  const [zoom, setZoom]     = useState(1)
  const [pan, setPan]       = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const svgRef    = useRef(null)

  // Auto-fit when nodes change
  useEffect(() => {
    if (!nodes.length) return
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [nodes.length])

  // ── Zoom helpers ──
  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  const zoomIn  = () => setZoom(z => clampZoom(z + ZOOM_STEP))
  const zoomOut = () => setZoom(z => clampZoom(z - ZOOM_STEP))
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // Zoom toward cursor on wheel
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
    setZoom(z => clampZoom(z + delta))
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // ── Pan helpers ──
  const onMouseDown = (e) => {
    if (e.button !== 0) return
    setDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }
  const onMouseMove = (e) => {
    if (!dragging || !dragStart.current) return
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  const onMouseUp = () => { setDragging(false); dragStart.current = null }

  // Touch pan
  const touchStart = useRef(null)
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y }
    }
  }
  const onTouchMove = (e) => {
    if (e.touches.length === 1 && touchStart.current) {
      setPan({ x: e.touches[0].clientX - touchStart.current.x, y: e.touches[0].clientY - touchStart.current.y })
    }
  }

  if (!nodes.length) return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ color: '#6B7785' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" opacity={0.25}>
        {[[10,40,40,10],[40,10,70,40],[70,40,40,70],[40,70,10,40],[10,40,70,40]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4A6080" strokeWidth="1.5" />
        ))}
        {[[10,40],[40,10],[70,40],[40,70]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="8" fill="#1A2A3A" stroke="#4A6080" strokeWidth="1.5" />
        ))}
      </svg>
      <p className="text-sm">Click <span style={{ color: '#4F8CFF' }}>Run</span> to start</p>
    </div>
  )

  const visited   = step?.visited   || []
  const current   = step?.current
  const path      = step?.path      || []
  const distances = step?.distances || {}

  const isPathEdge = (e) => {
    const i = path.indexOf(e.source)
    if (i !== -1 && path[i + 1] === e.target) return true
    const j = path.indexOf(e.target)
    if (j !== -1 && path[j + 1] === e.source) return true
    return false
  }
  const isVisitedEdge = (e) => visited.includes(e.source) && visited.includes(e.target)

  // Transform string for the graph group
  const transform = `translate(${pan.x}, ${pan.y}) scale(${zoom})`
  // Origin for scale: center of SVG
  const transformOrigin = `${SVG_W / 2}px ${SVG_H / 2}px`

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0B0F14' }}>

      {/* ── Toolbar ── */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid #1F2630' }}
      >
        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border" style={{ background: color, borderColor: color }} />
              <span className="text-[11px] font-medium" style={{ color: '#6B7785' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono mr-2" style={{ color: '#4A6080' }}>
            {Math.round(zoom * 100)}%
          </span>
          <ZoomBtn onClick={zoomOut} disabled={zoom <= MIN_ZOOM} title="Zoom out"><ZoomOut size={13} /></ZoomBtn>
          <ZoomBtn onClick={zoomIn}  disabled={zoom >= MAX_ZOOM} title="Zoom in"><ZoomIn  size={13} /></ZoomBtn>
          <ZoomBtn onClick={resetView} title="Reset view"><Maximize2 size={13} /></ZoomBtn>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => { touchStart.current = null }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', userSelect: 'none' }}
        >
          <defs>
            <filter id="glow-active" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-path" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Arrow marker for directed feel */}
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3A4F65" />
            </marker>
            <marker id="arrow-path" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#5BCB8A" />
            </marker>
          </defs>

          {/* Everything inside this group is zoom/pan-able */}
          <g transform={transform} style={{ transformOrigin }}>

            {/* ── Edges ── */}
            {edges.map((e, i) => {
              const src = nodes.find(n => n.id === e.source)
              const tgt = nodes.find(n => n.id === e.target)
              if (!src || !tgt) return null

              const onPath    = isPathEdge(e)
              const onVisited = isVisitedEdge(e)
              const es        = edgeStyle(onPath, onVisited)

              // Shorten line so it doesn't overlap node circles
              const dx = tgt.x - src.x, dy = tgt.y - src.y
              const len = Math.sqrt(dx * dx + dy * dy) || 1
              const nr = 24 // node radius
              const x1 = src.x + (dx / len) * nr
              const y1 = src.y + (dy / len) * nr
              const x2 = tgt.x - (dx / len) * (nr + 4)
              const y2 = tgt.y - (dy / len) * (nr + 4)

              const mx = (src.x + tgt.x) / 2
              const my = (src.y + tgt.y) / 2

              return (
                <g key={i}>
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={es.stroke}
                    strokeWidth={es.width}
                    strokeOpacity={es.opacity}
                    strokeLinecap="round"
                  />
                  {/* Weight badge */}
                  {e.weight !== undefined && (
                    <g>
                      <rect
                        x={mx - 9} y={my - 9}
                        width={18} height={14}
                        rx={4}
                        fill="#0F141A"
                        stroke={onPath ? '#5BCB8A' : '#2A3441'}
                        strokeWidth={1}
                        fillOpacity={0.92}
                      />
                      <text
                        x={mx} y={my + 2}
                        textAnchor="middle"
                        fill={onPath ? '#5BCB8A' : '#5A7A9A'}
                        fontSize="10"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                      >
                        {e.weight}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* ── Nodes ── */}
            {nodes.map(node => {
              const s = nodeStyle(node.id, current, path, visited)
              const isCurrent = node.id === current
              const hasDistance = distances[node.id] !== undefined && distances[node.id] !== Infinity

              return (
                <g key={node.id}>
                  {/* Pulse ring for active node */}
                  {isCurrent && (
                    <motion.circle
                      cx={node.x} cy={node.y}
                      animate={{ r: [28, 36, 28], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      fill="none"
                      stroke="#4F8CFF"
                      strokeWidth={1.5}
                    />
                  )}

                  {/* Node body */}
                  <motion.circle
                    cx={node.x} cy={node.y}
                    animate={{ r: s.r, fill: s.fill }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    stroke={s.stroke}
                    strokeWidth={s.strokeW}
                    filter={s.filter}
                  />

                  {/* Node label */}
                  <text
                    x={node.x} y={node.y + 5}
                    textAnchor="middle"
                    fill={s.label}
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.label}
                  </text>

                  {/* Distance badge (Dijkstra / A*) */}
                  {hasDistance && (
                    <g>
                      <rect
                        x={node.x - 14} y={node.y - s.r - 18}
                        width={28} height={16}
                        rx={5}
                        fill="rgba(79,140,255,0.18)"
                        stroke="rgba(79,140,255,0.45)"
                        strokeWidth={1}
                      />
                      <text
                        x={node.x} y={node.y - s.r - 6}
                        textAnchor="middle"
                        fill="#93C5FD"
                        fontSize="10"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                        style={{ pointerEvents: 'none' }}
                      >
                        {distances[node.id]}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {/* ── Zoom hint (fades after first interaction) ── */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded pointer-events-none"
          style={{ color: '#3D4A58', background: 'rgba(11,15,20,0.7)' }}
        >
          Scroll to zoom · Drag to pan
        </div>
      </div>
    </div>
  )
}

// ── Zoom button ───────────────────────────────────────────────────────────────
function ZoomBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-100 disabled:opacity-25"
      style={{
        background: 'transparent',
        border: '1px solid #1F2630',
        color: '#6B7785',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = '#1A2130'
          e.currentTarget.style.color = '#E6EDF3'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#6B7785'
      }}
    >
      {children}
    </button>
  )
}

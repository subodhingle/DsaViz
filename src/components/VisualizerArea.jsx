import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import SortingVisualizer   from './visualizers/SortingVisualizer'
import SearchingVisualizer from './visualizers/SearchingVisualizer'
import GraphVisualizer     from './visualizers/GraphVisualizer'
import TreeVisualizer      from './visualizers/TreeVisualizer'
import CustomVisualizer    from './visualizers/CustomVisualizer'
import LogicPanel          from './LogicPanel'
import AlgorithmBuilder    from './AlgorithmBuilder'
import CustomStatePanel    from './CustomStatePanel'
import AlgoInfoPanel       from './AlgoInfoPanel'
import CodeEditor          from './CodeEditor'

const VIS_MAP = {
  sorting:            SortingVisualizer,
  'advanced-sorting': SortingVisualizer,
  searching:          SearchingVisualizer,
  graph:              GraphVisualizer,
  tree:               TreeVisualizer,
  ds:                 SortingVisualizer,
  techniques:         SortingVisualizer,
}

// ── Draggable divider ─────────────────────────────────────────────────────────
// direction: 'horizontal' (left|right) | 'vertical' (top|bottom)
// size: current panel size in px
// onResize: (newSize) => void
// min/max: clamp limits in px
function Divider({ direction = 'horizontal', onResize, min = 180, max }) {
  const dragging = useRef(false)
  const startPos = useRef(0)
  const startSize = useRef(0)

  const isH = direction === 'horizontal'

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    startPos.current  = isH ? e.clientX : e.clientY
    startSize.current = 0 // will be read from parent via callback

    const onMove = (ev) => {
      if (!dragging.current) return
      const delta = (isH ? ev.clientX : ev.clientY) - startPos.current
      onResize(delta)
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [isH, onResize])

  // Touch support
  const onTouchStart = useCallback((e) => {
    dragging.current = true
    startPos.current = isH ? e.touches[0].clientX : e.touches[0].clientY

    const onMove = (ev) => {
      if (!dragging.current) return
      const delta = (isH ? ev.touches[0].clientX : ev.touches[0].clientY) - startPos.current
      onResize(delta)
    }
    const onEnd = () => {
      dragging.current = false
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }, [isH, onResize])

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="group shrink-0 flex items-center justify-center select-none"
      style={{
        width:  isH ? 6 : '100%',
        height: isH ? '100%' : 6,
        cursor: isH ? 'col-resize' : 'row-resize',
        background: '#1A2535',
        transition: 'background 0.15s',
        zIndex: 10,
        flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#4F8CFF'}
      onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}
    >
      {/* Grip dots */}
      <div className="flex gap-[3px]" style={{ flexDirection: isH ? 'column' : 'row' }}>
        {[0,1,2].map(i => (
          <div key={i} className="rounded-full"
            style={{ width: 3, height: 3, background: 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </div>
  )
}

// ── Horizontal split (left | divider | right) ─────────────────────────────────
function HSplit({ left, right, defaultRight = 320, minLeft = 200, minRight = 200 }) {
  const containerRef = useRef(null)
  const [rightW, setRightW] = useState(defaultRight)
  const baseW = useRef(defaultRight)
  const startDelta = useRef(0)

  const onResizeStart = useCallback((delta) => {
    if (startDelta.current === 0) {
      baseW.current = rightW
      startDelta.current = delta
    }
    const newW = baseW.current - (delta - startDelta.current)
    const containerW = containerRef.current?.offsetWidth || 800
    const clamped = Math.min(Math.max(newW, minRight), containerW - minLeft)
    setRightW(clamped)
  }, [rightW, minLeft, minRight])

  // Reset on drag end
  useEffect(() => {
    const reset = () => { startDelta.current = 0 }
    window.addEventListener('mouseup', reset)
    window.addEventListener('touchend', reset)
    return () => { window.removeEventListener('mouseup', reset); window.removeEventListener('touchend', reset) }
  }, [])

  return (
    <div ref={containerRef} className="flex-1 min-h-0 flex overflow-hidden">
      <div className="flex-1 min-w-0 overflow-hidden">{left}</div>
      <Divider direction="horizontal" onResize={onResizeStart} />
      <div className="overflow-hidden shrink-0" style={{ width: rightW }}>{right}</div>
    </div>
  )
}

// ── Vertical split (top | divider | bottom) ───────────────────────────────────
function VSplit({ top, bottom, defaultBottom = 200, minTop = 120, minBottom = 120 }) {
  const containerRef = useRef(null)
  const [botH, setBotH] = useState(defaultBottom)
  const baseH = useRef(defaultBottom)
  const startDelta = useRef(0)

  const onResizeStart = useCallback((delta) => {
    if (startDelta.current === 0) {
      baseH.current = botH
      startDelta.current = delta
    }
    const newH = baseH.current - (delta - startDelta.current)
    const containerH = containerRef.current?.offsetHeight || 600
    const clamped = Math.min(Math.max(newH, minBottom), containerH - minTop)
    setBotH(clamped)
  }, [botH, minTop, minBottom])

  useEffect(() => {
    const reset = () => { startDelta.current = 0 }
    window.addEventListener('mouseup', reset)
    window.addEventListener('touchend', reset)
    return () => { window.removeEventListener('mouseup', reset); window.removeEventListener('touchend', reset) }
  }, [])

  return (
    <div ref={containerRef} className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">{top}</div>
      <Divider direction="vertical" onResize={onResizeStart} />
      <div className="overflow-hidden shrink-0" style={{ height: botH }}>{bottom}</div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VisualizerArea() {
  const { category, view, algorithm } = useStore()

  // ── Code Editor ──────────────────────────────────────────────────────────
  if (category === 'compiler') {
    return <div className="w-full h-full overflow-hidden"><CodeEditor /></div>
  }

  // ── Custom Builder ────────────────────────────────────────────────────────
  if (category === 'custom') {
    return (
      <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
        {/* Mobile: vertical split */}
        <div className="flex md:hidden w-full h-full flex-col overflow-hidden">
          <VSplit
            top={<CustomVisualizer />}
            bottom={
              <div className="h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden"><AlgorithmBuilder /></div>
              </div>
            }
            defaultBottom={260}
          />
        </div>
        {/* Desktop: horizontal split */}
        <div className="hidden md:flex w-full h-full overflow-hidden">
          <HSplit
            left={
              <VSplit
                top={<CustomVisualizer />}
                bottom={<CustomStatePanel />}
                defaultBottom={160}
                minBottom={100}
              />
            }
            right={<AlgorithmBuilder />}
            defaultRight={400}
            minRight={280}
          />
        </div>
      </div>
    )
  }

  const VisComponent = VIS_MAP[category] || SortingVisualizer

  // ── Visual only ───────────────────────────────────────────────────────────
  if (view === 'visual') {
    return (
      <motion.div key="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">
        <VSplit
          top={<VisComponent />}
          bottom={<AlgoInfoPanel algorithm={algorithm} />}
          defaultBottom={52}
          minBottom={36}
          minTop={120}
        />
      </motion.div>
    )
  }

  // ── Logic only ────────────────────────────────────────────────────────────
  if (view === 'logic') {
    return (
      <motion.div key="logic" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">
        <VSplit
          top={<LogicPanel />}
          bottom={<AlgoInfoPanel algorithm={algorithm} />}
          defaultBottom={52}
          minBottom={36}
          minTop={120}
        />
      </motion.div>
    )
  }

  // ── Split view ────────────────────────────────────────────────────────────
  return (
    <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">

      {/* Mobile: vertical stack */}
      <div className="flex md:hidden w-full h-full flex-col overflow-hidden">
        <VSplit
          top={<VisComponent />}
          bottom={
            <VSplit
              top={<LogicPanel />}
              bottom={<AlgoInfoPanel algorithm={algorithm} />}
              defaultBottom={52}
              minBottom={36}
              minTop={80}
            />
          }
          defaultBottom={280}
          minBottom={120}
        />
      </div>

      {/* Desktop: horizontal split + info panel below */}
      <div className="hidden md:flex w-full h-full flex-col overflow-hidden">
        <HSplit
          left={<VisComponent />}
          right={<LogicPanel />}
          defaultRight={320}
          minRight={220}
          minLeft={200}
        />
        <AlgoInfoPanel algorithm={algorithm} />
      </div>
    </motion.div>
  )
}

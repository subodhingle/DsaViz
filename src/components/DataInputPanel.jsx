import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Shuffle, Check, X, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react'
import useStore from '../store/useStore'
import { generateArray, generateGraph } from '../utils/generators'

// ── Array editor ──────────────────────────────────────────────────────────────
function ArrayEditor({ onClose }) {
  const { array, setArray, setSteps, searchTarget, setSearchTarget } = useStore()
  const [raw, setRaw] = useState(array.join(', '))
  const [error, setError] = useState(null)
  const [target, setTarget] = useState(String(searchTarget))

  const parse = (str) => {
    const nums = str.split(/[\s,]+/).filter(Boolean).map(Number)
    if (nums.some(isNaN)) throw new Error('All values must be numbers')
    if (nums.length < 2)  throw new Error('Enter at least 2 values')
    if (nums.length > 50) throw new Error('Maximum 50 values')
    return nums
  }

  const handleApply = () => {
    try {
      const nums = parse(raw)
      setArray(nums)
      setSearchTarget(Number(target) || nums[0])
      setSteps([])
      setError(null)
      onClose()
    } catch (e) { setError(e.message) }
  }

  const handleRandom = () => {
    const arr = generateArray(20, 5, 99)
    setRaw(arr.join(', '))
    setError(null)
  }

  const addValue = () => {
    const v = Math.floor(Math.random() * 90) + 10
    setRaw(r => r ? r + ', ' + v : String(v))
  }

  const removeLastValue = () => {
    setRaw(r => r.split(',').slice(0, -1).join(',').trim())
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: '#C8DCF0' }}>Array Values</span>
        <div className="flex gap-1">
          <button onClick={addValue} className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ background: '#1A2535', color: '#4F8CFF' }}
            onMouseEnter={e => e.currentTarget.style.background = '#243040'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}>
            <Plus size={11} />
          </button>
          <button onClick={removeLastValue} className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ background: '#1A2535', color: '#E85D5D' }}
            onMouseEnter={e => e.currentTarget.style.background = '#243040'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}>
            <Minus size={11} />
          </button>
          <button onClick={handleRandom} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors"
            style={{ background: '#1A2535', color: '#9DA7B3' }}
            onMouseEnter={e => e.currentTarget.style.background = '#243040'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}>
            <Shuffle size={10} /> Random
          </button>
        </div>
      </div>

      <textarea
        value={raw}
        onChange={e => { setRaw(e.target.value); setError(null) }}
        placeholder="e.g. 64, 34, 25, 12, 22, 11, 90"
        rows={3}
        className="w-full rounded-lg px-3 py-2 text-xs font-mono resize-none outline-none"
        style={{
          background: '#0B0F14', color: '#C8DCF0',
          border: `1px solid ${error ? 'rgba(232,93,93,0.5)' : '#1A2535'}`,
          caretColor: '#4F8CFF',
        }}
      />

      {/* Preview */}
      {!error && raw.trim() && (
        <div className="flex flex-wrap gap-1">
          {raw.split(/[\s,]+/).filter(Boolean).slice(0, 20).map((v, i) => (
            <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: '#1A2535', color: '#6EA8FF', border: '1px solid #243040' }}>
              {v}
            </span>
          ))}
          {raw.split(/[\s,]+/).filter(Boolean).length > 20 && (
            <span className="text-[10px]" style={{ color: '#4A6080' }}>+more</span>
          )}
        </div>
      )}

      {/* Search target */}
      <div className="flex items-center gap-2">
        <span className="text-[11px]" style={{ color: '#6B7785' }}>Search target:</span>
        <input type="number" value={target} onChange={e => setTarget(e.target.value)}
          className="w-20 px-2 py-1 rounded text-xs font-mono outline-none"
          style={{ background: '#0B0F14', color: '#C8DCF0', border: '1px solid #1A2535' }} />
      </div>

      {error && <p className="text-[11px]" style={{ color: '#E07070' }}>⚠ {error}</p>}

      <div className="flex gap-2 pt-1">
        <button onClick={handleApply}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: '#4F8CFF', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#6EA8FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#4F8CFF'}>
          <Check size={12} /> Apply
        </button>
        <button onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs transition-all"
          style={{ background: '#1A2535', color: '#9DA7B3' }}
          onMouseEnter={e => e.currentTarget.style.background = '#243040'}
          onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Graph editor ──────────────────────────────────────────────────────────────
function GraphEditor({ onClose }) {
  const { setGraphData, setSteps } = useStore()
  const [nodeCount, setNodeCount] = useState(7)
  const [edgesRaw, setEdgesRaw] = useState('0-1:4, 1-2:3, 2-3:2, 3-4:5, 4-5:1, 5-6:3, 0-3:7, 1-4:2')
  const [error, setError] = useState(null)

  const handleApply = () => {
    try {
      const n = Math.min(Math.max(parseInt(nodeCount) || 6, 2), 12)
      const CX = 300, CY = 250, R = 180
      const nodes = Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        return { id: i, label: String.fromCharCode(65 + i), x: Math.round(CX + Math.cos(angle) * R), y: Math.round(CY + Math.sin(angle) * R) }
      })
      const edges = []
      const edgeSet = new Set()
      for (const part of edgesRaw.split(',')) {
        const m = part.trim().match(/^(\d+)-(\d+)(?::(\d+))?$/)
        if (!m) continue
        const [, a, b, w] = m
        const src = parseInt(a), tgt = parseInt(b)
        if (src >= n || tgt >= n || src === tgt) continue
        const key = `${Math.min(src, tgt)}-${Math.max(src, tgt)}`
        if (!edgeSet.has(key)) {
          edgeSet.add(key)
          edges.push({ source: src, target: tgt, weight: w ? parseInt(w) : undefined })
        }
      }
      if (edges.length === 0) throw new Error('Add at least one edge (format: 0-1:4)')
      setGraphData({ nodes, edges })
      setSteps([])
      setError(null)
      onClose()
    } catch (e) { setError(e.message) }
  }

  const handleRandom = () => {
    const g = generateGraph(nodeCount)
    setEdgesRaw(g.edges.map(e => `${e.source}-${e.target}:${e.weight}`).join(', '))
    setError(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: '#6B7785' }}>Nodes:</span>
          <input type="number" min={2} max={12} value={nodeCount}
            onChange={e => setNodeCount(Math.min(12, Math.max(2, parseInt(e.target.value) || 2)))}
            className="w-16 px-2 py-1 rounded text-xs font-mono outline-none"
            style={{ background: '#0B0F14', color: '#C8DCF0', border: '1px solid #1A2535' }} />
        </div>
        <button onClick={handleRandom} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors"
          style={{ background: '#1A2535', color: '#9DA7B3' }}
          onMouseEnter={e => e.currentTarget.style.background = '#243040'}
          onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}>
          <Shuffle size={10} /> Random
        </button>
      </div>

      <div>
        <span className="text-[11px] block mb-1" style={{ color: '#6B7785' }}>
          Edges (format: <code style={{ color: '#4F8CFF' }}>src-tgt:weight</code>, comma separated)
        </span>
        <textarea value={edgesRaw} onChange={e => { setEdgesRaw(e.target.value); setError(null) }}
          placeholder="0-1:4, 1-2:3, 2-3:2"
          rows={3}
          className="w-full rounded-lg px-3 py-2 text-xs font-mono resize-none outline-none"
          style={{
            background: '#0B0F14', color: '#C8DCF0',
            border: `1px solid ${error ? 'rgba(232,93,93,0.5)' : '#1A2535'}`,
            caretColor: '#4F8CFF',
          }} />
      </div>

      {error && <p className="text-[11px]" style={{ color: '#E07070' }}>⚠ {error}</p>}

      <div className="flex gap-2 pt-1">
        <button onClick={handleApply}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: '#4F8CFF', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#6EA8FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#4F8CFF'}>
          <Check size={12} /> Apply
        </button>
        <button onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs transition-all"
          style={{ background: '#1A2535', color: '#9DA7B3' }}
          onMouseEnter={e => e.currentTarget.style.background = '#243040'}
          onMouseLeave={e => e.currentTarget.style.background = '#1A2535'}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Main DataInputPanel ───────────────────────────────────────────────────────
export default function DataInputPanel() {
  const { category, array } = useStore()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('array') // 'array' | 'graph'

  const isGraph = category === 'graph'
  const isTree  = category === 'tree'
  const showPanel = !['custom', 'compiler'].includes(category)

  if (!showPanel) return null

  return (
    <div style={{ borderTop: '1px solid #1A2535' }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-2 transition-colors"
        style={{ background: open ? '#0D1117' : 'transparent' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#0D1117' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <Edit3 size={12} style={{ color: '#4F8CFF' }} />
        <span className="text-xs font-semibold" style={{ color: '#C8DCF0' }}>
          Custom Data Input
        </span>
        {/* Current data preview */}
        {!isGraph && !isTree && array.length > 0 && (
          <span className="text-[10px] font-mono ml-2 truncate max-w-[120px]" style={{ color: '#4A6080' }}>
            [{array.slice(0, 6).join(', ')}{array.length > 6 ? '…' : ''}]
          </span>
        )}
        <span className="ml-auto" style={{ color: '#3A5070' }}>
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2" style={{ background: '#0D1117' }}>
              {/* Tab selector for graph categories */}
              {isGraph && (
                <div className="flex gap-1 mb-3">
                  {['array', 'graph'].map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      className="px-3 py-1 rounded text-xs font-medium transition-all"
                      style={mode === m
                        ? { background: '#4F8CFF', color: '#fff' }
                        : { background: '#1A2535', color: '#6B7785' }}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Editor */}
              {(!isGraph || mode === 'array') && !isTree && (
                <ArrayEditor onClose={() => setOpen(false)} />
              )}
              {isGraph && mode === 'graph' && (
                <GraphEditor onClose={() => setOpen(false)} />
              )}
              {isTree && (
                <div className="text-xs py-2" style={{ color: '#4A6080' }}>
                  Tree data is auto-generated on Run. Use the Custom Builder to define your own logic.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

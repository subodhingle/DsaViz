import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Square, SkipForward, RotateCcw, Info, X,
  Terminal, ChevronRight, Circle, Hash, Activity,
  BookOpen, Trash2
} from 'lucide-react'
import useStore from '../store/useStore'
import { parseUserAlgorithm } from '../engine/logicParser'
import { defaultUserCode } from '../utils/generators'

// ── API reference entries ─────────────────────────────────────────────────────
const API_REF = [
  { fn: 'compare(i, j)',   ret: 'boolean', color: '#E6A23C', desc: 'true if arr[i] > arr[j] — emits amber comparison step' },
  { fn: 'swap(i, j)',      ret: 'void',    color: '#E85D5D', desc: 'swaps arr[i] ↔ arr[j] — emits red swap step' },
  { fn: 'set(i, value)',   ret: 'void',    color: '#4F8CFF', desc: 'sets arr[i] = value — emits blue highlight step' },
  { fn: 'highlight(i)',    ret: 'void',    color: '#4F8CFF', desc: 'highlights index i in blue' },
  { fn: 'mark(i)',         ret: 'void',    color: '#5BCB8A', desc: 'marks index i as sorted/done (green)' },
  { fn: 'markAll()',       ret: 'void',    color: '#5BCB8A', desc: 'marks all indices as done' },
  { fn: 'pivot(i)',        ret: 'void',    color: '#A78BFA', desc: 'marks index i as pivot (violet)' },
  { fn: 'log(msg)',        ret: 'void',    color: '#9DA7B3', desc: 'emits a message step (shown in output)' },
  { fn: 'setVar(k, v)',    ret: 'void',    color: '#9DA7B3', desc: 'tracks a named variable in the variables panel' },
  { fn: 'snapshot()',      ret: 'void',    color: '#9DA7B3', desc: 'captures current array state as a step' },
  { fn: 'n',               ret: 'number',  color: '#C8873A', desc: 'array length (read-only)' },
  { fn: 'arr',             ret: 'number[]',color: '#C8873A', desc: 'copy of current array (read-only)' },
]

// ── Code templates ────────────────────────────────────────────────────────────
const TEMPLATES = {
  bubble: `// Bubble Sort
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - 1 - i; j++) {
    if (compare(j, j + 1)) {
      swap(j, j + 1);
    }
  }
  mark(n - 1 - i);
}
markAll();`,

  selection: `// Selection Sort
for (let i = 0; i < n - 1; i++) {
  let minIdx = i;
  highlight(minIdx);
  for (let j = i + 1; j < n; j++) {
    if (compare(minIdx, j)) {
      highlight(j);
      minIdx = j;
    }
  }
  if (minIdx !== i) swap(i, minIdx);
  mark(i);
}
mark(n - 1);`,

  insertion: `// Insertion Sort
for (let i = 1; i < n; i++) {
  let j = i;
  highlight(j);
  while (j > 0 && compare(j - 1, j)) {
    swap(j - 1, j);
    j--;
  }
  mark(i);
}`,

  linear: `// Linear Search — find value 42
const target = 42;
log("Searching for " + target);
for (let i = 0; i < n; i++) {
  highlight(i);
  if (arr[i] === target) {
    mark(i);
    log("Found at index " + i);
    break;
  }
}`,
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AlgorithmBuilder() {
  const {
    array, userCode, setUserCode,
    steps, setSteps, setIsPlaying,
    currentStep,
    breakpoints, toggleBreakpoint, clearBreakpoints,
    execLog, appendLog, clearLog,
  } = useStore()

  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState('editor')   // 'editor' | 'api' | 'log'
  const [showTemplates, setShowTemplates] = useState(false)

  const textareaRef = useRef(null)
  const lineNumRef  = useRef(null)

  // Init default code
  useEffect(() => { if (!userCode) setUserCode(defaultUserCode) }, [])

  // Sync line-number scroll
  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current)
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop
  }, [])

  // Active line from current step
  const activeLine = steps[currentStep]?.line ?? -1

  // Scroll active line into view in line-number gutter
  useEffect(() => {
    if (!lineNumRef.current || activeLine < 0) return
    const lineH = 25.6 // 1.6rem at 16px base
    const top = activeLine * lineH - lineNumRef.current.clientHeight / 2
    lineNumRef.current.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, [activeLine])

  // ── Run ──
  const handleRun = () => {
    setError(null)
    clearLog()
    try {
      const code = userCode || defaultUserCode
      const result = parseUserAlgorithm(code, array)
      // Append messages to exec log
      result.forEach(s => {
        if (s.message) appendLog({ type: s.type, text: s.message, line: s.line })
        if (s.error)   appendLog({ type: 'error', text: s.error, line: s.line })
      })
      setSteps(result)
      setIsPlaying(true)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleReset = () => {
    setUserCode(defaultUserCode)
    clearBreakpoints()
    clearLog()
    setError(null)
    setTimeout(() => {
      if (textareaRef.current) { textareaRef.current.scrollTop = 0; syncScroll() }
    }, 0)
  }

  const handleStop = () => setIsPlaying(false)

  const applyTemplate = (key) => {
    setUserCode(TEMPLATES[key])
    setShowTemplates(false)
    setTimeout(() => {
      if (textareaRef.current) { textareaRef.current.scrollTop = 0; syncScroll() }
    }, 0)
  }

  const code  = userCode || defaultUserCode
  const lines = code.split('\n')

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0B0F14' }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid #1A2535', background: '#0D1117' }}>

        <div className="flex items-center gap-2">
          <Terminal size={13} style={{ color: '#4F8CFF' }} />
          <span className="text-xs font-semibold" style={{ color: '#C8DCF0' }}>
            Algorithm Builder
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(79,140,255,0.12)', color: '#6EA8FF', border: '1px solid rgba(79,140,255,0.18)' }}>
            {lines.length}L
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Templates */}
          <div className="relative">
            <HBtn onClick={() => setShowTemplates(v => !v)} title="Templates" active={showTemplates}>
              <BookOpen size={12} />
            </HBtn>
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 z-50 rounded-lg overflow-hidden"
                  style={{ background: '#0F141A', border: '1px solid #1F2630', width: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                >
                  {Object.entries(TEMPLATES).map(([key]) => (
                    <button key={key} onClick={() => applyTemplate(key)}
                      className="w-full text-left px-3 py-2 text-xs transition-colors"
                      style={{ color: '#9DA7B3', borderBottom: '1px solid #1A2535' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1A2535'; e.currentTarget.style.color = '#E6EDF3' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9DA7B3' }}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)} Sort{key === 'linear' ? '' : ''}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <HBtn onClick={handleReset} title="Reset"><RotateCcw size={12} /></HBtn>
          <HBtn onClick={clearBreakpoints} title="Clear breakpoints"><Trash2 size={12} /></HBtn>

          {/* Stop */}
          <HBtn onClick={handleStop} title="Stop playback"><Square size={12} /></HBtn>

          {/* Run */}
          <button onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ml-1 transition-all"
            style={{ background: '#4F8CFF', color: '#fff', boxShadow: '0 0 0 1px rgba(79,140,255,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6EA8FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#4F8CFF'}
          >
            <Play size={11} fill="white" /> Run
          </button>
        </div>
      </div>

      {/* ══ TAB BAR ═════════════════════════════════════════════════════════ */}
      <div className="shrink-0 flex" style={{ borderBottom: '1px solid #1A2535', background: '#0D1117' }}>
        {[
          { id: 'editor', icon: Terminal,  label: 'Editor'    },
          { id: 'api',    icon: BookOpen,  label: 'API Ref'   },
          { id: 'log',    icon: Activity,  label: `Log${execLog.length ? ` (${execLog.length})` : ''}` },
        ].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium transition-colors relative"
            style={{
              color: activeTab === id ? '#C8DCF0' : '#4A6080',
              borderBottom: activeTab === id ? '2px solid #4F8CFF' : '2px solid transparent',
            }}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* ══ EDITOR TAB ══════════════════════════════════════════════════════ */}
      {activeTab === 'editor' && (
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* Breakpoint gutter + line numbers */}
          <div ref={lineNumRef}
            className="shrink-0 overflow-hidden select-none"
            style={{ width: 56, background: '#0D1117', borderRight: '1px solid #1A2535', overflowY: 'hidden' }}
            aria-hidden="true"
          >
            <div style={{ paddingTop: 14, paddingBottom: 14 }}>
              {lines.map((_, i) => {
                const isBP     = breakpoints.has(i)
                const isActive = activeLine === i
                return (
                  <div key={i}
                    className="flex items-center justify-end pr-2 cursor-pointer group"
                    style={{ height: '1.6rem', gap: 4 }}
                    onClick={() => toggleBreakpoint(i)}
                    title={isBP ? 'Remove breakpoint' : 'Add breakpoint'}
                  >
                    {/* Breakpoint dot */}
                    <div className="w-2 h-2 rounded-full transition-all"
                      style={{
                        background: isBP ? '#E85D5D' : 'transparent',
                        border: isBP ? 'none' : '1px solid transparent',
                        boxShadow: isBP ? '0 0 6px rgba(232,93,93,0.6)' : 'none',
                      }}
                    />
                    {/* Line number */}
                    <span style={{
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: isActive ? '#4F8CFF' : isBP ? '#E85D5D' : '#2A3A50',
                      fontWeight: isActive ? 700 : 400,
                      minWidth: 20,
                      textAlign: 'right',
                    }}>
                      {i + 1}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Code textarea with active-line overlay */}
          <div className="flex-1 relative overflow-hidden min-w-0">
            {/* Active line highlight overlay */}
            {activeLine >= 0 && (
              <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: 14 + activeLine * 25.6,
                  height: 25.6,
                  background: 'rgba(79,140,255,0.08)',
                  borderLeft: '2px solid #4F8CFF',
                }}
              />
            )}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setUserCode(e.target.value)}
              onScroll={syncScroll}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              className="w-full h-full resize-none outline-none"
              style={{
                background: 'transparent',
                color: '#C8DCF0',
                caretColor: '#4F8CFF',
                fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
                fontSize: 12.5,
                lineHeight: '1.6rem',
                tabSize: 2,
                padding: '14px 16px',
                border: 'none',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      )}

      {/* ══ API REFERENCE TAB ═══════════════════════════════════════════════ */}
      {activeTab === 'api' && (
        <div className="flex-1 overflow-y-auto" style={{ background: '#0B0F14' }}>
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#2A3A50' }}>
              Available Functions
            </p>
            {API_REF.map(({ fn, ret, color, desc }) => (
              <div key={fn}
                className="rounded-lg p-3"
                style={{ background: '#0D1117', border: '1px solid #1A2535' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[12px] font-mono font-bold" style={{ color }}>
                    {fn}
                  </code>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: '#1A2535', color: '#4A6080' }}>
                    → {ret}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: '#5A7A9A' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ EXECUTION LOG TAB ═══════════════════════════════════════════════ */}
      {activeTab === 'log' && (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0B0F14' }}>
          <div className="shrink-0 flex items-center justify-between px-4 py-2"
            style={{ borderBottom: '1px solid #1A2535' }}>
            <span className="text-[10px] font-mono" style={{ color: '#2A3A50' }}>
              {execLog.length} entries
            </span>
            <button onClick={clearLog}
              className="text-[10px] font-mono transition-colors"
              style={{ color: '#2A3A50' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E85D5D'}
              onMouseLeave={e => e.currentTarget.style.color = '#2A3A50'}
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-[11px]">
            {execLog.length === 0 ? (
              <p className="text-center py-8" style={{ color: '#2A3A50' }}>
                Run your algorithm to see output
              </p>
            ) : (
              execLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <span style={{ color: '#2A3A50', minWidth: 28 }}>{i + 1}</span>
                  <span style={{ color: '#2A3A50', minWidth: 16 }}>
                    {entry.line >= 0 ? `L${entry.line + 1}` : '  '}
                  </span>
                  <span style={{
                    color: entry.type === 'error' ? '#E07070'
                         : entry.type === 'done'  ? '#5BCB8A'
                         : '#7A9AB8',
                  }}>
                    {entry.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ══ ERROR BAR ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div className="flex items-start gap-2 px-4 py-2.5 text-[11px] font-mono"
              style={{ background: 'rgba(232,93,93,0.08)', borderTop: '1px solid rgba(232,93,93,0.25)', color: '#E07070' }}>
              <ChevronRight size={11} className="shrink-0 mt-0.5" />
              <span className="flex-1 break-all">{error}</span>
              <button onClick={() => setError(null)} className="shrink-0 opacity-50 hover:opacity-100">
                <X size={11} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ STATUS BAR ══════════════════════════════════════════════════════ */}
      <div className="shrink-0 flex items-center gap-4 px-4 py-1"
        style={{ borderTop: '1px solid #1A2535', background: '#0D1117' }}>
        <span className="text-[10px] font-mono" style={{ color: '#2A3A50' }}>JS</span>
        <span className="text-[10px] font-mono" style={{ color: '#2A3A50' }}>n={array.length}</span>
        {breakpoints.size > 0 && (
          <span className="text-[10px] font-mono" style={{ color: '#E85D5D' }}>
            {breakpoints.size} bp
          </span>
        )}
        {steps.length > 0 && (
          <span className="text-[10px] font-mono" style={{ color: '#4A6080' }}>
            {steps.length} steps
          </span>
        )}
        <span className="ml-auto text-[10px] font-mono" style={{ color: '#2A3A50' }}>UTF-8</span>
      </div>
    </div>
  )
}

// ── Header button ─────────────────────────────────────────────────────────────
function HBtn({ children, onClick, title, active }) {
  return (
    <button onClick={onClick} title={title}
      className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-100"
      style={{
        background: active ? '#1A2535' : 'transparent',
        color: active ? '#C8DCF0' : '#4A6080',
        border: `1px solid ${active ? '#2A3A50' : 'transparent'}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#1A2535'; e.currentTarget.style.color = '#C8DCF0' }}
      onMouseLeave={e => {
        if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A6080' }
      }}
    >
      {children}
    </button>
  )
}

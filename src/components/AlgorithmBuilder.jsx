import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, X, Terminal, RotateCcw, ChevronRight } from 'lucide-react'
import useStore from '../store/useStore'
import { parseUserAlgorithm } from '../engine/logicParser'
import { defaultUserCode } from '../utils/generators'

const API_DOCS = [
  { fn: 'compare(i, j)', desc: 'true if arr[i] > arr[j] — logs comparison step' },
  { fn: 'swap(i, j)',    desc: 'swaps arr[i] ↔ arr[j] — logs swap step' },
  { fn: 'mark(i)',       desc: 'marks index i as sorted (green)' },
  { fn: 'set(name, v)',  desc: 'logs a named variable to the panel' },
  { fn: 'n',             desc: 'array length' },
]

export default function AlgorithmBuilder() {
  const { array, userCode, setUserCode, setSteps, setIsPlaying } = useStore()
  const [error, setError]       = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const textareaRef  = useRef(null)
  const lineNumRef   = useRef(null)

  // Init default code
  useEffect(() => { if (!userCode) setUserCode(defaultUserCode) }, [])

  // Sync line-number scroll with textarea scroll
  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  const handleReset = () => {
    setUserCode(defaultUserCode)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = 0
        syncScroll()
      }
    }, 0)
  }

  const handleRun = () => {
    setError(null)
    try {
      const code = userCode || defaultUserCode
      const steps = parseUserAlgorithm(code, array)
      setSteps(steps)
      setIsPlaying(true)
    } catch (e) {
      setError(e.message)
    }
  }

  const code = userCode || defaultUserCode
  const lines = code.split('\n')

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#0B0F14' }}
    >
      {/* ── Header ── */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '1px solid #1F2630', background: '#0F141A' }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={13} style={{ color: '#4F8CFF' }} />
          <span className="text-xs font-semibold" style={{ color: '#E6EDF3' }}>
            Algorithm Builder
          </span>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded ml-1"
            style={{ background: 'rgba(79,140,255,0.12)', color: '#6EA8FF', border: '1px solid rgba(79,140,255,0.2)' }}
          >
            {lines.length} lines
          </span>
        </div>
        <div className="flex items-center gap-1">
          <HBtn onClick={handleReset} title="Reset to default"><RotateCcw size={12} /></HBtn>
          <HBtn onClick={() => setShowHelp(v => !v)} title="API reference" active={showHelp}>
            <Info size={12} />
          </HBtn>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ml-1 transition-all"
            style={{
              background: '#4F8CFF',
              color: '#fff',
              boxShadow: '0 0 0 1px rgba(79,140,255,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#6EA8FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#4F8CFF'}
          >
            <Play size={11} fill="white" /> Run
          </button>
        </div>
      </div>

      {/* ── API Help ── */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 overflow-hidden"
            style={{ borderBottom: '1px solid #1F2630', background: '#0F141A' }}
          >
            <div className="px-4 py-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#3D4A58' }}>
                Available API
              </p>
              {API_DOCS.map(({ fn, desc }) => (
                <div key={fn} className="flex items-start gap-3">
                  <code className="shrink-0 text-[11px] font-mono font-bold" style={{ color: '#4F8CFF' }}>
                    {fn}
                  </code>
                  <span className="text-[11px]" style={{ color: '#6B7785' }}>{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Editor ── */}
      <div className="flex-1 flex overflow-hidden min-h-0" style={{ background: '#0B0F14' }}>

        {/* Line numbers — scrolls in sync with textarea */}
        <div
          ref={lineNumRef}
          className="shrink-0 overflow-hidden select-none"
          style={{
            width: 48,
            background: '#0D1117',
            borderRight: '1px solid #1F2630',
            paddingTop: 14,
            paddingBottom: 14,
            overflowY: 'hidden',
          }}
          aria-hidden="true"
        >
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                height: '1.6rem',
                lineHeight: '1.6rem',
                textAlign: 'right',
                paddingRight: 10,
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#3D4A58',
                userSelect: 'none',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => setUserCode(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 resize-none outline-none min-h-0"
          style={{
            background: '#0B0F14',
            color: '#C8DCF0',
            caretColor: '#4F8CFF',
            fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
            fontSize: 12.5,
            lineHeight: '1.6rem',
            tabSize: 2,
            padding: '14px 16px',
            border: 'none',
          }}
        />
      </div>

      {/* ── Output / Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div
              className="flex items-start gap-2 px-4 py-2.5 text-[11px] font-mono"
              style={{
                background: 'rgba(232,93,93,0.08)',
                borderTop: '1px solid rgba(232,93,93,0.25)',
                color: '#E07070',
              }}
            >
              <ChevronRight size={11} className="shrink-0 mt-0.5" />
              <span className="flex-1 break-all">{error}</span>
              <button
                onClick={() => setError(null)}
                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status bar ── */}
      <div
        className="shrink-0 flex items-center gap-4 px-4 py-1.5"
        style={{ borderTop: '1px solid #1F2630', background: '#0D1117' }}
      >
        <span className="text-[10px] font-mono" style={{ color: '#3D4A58' }}>
          JS-like syntax
        </span>
        <span className="text-[10px] font-mono" style={{ color: '#3D4A58' }}>
          arr.length = {array.length}
        </span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: '#3D4A58' }}>
          UTF-8
        </span>
      </div>
    </div>
  )
}

function HBtn({ children, onClick, title, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-100"
      style={{
        background: active ? '#1A2130' : 'transparent',
        color: active ? '#E6EDF3' : '#6B7785',
        border: `1px solid ${active ? '#2A3441' : 'transparent'}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#1A2130'; e.currentTarget.style.color = '#E6EDF3' }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#6B7785'
        }
      }}
    >
      {children}
    </button>
  )
}

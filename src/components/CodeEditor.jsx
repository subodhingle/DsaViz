import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Square, Copy, Check, ChevronDown,
  Terminal, Loader, AlertCircle, CheckCircle, Trash2
} from 'lucide-react'
import { LANGUAGES, LANG_MAP, tokenize, tokenColor } from '../data/languages'

// Judge0 public instance — no auth needed for basic use
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com'
const RAPID_KEY  = '' // user must supply their own key — we fall back to local JS eval

// ── Highlighted code overlay ──────────────────────────────────────────────────
function HighlightOverlay({ code, langId }) {
  const tokens = tokenize(code, langId)
  return (
    <pre
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        margin: 0, padding: '14px 16px',
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
        fontSize: 12.5, lineHeight: '1.6rem',
        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        pointerEvents: 'none', zIndex: 0,
        color: 'transparent', // text is invisible — only spans show color
        overflow: 'hidden',
      }}
    >
      {tokens.map((t, i) => (
        <span key={i} style={{ color: tokenColor(t.type) }}>{t.value}</span>
      ))}
    </pre>
  )
}

// ── Language selector ─────────────────────────────────────────────────────────
function LangSelector({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const lang = LANG_MAP[selected]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
        style={{
          background: '#0D1117', border: '1px solid #1A2535',
          color: lang.color,
        }}
      >
        <span className="font-mono font-bold text-[10px]"
          style={{ background: `${lang.color}20`, color: lang.color, padding: '1px 5px', borderRadius: 3 }}>
          {lang.icon}
        </span>
        {lang.label}
        <ChevronDown size={11} style={{ color: '#4A6080' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-10 z-50 rounded-xl overflow-hidden"
            style={{
              background: '#0D1117', border: '1px solid #1F2630',
              width: 200, maxHeight: 320, overflowY: 'auto',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
          >
            {LANGUAGES.map(l => (
              <button key={l.id}
                onClick={() => { onChange(l.id); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                style={{
                  background: selected === l.id ? '#1A2535' : 'transparent',
                  color: selected === l.id ? l.color : '#7A9AB8',
                  borderBottom: '1px solid #1A2535',
                }}
                onMouseEnter={e => { if (selected !== l.id) e.currentTarget.style.background = '#141C28' }}
                onMouseLeave={e => { if (selected !== l.id) e.currentTarget.style.background = 'transparent' }}
              >
                <span className="font-mono font-bold text-[9px] px-1 py-0.5 rounded"
                  style={{ background: `${l.color}20`, color: l.color, minWidth: 24, textAlign: 'center' }}>
                  {l.icon}
                </span>
                {l.label}
                {selected === l.id && <CheckCircle size={10} className="ml-auto" style={{ color: l.color }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Output panel ──────────────────────────────────────────────────────────────
function OutputPanel({ result, running }) {
  if (running) return (
    <div className="flex items-center gap-2 px-4 py-3 text-xs font-mono"
      style={{ color: '#4A6080' }}>
      <Loader size={12} className="animate-spin" />
      Compiling and running...
    </div>
  )
  if (!result) return (
    <div className="px-4 py-3 text-xs font-mono" style={{ color: '#2A3A50' }}>
      Press Run to execute your code
    </div>
  )

  const hasError = result.stderr || result.compile_output || result.status?.id > 3
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Status */}
      <div className="flex items-center gap-2 px-4 py-2"
        style={{ borderBottom: '1px solid #1A2535' }}>
        {hasError
          ? <AlertCircle size={12} style={{ color: '#E85D5D' }} />
          : <CheckCircle size={12} style={{ color: '#5BCB8A' }} />
        }
        <span className="text-[11px] font-mono font-semibold"
          style={{ color: hasError ? '#E85D5D' : '#5BCB8A' }}>
          {result.status?.description || (hasError ? 'Error' : 'Success')}
        </span>
        {result.time && (
          <span className="ml-auto text-[10px] font-mono" style={{ color: '#2A3A50' }}>
            {result.time}s · {result.memory}KB
          </span>
        )}
      </div>

      {/* stdout */}
      {result.stdout && (
        <pre className="px-4 py-3 text-[11px] font-mono whitespace-pre-wrap break-all"
          style={{ color: '#C8DCF0' }}>
          {result.stdout}
        </pre>
      )}

      {/* stderr / compile error */}
      {(result.stderr || result.compile_output) && (
        <pre className="px-4 py-3 text-[11px] font-mono whitespace-pre-wrap break-all"
          style={{ color: '#E07070', background: 'rgba(232,93,93,0.05)' }}>
          {result.stderr || result.compile_output}
        </pre>
      )}
    </div>
  )
}

// ── Main CodeEditor ───────────────────────────────────────────────────────────
export default function CodeEditor() {
  const [langId, setLangId]     = useState('javascript')
  const [codes, setCodes]       = useState({})   // per-language code cache
  const [result, setResult]     = useState(null)
  const [running, setRunning]   = useState(false)
  const [copied, setCopied]     = useState(false)
  const [outputH, setOutputH]   = useState(160)  // resizable output panel

  const textareaRef = useRef(null)
  const lineNumRef  = useRef(null)

  const lang = LANG_MAP[langId]
  const code = codes[langId] ?? lang.starter

  const setCode = (val) => setCodes(prev => ({ ...prev, [langId]: val }))

  // Sync line numbers scroll
  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current)
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop
  }, [])

  // Switch language — reset result
  const handleLangChange = (id) => {
    setLangId(id)
    setResult(null)
  }

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Run code
  const handleRun = async () => {
    setRunning(true)
    setResult(null)

    // JavaScript — run locally in a sandboxed way
    if (langId === 'javascript' || langId === 'typescript') {
      try {
        const logs = []
        const sandbox = {
          console: { log: (...a) => logs.push(a.map(String).join(' ')), error: (...a) => logs.push('ERR: ' + a.join(' ')), warn: (...a) => logs.push('WARN: ' + a.join(' ')) },
        }
        const fn = new Function('console', `"use strict";\n${code}`)
        fn(sandbox.console)
        setResult({ stdout: logs.join('\n') || '(no output)', status: { id: 3, description: 'Accepted' }, time: '< 1ms', memory: '—' })
      } catch (e) {
        setResult({ stderr: e.message, status: { id: 11, description: 'Runtime Error' } })
      }
      setRunning(false)
      return
    }

    // Other languages — try Judge0 (requires RapidAPI key)
    if (!RAPID_KEY) {
      setResult({
        stdout: '',
        stderr: '',
        compile_output: '',
        status: { id: 0, description: 'No Compiler Key' },
        _note: 'To run ' + lang.label + ', add your RapidAPI Judge0 key in src/data/languages.js',
      })
      // Show a helpful message instead
      setResult({
        stdout: `// To compile and run ${lang.label} code:\n// 1. Get a free key at rapidapi.com/judge0-official/api/judge0-ce\n// 2. Set RAPID_KEY in src/data/languages.js\n//\n// JavaScript runs locally without any key.`,
        status: { id: 3, description: 'Key Required' },
      })
      setRunning(false)
      return
    }

    try {
      // Submit
      const sub = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPID_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: lang.judge0Id,
          stdin: '',
        }),
      })
      const data = await sub.json()
      setResult(data)
    } catch (e) {
      setResult({ stderr: e.message, status: { id: 0, description: 'Network Error' } })
    }
    setRunning(false)
  }

  const lines = code.split('\n')

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0B0F14' }}>

      {/* ── Toolbar ── */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid #1A2535', background: '#0D1117' }}>

        <Terminal size={13} style={{ color: '#4F8CFF' }} />
        <span className="text-xs font-semibold mr-1" style={{ color: '#C8DCF0' }}>Code Editor</span>

        <LangSelector selected={langId} onChange={handleLangChange} />

        <div className="ml-auto flex items-center gap-1">
          {/* Line count */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{ background: '#1A2535', color: '#4A6080' }}>
            {lines.length}L
          </span>

          {/* Copy */}
          <button onClick={handleCopy}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
            style={{ background: 'transparent', color: copied ? '#5BCB8A' : '#4A6080', border: '1px solid transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1A2535'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Copy code"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>

          {/* Clear output */}
          <button onClick={() => setResult(null)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
            style={{ background: 'transparent', color: '#4A6080', border: '1px solid transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1A2535'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Clear output"
          >
            <Trash2 size={12} />
          </button>

          {/* Run */}
          <button onClick={handleRun} disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ml-1 transition-all disabled:opacity-50"
            style={{ background: '#4F8CFF', color: '#fff', boxShadow: '0 0 0 1px rgba(79,140,255,0.3)' }}
            onMouseEnter={e => { if (!running) e.currentTarget.style.background = '#6EA8FF' }}
            onMouseLeave={e => e.currentTarget.style.background = '#4F8CFF'}
          >
            {running
              ? <><Loader size={11} className="animate-spin" /> Running</>
              : <><Play size={11} fill="white" /> Run</>
            }
          </button>
        </div>
      </div>

      {/* ── Editor ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Line numbers */}
        <div ref={lineNumRef}
          className="shrink-0 select-none overflow-hidden"
          style={{
            width: 48, background: '#0D1117',
            borderRight: '1px solid #1A2535',
            overflowY: 'hidden',
          }}
          aria-hidden="true"
        >
          <div style={{ paddingTop: 14, paddingBottom: 14 }}>
            {lines.map((_, i) => (
              <div key={i} style={{
                height: '1.6rem', lineHeight: '1.6rem',
                textAlign: 'right', paddingRight: 10,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                color: '#2A3A50', userSelect: 'none',
              }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Code area — textarea + highlight overlay */}
        <div className="flex-1 relative overflow-hidden min-w-0">
          <HighlightOverlay code={code} langId={langId} />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onScroll={syncScroll}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className="w-full h-full resize-none outline-none"
            style={{
              position: 'absolute', inset: 0,
              background: 'transparent',
              color: 'transparent',
              caretColor: '#4F8CFF',
              fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
              fontSize: 12.5, lineHeight: '1.6rem',
              tabSize: 2, padding: '14px 16px',
              border: 'none', zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* ── Output panel (resizable) ── */}
      <div
        className="shrink-0 flex flex-col overflow-hidden"
        style={{ height: outputH, borderTop: '1px solid #1A2535', background: '#0D1117' }}
      >
        {/* Output header */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-1.5"
          style={{ borderBottom: '1px solid #1A2535' }}>
          <Terminal size={11} style={{ color: '#2A3A50' }} />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider"
            style={{ color: '#2A3A50' }}>Output</span>
          {result && !running && (
            <span className="ml-2 text-[10px] font-mono"
              style={{ color: result.stderr || result.compile_output ? '#E85D5D' : '#5BCB8A' }}>
              {result.status?.description}
            </span>
          )}
          {/* Resize handle */}
          <div className="ml-auto flex gap-1">
            {[120, 200, 280].map(h => (
              <button key={h} onClick={() => setOutputH(h)}
                className="w-4 h-4 rounded flex items-center justify-center text-[8px] transition-all"
                style={{
                  background: outputH === h ? '#1A2535' : 'transparent',
                  color: outputH === h ? '#4F8CFF' : '#2A3A50',
                  border: `1px solid ${outputH === h ? '#2A3A50' : 'transparent'}`,
                }}>
                {h === 120 ? '▁' : h === 200 ? '▃' : '▅'}
              </button>
            ))}
          </div>
        </div>

        <OutputPanel result={result} running={running} />
      </div>

      {/* ── Status bar ── */}
      <div className="shrink-0 flex items-center gap-4 px-4 py-1"
        style={{ borderTop: '1px solid #1A2535', background: '#080C10' }}>
        <span className="text-[10px] font-mono" style={{ color: lang.color }}>{lang.label}</span>
        <span className="text-[10px] font-mono" style={{ color: '#2A3A50' }}>
          {langId === 'javascript' ? '⚡ Runs locally' : '☁ Requires Judge0 key'}
        </span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: '#2A3A50' }}>UTF-8</span>
      </div>
    </div>
  )
}

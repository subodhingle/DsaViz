import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Code2, Hash } from 'lucide-react'
import useStore from '../store/useStore'
import { pseudocode } from '../algorithms/pseudocode'

export default function LogicPanel() {
  const { algorithm, steps, currentStep } = useStore()
  const step = steps[currentStep]
  const lines = pseudocode[algorithm] || []
  const highlightLine = step?.highlightLine ?? -1
  const variables = step?.variables || {}

  // Auto-scroll active line into view
  const activeLineRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      const container = scrollRef.current
      const el = activeLineRef.current
      const elTop = el.offsetTop
      const elBot = elTop + el.offsetHeight
      const cTop = container.scrollTop
      const cBot = cTop + container.clientHeight
      if (elTop < cTop + 40 || elBot > cBot - 40) {
        container.scrollTo({ top: elTop - container.clientHeight / 2 + el.offsetHeight / 2, behavior: 'smooth' })
      }
    }
  }, [highlightLine])

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#0F141A' }}
    >
      {/* ── Header ── */}
      <div
        className="shrink-0 flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: '1px solid #1F2630', background: '#0F141A' }}
      >
        <Code2 size={13} style={{ color: '#4F8CFF' }} />
        <span className="text-xs font-semibold tracking-wide" style={{ color: '#E6EDF3' }}>
          Pseudocode
        </span>
        {highlightLine >= 0 && (
          <span
            className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded"
            style={{ background: 'rgba(79,140,255,0.15)', color: '#6EA8FF', border: '1px solid rgba(79,140,255,0.3)' }}
          >
            line {highlightLine + 1}
          </span>
        )}
      </div>

      {/* ── Code lines ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ background: '#0B0F14' }}
      >
        {lines.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs" style={{ color: '#3D4A58' }}>No pseudocode available</p>
          </div>
        ) : (
          <div className="py-3">
            {lines.map((line, i) => {
              const isActive = highlightLine === i
              // Indent detection — count leading spaces
              const indent = line.match(/^(\s*)/)[1].length

              return (
                <div
                  key={i}
                  ref={isActive ? activeLineRef : null}
                  className="flex items-stretch min-h-[28px] group"
                  style={{
                    background: isActive ? 'rgba(79,140,255,0.10)' : 'transparent',
                    borderLeft: isActive ? '3px solid #4F8CFF' : '3px solid transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Line number gutter */}
                  <div
                    className="shrink-0 flex items-center justify-end pr-3 pl-3 select-none"
                    style={{
                      width: 40,
                      color: isActive ? '#4F8CFF' : '#3D4A58',
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: isActive ? 700 : 400,
                      borderRight: '1px solid #1F2630',
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Code text */}
                  <div
                    className="flex-1 flex items-center px-3 py-1 overflow-hidden"
                  >
                    <span
                      className="text-[12.5px] font-mono leading-relaxed"
                      style={{
                        color: isActive ? '#E6EDF3' : '#7A8FA8',
                        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
                        fontWeight: isActive ? 500 : 400,
                        paddingLeft: indent * 6,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        width: '100%',
                      }}
                      title={line.trim()}
                    >
                      {line.trim() || '\u00A0'}
                    </span>
                  </div>

                  {/* Exec badge */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="shrink-0 flex items-center pr-3"
                    >
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(79,140,255,0.2)',
                          color: '#6EA8FF',
                          border: '1px solid rgba(79,140,255,0.35)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        ▶ exec
                      </span>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Variables ── */}
      <div style={{ borderTop: '1px solid #1F2630', background: '#0F141A' }}>
        {/* Variables header */}
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: '1px solid #1F2630' }}
        >
          <Hash size={11} style={{ color: '#3D4A58' }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3D4A58' }}>
            Variables
          </span>
          <span className="ml-auto text-[10px] font-mono" style={{ color: '#3D4A58' }}>
            {Object.keys(variables).length} bound
          </span>
        </div>

        {/* Variable grid */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: 140, padding: '8px 12px' }}
        >
          {Object.keys(variables).length === 0 ? (
            <p className="text-[11px] py-2 text-center" style={{ color: '#3D4A58' }}>
              Run the algorithm to see variables
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(variables).map(([key, val]) => (
                <motion.div
                  key={key}
                  layout
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md overflow-hidden"
                  style={{
                    background: '#151B23',
                    border: '1px solid #1F2630',
                  }}
                >
                  <span
                    className="text-[11px] font-mono font-bold shrink-0"
                    style={{ color: '#4F8CFF' }}
                  >
                    {key}
                  </span>
                  <span
                    className="text-[11px] font-mono ml-2 truncate"
                    style={{ color: '#C8DCF0' }}
                    title={String(val)}
                  >
                    {String(val)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

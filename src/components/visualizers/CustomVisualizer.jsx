import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

// ── Bar color per event type ──────────────────────────────────────────────────
function getBarStyle(i, step) {
  const { comparing = [], swapping = [], sorted = [], highlighted = [], pivot } = step
  if (swapping.includes(i))    return { top: '#E85D5D', bot: '#B03030', glow: 'rgba(232,93,93,0.55)',  label: 'Swap'     }
  if (comparing.includes(i))   return { top: '#E6A23C', bot: '#B07010', glow: 'rgba(230,162,60,0.55)', label: 'Compare'  }
  if (pivot === i)             return { top: '#A78BFA', bot: '#7050C0', glow: 'rgba(167,139,250,0.5)', label: 'Pivot'    }
  if (highlighted.includes(i)) return { top: '#4F8CFF', bot: '#2A5CC0', glow: 'rgba(79,140,255,0.5)', label: 'Active'   }
  if (sorted.includes(i))      return { top: '#5BCB8A', bot: '#309050', glow: 'rgba(91,203,138,0.4)', label: 'Sorted'   }
  return                               { top: '#3A5878', bot: '#243A50', glow: null,                   label: 'Default'  }
}

const LEGEND = [
  { top: '#E6A23C', label: 'Compare'  },
  { top: '#E85D5D', label: 'Swap'     },
  { top: '#A78BFA', label: 'Pivot'    },
  { top: '#4F8CFF', label: 'Active'   },
  { top: '#5BCB8A', label: 'Sorted'   },
  { top: '#3A5878', label: 'Default'  },
]

export default function CustomVisualizer() {
  const { steps, currentStep } = useStore()
  const containerRef = useRef(null)
  const [containerH, setContainerH] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(e => setContainerH(e[0].contentRect.height))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const step = steps[currentStep]

  // ── Empty / no steps ──
  if (!step) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: '#0B0F14' }}>
        <div className="flex items-end gap-1 h-16 opacity-20">
          {[35,65,20,85,50,30,75,55,40,70].map((h, i) => (
            <div key={i} className="w-5 rounded-t-sm"
              style={{ height: `${h}%`, background: 'linear-gradient(to bottom,#3A5878,#243A50)' }} />
          ))}
        </div>
        <p className="text-sm" style={{ color: '#4A6080' }}>
          Write your algorithm and click <span style={{ color: '#4F8CFF' }}>Run</span>
        </p>
      </div>
    )
  }

  const { array, message, error, type } = step
  const max = Math.max(...array, 1)
  const chartH = Math.max(containerH - 80, 60)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0B0F14' }}>

      {/* ── Legend ── */}
      <div className="shrink-0 flex flex-wrap items-center gap-3 px-5 pt-3 pb-2"
        style={{ borderBottom: '1px solid #1A2535' }}>
        {LEGEND.map(({ top, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: top }} />
            <span className="text-[10px] font-medium" style={{ color: '#5A7A9A' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Bars ── */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden px-5 pb-8">
        {containerH > 0 && (
          <>
            <div className="absolute inset-x-5 top-2 bottom-8 flex items-end gap-[3px]">
              {array.map((val, i) => {
                const { top, bot, glow } = getBarStyle(i, step)
                const barH = Math.max(Math.round((val / max) * chartH), 4)
                return (
                  <div key={i} className="relative flex-1 flex flex-col justify-end" style={{ maxWidth: 56 }}>
                    <motion.div
                      animate={{ height: barH }}
                      transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full rounded-t-[3px]"
                      style={{
                        background: `linear-gradient(to bottom, ${top}, ${bot})`,
                        boxShadow: glow ? `0 0 14px ${glow}` : 'none',
                        minHeight: 4,
                      }}
                    />
                    {array.length <= 28 && (
                      <span className="absolute text-[9px] font-mono text-center w-full select-none"
                        style={{ bottom: -17, color: '#3D5070' }}>
                        {val}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="absolute bottom-8 inset-x-5 h-px" style={{ background: '#1A2535' }} />
          </>
        )}
      </div>

      {/* ── Message / Error banner ── */}
      <AnimatePresence>
        {(message || error) && (
          <motion.div
            key={message || error}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="shrink-0 px-5 py-2 text-[11px] font-mono"
            style={{
              borderTop: `1px solid ${error ? 'rgba(232,93,93,0.3)' : type === 'done' ? 'rgba(91,203,138,0.3)' : '#1A2535'}`,
              background: error ? 'rgba(232,93,93,0.07)' : type === 'done' ? 'rgba(91,203,138,0.07)' : 'transparent',
              color: error ? '#E07070' : type === 'done' ? '#5BCB8A' : '#5A7A9A',
            }}
          >
            {error ? `⚠ ${error}` : message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

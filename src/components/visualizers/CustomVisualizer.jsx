import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

// ── Bar color per event type ──────────────────────────────────────────────────
function getBarStyle(i, step) {
  const { comparing = [], swapping = [], sorted = [], highlighted = [], pivot } = step
  if (swapping.includes(i))    return { top: '#E85D5D', bot: '#B03030', glow: 'rgba(232,93,93,0.6)'   }
  if (comparing.includes(i))   return { top: '#E6A23C', bot: '#B07010', glow: 'rgba(230,162,60,0.6)'  }
  if (pivot === i)             return { top: '#A78BFA', bot: '#7050C0', glow: 'rgba(167,139,250,0.55)' }
  if (highlighted.includes(i)) return { top: '#4F8CFF', bot: '#2A5CC0', glow: 'rgba(79,140,255,0.55)' }
  if (sorted.includes(i))      return { top: '#5BCB8A', bot: '#309050', glow: 'rgba(91,203,138,0.45)' }
  return                               { top: '#4A6888', bot: '#2A4060', glow: null                    }
}

const LEGEND = [
  { color: '#E6A23C', label: 'Compare' },
  { color: '#E85D5D', label: 'Swap'    },
  { color: '#A78BFA', label: 'Pivot'   },
  { color: '#4F8CFF', label: 'Active'  },
  { color: '#5BCB8A', label: 'Sorted'  },
  { color: '#4A6888', label: 'Default' },
]

const EMPTY_BARS = [35, 65, 20, 85, 50, 30, 75, 55, 40, 70]

export default function CustomVisualizer() {
  const { steps, currentStep } = useStore()
  const step = steps[currentStep]

  // ── Empty state ──
  if (!step) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4"
        style={{ background: '#0B0F14' }}>
        <div className="flex items-end gap-1" style={{ height: 64 }}>
          {EMPTY_BARS.map((h, i) => (
            <div key={i} style={{
              width: 18,
              height: `${h}%`,
              borderRadius: '2px 2px 0 0',
              background: 'linear-gradient(to bottom, #4A6888, #2A4060)',
              opacity: 0.3,
            }} />
          ))}
        </div>
        <p className="text-sm" style={{ color: '#4A6080' }}>
          Write your algorithm and click{' '}
          <span style={{ color: '#4F8CFF' }}>Run</span>
        </p>
      </div>
    )
  }

  const { array, message, error, type } = step
  const max = Math.max(...array, 1)
  const showLabels = array.length <= 28

  return (
    <div className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: '#0B0F14' }}>

      {/* ── Legend ── */}
      <div className="shrink-0 flex flex-wrap items-center gap-3 px-5 pt-3 pb-2"
        style={{ borderBottom: '1px solid #1A2535' }}>
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[10px] font-medium" style={{ color: '#5A7A9A' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Chart — pure CSS, no ResizeObserver needed ── */}
      {/*
        Key insight: give the bar container 100% height and use
        percentage-based heights on the bars themselves.
        The outer div is position:relative with explicit bottom padding
        for labels. Bars use `height: X%` inside a flex-end container
        that has a real CSS height (100%).
      */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/* Full-height inner container */}
        <div
          className="absolute inset-0"
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 8,
            paddingBottom: showLabels ? 28 : 12,
          }}
        >
          {/* Flex row — bars grow from bottom */}
          <div
            className="w-full h-full flex items-end"
            style={{ gap: 3 }}
          >
            {array.map((val, i) => {
              const { top, bot, glow } = getBarStyle(i, step)
              const pct = Math.max((val / max) * 100, 0.5)

              return (
                <div
                  key={i}
                  className="relative flex-1 flex flex-col justify-end"
                  style={{ height: '100%', maxWidth: 56 }}
                >
                  <motion.div
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '100%',
                      minHeight: 4,
                      borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(to bottom, ${top}, ${bot})`,
                      boxShadow: glow ? `0 0 12px ${glow}` : 'none',
                    }}
                  />
                  {showLabels && (
                    <span
                      className="absolute text-center w-full select-none"
                      style={{
                        bottom: -20,
                        fontSize: 9,
                        fontFamily: 'monospace',
                        color: '#3D5070',
                      }}
                    >
                      {val}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Baseline */}
          <div
            className="absolute inset-x-5"
            style={{
              bottom: showLabels ? 28 : 12,
              height: 1,
              background: '#1A2535',
            }}
          />
        </div>
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
              borderTop: `1px solid ${
                error         ? 'rgba(232,93,93,0.3)'  :
                type === 'done' ? 'rgba(91,203,138,0.3)' :
                '#1A2535'
              }`,
              background: error
                ? 'rgba(232,93,93,0.07)'
                : type === 'done'
                ? 'rgba(91,203,138,0.07)'
                : 'transparent',
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

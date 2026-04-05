import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const STATE_COLORS = {
  found:   { top: '#5BCB8A', bot: '#38A060', glow: 'rgba(91,203,138,0.5)'  },
  active:  { top: '#6EA8FF', bot: '#3A70D4', glow: 'rgba(110,168,255,0.5)' },
  range:   { top: '#5A80B8', bot: '#3A5A90', glow: null                     },
  default: { top: '#4A6888', bot: '#2A4060', glow: null                     },
}

const LEGEND = [
  { state: 'active', label: 'Current'      },
  { state: 'range',  label: 'Search Range' },
  { state: 'found',  label: 'Found'        },
]

export default function SearchingVisualizer() {
  const { steps, currentStep, searchTarget } = useStore()
  const step = steps[currentStep]

  if (!step) return (
    <div className="w-full h-full flex items-center justify-center text-sm"
      style={{ background: '#0B0F14', color: '#4A6080' }}>
      Click <span className="mx-1" style={{ color: '#4F8CFF' }}>Run</span> to start
    </div>
  )

  const { array, current, found, range = [] } = step
  const max = Math.max(...array, 1)

  const getState = (i) => {
    if (found === i) return 'found'
    if (current === i) return 'active'
    if (range.length === 2 && i >= range[0] && i <= range[1]) return 'range'
    return 'default'
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0B0F14' }}>
      {/* Header */}
      <div className="shrink-0 flex flex-wrap items-center gap-4 px-5 pt-3 pb-2"
        style={{ borderBottom: '1px solid #1A2535' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium" style={{ color: '#7A9AB8' }}>Target</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded"
            style={{ background: 'rgba(79,140,255,0.15)', color: '#6EA8FF', border: '1px solid rgba(79,140,255,0.3)' }}>
            {searchTarget}
          </span>
        </div>
        {LEGEND.map(({ state, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: STATE_COLORS[state].top }} />
            <span className="text-[11px] font-medium" style={{ color: '#7A9AB8' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart — pure CSS percentage heights */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        <div className="absolute inset-0" style={{
          paddingLeft: 20, paddingRight: 20,
          paddingTop: 8, paddingBottom: 36,
        }}>
          <div className="w-full h-full flex items-end" style={{ gap: 3 }}>
            {array.map((val, i) => {
              const state = getState(i)
              const { top, bot, glow } = STATE_COLORS[state]
              const pct = Math.max((val / max) * 100, 0.5)
              return (
                <div key={i} className="relative flex-1 flex flex-col justify-end"
                  style={{ height: '100%', maxWidth: 52 }}>
                  <motion.div
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '100%', minHeight: 4,
                      borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(to bottom, ${top}, ${bot})`,
                      boxShadow: glow ? `0 0 10px ${glow}` : 'none',
                    }}
                  />
                  <span className="absolute text-center w-full select-none"
                    style={{ bottom: -16, fontSize: 9, fontFamily: 'monospace', color: '#3D5070' }}>
                    {val}
                  </span>
                  <span className="absolute text-center w-full select-none"
                    style={{ bottom: -26, fontSize: 8, fontFamily: 'monospace', color: '#2A3A50' }}>
                    [{i}]
                  </span>
                </div>
              )
            })}
          </div>
          <div className="absolute inset-x-5"
            style={{ bottom: 36, height: 1, background: '#1A2535' }} />
        </div>
      </div>
    </div>
  )
}

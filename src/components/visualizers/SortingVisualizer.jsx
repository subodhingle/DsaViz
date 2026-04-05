import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const LEGEND = [
  { label: 'Comparing', color: '#E6A23C' },
  { label: 'Swapping',  color: '#E85D5D' },
  { label: 'Pivot',     color: '#A78BFA' },
  { label: 'Sorted',    color: '#5BCB8A' },
  { label: 'Default',   color: '#4A6888' },
]

function getBarColor(i, comparing, swapping, sorted, pivot) {
  if (swapping.includes(i))  return { top: '#E85D5D', bot: '#C03A3A', glow: 'rgba(232,93,93,0.55)'   }
  if (comparing.includes(i)) return { top: '#E6A23C', bot: '#C07820', glow: 'rgba(230,162,60,0.55)'  }
  if (pivot === i)           return { top: '#A78BFA', bot: '#7C5FD4', glow: 'rgba(167,139,250,0.5)'  }
  if (sorted.includes(i))    return { top: '#5BCB8A', bot: '#38A060', glow: 'rgba(91,203,138,0.4)'   }
  return                            { top: '#4A6888', bot: '#2A4060', glow: null                      }
}

const EMPTY = [35, 65, 20, 85, 50, 30, 75, 55, 40, 70]

export default function SortingVisualizer() {
  const { steps, currentStep } = useStore()
  const step = steps[currentStep]

  if (!step) return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4"
      style={{ background: '#0B0F14' }}>
      <div className="flex items-end gap-1" style={{ height: 64 }}>
        {EMPTY.map((h, i) => (
          <div key={i} style={{
            width: 18, height: `${h}%`,
            borderRadius: '2px 2px 0 0',
            background: 'linear-gradient(to bottom,#4A6888,#2A4060)',
            opacity: 0.3,
          }} />
        ))}
      </div>
      <p className="text-sm" style={{ color: '#4A6080' }}>
        Click <span style={{ color: '#4F8CFF' }}>Run</span> to start
      </p>
    </div>
  )

  const { array, comparing = [], swapping = [], sorted = [], pivot } = step
  const max = Math.max(...array, 1)
  const showLabels = array.length <= 25

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0B0F14' }}>
      {/* Legend */}
      <div className="shrink-0 flex flex-wrap items-center gap-4 px-5 pt-3 pb-2"
        style={{ borderBottom: '1px solid #1A2535' }}>
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[11px] font-medium" style={{ color: '#7A9AB8' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart — pure CSS percentage heights */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        <div className="absolute inset-0" style={{
          paddingLeft: 20, paddingRight: 20,
          paddingTop: 8,
          paddingBottom: showLabels ? 28 : 12,
        }}>
          <div className="w-full h-full flex items-end" style={{ gap: 3 }}>
            {array.map((val, i) => {
              const { top, bot, glow } = getBarColor(i, comparing, swapping, sorted, pivot)
              const pct = Math.max((val / max) * 100, 0.5)
              return (
                <div key={i} className="relative flex-1 flex flex-col justify-end"
                  style={{ height: '100%', maxWidth: 52 }}>
                  <motion.div
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '100%', minHeight: 4,
                      borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(to bottom, ${top}, ${bot})`,
                      boxShadow: glow ? `0 0 12px ${glow}` : 'none',
                    }}
                  />
                  {showLabels && (
                    <span className="absolute text-center w-full select-none"
                      style={{ bottom: -20, fontSize: 9, fontFamily: 'monospace', color: '#3D5070' }}>
                      {val}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {/* Baseline */}
          <div className="absolute inset-x-5"
            style={{ bottom: showLabels ? 28 : 12, height: 1, background: '#1A2535' }} />
        </div>
      </div>
    </div>
  )
}

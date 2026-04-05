import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const STATE_COLORS = {
  found:   { top: '#5BCB8A', bot: '#38A060', shadow: 'rgba(91,203,138,0.45)' },
  active:  { top: '#6EA8FF', bot: '#3A70D4', shadow: 'rgba(110,168,255,0.45)' },
  range:   { top: '#5A80B8', bot: '#3A5A90', shadow: null },
  default: { top: '#4A6080', bot: '#344558', shadow: null },
}

const LEGEND = [
  { state: 'active', label: 'Current'      },
  { state: 'range',  label: 'Search Range' },
  { state: 'found',  label: 'Found'        },
]

export default function SearchingVisualizer() {
  const { steps, currentStep, searchTarget } = useStore()
  const containerRef = useRef(null)
  const [containerH, setContainerH] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(e => setContainerH(e[0].contentRect.height))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const step = steps[currentStep]

  if (!step) return (
    <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: '#6B7785' }}>
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
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 px-5 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium" style={{ color: '#9DA7B3' }}>Target</span>
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded"
            style={{ background: 'rgba(79,140,255,0.15)', color: '#6EA8FF', border: '1px solid rgba(79,140,255,0.3)' }}
          >
            {searchTarget}
          </span>
        </div>
        {LEGEND.map(({ state, label }) => {
          const { top } = STATE_COLORS[state]
          return (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: top }} />
              <span className="text-[11px] font-medium" style={{ color: '#9DA7B3' }}>{label}</span>
            </div>
          )
        })}
      </div>

      {/* Bars */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden px-5 pb-10">
        {containerH > 0 && (
          <>
            <div className="absolute inset-x-5 top-2 bottom-10 flex items-end gap-[3px]">
              {array.map((val, i) => {
                const state = getState(i)
                const { top, bot, shadow } = STATE_COLORS[state]
                const barH = Math.max(Math.round((val / max) * (containerH - 52)), 4)
                return (
                  <div
                    key={i}
                    className="relative flex-1 flex flex-col justify-end"
                    style={{ maxWidth: 52 }}
                  >
                    <motion.div
                      animate={{ height: barH }}
                      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full rounded-t-[3px]"
                      style={{
                        background: `linear-gradient(to bottom, ${top}, ${bot})`,
                        boxShadow: shadow ? `0 0 10px ${shadow}` : 'none',
                        minHeight: 4,
                      }}
                    />
                    <span
                      className="absolute text-[9px] font-mono text-center w-full select-none"
                      style={{ bottom: -16, color: '#6B7785' }}
                    >
                      {val}
                    </span>
                    <span
                      className="absolute text-[8px] font-mono text-center w-full select-none"
                      style={{ bottom: -26, color: '#3D4A58' }}
                    >
                      [{i}]
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="absolute bottom-10 inset-x-5 h-px" style={{ background: '#2A3441' }} />
          </>
        )}
      </div>
    </div>
  )
}

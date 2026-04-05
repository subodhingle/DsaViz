import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const LEGEND = [
  { label: 'Comparing', color: '#E6A23C' },
  { label: 'Swapping',  color: '#E85D5D' },
  { label: 'Pivot',     color: '#A78BFA' },
  { label: 'Sorted',    color: '#5BCB8A' },
  { label: 'Default',   color: '#4A6080' },
]

function getBarColor(i, comparing, swapping, sorted, pivot) {
  if (swapping.includes(i))  return { top: '#E85D5D', bot: '#C03A3A', shadow: 'rgba(232,93,93,0.5)'  }
  if (comparing.includes(i)) return { top: '#E6A23C', bot: '#C07820', shadow: 'rgba(230,162,60,0.5)' }
  if (pivot === i)           return { top: '#A78BFA', bot: '#7C5FD4', shadow: 'rgba(167,139,250,0.4)' }
  if (sorted.includes(i))    return { top: '#5BCB8A', bot: '#38A060', shadow: 'rgba(91,203,138,0.35)' }
  return { top: '#4A6080', bot: '#344558', shadow: null }
}

export default function SortingVisualizer() {
  const { steps, currentStep } = useStore()
  const containerRef = useRef(null)
  const [containerH, setContainerH] = useState(0)

  // Measure real pixel height so % bars always resolve correctly
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      setContainerH(entries[0].contentRect.height)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const step = steps[currentStep]
  if (!step) return <EmptyState />

  const { array, comparing = [], swapping = [], sorted = [], pivot } = step
  const max = Math.max(...array, 1)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-5 pt-3 pb-2 shrink-0">
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[11px] font-medium" style={{ color: '#9DA7B3' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart area — ref-measured so pixel heights are always correct */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden px-5 pb-8">
        {containerH > 0 && (
          <>
            <div
              className="absolute inset-x-5 top-2 bottom-8 flex items-end gap-[3px]"
            >
              {array.map((val, i) => {
                const { top, bot, shadow } = getBarColor(i, comparing, swapping, sorted, pivot)
                const barH = Math.max(Math.round((val / max) * (containerH - 48)), 4)
                return (
                  <div
                    key={i}
                    className="relative flex-1 flex flex-col justify-end"
                    style={{ maxWidth: 52 }}
                  >
                    <motion.div
                      animate={{ height: barH }}
                      transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full rounded-t-[3px]"
                      style={{
                        background: `linear-gradient(to bottom, ${top}, ${bot})`,
                        boxShadow: shadow ? `0 0 12px ${shadow}` : 'none',
                        minHeight: 4,
                      }}
                    />
                    {array.length <= 25 && (
                      <span
                        className="absolute text-[9px] font-mono text-center w-full select-none"
                        style={{ bottom: -18, color: '#6B7785' }}
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
              className="absolute bottom-8 inset-x-5 h-px"
              style={{ background: '#2A3441' }}
            />
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  const preview = [35, 65, 20, 85, 50, 30, 75, 55, 40, 70]
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="flex items-end gap-1 h-16">
        {preview.map((h, i) => (
          <div
            key={i}
            className="w-5 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: 'linear-gradient(to bottom, #4A6080, #344558)',
              opacity: 0.4,
            }}
          />
        ))}
      </div>
      <p className="text-sm" style={{ color: '#6B7785' }}>
        Click <span style={{ color: '#4F8CFF' }}>Run</span> to start visualization
      </p>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Shuffle, ChevronsLeft } from 'lucide-react'
import useStore from '../store/useStore'

export default function Controls({ onGenerate, onRun }) {
  const { isPlaying, setIsPlaying, speed, setSpeed, currentStep, steps, nextStep, prevStep, reset } = useStore()
  const timerRef = useRef(null)

  useEffect(() => {
    clearInterval(timerRef.current)
    if (!isPlaying) return
    timerRef.current = setInterval(() => {
      const s = useStore.getState()
      if (!s.isPlaying) return
      if (s.currentStep < s.steps.length - 1) s.nextStep()
      else s.setIsPlaying(false)
    }, speed)
    return () => clearInterval(timerRef.current)
  }, [isPlaying, speed])

  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  return (
    <div className="shrink-0 flex flex-col"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)' }}>

      {/* Progress track */}
      <div className="relative h-[2px]" style={{ background: 'var(--border-subtle)' }}>
        <motion.div className="absolute left-0 top-0 h-full"
          style={{ background: 'var(--accent)', width: `${progress}%` }}
          transition={{ duration: 0.08 }} />
      </div>

      {/* Controls row — wraps on very small screens */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-2">

        {/* Generate + Run */}
        <div className="flex items-center gap-1.5">
          <button onClick={onGenerate}
            className="btn-ghost flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium">
            <Shuffle size={12} />
            <span className="hidden sm:inline">New Data</span>
          </button>
          <button onClick={onRun}
            className="btn-accent flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs">
            <RefreshCw size={12} />
            <span className="hidden sm:inline">Run</span>
          </button>
        </div>

        {/* Playback */}
        <div className="flex items-center gap-1">
          <IconBtn onClick={reset} title="Reset"><ChevronsLeft size={13} /></IconBtn>
          <IconBtn onClick={prevStep} disabled={currentStep === 0} title="Previous"><SkipBack size={13} /></IconBtn>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={steps.length === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <IconBtn onClick={nextStep} disabled={currentStep >= steps.length - 1} title="Next"><SkipForward size={13} /></IconBtn>
        </div>

        {/* Speed + counter */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>Speed</span>
            <input type="range" min={50} max={1500} step={50}
              value={1550 - speed}
              onChange={e => setSpeed(1550 - Number(e.target.value))}
              className="w-16 sm:w-20 h-1 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
            <span className="text-xs w-6 font-mono" style={{ color: 'var(--text-muted)' }}>
              {speed < 200 ? '2×' : speed < 600 ? '1×' : '½×'}
            </span>
          </div>
          <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {String(currentStep + 1).padStart(3, '0')}/{String(steps.length || 1).padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children, onClick, disabled, title }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className="w-7 h-7 rounded-md flex items-center justify-center transition-all disabled:opacity-25"
      style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      {children}
    </button>
  )
}

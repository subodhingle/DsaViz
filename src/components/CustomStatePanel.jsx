import { motion } from 'framer-motion'
import { Hash, BarChart2, Activity } from 'lucide-react'
import useStore from '../store/useStore'

export default function CustomStatePanel() {
  const { steps, currentStep } = useStore()
  const step = steps[currentStep]

  if (!step) return (
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: '#0D1117', borderTop: '1px solid #1A2535' }}>
      <p className="text-[11px]" style={{ color: '#2A3A50' }}>No state yet</p>
    </div>
  )

  const { variables = {}, stats = {}, type, array, sorted = [] } = step

  const typeColor = {
    compare:   '#E6A23C',
    swap:      '#E85D5D',
    highlight: '#4F8CFF',
    sorted:    '#5BCB8A',
    pivot:     '#A78BFA',
    set:       '#4F8CFF',
    done:      '#5BCB8A',
    error:     '#E85D5D',
    log:       '#9DA7B3',
    var:       '#9DA7B3',
    snapshot:  '#9DA7B3',
  }[type] || '#4A6080'

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: '#0D1117', borderTop: '1px solid #1A2535' }}>

      {/* Event type badge */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid #1A2535' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: typeColor }} />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: typeColor }}>
          {type}
        </span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: '#2A3A50' }}>
          {sorted.length}/{array.length} sorted
        </span>
      </div>

      {/* Stats row */}
      <div className="shrink-0 flex items-center gap-0"
        style={{ borderBottom: '1px solid #1A2535' }}>
        {[
          { label: 'Comparisons', value: stats.comparisons ?? 0, color: '#E6A23C' },
          { label: 'Swaps',       value: stats.swaps       ?? 0, color: '#E85D5D' },
          { label: 'Highlights',  value: stats.highlights  ?? 0, color: '#4F8CFF' },
        ].map(({ label, value, color }, i) => (
          <div key={label}
            className="flex-1 flex flex-col items-center py-2"
            style={{ borderRight: i < 2 ? '1px solid #1A2535' : 'none' }}
          >
            <motion.span
              key={value}
              initial={{ scale: 1.3, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm font-mono font-bold"
              style={{ color }}
            >
              {value}
            </motion.span>
            <span className="text-[9px] font-medium mt-0.5" style={{ color: '#2A3A50' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Variables */}
      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-[9px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: '#2A3A50' }}>
          Variables
        </p>
        {Object.keys(variables).length === 0 ? (
          <p className="text-[10px] text-center py-3" style={{ color: '#2A3A50' }}>
            Use setVar() to track variables
          </p>
        ) : (
          <div className="space-y-1">
            {Object.entries(variables).map(([key, val]) => (
              <motion.div key={key} layout
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md"
                style={{ background: '#0B0F14', border: '1px solid #1A2535' }}
              >
                <span className="text-[11px] font-mono font-bold shrink-0" style={{ color: '#4F8CFF' }}>
                  {key}
                </span>
                <span className="text-[11px] font-mono ml-2 truncate" style={{ color: '#8AAAC4' }}
                  title={String(val)}>
                  {String(val)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

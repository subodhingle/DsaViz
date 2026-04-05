import { motion } from 'framer-motion'
import { Eye, ArrowLeftRight, Activity, TrendingUp } from 'lucide-react'
import useStore from '../store/useStore'

const COMPLEXITY = {
  bubble:         { time: 'O(n²)',         best: 'O(n)',       space: 'O(1)' },
  merge:          { time: 'O(n log n)',     best: 'O(n log n)', space: 'O(n)' },
  quick:          { time: 'O(n log n)',     best: 'O(n log n)', space: 'O(log n)' },
  heap:           { time: 'O(n log n)',     best: 'O(n log n)', space: 'O(1)' },
  linear:         { time: 'O(n)',           best: 'O(1)',        space: 'O(1)' },
  binary:         { time: 'O(log n)',       best: 'O(1)',        space: 'O(1)' },
  bfs:            { time: 'O(V+E)',         best: 'O(V+E)',      space: 'O(V)' },
  dfs:            { time: 'O(V+E)',         best: 'O(V+E)',      space: 'O(V)' },
  dijkstra:       { time: 'O((V+E)logV)',   best: 'O(E log V)', space: 'O(V)' },
  astar:          { time: 'O(E log V)',     best: 'O(E)',        space: 'O(V)' },
  'bst-insert':   { time: 'O(log n)',       best: 'O(log n)',    space: 'O(1)' },
  'bst-delete':   { time: 'O(log n)',       best: 'O(log n)',    space: 'O(1)' },
  'bst-inorder':  { time: 'O(n)',           best: 'O(n)',        space: 'O(n)' },
  'bst-preorder': { time: 'O(n)',           best: 'O(n)',        space: 'O(n)' },
  'bst-postorder':{ time: 'O(n)',           best: 'O(n)',        space: 'O(n)' },
}

export default function StatsPanel() {
  const { steps, currentStep, algorithm } = useStore()
  const step = steps[currentStep]
  const vars = step?.variables || {}
  const cx   = COMPLEXITY[algorithm] || { time: '—', best: '—', space: '—' }

  const comparisons = vars.comparisons ?? 0
  const swaps       = vars.swaps ?? 0
  const progress    = steps.length > 1 ? Math.round((currentStep / (steps.length - 1)) * 100) : 0

  const stats = [
    { icon: Eye,            label: 'Cmp',      fullLabel: 'Comparisons', value: comparisons },
    { icon: ArrowLeftRight, label: 'Swp',      fullLabel: 'Swaps',       value: swaps },
    { icon: Activity,       label: 'Steps',    fullLabel: 'Steps',       value: steps.length },
    { icon: TrendingUp,     label: 'Progress', fullLabel: 'Progress',    value: `${progress}%` },
  ]

  return (
    <div className="shrink-0 flex items-center overflow-x-auto"
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)', height: 36 }}>

      {stats.map(({ icon: Icon, label, fullLabel, value }, i) => (
        <div key={label} className="flex items-center gap-1.5 px-3 shrink-0"
          style={{ borderRight: '1px solid var(--border-subtle)', height: '100%' }}>
          <Icon size={11} style={{ color: 'var(--text-disabled)' }} />
          <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{fullLabel}</span>
          <span className="text-xs sm:hidden" style={{ color: 'var(--text-muted)' }}>{label}</span>
          <motion.span key={String(value)}
            initial={{ opacity: 0.4, y: -2 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            {value}
          </motion.span>
        </div>
      ))}

      {/* Complexity — hidden on very small screens */}
      <div className="ml-auto hidden md:flex items-center gap-3 px-4 shrink-0">
        {[
          { label: 'Worst', value: cx.time },
          { label: 'Best',  value: cx.best },
          { label: 'Space', value: cx.space },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>{label}</span>
            <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

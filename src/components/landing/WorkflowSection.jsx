import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shuffle, Play, SkipForward, Code2, Wand2 } from 'lucide-react'

const STEPS = [
  { num: '01', icon: Shuffle,     title: 'Pick an Algorithm',  color: '#4F8CFF',
    desc: 'Choose from 13 algorithms across Sorting, Searching, Graph, and Tree categories.',
    detail: 'Bubble, Merge, Quick, Heap, BFS, DFS, Dijkstra, A*, BST operations, and more.' },
  { num: '02', icon: Play,        title: 'Generate & Run',     color: '#7C6FE8',
    desc: 'Hit "New Data" to randomize the input, then "Run" to compute all animation steps.',
    detail: 'The engine pre-computes every comparison, swap, and node visit before playback.' },
  { num: '03', icon: SkipForward, title: 'Step Through It',    color: '#4BAF78',
    desc: 'Play, pause, rewind, or manually step forward/back. Control speed precisely.',
    detail: 'Every step updates the visualization, pseudocode highlight, and variable trace.' },
  { num: '04', icon: Code2,       title: 'Trace the Logic',    color: '#C8873A',
    desc: 'Switch to Split or Logic view to see pseudocode highlight line-by-line.',
    detail: 'Variables panel shows i, j, pivot, comparisons, swaps — everything the algorithm tracks.' },
  { num: '05', icon: Wand2,       title: 'Build Your Own',     color: '#9B6FD4',
    desc: 'Switch to Custom mode and write your own algorithm using compare(), swap(), mark().',
    detail: 'The logic interpreter parses your code and generates animation steps instantly.' },
]

export default function WorkflowSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="workflow" ref={ref} className="py-24 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: 'var(--elevated)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            How It Works
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-black mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            From Zero to Visualized in 5 Steps
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.14 }}
            className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            No setup, no config. Pick an algorithm, hit run, and start learning.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative space-y-3">
          {/* Vertical connector */}
          <div
            className="absolute left-[27px] top-10 bottom-10 w-px hidden sm:block"
            style={{ background: 'linear-gradient(to bottom, #4F8CFF40, #7C6FE840, #4BAF7840, #C8873A40, #9B6FD440)' }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16,1,0.3,1] }}
              className="flex gap-4 items-start"
            >
              {/* Icon */}
              <div
                className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center relative z-10"
                style={{
                  background: 'var(--elevated)',
                  border: `1px solid ${step.color}30`,
                  boxShadow: `0 0 0 1px ${step.color}15, var(--shadow-sm)`,
                }}
              >
                <step.icon size={18} style={{ color: step.color }} strokeWidth={1.75} />
              </div>

              {/* Content */}
              <div
                className="flex-1 rounded-xl p-4"
                style={{
                  background: 'var(--elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-[10px] font-mono font-bold" style={{ color: step.color }}>{step.num}</span>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                </div>
                <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-disabled)' }}>{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

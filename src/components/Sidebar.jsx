import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Search, GitBranch, Binary, Wand2, Code, Layers, ChevronDown, ChevronRight } from 'lucide-react'
import useStore from '../store/useStore'

const CATEGORIES = [
  {
    id: 'sorting', label: 'Sorting', icon: BarChart2,
    algos: ['bubble:Bubble Sort', 'merge:Merge Sort', 'quick:Quick Sort', 'heap:Heap Sort'],
  },
  {
    id: 'advanced-sorting', label: 'Adv. Sorting', icon: BarChart2,
    algos: ['counting-sort:Counting Sort', 'shell-sort:Shell Sort', 'radix-sort:Radix Sort'],
  },
  {
    id: 'searching', label: 'Searching', icon: Search,
    algos: ['linear:Linear Search', 'binary:Binary Search'],
  },
  {
    id: 'graph', label: 'Graph', icon: GitBranch,
    algos: ['bfs:BFS', 'dfs:DFS', 'dijkstra:Dijkstra', 'astar:A* Search'],
  },
  {
    id: 'tree', label: 'Tree (BST)', icon: Binary,
    algos: ['bst-insert:Insert', 'bst-delete:Delete', 'bst-inorder:Inorder', 'bst-preorder:Preorder', 'bst-postorder:Postorder'],
  },
  {
    id: 'ds', label: 'Data Structures', icon: Layers,
    algos: ['stack-ops:Stack', 'queue-ops:Queue'],
  },
  {
    id: 'techniques', label: 'Techniques', icon: Layers,
    algos: ['sliding-window:Sliding Window', 'two-pointers:Two Pointers', 'knapsack:0/1 Knapsack DP'],
  },
  {
    id: 'custom', label: 'Custom Builder', icon: Wand2,
    algos: [],
  },
  {
    id: 'compiler', label: 'Code Editor', icon: Code,
    algos: [],
  },
]

// Group categories into sections
const SECTIONS = [
  { label: 'Algorithms', ids: ['sorting', 'advanced-sorting', 'searching', 'graph', 'tree'] },
  { label: 'Advanced', ids: ['ds', 'techniques'] },
  { label: 'Tools', ids: ['custom', 'compiler'] },
]

export default function Sidebar({ onSelect }) {
  const { category, algorithm, setCategory, setAlgorithm } = useStore()
  const [collapsed, setCollapsed] = useState({})

  const toggleSection = (label) => setCollapsed(p => ({ ...p, [label]: !p[label] }))

  return (
    <aside className="w-52 h-full flex flex-col overflow-y-auto"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border-subtle)' }}>

      {SECTIONS.map(section => {
        const isCollapsed = collapsed[section.label]
        const cats = CATEGORIES.filter(c => section.ids.includes(c.id))
        return (
          <div key={section.label}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.label)}
              className="w-full flex items-center justify-between px-4 pt-4 pb-1.5 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-disabled)' }}>
                {section.label}
              </span>
              {isCollapsed
                ? <ChevronRight size={11} style={{ color: 'var(--text-disabled)' }} />
                : <ChevronDown size={11} style={{ color: 'var(--text-disabled)' }} />
              }
            </button>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <nav className="px-2 pb-2 space-y-0.5">
                    {cats.map(cat => {
                      const isActive = category === cat.id
                      return (
                        <div key={cat.id}>
                          <button
                            onClick={() => {
                              setCategory(cat.id)
                              const first = cat.algos[0]?.split(':')[0]
                              if (first) setAlgorithm(first)
                              onSelect?.()
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                            style={isActive
                              ? { background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                              : { color: 'var(--text-secondary)', border: '1px solid transparent' }
                            }
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--hover-bg)' }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                          >
                            <cat.icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="truncate">{cat.label}</span>
                          </button>

                          <AnimatePresence>
                            {isActive && cat.algos.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="ml-4 mt-0.5 mb-1 pl-3 space-y-0.5"
                                  style={{ borderLeft: '1px solid var(--border-default)' }}>
                                  {cat.algos.map(raw => {
                                    const [id, label] = raw.split(':')
                                    const isAlgoActive = algorithm === id
                                    return (
                                      <button key={id}
                                        onClick={() => { setAlgorithm(id); onSelect?.() }}
                                        className="w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all duration-100"
                                        style={isAlgoActive
                                          ? { color: 'var(--accent)', background: 'var(--accent-subtle)', fontWeight: 600 }
                                          : { color: 'var(--text-muted)' }
                                        }
                                        onMouseEnter={e => { if (!isAlgoActive) e.currentTarget.style.color = 'var(--text-primary)' }}
                                        onMouseLeave={e => { if (!isAlgoActive) e.currentTarget.style.color = 'var(--text-muted)' }}
                                      >
                                        {label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </aside>
  )
}

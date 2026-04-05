import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Search, GitBranch, Binary, Wand2 } from 'lucide-react'
import useStore from '../store/useStore'

const CATEGORIES = [
  {
    id: 'sorting', label: 'Sorting', icon: BarChart2,
    algos: ['bubble:Bubble Sort', 'merge:Merge Sort', 'quick:Quick Sort', 'heap:Heap Sort'],
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
    id: 'custom', label: 'Custom Builder', icon: Wand2,
    algos: [],
  },
]

export default function Sidebar() {
  const { category, algorithm, setCategory, setAlgorithm } = useStore()

  return (
    <aside
      className="w-52 shrink-0 flex flex-col overflow-y-auto pt-12"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Section label */}
      <div className="px-4 pt-5 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-disabled)' }}>
          Algorithms
        </span>
      </div>

      <nav className="flex-1 px-2 pb-4 space-y-0.5">
        {CATEGORIES.map(cat => {
          const isActive = category === cat.id
          return (
            <div key={cat.id}>
              <button
                onClick={() => {
                  setCategory(cat.id)
                  const first = cat.algos[0]?.split(':')[0]
                  if (first) setAlgorithm(first)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={
                  isActive
                    ? {
                        background: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-border)',
                      }
                    : {
                        color: 'var(--text-secondary)',
                        border: '1px solid transparent',
                      }
                }
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--hover-bg)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <cat.icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                <span>{cat.label}</span>
              </button>

              <AnimatePresence>
                {isActive && cat.algos.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-0.5 mb-1 pl-3 space-y-0.5"
                      style={{ borderLeft: '1px solid var(--border-default)' }}>
                      {cat.algos.map(raw => {
                        const [id, label] = raw.split(':')
                        const isAlgoActive = algorithm === id
                        return (
                          <button
                            key={id}
                            onClick={() => setAlgorithm(id)}
                            className="w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all duration-100"
                            style={
                              isAlgoActive
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
    </aside>
  )
}

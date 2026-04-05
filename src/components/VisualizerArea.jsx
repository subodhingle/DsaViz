import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import SortingVisualizer   from './visualizers/SortingVisualizer'
import SearchingVisualizer from './visualizers/SearchingVisualizer'
import GraphVisualizer     from './visualizers/GraphVisualizer'
import TreeVisualizer      from './visualizers/TreeVisualizer'
import CustomVisualizer    from './visualizers/CustomVisualizer'
import LogicPanel          from './LogicPanel'
import AlgorithmBuilder    from './AlgorithmBuilder'
import CustomStatePanel    from './CustomStatePanel'
import AlgoInfoPanel       from './AlgoInfoPanel'
import CodeEditor          from './CodeEditor'

const VIS_MAP = {
  sorting:   SortingVisualizer,
  searching: SearchingVisualizer,
  graph:     GraphVisualizer,
  tree:      TreeVisualizer,
}

export default function VisualizerArea() {
  const { category, view, algorithm } = useStore()

  // ── Code Editor ───────────────────────────────────────────────────────────
  if (category === 'compiler') {
    return <div className="w-full h-full overflow-hidden"><CodeEditor /></div>
  }

  // ── Custom Builder ────────────────────────────────────────────────────────
  if (category === 'custom') {
    return (
      <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
        {/* Visualization */}
        <div className="flex-1 min-h-0 md:min-w-0 flex flex-col overflow-hidden"
          style={{ borderBottom: '1px solid #1A2535', borderRight: 'none' }}
          // On md+ override to side-by-side
        >
          <div className="flex-1 overflow-hidden" style={{ minHeight: 180 }}>
            <CustomVisualizer />
          </div>
          <div style={{ height: 160, flexShrink: 0, borderTop: '1px solid #1A2535' }}>
            <CustomStatePanel />
          </div>
        </div>
        {/* Editor */}
        <div className="shrink-0 overflow-hidden"
          style={{ height: '45%', borderTop: '1px solid #1A2535' }}
          // md: full height, fixed width
        >
          {/* Responsive: full width on mobile, 400px on desktop */}
          <div className="w-full md:w-[400px] h-full">
            <AlgorithmBuilder />
          </div>
        </div>
      </div>
    )
  }

  const VisComponent = VIS_MAP[category] || SortingVisualizer

  // ── Visual only ───────────────────────────────────────────────────────────
  if (view === 'visual') {
    return (
      <motion.div key="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <VisComponent />
        </div>
        <AlgoInfoPanel algorithm={algorithm} />
      </motion.div>
    )
  }

  // ── Logic only ────────────────────────────────────────────────────────────
  if (view === 'logic') {
    return (
      <motion.div key="logic" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <LogicPanel />
        </div>
        <AlgoInfoPanel algorithm={algorithm} />
      </motion.div>
    )
  }

  // ── Split view — stacks on mobile, side-by-side on md+ ───────────────────
  return (
    <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Visualization */}
        <div className="flex-1 min-h-0 md:min-w-0 overflow-hidden"
          style={{ borderBottom: '1px solid #1A2535' }}>
          <VisComponent />
        </div>
        {/* Logic panel */}
        <div className="shrink-0 overflow-hidden"
          style={{ height: '40%', borderTop: '1px solid #1A2535' }}>
          <div className="w-full md:w-80 h-full">
            <LogicPanel />
          </div>
        </div>
      </div>
      <AlgoInfoPanel algorithm={algorithm} />
    </motion.div>
  )
}

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

const VIS_MAP = {
  sorting:   SortingVisualizer,
  searching: SearchingVisualizer,
  graph:     GraphVisualizer,
  tree:      TreeVisualizer,
}

export default function VisualizerArea() {
  const { category, view, algorithm } = useStore()

  // ── Custom Builder ────────────────────────────────────────────────────────
  if (category === 'custom') {
    return (
      <div className="w-full h-full flex overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden"
          style={{ borderRight: '1px solid #1A2535' }}>
          <div className="flex-1 overflow-hidden">
            <CustomVisualizer />
          </div>
          <div style={{ height: 180, flexShrink: 0 }}>
            <CustomStatePanel />
          </div>
        </div>
        <div className="h-full overflow-hidden shrink-0" style={{ width: 400 }}>
          <AlgorithmBuilder />
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

  // ── Split view ────────────────────────────────────────────────────────────
  return (
    <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }} className="w-full h-full flex flex-col overflow-hidden">
      {/* Top: vis + logic side by side */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden"
          style={{ borderRight: '1px solid #1A2535' }}>
          <VisComponent />
        </div>
        <div className="h-full overflow-hidden shrink-0" style={{ width: 320 }}>
          <LogicPanel />
        </div>
      </div>
      {/* Bottom: info panel */}
      <AlgoInfoPanel algorithm={algorithm} />
    </motion.div>
  )
}

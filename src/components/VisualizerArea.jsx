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

const VIS_MAP = {
  sorting:   SortingVisualizer,
  searching: SearchingVisualizer,
  graph:     GraphVisualizer,
  tree:      TreeVisualizer,
}

export default function VisualizerArea() {
  const { category, view } = useStore()

  // ── Custom Builder — 3-column IDE layout ──────────────────────────────────
  if (category === 'custom') {
    return (
      <div className="w-full h-full flex overflow-hidden">

        {/* Left: Visualization */}
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden"
          style={{ borderRight: '1px solid #1A2535' }}>
          {/* Main chart */}
          <div className="flex-1 overflow-hidden">
            <CustomVisualizer />
          </div>
          {/* State panel below chart */}
          <div style={{ height: 180, borderTop: '1px solid #1A2535', flexShrink: 0 }}>
            <CustomStatePanel />
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="h-full overflow-hidden shrink-0" style={{ width: 400 }}>
          <AlgorithmBuilder />
        </div>
      </div>
    )
  }

  const VisComponent = VIS_MAP[category] || SortingVisualizer

  // ── Visual only ──────────────────────────────────────────────────────────
  if (view === 'visual') {
    return (
      <motion.div key="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} className="w-full h-full overflow-hidden">
        <VisComponent />
      </motion.div>
    )
  }

  // ── Logic only ───────────────────────────────────────────────────────────
  if (view === 'logic') {
    return (
      <motion.div key="logic" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} className="w-full h-full overflow-hidden">
        <LogicPanel />
      </motion.div>
    )
  }

  // ── Split view ───────────────────────────────────────────────────────────
  return (
    <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }} className="w-full h-full flex overflow-hidden">
      <div className="flex-1 min-w-0 h-full overflow-hidden"
        style={{ borderRight: '1px solid #1A2535' }}>
        <VisComponent />
      </div>
      <div className="h-full overflow-hidden shrink-0" style={{ width: 320 }}>
        <LogicPanel />
      </div>
    </motion.div>
  )
}

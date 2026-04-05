import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import SortingVisualizer from './visualizers/SortingVisualizer'
import SearchingVisualizer from './visualizers/SearchingVisualizer'
import GraphVisualizer from './visualizers/GraphVisualizer'
import TreeVisualizer from './visualizers/TreeVisualizer'
import LogicPanel from './LogicPanel'
import AlgorithmBuilder from './AlgorithmBuilder'

const VIS_MAP = {
  sorting:   SortingVisualizer,
  searching: SearchingVisualizer,
  graph:     GraphVisualizer,
  tree:      TreeVisualizer,
  custom:    SortingVisualizer,
}

export default function VisualizerArea() {
  const { category, view } = useStore()
  const VisComponent = VIS_MAP[category] || SortingVisualizer

  // ── Custom builder: visualization left + code editor right ──
  if (category === 'custom') {
    return (
      <div className="w-full h-full flex overflow-hidden">
        {/* Visualization panel */}
        <div
          className="flex-1 min-w-0 h-full overflow-hidden"
          style={{ borderRight: '1px solid #1F2630' }}
        >
          <SortingVisualizer />
        </div>
        {/* Code editor panel */}
        <div
          className="h-full overflow-hidden shrink-0"
          style={{ width: 380 }}
        >
          <AlgorithmBuilder />
        </div>
      </div>
    )
  }

  // ── Visual only ──
  if (view === 'visual') {
    return (
      <motion.div
        key="visual"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full h-full overflow-hidden"
      >
        <VisComponent />
      </motion.div>
    )
  }

  // ── Logic only ──
  if (view === 'logic') {
    return (
      <motion.div
        key="logic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full h-full overflow-hidden"
      >
        <LogicPanel />
      </motion.div>
    )
  }

  // ── Split view: visualization left + pseudocode right ──
  return (
    <motion.div
      key="split"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full flex overflow-hidden"
    >
      {/* Visualization — takes remaining space */}
      <div
        className="flex-1 min-w-0 h-full overflow-hidden"
        style={{ borderRight: '1px solid #1F2630' }}
      >
        <VisComponent />
      </div>

      {/* Logic panel — fixed width, enough for pseudocode */}
      <div
        className="h-full overflow-hidden shrink-0"
        style={{ width: 320 }}
      >
        <LogicPanel />
      </div>
    </motion.div>
  )
}

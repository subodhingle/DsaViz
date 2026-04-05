import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import VisualizerArea from './components/VisualizerArea'
import Controls from './components/Controls'
import StatsPanel from './components/StatsPanel'
import LandingPage from './pages/LandingPage'
import useStore from './store/useStore'
import { generateArray, generateGraph, generateBSTValues } from './utils/generators'
import { bubbleSort, mergeSort, quickSort, heapSort } from './algorithms/sorting'
import { linearSearch, binarySearch } from './algorithms/searching'
import { bfs, dfs, dijkstra, aStar } from './algorithms/graph'
import { bstInsert, bstDelete, bstTraversal } from './algorithms/tree'

function VisualizerApp() {
  const {
    theme, category, algorithm,
    array, setArray,
    graphData, setGraphData,
    setSteps, setIsPlaying,
    searchTarget, setSearchTarget,
    graphSource, graphTarget,
  } = useStore()

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'glass' ? 'theme-glass' : theme === 'military' ? 'theme-military' : ''
  }, [theme])

  const handleGenerate = () => {
    if (category === 'sorting' || category === 'searching' || category === 'custom') {
      const arr = generateArray(20, 5, 99)
      setArray(arr)
      setSearchTarget(arr[Math.floor(Math.random() * arr.length)])
    } else if (category === 'graph') {
      setGraphData(generateGraph(8))
    } else if (category === 'tree') {
      // tree data is generated on run
    }
    setSteps([])
  }

  const handleRun = () => {
    setIsPlaying(false)
    let steps = []

    if (category === 'sorting') {
      const runners = { bubble: bubbleSort, merge: mergeSort, quick: quickSort, heap: heapSort }
      steps = (runners[algorithm] || bubbleSort)(array.length ? array : generateArray())
      if (!array.length) setArray(generateArray())
    } else if (category === 'searching') {
      const arr = array.length ? array : generateArray()
      if (!array.length) setArray(arr)
      steps = algorithm === 'binary' ? binarySearch(arr, searchTarget) : linearSearch(arr, searchTarget)
    } else if (category === 'graph') {
      const { nodes, edges } = graphData.nodes.length ? graphData : generateGraph(8)
      if (!graphData.nodes.length) setGraphData({ nodes, edges })
      if (algorithm === 'bfs') steps = bfs(nodes, edges, graphSource)
      else if (algorithm === 'dfs') steps = dfs(nodes, edges, graphSource)
      else if (algorithm === 'dijkstra') steps = dijkstra(nodes, edges, graphSource)
      else steps = aStar(nodes, edges, graphSource, graphTarget)
    } else if (category === 'tree') {
      const vals = generateBSTValues(10)
      if (algorithm === 'bst-insert') steps = bstInsert(vals)
      else if (algorithm === 'bst-delete') steps = bstDelete(vals, vals[Math.floor(vals.length / 2)])
      else {
        const traversalType = algorithm.replace('bst-', '')
        steps = bstTraversal(vals, traversalType)
      }
    }

    setSteps(steps)
    setTimeout(() => setIsPlaying(true), 100)
  }

  // Auto-generate on mount and category change
  useEffect(() => {
    handleGenerate()
  }, [category])

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--canvas)' }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-12">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--canvas)' }}>
          <StatsPanel />

          <div className="flex-1 overflow-hidden relative">
            <VisualizerArea />
          </div>

          <Controls onGenerate={handleGenerate} onRun={handleRun} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<VisualizerApp />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  )
}

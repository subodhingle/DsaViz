import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import VisualizerArea from './components/VisualizerArea'
import Controls from './components/Controls'
import StatsPanel from './components/StatsPanel'
import DataInputPanel from './components/DataInputPanel'
import LandingPage from './pages/LandingPage'
import useStore from './store/useStore'
import { generateArray, generateGraph, generateBSTValues } from './utils/generators'
import { bubbleSort, mergeSort, quickSort, heapSort } from './algorithms/sorting'
import { linearSearch, binarySearch } from './algorithms/searching'
import { bfs, dfs, dijkstra, aStar } from './algorithms/graph'
import { bstInsert, bstDelete, bstTraversal } from './algorithms/tree'
import {
  countingSort, shellSort, radixSort,
  stackOps, queueOps,
  slidingWindow, twoPointers, knapsack,
} from './algorithms/advanced'

function VisualizerApp() {
  const {
    theme, category, algorithm,
    array, setArray,
    graphData, setGraphData,
    setSteps, setIsPlaying,
    searchTarget, setSearchTarget,
    graphSource, graphTarget,
  } = useStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.className = theme === 'glass' ? 'theme-glass' : theme === 'military' ? 'theme-military' : ''
  }, [theme])

  const handleGenerate = () => {
    const needsArray = ['sorting', 'advanced-sorting', 'searching', 'custom', 'ds', 'techniques']
    if (needsArray.includes(category)) {
      const arr = generateArray(20, 5, 99)
      setArray(arr)
      setSearchTarget(arr[Math.floor(Math.random() * arr.length)])
    } else if (category === 'graph') {
      setGraphData(generateGraph(7))
    }
    setSteps([])
  }

  const handleRun = () => {
    setIsPlaying(false)
    const arr = array.length ? array : generateArray()
    if (!array.length) setArray(arr)
    let steps = []

    // ── Sorting ──
    if (category === 'sorting') {
      const runners = { bubble: bubbleSort, merge: mergeSort, quick: quickSort, heap: heapSort }
      steps = (runners[algorithm] || bubbleSort)(arr)
    }
    // ── Advanced Sorting ──
    else if (category === 'advanced-sorting') {
      if (algorithm === 'counting-sort') steps = countingSort(arr)
      else if (algorithm === 'shell-sort')   steps = shellSort(arr)
      else if (algorithm === 'radix-sort')   steps = radixSort(arr)
    }
    // ── Searching ──
    else if (category === 'searching') {
      steps = algorithm === 'binary' ? binarySearch(arr, searchTarget) : linearSearch(arr, searchTarget)
    }
    // ── Graph ──
    else if (category === 'graph') {
      const { nodes, edges } = graphData.nodes.length ? graphData : generateGraph(7)
      if (!graphData.nodes.length) setGraphData({ nodes, edges })
      if (algorithm === 'bfs')      steps = bfs(nodes, edges, graphSource)
      else if (algorithm === 'dfs') steps = dfs(nodes, edges, graphSource)
      else if (algorithm === 'dijkstra') steps = dijkstra(nodes, edges, graphSource)
      else steps = aStar(nodes, edges, graphSource, graphTarget)
    }
    // ── Tree ──
    else if (category === 'tree') {
      const vals = generateBSTValues(10)
      if (algorithm === 'bst-insert') steps = bstInsert(vals)
      else if (algorithm === 'bst-delete') steps = bstDelete(vals, vals[Math.floor(vals.length / 2)])
      else steps = bstTraversal(vals, algorithm.replace('bst-', ''))
    }
    // ── Data Structures ──
    else if (category === 'ds') {
      if (algorithm === 'stack-ops') steps = stackOps(arr)
      else if (algorithm === 'queue-ops') steps = queueOps(arr)
    }
    // ── Techniques ──
    else if (category === 'techniques') {
      if (algorithm === 'sliding-window') steps = slidingWindow(arr, 4)
      else if (algorithm === 'two-pointers') steps = twoPointers(arr, arr[0] + arr[arr.length - 1])
      else if (algorithm === 'knapsack') steps = knapsack(arr)
    }

    setSteps(steps)
    setTimeout(() => setIsPlaying(true), 100)
  }

  useEffect(() => { handleGenerate() }, [category])

  const showControls = !['compiler'].includes(category)

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--canvas)' }}>
      <Navbar onMenuClick={() => setSidebarOpen(v => !v)} sidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 overflow-hidden pt-12">
        <div className={`
          fixed lg:relative z-40 lg:z-auto
          top-12 lg:top-0 bottom-0 left-0
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar onSelect={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <StatsPanel />
          <div className="flex-1 overflow-hidden min-h-0">
            <VisualizerArea />
          </div>
          {showControls && (
            <>
              <DataInputPanel />
              <Controls onGenerate={handleGenerate} onRun={handleRun} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<LandingPage />} />
        <Route path="/app" element={<VisualizerApp />} />
      </Routes>
    </BrowserRouter>
  )
}

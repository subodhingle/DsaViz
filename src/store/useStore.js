import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Theme
  theme: 'neon', // 'neon' | 'glass' | 'military'
  setTheme: (theme) => set({ theme }),

  // Algorithm selection
  category: 'sorting',       // sorting | searching | graph | tree
  algorithm: 'bubble',
  setCategory: (category) => set({ category, algorithm: defaultAlgo[category] }),
  setAlgorithm: (algorithm) => set({ algorithm }),

  // Data
  array: [],
  setArray: (array) => set({ array }),
  graphData: { nodes: [], edges: [] },
  setGraphData: (graphData) => set({ graphData }),
  treeData: null,
  setTreeData: (treeData) => set({ treeData }),

  // Playback
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500, // ms per step
  setSteps: (steps) => set({ steps, currentStep: 0 }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  nextStep: () => {
    const { currentStep, steps } = get()
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 })
    else set({ isPlaying: false })
  },
  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },
  reset: () => set({ currentStep: 0, isPlaying: false }),

  // View
  view: 'visual', // 'visual' | 'logic' | 'split'
  setView: (view) => set({ view }),

  // Pseudocode highlight
  highlightedLine: -1,
  setHighlightedLine: (highlightedLine) => set({ highlightedLine }),

  // Variables trace
  variables: {},
  setVariables: (variables) => set({ variables }),

  // User algorithm builder
  userCode: '',
  setUserCode: (userCode) => set({ userCode }),
  userSteps: [],
  setUserSteps: (userSteps) => set({ userSteps }),

  // Breakpoints — set of 0-based line numbers
  breakpoints: new Set(),
  toggleBreakpoint: (line) => set(s => {
    const bp = new Set(s.breakpoints)
    bp.has(line) ? bp.delete(line) : bp.add(line)
    return { breakpoints: bp }
  }),
  clearBreakpoints: () => set({ breakpoints: new Set() }),

  // Execution log
  execLog: [],
  appendLog: (entry) => set(s => ({ execLog: [...s.execLog.slice(-199), entry] })),
  clearLog: () => set({ execLog: [] }),

  // Stats
  comparisons: 0,
  swaps: 0,
  setStats: (comparisons, swaps) => set({ comparisons, swaps }),

  // Search target
  searchTarget: 42,
  setSearchTarget: (searchTarget) => set({ searchTarget }),

  // Graph source/target
  graphSource: 0,
  graphTarget: 5,
  setGraphSource: (graphSource) => set({ graphSource }),
  setGraphTarget: (graphTarget) => set({ graphTarget }),
}))

const defaultAlgo = {
  sorting:          'bubble',
  'advanced-sorting': 'counting-sort',
  searching:        'linear',
  graph:            'bfs',
  tree:             'bst-insert',
  ds:               'stack-ops',
  techniques:       'sliding-window',
  custom:           'custom',
  compiler:         'compiler',
}

export default useStore

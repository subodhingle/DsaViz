import { describe, it, expect, beforeEach } from 'vitest'
import useStore from '../store/useStore'

// Reset store to initial state before each test
beforeEach(() => {
  useStore.setState({
    theme: 'neon',
    category: 'sorting',
    algorithm: 'bubble',
    array: [],
    graphData: { nodes: [], edges: [] },
    treeData: null,
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 500,
    view: 'visual',
    highlightedLine: -1,
    variables: {},
    userCode: '',
    userSteps: [],
    breakpoints: new Set(),
    execLog: [],
    comparisons: 0,
    swaps: 0,
    searchTarget: 42,
    graphSource: 0,
    graphTarget: 5,
  })
})

describe('useStore — theme', () => {
  it('has default theme neon', () => {
    expect(useStore.getState().theme).toBe('neon')
  })

  it('setTheme updates theme', () => {
    useStore.getState().setTheme('glass')
    expect(useStore.getState().theme).toBe('glass')
  })

  it('setTheme to military works', () => {
    useStore.getState().setTheme('military')
    expect(useStore.getState().theme).toBe('military')
  })
})

describe('useStore — category and algorithm selection', () => {
  it('has default category sorting and algorithm bubble', () => {
    const { category, algorithm } = useStore.getState()
    expect(category).toBe('sorting')
    expect(algorithm).toBe('bubble')
  })

  it('setCategory updates category and resets algorithm to default', () => {
    useStore.getState().setCategory('searching')
    const { category, algorithm } = useStore.getState()
    expect(category).toBe('searching')
    expect(algorithm).toBe('linear')
  })

  it('setCategory to graph sets algorithm to bfs', () => {
    useStore.getState().setCategory('graph')
    expect(useStore.getState().algorithm).toBe('bfs')
  })

  it('setCategory to tree sets algorithm to bst-insert', () => {
    useStore.getState().setCategory('tree')
    expect(useStore.getState().algorithm).toBe('bst-insert')
  })

  it('setAlgorithm updates algorithm without changing category', () => {
    useStore.getState().setAlgorithm('merge')
    expect(useStore.getState().algorithm).toBe('merge')
    expect(useStore.getState().category).toBe('sorting')
  })
})

describe('useStore — data state', () => {
  it('setArray stores the array', () => {
    useStore.getState().setArray([1, 2, 3])
    expect(useStore.getState().array).toEqual([1, 2, 3])
  })

  it('setGraphData stores graph data', () => {
    const data = { nodes: [{ id: 0 }], edges: [{ source: 0, target: 1 }] }
    useStore.getState().setGraphData(data)
    expect(useStore.getState().graphData).toEqual(data)
  })

  it('setTreeData stores tree data', () => {
    useStore.getState().setTreeData({ root: 50 })
    expect(useStore.getState().treeData).toEqual({ root: 50 })
  })
})

describe('useStore — playback', () => {
  it('setSteps stores steps and resets currentStep to 0', () => {
    useStore.setState({ currentStep: 3 })
    const steps = [{ array: [1] }, { array: [2] }, { array: [3] }]
    useStore.getState().setSteps(steps)
    expect(useStore.getState().steps).toEqual(steps)
    expect(useStore.getState().currentStep).toBe(0)
  })

  it('nextStep increments currentStep when not at end', () => {
    useStore.setState({ steps: [0, 1, 2], currentStep: 0 })
    useStore.getState().nextStep()
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('nextStep stops playing when at last step', () => {
    useStore.setState({ steps: [0, 1, 2], currentStep: 2, isPlaying: true })
    useStore.getState().nextStep()
    expect(useStore.getState().currentStep).toBe(2)
    expect(useStore.getState().isPlaying).toBe(false)
  })

  it('prevStep decrements currentStep when not at beginning', () => {
    useStore.setState({ steps: [0, 1, 2], currentStep: 2 })
    useStore.getState().prevStep()
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('prevStep does not go below 0', () => {
    useStore.setState({ currentStep: 0 })
    useStore.getState().prevStep()
    expect(useStore.getState().currentStep).toBe(0)
  })

  it('reset sets currentStep to 0 and isPlaying to false', () => {
    useStore.setState({ currentStep: 5, isPlaying: true })
    useStore.getState().reset()
    expect(useStore.getState().currentStep).toBe(0)
    expect(useStore.getState().isPlaying).toBe(false)
  })

  it('setIsPlaying updates isPlaying', () => {
    useStore.getState().setIsPlaying(true)
    expect(useStore.getState().isPlaying).toBe(true)
  })

  it('setSpeed updates speed', () => {
    useStore.getState().setSpeed(200)
    expect(useStore.getState().speed).toBe(200)
  })
})

describe('useStore — view', () => {
  it('has default view visual', () => {
    expect(useStore.getState().view).toBe('visual')
  })

  it('setView updates view', () => {
    useStore.getState().setView('logic')
    expect(useStore.getState().view).toBe('logic')
  })

  it('setView to split works', () => {
    useStore.getState().setView('split')
    expect(useStore.getState().view).toBe('split')
  })
})

describe('useStore — breakpoints', () => {
  it('toggleBreakpoint adds a line', () => {
    useStore.getState().toggleBreakpoint(3)
    expect(useStore.getState().breakpoints.has(3)).toBe(true)
  })

  it('toggleBreakpoint removes an already-set line', () => {
    useStore.setState({ breakpoints: new Set([3]) })
    useStore.getState().toggleBreakpoint(3)
    expect(useStore.getState().breakpoints.has(3)).toBe(false)
  })

  it('toggleBreakpoint can set multiple lines', () => {
    useStore.getState().toggleBreakpoint(1)
    useStore.getState().toggleBreakpoint(5)
    const bp = useStore.getState().breakpoints
    expect(bp.has(1)).toBe(true)
    expect(bp.has(5)).toBe(true)
  })

  it('clearBreakpoints removes all breakpoints', () => {
    useStore.setState({ breakpoints: new Set([1, 2, 3]) })
    useStore.getState().clearBreakpoints()
    expect(useStore.getState().breakpoints.size).toBe(0)
  })
})

describe('useStore — execution log', () => {
  it('appendLog adds an entry', () => {
    useStore.getState().appendLog('line 1')
    expect(useStore.getState().execLog).toContain('line 1')
  })

  it('appendLog keeps at most 200 entries (slices at -199 to allow one more)', () => {
    // Fill with 200 entries then add one more
    const entries = Array.from({ length: 200 }, (_, i) => `entry-${i}`)
    useStore.setState({ execLog: entries })
    useStore.getState().appendLog('new-entry')
    const log = useStore.getState().execLog
    expect(log.length).toBe(200)
    expect(log[log.length - 1]).toBe('new-entry')
    expect(log[0]).toBe('entry-1') // first entry was dropped
  })

  it('clearLog empties the log', () => {
    useStore.setState({ execLog: ['a', 'b', 'c'] })
    useStore.getState().clearLog()
    expect(useStore.getState().execLog).toHaveLength(0)
  })
})

describe('useStore — stats', () => {
  it('setStats updates comparisons and swaps', () => {
    useStore.getState().setStats(10, 5)
    const { comparisons, swaps } = useStore.getState()
    expect(comparisons).toBe(10)
    expect(swaps).toBe(5)
  })
})

describe('useStore — search target', () => {
  it('has default searchTarget 42', () => {
    expect(useStore.getState().searchTarget).toBe(42)
  })

  it('setSearchTarget updates the target', () => {
    useStore.getState().setSearchTarget(77)
    expect(useStore.getState().searchTarget).toBe(77)
  })
})

describe('useStore — graph source/target', () => {
  it('has default graphSource 0 and graphTarget 5', () => {
    expect(useStore.getState().graphSource).toBe(0)
    expect(useStore.getState().graphTarget).toBe(5)
  })

  it('setGraphSource updates source', () => {
    useStore.getState().setGraphSource(2)
    expect(useStore.getState().graphSource).toBe(2)
  })

  it('setGraphTarget updates target', () => {
    useStore.getState().setGraphTarget(3)
    expect(useStore.getState().graphTarget).toBe(3)
  })
})
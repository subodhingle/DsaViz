import { describe, it, expect, beforeEach } from 'vitest'
import useStore from '../store/useStore'

// Reset store to default state before each test
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

// ── Theme ─────────────────────────────────────────────────────────────────────
describe('theme', () => {
  it('has default theme neon', () => {
    expect(useStore.getState().theme).toBe('neon')
  })

  it('setTheme updates theme', () => {
    useStore.getState().setTheme('glass')
    expect(useStore.getState().theme).toBe('glass')
  })

  it('setTheme to military', () => {
    useStore.getState().setTheme('military')
    expect(useStore.getState().theme).toBe('military')
  })
})

// ── Category & Algorithm ──────────────────────────────────────────────────────
describe('category and algorithm', () => {
  it('has default category sorting', () => {
    expect(useStore.getState().category).toBe('sorting')
  })

  it('has default algorithm bubble', () => {
    expect(useStore.getState().algorithm).toBe('bubble')
  })

  it('setCategory updates category and sets default algorithm', () => {
    useStore.getState().setCategory('searching')
    expect(useStore.getState().category).toBe('searching')
    expect(useStore.getState().algorithm).toBe('linear')
  })

  it('setCategory to graph sets default bfs', () => {
    useStore.getState().setCategory('graph')
    expect(useStore.getState().algorithm).toBe('bfs')
  })

  it('setCategory to tree sets default bst-insert', () => {
    useStore.getState().setCategory('tree')
    expect(useStore.getState().algorithm).toBe('bst-insert')
  })

  it('setAlgorithm updates algorithm independently', () => {
    useStore.getState().setAlgorithm('merge')
    expect(useStore.getState().algorithm).toBe('merge')
    expect(useStore.getState().category).toBe('sorting')
  })
})

// ── Array data ────────────────────────────────────────────────────────────────
describe('array', () => {
  it('starts empty', () => {
    expect(useStore.getState().array).toEqual([])
  })

  it('setArray updates array', () => {
    useStore.getState().setArray([1, 2, 3])
    expect(useStore.getState().array).toEqual([1, 2, 3])
  })

  it('setArray replaces previous array', () => {
    useStore.getState().setArray([10, 20])
    useStore.getState().setArray([5, 6, 7])
    expect(useStore.getState().array).toEqual([5, 6, 7])
  })
})

// ── Graph data ────────────────────────────────────────────────────────────────
describe('graphData', () => {
  it('starts with empty nodes and edges', () => {
    const { graphData } = useStore.getState()
    expect(graphData.nodes).toEqual([])
    expect(graphData.edges).toEqual([])
  })

  it('setGraphData updates graph data', () => {
    const data = { nodes: [{ id: 0 }], edges: [{ source: 0, target: 1 }] }
    useStore.getState().setGraphData(data)
    expect(useStore.getState().graphData).toEqual(data)
  })
})

// ── Playback steps ────────────────────────────────────────────────────────────
describe('steps and playback', () => {
  it('starts with empty steps', () => {
    expect(useStore.getState().steps).toEqual([])
  })

  it('setSteps resets currentStep to 0', () => {
    useStore.setState({ currentStep: 3 })
    useStore.getState().setSteps([{ a: 1 }, { a: 2 }])
    expect(useStore.getState().steps).toHaveLength(2)
    expect(useStore.getState().currentStep).toBe(0)
  })

  it('nextStep advances currentStep', () => {
    useStore.getState().setSteps([{}, {}, {}])
    useStore.getState().nextStep()
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('nextStep stops at last step and sets isPlaying false', () => {
    useStore.getState().setSteps([{}, {}])
    useStore.setState({ currentStep: 1, isPlaying: true })
    useStore.getState().nextStep()
    expect(useStore.getState().currentStep).toBe(1)
    expect(useStore.getState().isPlaying).toBe(false)
  })

  it('prevStep decrements currentStep', () => {
    useStore.getState().setSteps([{}, {}, {}])
    useStore.setState({ currentStep: 2 })
    useStore.getState().prevStep()
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('prevStep does not go below 0', () => {
    useStore.getState().setSteps([{}, {}])
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
})

// ── Speed ─────────────────────────────────────────────────────────────────────
describe('speed', () => {
  it('has default speed 500', () => {
    expect(useStore.getState().speed).toBe(500)
  })

  it('setSpeed updates speed', () => {
    useStore.getState().setSpeed(100)
    expect(useStore.getState().speed).toBe(100)
  })
})

// ── View ──────────────────────────────────────────────────────────────────────
describe('view', () => {
  it('has default view visual', () => {
    expect(useStore.getState().view).toBe('visual')
  })

  it('setView updates view to split', () => {
    useStore.getState().setView('split')
    expect(useStore.getState().view).toBe('split')
  })

  it('setView updates view to logic', () => {
    useStore.getState().setView('logic')
    expect(useStore.getState().view).toBe('logic')
  })
})

// ── Breakpoints ───────────────────────────────────────────────────────────────
describe('breakpoints', () => {
  it('starts with empty breakpoints set', () => {
    expect(useStore.getState().breakpoints.size).toBe(0)
  })

  it('toggleBreakpoint adds a line', () => {
    useStore.getState().toggleBreakpoint(3)
    expect(useStore.getState().breakpoints.has(3)).toBe(true)
  })

  it('toggleBreakpoint removes an existing line', () => {
    useStore.getState().toggleBreakpoint(3)
    useStore.getState().toggleBreakpoint(3)
    expect(useStore.getState().breakpoints.has(3)).toBe(false)
  })

  it('clearBreakpoints empties the set', () => {
    useStore.getState().toggleBreakpoint(1)
    useStore.getState().toggleBreakpoint(2)
    useStore.getState().clearBreakpoints()
    expect(useStore.getState().breakpoints.size).toBe(0)
  })

  it('toggleBreakpoint can have multiple breakpoints', () => {
    useStore.getState().toggleBreakpoint(0)
    useStore.getState().toggleBreakpoint(5)
    useStore.getState().toggleBreakpoint(10)
    expect(useStore.getState().breakpoints.size).toBe(3)
    expect(useStore.getState().breakpoints.has(0)).toBe(true)
    expect(useStore.getState().breakpoints.has(5)).toBe(true)
    expect(useStore.getState().breakpoints.has(10)).toBe(true)
  })
})

// ── Execution log ─────────────────────────────────────────────────────────────
describe('execLog', () => {
  it('starts empty', () => {
    expect(useStore.getState().execLog).toEqual([])
  })

  it('appendLog adds an entry', () => {
    useStore.getState().appendLog('line 1')
    expect(useStore.getState().execLog).toHaveLength(1)
    expect(useStore.getState().execLog[0]).toBe('line 1')
  })

  it('appendLog caps log at 200 entries', () => {
    for (let i = 0; i < 205; i++) {
      useStore.getState().appendLog(`entry ${i}`)
    }
    expect(useStore.getState().execLog.length).toBeLessThanOrEqual(200)
  })

  it('clearLog empties the log', () => {
    useStore.getState().appendLog('a')
    useStore.getState().appendLog('b')
    useStore.getState().clearLog()
    expect(useStore.getState().execLog).toEqual([])
  })
})

// ── Stats ─────────────────────────────────────────────────────────────────────
describe('stats', () => {
  it('has default comparisons and swaps of 0', () => {
    expect(useStore.getState().comparisons).toBe(0)
    expect(useStore.getState().swaps).toBe(0)
  })

  it('setStats updates comparisons and swaps', () => {
    useStore.getState().setStats(15, 7)
    expect(useStore.getState().comparisons).toBe(15)
    expect(useStore.getState().swaps).toBe(7)
  })
})

// ── Search target ─────────────────────────────────────────────────────────────
describe('searchTarget', () => {
  it('has default searchTarget 42', () => {
    expect(useStore.getState().searchTarget).toBe(42)
  })

  it('setSearchTarget updates target', () => {
    useStore.getState().setSearchTarget(77)
    expect(useStore.getState().searchTarget).toBe(77)
  })
})

// ── Graph source/target ───────────────────────────────────────────────────────
describe('graphSource and graphTarget', () => {
  it('has default graphSource 0 and graphTarget 5', () => {
    expect(useStore.getState().graphSource).toBe(0)
    expect(useStore.getState().graphTarget).toBe(5)
  })

  it('setGraphSource updates source', () => {
    useStore.getState().setGraphSource(3)
    expect(useStore.getState().graphSource).toBe(3)
  })

  it('setGraphTarget updates target', () => {
    useStore.getState().setGraphTarget(7)
    expect(useStore.getState().graphTarget).toBe(7)
  })
})

// ── User code builder ─────────────────────────────────────────────────────────
describe('userCode and userSteps', () => {
  it('starts with empty userCode', () => {
    expect(useStore.getState().userCode).toBe('')
  })

  it('setUserCode updates code', () => {
    useStore.getState().setUserCode('compare(0, 1)')
    expect(useStore.getState().userCode).toBe('compare(0, 1)')
  })

  it('setUserSteps updates steps', () => {
    const steps = [{ array: [1, 2], comparing: [0, 1] }]
    useStore.getState().setUserSteps(steps)
    expect(useStore.getState().userSteps).toEqual(steps)
  })
})
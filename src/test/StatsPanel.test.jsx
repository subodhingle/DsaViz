import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsPanel from '../components/StatsPanel'
import useStore from '../store/useStore'

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

beforeEach(() => {
  useStore.setState({
    steps: [],
    currentStep: 0,
    algorithm: 'bubble',
  })
})

// ── Exported COMPLEXITY map tests ──────────────────────────────────────────────
// We test via the rendered component output since COMPLEXITY is not exported

describe('StatsPanel — complexity display for sorting algorithms', () => {
  it('shows bubble sort complexity O(n²) worst case', () => {
    useStore.setState({ algorithm: 'bubble' })
    render(<StatsPanel />)
    expect(screen.getByText('O(n²)')).toBeInTheDocument()
  })

  it('shows merge sort O(n log n) complexity', () => {
    useStore.setState({ algorithm: 'merge' })
    render(<StatsPanel />)
    const values = screen.getAllByText('O(n log n)')
    expect(values.length).toBeGreaterThan(0)
  })

  it('shows heap sort O(1) space complexity', () => {
    useStore.setState({ algorithm: 'heap' })
    render(<StatsPanel />)
    expect(screen.getByText('O(1)')).toBeInTheDocument()
  })
})

describe('StatsPanel — complexity display for searching algorithms', () => {
  it('shows linear search O(n) worst case', () => {
    useStore.setState({ algorithm: 'linear' })
    render(<StatsPanel />)
    expect(screen.getByText('O(n)')).toBeInTheDocument()
  })

  it('shows binary search O(log n) worst case', () => {
    useStore.setState({ algorithm: 'binary' })
    render(<StatsPanel />)
    expect(screen.getByText('O(log n)')).toBeInTheDocument()
  })
})

describe('StatsPanel — complexity display for graph algorithms', () => {
  it('shows bfs O(V+E) complexity', () => {
    useStore.setState({ algorithm: 'bfs' })
    render(<StatsPanel />)
    // BFS has O(V+E) for both Worst and Best, so multiple elements appear
    const values = screen.getAllByText('O(V+E)')
    expect(values.length).toBeGreaterThanOrEqual(2)
  })

  it('shows dijkstra updated complexity O((V+E) log V)', () => {
    useStore.setState({ algorithm: 'dijkstra' })
    render(<StatsPanel />)
    expect(screen.getByText('O((V+E) log V)')).toBeInTheDocument()
  })

  it('shows astar O(E log V) complexity', () => {
    useStore.setState({ algorithm: 'astar' })
    render(<StatsPanel />)
    expect(screen.getByText('O(E log V)')).toBeInTheDocument()
  })
})

describe('StatsPanel — complexity display for BST algorithms', () => {
  it('shows bst-insert O(log n) complexity', () => {
    useStore.setState({ algorithm: 'bst-insert' })
    render(<StatsPanel />)
    const values = screen.getAllByText('O(log n)')
    expect(values.length).toBeGreaterThan(0)
  })

  it('shows bst-inorder O(n) complexity', () => {
    useStore.setState({ algorithm: 'bst-inorder' })
    render(<StatsPanel />)
    const values = screen.getAllByText('O(n)')
    expect(values.length).toBeGreaterThan(0)
  })
})

describe('StatsPanel — unknown algorithm fallback', () => {
  it('shows — for unknown algorithm', () => {
    useStore.setState({ algorithm: 'unknown-algo' })
    render(<StatsPanel />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBe(3) // Worst, Best, Space all show —
  })
})

describe('StatsPanel — live stats display', () => {
  it('renders stat labels: Comparisons, Swaps, Steps, Progress', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Comparisons')).toBeInTheDocument()
    expect(screen.getByText('Swaps')).toBeInTheDocument()
    expect(screen.getByText('Steps')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })

  it('shows 0 for comparisons and swaps with empty steps', () => {
    render(<StatsPanel />)
    // value 0 appears for comparisons and swaps
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(2)
  })

  it('shows correct steps count from store', () => {
    useStore.setState({ steps: [1, 2, 3], currentStep: 0 })
    render(<StatsPanel />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows 0% progress with only one step', () => {
    useStore.setState({ steps: [{}], currentStep: 0 })
    render(<StatsPanel />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows 50% progress at midpoint of steps', () => {
    useStore.setState({ steps: [{}, {}, {}, {}, {}], currentStep: 2 })
    render(<StatsPanel />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows 100% progress at last step', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<StatsPanel />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows comparisons from step variables', () => {
    useStore.setState({
      steps: [{ variables: { comparisons: 7, swaps: 3 } }],
      currentStep: 0,
    })
    render(<StatsPanel />)
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

describe('StatsPanel — complexity label headers', () => {
  it('renders Worst, Best, and Space labels', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Worst')).toBeInTheDocument()
    expect(screen.getByText('Best')).toBeInTheDocument()
    expect(screen.getByText('Space')).toBeInTheDocument()
  })
})
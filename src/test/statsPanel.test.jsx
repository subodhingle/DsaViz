import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useStore from '../store/useStore'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Eye: () => <svg data-testid="icon-eye" />,
  ArrowLeftRight: () => <svg data-testid="icon-arrows" />,
  Activity: () => <svg data-testid="icon-activity" />,
  TrendingUp: () => <svg data-testid="icon-trending" />,
}))

import StatsPanel from '../components/StatsPanel'

beforeEach(() => {
  useStore.setState({
    steps: [],
    currentStep: 0,
    algorithm: 'bubble',
    comparisons: 0,
    swaps: 0,
  })
})

// ── COMPLEXITY data ───────────────────────────────────────────────────────────
describe('COMPLEXITY data via StatsPanel render', () => {
  const algorithms = [
    { id: 'bubble',        worst: 'O(n²)',          best: 'O(n)',       space: 'O(1)' },
    { id: 'merge',         worst: 'O(n log n)',      best: 'O(n log n)', space: 'O(n)' },
    { id: 'quick',         worst: 'O(n log n)',      best: 'O(n log n)', space: 'O(log n)' },
    { id: 'heap',          worst: 'O(n log n)',      best: 'O(n log n)', space: 'O(1)' },
    { id: 'linear',        worst: 'O(n)',            best: 'O(1)',        space: 'O(1)' },
    { id: 'binary',        worst: 'O(log n)',        best: 'O(1)',        space: 'O(1)' },
    { id: 'bfs',           worst: 'O(V+E)',          best: 'O(V+E)',      space: 'O(V)' },
    { id: 'dfs',           worst: 'O(V+E)',          best: 'O(V+E)',      space: 'O(V)' },
    { id: 'dijkstra',      worst: 'O((V+E) log V)',  best: 'O(E log V)', space: 'O(V)' },
    { id: 'astar',         worst: 'O(E log V)',      best: 'O(E)',        space: 'O(V)' },
    { id: 'bst-insert',    worst: 'O(log n)',        best: 'O(log n)',    space: 'O(1)' },
    { id: 'bst-delete',    worst: 'O(log n)',        best: 'O(log n)',    space: 'O(1)' },
    { id: 'bst-inorder',   worst: 'O(n)',            best: 'O(n)',        space: 'O(n)' },
    { id: 'bst-preorder',  worst: 'O(n)',            best: 'O(n)',        space: 'O(n)' },
    { id: 'bst-postorder', worst: 'O(n)',            best: 'O(n)',        space: 'O(n)' },
  ]

  algorithms.forEach(({ id, worst, best, space }) => {
    it(`displays correct complexity for ${id}`, () => {
      useStore.setState({ algorithm: id })
      render(<StatsPanel />)
      // Use getAllByText to handle cases where values repeat (e.g. O(n) as worst/best/space)
      expect(screen.getAllByText(worst).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(best).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(space).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('falls back to dashes for unknown algorithm', () => {
    useStore.setState({ algorithm: 'unknown-algo' })
    render(<StatsPanel />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(3)
  })

  it('dijkstra uses spaced format O((V+E) log V) not O((V+E)logV)', () => {
    useStore.setState({ algorithm: 'dijkstra' })
    render(<StatsPanel />)
    expect(screen.getByText('O((V+E) log V)')).toBeInTheDocument()
    expect(screen.queryByText('O((V+E)logV)')).not.toBeInTheDocument()
  })
})

// ── Live stats display ────────────────────────────────────────────────────────
describe('stats labels', () => {
  it('shows Comparisons label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Comparisons')).toBeInTheDocument()
  })

  it('shows Swaps label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Swaps')).toBeInTheDocument()
  })

  it('shows Steps label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Steps')).toBeInTheDocument()
  })

  it('shows Progress label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })
})

// ── Progress calculation ──────────────────────────────────────────────────────
describe('progress calculation', () => {
  it('shows 0% when no steps', () => {
    useStore.setState({ steps: [], currentStep: 0 })
    render(<StatsPanel />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows 0% for single step', () => {
    useStore.setState({ steps: [{}], currentStep: 0 })
    render(<StatsPanel />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows 50% at midpoint of steps', () => {
    useStore.setState({ steps: [{}, {}, {}, {}, {}], currentStep: 2 })
    render(<StatsPanel />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows 100% at last step', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<StatsPanel />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

// ── Comparison and swap values from step variables ────────────────────────────
describe('comparisons and swaps from step variables', () => {
  it('shows 0 comparisons when no step data', () => {
    useStore.setState({ steps: [], currentStep: 0 })
    render(<StatsPanel />)
    // comparisons defaults to 0
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(1)
  })

  it('reads comparisons from step variables', () => {
    useStore.setState({
      steps: [{ variables: { comparisons: 12, swaps: 5 } }],
      currentStep: 0,
    })
    render(<StatsPanel />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows total steps count', () => {
    const steps = [{}, {}, {}, {}, {}, {}]
    useStore.setState({ steps, currentStep: 0 })
    render(<StatsPanel />)
    expect(screen.getByText('6')).toBeInTheDocument()
  })
})

// ── Complexity labels ─────────────────────────────────────────────────────────
describe('complexity labels', () => {
  it('shows Worst label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Worst')).toBeInTheDocument()
  })

  it('shows Best label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Best')).toBeInTheDocument()
  })

  it('shows Space label', () => {
    render(<StatsPanel />)
    expect(screen.getByText('Space')).toBeInTheDocument()
  })
})
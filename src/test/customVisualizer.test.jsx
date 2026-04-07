import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useStore from '../store/useStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, transition, style, ...props }) => (
      <div style={style} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Mock ResizeObserver — calls callback immediately on observe() so containerH gets set
global.ResizeObserver = class ResizeObserver {
  constructor(cb) { this.cb = cb }
  observe(el) {
    this.cb([{ contentRect: { height: 400, width: 800 } }])
  }
  unobserve() {}
  disconnect() {}
}

import CustomVisualizer from '../components/visualizers/CustomVisualizer'

beforeEach(() => {
  useStore.setState({ steps: [], currentStep: 0 })
})

// ── Empty state ───────────────────────────────────────────────────────────────
describe('CustomVisualizer empty state', () => {
  it('shows write algorithm hint when no steps', () => {
    render(<CustomVisualizer />)
    expect(screen.getByText(/Write your algorithm/i)).toBeInTheDocument()
  })

  it('shows Run reference in empty state', () => {
    render(<CustomVisualizer />)
    expect(screen.getByText('Run')).toBeInTheDocument()
  })
})

// ── With steps ────────────────────────────────────────────────────────────────
describe('CustomVisualizer with steps', () => {
  it('renders without error with basic step data', () => {
    useStore.setState({
      steps: [{
        array: [10, 50, 30, 20, 40],
        comparing: [],
        swapping: [],
        sorted: [],
        highlighted: [],
        pivot: null,
        message: null,
        error: null,
        type: null,
      }],
      currentStep: 0,
    })
    expect(() => render(<CustomVisualizer />)).not.toThrow()
  })

  it('shows message when step has a message', () => {
    useStore.setState({
      steps: [{
        array: [1, 2, 3],
        comparing: [],
        swapping: [],
        sorted: [],
        highlighted: [],
        pivot: null,
        message: 'Comparing index 0 and 1',
        error: null,
        type: null,
      }],
      currentStep: 0,
    })
    render(<CustomVisualizer />)
    expect(screen.getByText('Comparing index 0 and 1')).toBeInTheDocument()
  })

  it('shows error message with warning prefix when step has error', () => {
    useStore.setState({
      steps: [{
        array: [1, 2, 3],
        comparing: [],
        swapping: [],
        sorted: [],
        highlighted: [],
        pivot: null,
        message: null,
        error: 'Invalid operation',
        type: null,
      }],
      currentStep: 0,
    })
    render(<CustomVisualizer />)
    expect(screen.getByText('⚠ Invalid operation')).toBeInTheDocument()
  })

  it('shows done message with type done', () => {
    useStore.setState({
      steps: [{
        array: [1, 2, 3],
        comparing: [],
        swapping: [],
        sorted: [0, 1, 2],
        highlighted: [],
        pivot: null,
        message: 'Sorting complete',
        error: null,
        type: 'done',
      }],
      currentStep: 0,
    })
    render(<CustomVisualizer />)
    expect(screen.getByText('Sorting complete')).toBeInTheDocument()
  })

  it('shows value labels for small arrays (<=28)', () => {
    useStore.setState({
      steps: [{
        array: [5, 15, 25],
        comparing: [],
        swapping: [],
        sorted: [],
        highlighted: [],
        pivot: null,
        message: null,
        error: null,
      }],
      currentStep: 0,
    })
    render(<CustomVisualizer />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('does not show labels for large arrays (>28)', () => {
    const largeArray = Array.from({ length: 30 }, (_, i) => i + 5)
    useStore.setState({
      steps: [{
        array: largeArray,
        comparing: [],
        swapping: [],
        sorted: [],
        highlighted: [],
        pivot: null,
        message: null,
        error: null,
      }],
      currentStep: 0,
    })
    render(<CustomVisualizer />)
    // For >28 items, no value labels
    expect(screen.queryByText('5')).not.toBeInTheDocument()
  })
})

// ── Legend ────────────────────────────────────────────────────────────────────
describe('CustomVisualizer legend', () => {
  const basicStep = {
    array: [1, 2, 3],
    comparing: [],
    swapping: [],
    sorted: [],
    highlighted: [],
    pivot: null,
    message: null,
    error: null,
  }

  it('shows Compare legend', () => {
    useStore.setState({ steps: [basicStep], currentStep: 0 })
    render(<CustomVisualizer />)
    expect(screen.getByText('Compare')).toBeInTheDocument()
  })

  it('shows Swap legend', () => {
    useStore.setState({ steps: [basicStep], currentStep: 0 })
    render(<CustomVisualizer />)
    expect(screen.getByText('Swap')).toBeInTheDocument()
  })

  it('shows Pivot legend', () => {
    useStore.setState({ steps: [basicStep], currentStep: 0 })
    render(<CustomVisualizer />)
    expect(screen.getByText('Pivot')).toBeInTheDocument()
  })

  it('shows Active legend', () => {
    useStore.setState({ steps: [basicStep], currentStep: 0 })
    render(<CustomVisualizer />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows Sorted legend', () => {
    useStore.setState({ steps: [basicStep], currentStep: 0 })
    render(<CustomVisualizer />)
    expect(screen.getByText('Sorted')).toBeInTheDocument()
  })

  it('shows Default legend', () => {
    useStore.setState({ steps: [basicStep], currentStep: 0 })
    render(<CustomVisualizer />)
    expect(screen.getByText('Default')).toBeInTheDocument()
  })
})

// ── getBarStyle color priority ────────────────────────────────────────────────
describe('getBarStyle color priority', () => {
  it('swapping takes visual priority (renders without error)', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30],
        comparing: [0],
        swapping: [0],   // swapping beats comparing
        sorted: [0],
        highlighted: [0],
        pivot: 0,
        message: null,
        error: null,
      }],
      currentStep: 0,
    })
    expect(() => render(<CustomVisualizer />)).not.toThrow()
  })

  it('renders step with pivot index', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30],
        comparing: [],
        swapping: [],
        sorted: [],
        highlighted: [],
        pivot: 1,
        message: null,
        error: null,
      }],
      currentStep: 0,
    })
    expect(() => render(<CustomVisualizer />)).not.toThrow()
  })
})
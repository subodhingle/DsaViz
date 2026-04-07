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

import SearchingVisualizer from '../components/visualizers/SearchingVisualizer'

beforeEach(() => {
  useStore.setState({ steps: [], currentStep: 0, searchTarget: 42 })
})

// ── Empty state ───────────────────────────────────────────────────────────────
describe('SearchingVisualizer empty state', () => {
  it('shows Run hint when no steps', () => {
    render(<SearchingVisualizer />)
    expect(screen.getByText(/Run/)).toBeInTheDocument()
  })

  it('shows Click text in empty state', () => {
    render(<SearchingVisualizer />)
    expect(screen.getByText(/Click/i)).toBeInTheDocument()
  })
})

// ── With steps ────────────────────────────────────────────────────────────────
describe('SearchingVisualizer with steps', () => {
  it('renders without error with step data', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30, 42, 50],
        current: 2,
        found: null,
        range: [0, 4],
      }],
      currentStep: 0,
      searchTarget: 42,
    })
    expect(() => render(<SearchingVisualizer />)).not.toThrow()
  })

  it('shows Target label', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30],
        current: 0,
        found: null,
        range: [],
      }],
      currentStep: 0,
      searchTarget: 20,
    })
    render(<SearchingVisualizer />)
    expect(screen.getByText('Target')).toBeInTheDocument()
  })

  it('shows the search target value in header badge', () => {
    useStore.setState({
      steps: [{
        array: [10, 30, 50],  // array does NOT contain 20, so "20" appears only once (target badge)
        current: 0,
        found: null,
        range: [],
      }],
      currentStep: 0,
      searchTarget: 20,
    })
    render(<SearchingVisualizer />)
    // Use getAllByText since target may also appear in bar labels if present in array
    expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1)
  })

  it('shows array value labels', () => {
    useStore.setState({
      steps: [{
        array: [5, 15, 25],
        current: 0,
        found: null,
        range: [],
      }],
      currentStep: 0,
      searchTarget: 99,  // target distinct from array values to avoid duplicates
    })
    render(<SearchingVisualizer />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('shows index labels', () => {
    useStore.setState({
      steps: [{
        array: [5, 15, 25],
        current: 0,
        found: null,
        range: [],
      }],
      currentStep: 0,
      searchTarget: 99,
    })
    render(<SearchingVisualizer />)
    expect(screen.getByText('[0]')).toBeInTheDocument()
    expect(screen.getByText('[1]')).toBeInTheDocument()
    expect(screen.getByText('[2]')).toBeInTheDocument()
  })
})

// ── Legend ────────────────────────────────────────────────────────────────────
describe('SearchingVisualizer legend', () => {
  const stepWithData = {
    array: [10, 20, 30],
    current: 1,
    found: null,
    range: [0, 2],
  }

  it('shows Current legend', () => {
    useStore.setState({ steps: [stepWithData], currentStep: 0 })
    render(<SearchingVisualizer />)
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('shows Search Range legend', () => {
    useStore.setState({ steps: [stepWithData], currentStep: 0 })
    render(<SearchingVisualizer />)
    expect(screen.getByText('Search Range')).toBeInTheDocument()
  })

  it('shows Found legend', () => {
    useStore.setState({ steps: [stepWithData], currentStep: 0 })
    render(<SearchingVisualizer />)
    expect(screen.getByText('Found')).toBeInTheDocument()
  })
})

// ── getState color logic (via STATE_COLORS) ───────────────────────────────────
describe('getState logic', () => {
  it('renders correctly when element is found', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30],
        current: 1,
        found: 1,  // index 1 is found
        range: [0, 2],
      }],
      currentStep: 0,
      searchTarget: 20,
    })
    expect(() => render(<SearchingVisualizer />)).not.toThrow()
  })

  it('renders correctly with range highlighting', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30, 40, 50],
        current: 2,
        found: null,
        range: [1, 3],  // search range
      }],
      currentStep: 0,
      searchTarget: 30,
    })
    expect(() => render(<SearchingVisualizer />)).not.toThrow()
  })

  it('renders correctly when range is empty array', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30],
        current: 0,
        found: null,
        range: [],
      }],
      currentStep: 0,
    })
    expect(() => render(<SearchingVisualizer />)).not.toThrow()
  })

  it('handles step with no range property', () => {
    useStore.setState({
      steps: [{
        array: [10, 20, 30],
        current: 0,
        found: null,
        // range not provided — defaults to []
      }],
      currentStep: 0,
    })
    expect(() => render(<SearchingVisualizer />)).not.toThrow()
  })
})
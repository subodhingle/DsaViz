import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useStore from '../store/useStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Stub out all heavy visualizer components
vi.mock('../components/visualizers/SortingVisualizer', () => ({
  default: () => <div data-testid="sorting-visualizer" />,
}))
vi.mock('../components/visualizers/SearchingVisualizer', () => ({
  default: () => <div data-testid="searching-visualizer" />,
}))
vi.mock('../components/visualizers/GraphVisualizer', () => ({
  default: () => <div data-testid="graph-visualizer" />,
}))
vi.mock('../components/visualizers/TreeVisualizer', () => ({
  default: () => <div data-testid="tree-visualizer" />,
}))
vi.mock('../components/visualizers/CustomVisualizer', () => ({
  default: () => <div data-testid="custom-visualizer" />,
}))
vi.mock('../components/LogicPanel', () => ({
  default: () => <div data-testid="logic-panel" />,
}))
vi.mock('../components/AlgorithmBuilder', () => ({
  default: () => <div data-testid="algorithm-builder" />,
}))
vi.mock('../components/CustomStatePanel', () => ({
  default: () => <div data-testid="custom-state-panel" />,
}))

import VisualizerArea from '../components/VisualizerArea'

beforeEach(() => {
  useStore.setState({ category: 'sorting', view: 'visual' })
})

// ── VIS_MAP routing ───────────────────────────────────────────────────────────
describe('VIS_MAP category routing', () => {
  it('renders SortingVisualizer for sorting category', () => {
    useStore.setState({ category: 'sorting', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
  })

  it('renders SearchingVisualizer for searching category', () => {
    useStore.setState({ category: 'searching', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('searching-visualizer')).toBeInTheDocument()
  })

  it('renders GraphVisualizer for graph category', () => {
    useStore.setState({ category: 'graph', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('graph-visualizer')).toBeInTheDocument()
  })

  it('renders TreeVisualizer for tree category', () => {
    useStore.setState({ category: 'tree', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('tree-visualizer')).toBeInTheDocument()
  })

  it('falls back to SortingVisualizer for unknown category', () => {
    useStore.setState({ category: 'unknown-category', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
  })
})

// ── Removed categories not in VIS_MAP ────────────────────────────────────────
describe('removed categories (from PR diff)', () => {
  it('does not have ds in VIS_MAP — falls back to SortingVisualizer', () => {
    useStore.setState({ category: 'ds', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
  })

  it('does not have advanced-sorting in VIS_MAP — falls back to SortingVisualizer', () => {
    useStore.setState({ category: 'advanced-sorting', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
  })

  it('does not have techniques in VIS_MAP — falls back to SortingVisualizer', () => {
    useStore.setState({ category: 'techniques', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
  })
})

// ── View mode switching ───────────────────────────────────────────────────────
describe('view mode routing', () => {
  it('renders visualizer only in visual view', () => {
    useStore.setState({ category: 'sorting', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
    expect(screen.queryByTestId('logic-panel')).not.toBeInTheDocument()
  })

  it('renders logic panel only in logic view', () => {
    useStore.setState({ category: 'sorting', view: 'logic' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('logic-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('sorting-visualizer')).not.toBeInTheDocument()
  })

  it('renders both visualizer and logic panel in split view', () => {
    useStore.setState({ category: 'sorting', view: 'split' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('sorting-visualizer')).toBeInTheDocument()
    expect(screen.getByTestId('logic-panel')).toBeInTheDocument()
  })
})

// ── Custom category renders IDE layout ────────────────────────────────────────
describe('custom category', () => {
  it('renders CustomVisualizer for custom category', () => {
    useStore.setState({ category: 'custom', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('custom-visualizer')).toBeInTheDocument()
  })

  it('renders AlgorithmBuilder for custom category', () => {
    useStore.setState({ category: 'custom', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('algorithm-builder')).toBeInTheDocument()
  })

  it('renders CustomStatePanel for custom category', () => {
    useStore.setState({ category: 'custom', view: 'visual' })
    render(<VisualizerArea />)
    expect(screen.getByTestId('custom-state-panel')).toBeInTheDocument()
  })

  it('custom category ignores view setting (always shows IDE layout)', () => {
    useStore.setState({ category: 'custom', view: 'logic' })
    render(<VisualizerArea />)
    // Should still render custom layout regardless of view
    expect(screen.getByTestId('custom-visualizer')).toBeInTheDocument()
    expect(screen.getByTestId('algorithm-builder')).toBeInTheDocument()
  })
})
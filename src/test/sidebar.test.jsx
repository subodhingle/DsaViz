import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import useStore from '../store/useStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  BarChart2: () => <svg data-testid="icon-barchart" />,
  Search: () => <svg data-testid="icon-search" />,
  GitBranch: () => <svg data-testid="icon-git" />,
  Binary: () => <svg data-testid="icon-binary" />,
  Wand2: () => <svg data-testid="icon-wand" />,
}))

import Sidebar from '../components/Sidebar'

beforeEach(() => {
  useStore.setState({
    category: 'sorting',
    algorithm: 'bubble',
  })
})

// ── Category rendering ────────────────────────────────────────────────────────
describe('categories rendered', () => {
  it('renders Sorting category', () => {
    render(<Sidebar />)
    expect(screen.getByText('Sorting')).toBeInTheDocument()
  })

  it('renders Searching category', () => {
    render(<Sidebar />)
    expect(screen.getByText('Searching')).toBeInTheDocument()
  })

  it('renders Graph category', () => {
    render(<Sidebar />)
    expect(screen.getByText('Graph')).toBeInTheDocument()
  })

  it('renders Tree (BST) category', () => {
    render(<Sidebar />)
    expect(screen.getByText('Tree (BST)')).toBeInTheDocument()
  })

  it('renders Custom Builder category', () => {
    render(<Sidebar />)
    expect(screen.getByText('Custom Builder')).toBeInTheDocument()
  })
})

// ── Removed categories (from PR diff) ────────────────────────────────────────
describe('removed categories are absent', () => {
  it('does NOT render Adv. Sorting', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Adv. Sorting')).not.toBeInTheDocument()
  })

  it('does NOT render Data Structures', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument()
  })

  it('does NOT render Techniques', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Techniques')).not.toBeInTheDocument()
  })

  it('does NOT render Code Editor', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Code Editor')).not.toBeInTheDocument()
  })
})

// ── Active category expands sub-algos ─────────────────────────────────────────
describe('algorithm sub-list expansion', () => {
  it('shows sorting sub-algorithms when sorting is active', () => {
    useStore.setState({ category: 'sorting', algorithm: 'bubble' })
    render(<Sidebar />)
    expect(screen.getByText('Bubble Sort')).toBeInTheDocument()
    expect(screen.getByText('Merge Sort')).toBeInTheDocument()
    expect(screen.getByText('Quick Sort')).toBeInTheDocument()
    expect(screen.getByText('Heap Sort')).toBeInTheDocument()
  })

  it('shows searching sub-algorithms when searching is active', () => {
    useStore.setState({ category: 'searching', algorithm: 'linear' })
    render(<Sidebar />)
    expect(screen.getByText('Linear Search')).toBeInTheDocument()
    expect(screen.getByText('Binary Search')).toBeInTheDocument()
  })

  it('shows graph sub-algorithms when graph is active', () => {
    useStore.setState({ category: 'graph', algorithm: 'bfs' })
    render(<Sidebar />)
    expect(screen.getByText('BFS')).toBeInTheDocument()
    expect(screen.getByText('DFS')).toBeInTheDocument()
    expect(screen.getByText('Dijkstra')).toBeInTheDocument()
    expect(screen.getByText('A* Search')).toBeInTheDocument()
  })

  it('shows tree sub-algorithms when tree is active', () => {
    useStore.setState({ category: 'tree', algorithm: 'bst-insert' })
    render(<Sidebar />)
    expect(screen.getByText('Insert')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Inorder')).toBeInTheDocument()
    expect(screen.getByText('Preorder')).toBeInTheDocument()
    expect(screen.getByText('Postorder')).toBeInTheDocument()
  })

  it('does not show sub-algorithms for inactive category', () => {
    useStore.setState({ category: 'sorting', algorithm: 'bubble' })
    render(<Sidebar />)
    // Graph algos should not be visible
    expect(screen.queryByText('BFS')).not.toBeInTheDocument()
    expect(screen.queryByText('DFS')).not.toBeInTheDocument()
  })

  it('does not show sub-algos for custom (empty algos)', () => {
    useStore.setState({ category: 'custom', algorithm: '' })
    render(<Sidebar />)
    // Custom Builder has no sub-algos
    expect(screen.queryByText('Bubble Sort')).not.toBeInTheDocument()
  })
})

// ── Category click behavior ────────────────────────────────────────────────────
describe('category click interaction', () => {
  it('clicking Searching sets category to searching', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Searching'))
    expect(useStore.getState().category).toBe('searching')
  })

  it('clicking Searching sets algorithm to linear (first algo)', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Searching'))
    expect(useStore.getState().algorithm).toBe('linear')
  })

  it('clicking Graph sets algorithm to bfs (first algo)', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Graph'))
    expect(useStore.getState().algorithm).toBe('bfs')
  })

  it('clicking Tree sets algorithm to bst-insert (first algo)', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Tree (BST)'))
    expect(useStore.getState().algorithm).toBe('bst-insert')
  })

  it('clicking a sub-algorithm updates algorithm in store', () => {
    useStore.setState({ category: 'sorting', algorithm: 'bubble' })
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Merge Sort'))
    expect(useStore.getState().algorithm).toBe('merge')
  })

  it('clicking Heap Sort sets algorithm to heap', () => {
    useStore.setState({ category: 'sorting', algorithm: 'bubble' })
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Heap Sort'))
    expect(useStore.getState().algorithm).toBe('heap')
  })
})

// ── Section label ─────────────────────────────────────────────────────────────
describe('section label', () => {
  it('renders Algorithms section header', () => {
    render(<Sidebar />)
    expect(screen.getByText('Algorithms')).toBeInTheDocument()
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '../components/Sidebar'
import useStore from '../store/useStore'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Reset store before each test
beforeEach(() => {
  useStore.setState({
    category: 'sorting',
    algorithm: 'bubble',
  })
})

describe('Sidebar — category structure', () => {
  it('renders without crashing', () => {
    render(<Sidebar />)
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })

  it('shows the "Algorithms" section label', () => {
    render(<Sidebar />)
    expect(screen.getByText('Algorithms')).toBeInTheDocument()
  })

  it('renders all 5 categories', () => {
    render(<Sidebar />)
    expect(screen.getByText('Sorting')).toBeInTheDocument()
    expect(screen.getByText('Searching')).toBeInTheDocument()
    expect(screen.getByText('Graph')).toBeInTheDocument()
    expect(screen.getByText('Tree (BST)')).toBeInTheDocument()
    expect(screen.getByText('Custom Builder')).toBeInTheDocument()
  })

  it('does NOT render removed advanced categories', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Adv. Sorting')).toBeNull()
    expect(screen.queryByText('Data Structures')).toBeNull()
    expect(screen.queryByText('Techniques')).toBeNull()
    expect(screen.queryByText('Code Editor')).toBeNull()
  })

  it('does NOT render removed algorithms (counting sort, stack, etc.)', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Counting Sort')).toBeNull()
    expect(screen.queryByText('Stack')).toBeNull()
    expect(screen.queryByText('Queue')).toBeNull()
    expect(screen.queryByText('Sliding Window')).toBeNull()
    expect(screen.queryByText('0/1 Knapsack DP')).toBeNull()
  })
})

describe('Sidebar — category selection', () => {
  it('clicking a category calls setCategory with that id', () => {
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

  it('active category shows sub-algorithms for Sorting', () => {
    render(<Sidebar />)
    // Sorting is active by default, should show sub-algos
    expect(screen.getByText('Bubble Sort')).toBeInTheDocument()
    expect(screen.getByText('Merge Sort')).toBeInTheDocument()
    expect(screen.getByText('Quick Sort')).toBeInTheDocument()
    expect(screen.getByText('Heap Sort')).toBeInTheDocument()
  })

  it('clicking an algorithm button updates algorithm in store', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Merge Sort'))
    expect(useStore.getState().algorithm).toBe('merge')
  })

  it('Custom Builder has no sub-algorithms', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Custom Builder'))
    // No algo sub-items should be visible for custom
    expect(screen.queryByRole('button', { name: /^$/i })).toBeNull()
  })
})

describe('Sidebar — does not accept onSelect prop (simplified API)', () => {
  it('renders without onSelect prop without errors', () => {
    expect(() => render(<Sidebar />)).not.toThrow()
  })
})
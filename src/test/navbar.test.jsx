import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import useStore from '../store/useStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  LayoutTemplate: () => <svg data-testid="icon-layout" />,
  Columns2: () => <svg data-testid="icon-columns" />,
  Code2: () => <svg data-testid="icon-code" />,
  ArrowLeft: () => <svg data-testid="icon-arrowleft" />,
  Hexagon: () => <svg data-testid="icon-hexagon" />,
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
let mockPathname = '/'

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}))

import Navbar from '../components/Navbar'

beforeEach(() => {
  mockNavigate.mockReset()
  mockPathname = '/'
  useStore.setState({
    theme: 'neon',
    view: 'visual',
  })
})

// ── Brand logo ────────────────────────────────────────────────────────────────
describe('logo and branding', () => {
  it('renders DSA text', () => {
    render(<Navbar />)
    expect(screen.getByText('DSA')).toBeInTheDocument()
  })

  it('renders Viz text', () => {
    render(<Navbar />)
    expect(screen.getByText('Viz')).toBeInTheDocument()
  })

  it('clicking logo navigates to /', () => {
    render(<Navbar />)
    // The logo button contains both DSA and Viz spans
    const dsaText = screen.getByText('DSA')
    fireEvent.click(dsaText.closest('button'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})

// ── Landing page (not /app) ───────────────────────────────────────────────────
describe('on landing page (pathname /)', () => {
  beforeEach(() => {
    mockPathname = '/'
  })

  it('shows Launch App button', () => {
    render(<Navbar />)
    expect(screen.getByText('Launch App')).toBeInTheDocument()
  })

  it('does not show view toggle', () => {
    render(<Navbar />)
    expect(screen.queryByText('Visual')).not.toBeInTheDocument()
    expect(screen.queryByText('Split')).not.toBeInTheDocument()
    expect(screen.queryByText('Logic')).not.toBeInTheDocument()
  })

  it('does not show Home breadcrumb', () => {
    render(<Navbar />)
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('clicking Launch App navigates to /app', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByText('Launch App'))
    expect(mockNavigate).toHaveBeenCalledWith('/app')
  })
})

// ── App page (pathname /app) ──────────────────────────────────────────────────
describe('on app page (pathname /app)', () => {
  beforeEach(() => {
    mockPathname = '/app'
  })

  it('shows view toggle with Visual', () => {
    render(<Navbar />)
    expect(screen.getByText('Visual')).toBeInTheDocument()
  })

  it('shows view toggle with Split', () => {
    render(<Navbar />)
    expect(screen.getByText('Split')).toBeInTheDocument()
  })

  it('shows view toggle with Logic', () => {
    render(<Navbar />)
    expect(screen.getByText('Logic')).toBeInTheDocument()
  })

  it('does not show Launch App button', () => {
    render(<Navbar />)
    expect(screen.queryByText('Launch App')).not.toBeInTheDocument()
  })

  it('shows Home breadcrumb', () => {
    render(<Navbar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('clicking Visual sets view to visual', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByText('Visual'))
    expect(useStore.getState().view).toBe('visual')
  })

  it('clicking Split sets view to split', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByText('Split'))
    expect(useStore.getState().view).toBe('split')
  })

  it('clicking Logic sets view to logic', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByText('Logic'))
    expect(useStore.getState().view).toBe('logic')
  })
})

// ── Theme selector ────────────────────────────────────────────────────────────
describe('theme selector', () => {
  it('renders Theme label', () => {
    render(<Navbar />)
    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('renders all 3 theme buttons', () => {
    render(<Navbar />)
    const themeButtons = screen.getAllByTitle(/Default|Violet|Terminal/)
    expect(themeButtons).toHaveLength(3)
  })

  it('clicking Default theme sets theme to neon', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTitle('Default'))
    expect(useStore.getState().theme).toBe('neon')
  })

  it('clicking Violet theme sets theme to glass', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTitle('Violet'))
    expect(useStore.getState().theme).toBe('glass')
  })

  it('clicking Terminal theme sets theme to military', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByTitle('Terminal'))
    expect(useStore.getState().theme).toBe('military')
  })
})

// ── No hamburger/sidebar props ────────────────────────────────────────────────
describe('removed props (onMenuClick, sidebarOpen)', () => {
  it('does not render a hamburger menu button', () => {
    mockPathname = '/app'
    render(<Navbar />)
    // No aria-label "Toggle sidebar"
    expect(screen.queryByLabelText('Toggle sidebar')).not.toBeInTheDocument()
  })

  it('renders without requiring any props', () => {
    // Navbar() takes no props — should render without error
    expect(() => render(<Navbar />)).not.toThrow()
  })
})
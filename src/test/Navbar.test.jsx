import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import useStore from '../store/useStore'

vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<Navbar />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  useStore.setState({ theme: 'neon', view: 'visual' })
})

describe('Navbar — logo', () => {
  it('renders DSAViz brand name', () => {
    renderNavbar('/')
    expect(screen.getByText(/DSA/)).toBeInTheDocument()
  })

  it('renders the logo button', () => {
    renderNavbar('/')
    // logo is a button containing "DSA" and "Viz" text
    const logo = screen.getAllByRole('button').find(btn => btn.textContent.includes('DSA'))
    expect(logo).toBeDefined()
  })
})

describe('Navbar — on landing page (/)', () => {
  it('shows "Launch App" button instead of view toggle', () => {
    renderNavbar('/')
    expect(screen.getByText('Launch App')).toBeInTheDocument()
  })

  it('does NOT show view toggle buttons on landing page', () => {
    renderNavbar('/')
    expect(screen.queryByText('Visual')).toBeNull()
    expect(screen.queryByText('Split')).toBeNull()
    expect(screen.queryByText('Logic')).toBeNull()
  })

  it('does NOT show "← Home" link on landing page', () => {
    renderNavbar('/')
    expect(screen.queryByText(/Home/)).toBeNull()
  })
})

describe('Navbar — on app page (/app)', () => {
  it('shows view toggle buttons', () => {
    renderNavbar('/app')
    expect(screen.getByText('Visual')).toBeInTheDocument()
    expect(screen.getByText('Split')).toBeInTheDocument()
    expect(screen.getByText('Logic')).toBeInTheDocument()
  })

  it('shows "← Home" link when on app route', () => {
    renderNavbar('/app')
    expect(screen.getByText(/Home/)).toBeInTheDocument()
  })

  it('does NOT show "Launch App" button on app page', () => {
    renderNavbar('/app')
    expect(screen.queryByText('Launch App')).toBeNull()
  })

  it('does NOT have a hamburger/menu button (mobile menu removed)', () => {
    renderNavbar('/app')
    // Should not have a button with aria-label "Toggle sidebar"
    expect(screen.queryByLabelText('Toggle sidebar')).toBeNull()
  })
})

describe('Navbar — theme selector', () => {
  it('shows "Theme" label', () => {
    renderNavbar('/')
    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('renders 3 theme buttons', () => {
    renderNavbar('/')
    // Theme buttons have title attributes: Default, Violet, Terminal
    expect(screen.getByTitle('Default')).toBeInTheDocument()
    expect(screen.getByTitle('Violet')).toBeInTheDocument()
    expect(screen.getByTitle('Terminal')).toBeInTheDocument()
  })

  it('clicking a theme dot updates the store theme', () => {
    renderNavbar('/')
    fireEvent.click(screen.getByTitle('Violet'))
    expect(useStore.getState().theme).toBe('glass')
  })

  it('clicking Terminal theme sets military theme', () => {
    renderNavbar('/')
    fireEvent.click(screen.getByTitle('Terminal'))
    expect(useStore.getState().theme).toBe('military')
  })

  it('clicking Default theme sets neon theme', () => {
    useStore.setState({ theme: 'glass' })
    renderNavbar('/')
    fireEvent.click(screen.getByTitle('Default'))
    expect(useStore.getState().theme).toBe('neon')
  })
})

describe('Navbar — view toggle interaction (on /app)', () => {
  it('clicking Split sets view to split in store', () => {
    renderNavbar('/app')
    fireEvent.click(screen.getByText('Split'))
    expect(useStore.getState().view).toBe('split')
  })

  it('clicking Logic sets view to logic in store', () => {
    renderNavbar('/app')
    fireEvent.click(screen.getByText('Logic'))
    expect(useStore.getState().view).toBe('logic')
  })

  it('clicking Visual sets view to visual in store', () => {
    useStore.setState({ view: 'logic' })
    renderNavbar('/app')
    fireEvent.click(screen.getByText('Visual'))
    expect(useStore.getState().view).toBe('visual')
  })
})

describe('Navbar — no mobile menu props', () => {
  it('Navbar component accepts no props (onMenuClick and sidebarOpen removed)', () => {
    // Should render without error when given no props
    expect(() => renderNavbar('/app')).not.toThrow()
  })
})
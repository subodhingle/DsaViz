import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import useStore from '../store/useStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, ...props }) => <div style={style} {...props}>{children}</div>,
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Play: () => <svg data-testid="icon-play" />,
  Pause: () => <svg data-testid="icon-pause" />,
  SkipBack: () => <svg data-testid="icon-skipback" />,
  SkipForward: () => <svg data-testid="icon-skipforward" />,
  RefreshCw: () => <svg data-testid="icon-refresh" />,
  Shuffle: () => <svg data-testid="icon-shuffle" />,
  ChevronsLeft: () => <svg data-testid="icon-reset" />,
}))

import Controls from '../components/Controls'

const mockGenerate = vi.fn()
const mockRun = vi.fn()

beforeEach(() => {
  mockGenerate.mockReset()
  mockRun.mockReset()
  useStore.setState({
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 500,
  })
})

// ── Rendering ─────────────────────────────────────────────────────────────────
describe('Controls renders', () => {
  it('renders New Data button', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('New Data')).toBeInTheDocument()
  })

  it('renders Run button', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('Run')).toBeInTheDocument()
  })

  it('renders Speed label', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('Speed')).toBeInTheDocument()
  })

  it('renders Reset button', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Reset')).toBeInTheDocument()
  })

  it('renders Previous step button', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Previous step')).toBeInTheDocument()
  })

  it('renders Next step button', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Next step')).toBeInTheDocument()
  })
})

// ── Button callbacks ──────────────────────────────────────────────────────────
describe('button callbacks', () => {
  it('clicking New Data calls onGenerate', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    fireEvent.click(screen.getByText('New Data'))
    expect(mockGenerate).toHaveBeenCalledTimes(1)
  })

  it('clicking Run calls onRun', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    fireEvent.click(screen.getByText('Run'))
    expect(mockRun).toHaveBeenCalledTimes(1)
  })
})

// ── Step counter display ──────────────────────────────────────────────────────
describe('step counter display', () => {
  it('shows 001 / 001 when no steps', () => {
    useStore.setState({ steps: [], currentStep: 0 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('001 / 001')).toBeInTheDocument()
  })

  it('shows step counter with padding', () => {
    useStore.setState({ steps: new Array(10).fill({}), currentStep: 0 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('001 / 010')).toBeInTheDocument()
  })

  it('shows correct current step', () => {
    useStore.setState({ steps: new Array(5).fill({}), currentStep: 3 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('004 / 005')).toBeInTheDocument()
  })
})

// ── Speed display ─────────────────────────────────────────────────────────────
describe('speed display label', () => {
  it('shows 2× when speed < 200', () => {
    useStore.setState({ speed: 100 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('2×')).toBeInTheDocument()
  })

  it('shows 1× when speed between 200 and 599', () => {
    useStore.setState({ speed: 400 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('1×')).toBeInTheDocument()
  })

  it('shows ½× when speed >= 600', () => {
    useStore.setState({ speed: 700 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('½×')).toBeInTheDocument()
  })

  it('shows 2× at boundary speed 100', () => {
    useStore.setState({ speed: 100 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('2×')).toBeInTheDocument()
  })

  it('shows 1× at boundary speed 500', () => {
    useStore.setState({ speed: 500 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('1×')).toBeInTheDocument()
  })

  it('shows ½× at boundary speed 600', () => {
    useStore.setState({ speed: 600 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByText('½×')).toBeInTheDocument()
  })
})

// ── Play/Pause button ─────────────────────────────────────────────────────────
describe('play/pause button', () => {
  it('is disabled when no steps', () => {
    useStore.setState({ steps: [], isPlaying: false })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    const playBtn = screen.getByTestId('icon-play').closest('button')
    expect(playBtn).toBeDisabled()
  })

  it('is enabled when steps exist', () => {
    useStore.setState({ steps: [{}, {}], isPlaying: false })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    const playBtn = screen.getByTestId('icon-play').closest('button')
    expect(playBtn).not.toBeDisabled()
  })

  it('shows pause icon when playing', () => {
    useStore.setState({ steps: [{}, {}], isPlaying: true })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTestId('icon-pause')).toBeInTheDocument()
  })

  it('shows play icon when not playing', () => {
    useStore.setState({ steps: [{}, {}], isPlaying: false })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTestId('icon-play')).toBeInTheDocument()
  })

  it('clicking play toggles isPlaying to true', () => {
    useStore.setState({ steps: [{}, {}], isPlaying: false })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    fireEvent.click(screen.getByTestId('icon-play').closest('button'))
    expect(useStore.getState().isPlaying).toBe(true)
  })
})

// ── Prev/Next step buttons ────────────────────────────────────────────────────
describe('prev/next step buttons', () => {
  it('Previous step button is disabled at step 0', () => {
    useStore.setState({ steps: [{}, {}], currentStep: 0 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Previous step')).toBeDisabled()
  })

  it('Previous step button enabled when not at step 0', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 1 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Previous step')).not.toBeDisabled()
  })

  it('Next step button is disabled at last step', () => {
    useStore.setState({ steps: [{}, {}], currentStep: 1 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Next step')).toBeDisabled()
  })

  it('Next step button enabled when not at last step', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    expect(screen.getByTitle('Next step')).not.toBeDisabled()
  })

  it('clicking Next step advances currentStep', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    fireEvent.click(screen.getByTitle('Next step'))
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('clicking Previous step decrements currentStep', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    fireEvent.click(screen.getByTitle('Previous step'))
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('clicking Reset goes to step 0', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2, isPlaying: true })
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    fireEvent.click(screen.getByTitle('Reset'))
    expect(useStore.getState().currentStep).toBe(0)
    expect(useStore.getState().isPlaying).toBe(false)
  })
})

// ── Speed range input ─────────────────────────────────────────────────────────
describe('speed range input', () => {
  it('renders speed range input', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    const slider = document.querySelector('input[type="range"]')
    expect(slider).toBeInTheDocument()
  })

  it('speed range has min 50 and max 1500', () => {
    render(<Controls onGenerate={mockGenerate} onRun={mockRun} />)
    const slider = document.querySelector('input[type="range"]')
    expect(slider.min).toBe('50')
    expect(slider.max).toBe('1500')
  })
})
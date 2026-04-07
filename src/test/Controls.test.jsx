import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Controls from '../components/Controls'
import useStore from '../store/useStore'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

beforeEach(() => {
  useStore.setState({
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 500,
  })
  vi.clearAllTimers()
})

describe('Controls — rendering', () => {
  it('renders without crashing', () => {
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('New Data')).toBeInTheDocument()
    expect(screen.getByText('Run')).toBeInTheDocument()
  })

  it('renders the speed label', () => {
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('Speed')).toBeInTheDocument()
  })

  it('renders step counter formatted as 001 / 001 with no steps', () => {
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('001 / 001')).toBeInTheDocument()
  })
})

describe('Controls — Generate and Run buttons', () => {
  it('clicking New Data calls onGenerate', () => {
    const onGenerate = vi.fn()
    render(<Controls onGenerate={onGenerate} onRun={vi.fn()} />)
    fireEvent.click(screen.getByText('New Data'))
    expect(onGenerate).toHaveBeenCalledTimes(1)
  })

  it('clicking Run calls onRun', () => {
    const onRun = vi.fn()
    render(<Controls onGenerate={vi.fn()} onRun={onRun} />)
    fireEvent.click(screen.getByText('Run'))
    expect(onRun).toHaveBeenCalledTimes(1)
  })
})

describe('Controls — play/pause button', () => {
  it('play button is disabled when steps is empty', () => {
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    // Find the play/pause button by its disabled state
    const buttons = screen.getAllByRole('button')
    const playBtn = buttons.find(btn => btn.disabled && !btn.title)
    expect(playBtn).toBeDefined()
  })

  it('play button toggles isPlaying in store', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0, isPlaying: false })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    // The play/pause button is between the Previous and Next step titled buttons
    const prevBtn = screen.getByTitle('Previous step')
    const nextBtn = screen.getByTitle('Next step')
    // play button is sibling between them — find button with no title between these
    const allButtons = screen.getAllByRole('button')
    const prevIdx = allButtons.indexOf(prevBtn)
    const nextIdx = allButtons.indexOf(nextBtn)
    const playBtn = allButtons[prevIdx + 1]
    expect(playBtn).not.toBe(nextBtn)
    expect(useStore.getState().isPlaying).toBe(false)
    fireEvent.click(playBtn)
    expect(useStore.getState().isPlaying).toBe(true)
  })
})

describe('Controls — step navigation buttons', () => {
  it('Previous step button is disabled at step 0', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    const prevBtn = screen.getByTitle('Previous step')
    expect(prevBtn).toBeDisabled()
  })

  it('Next step button is disabled at last step', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    const nextBtn = screen.getByTitle('Next step')
    expect(nextBtn).toBeDisabled()
  })

  it('Next step button is enabled when not at last step', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    const nextBtn = screen.getByTitle('Next step')
    expect(nextBtn).not.toBeDisabled()
  })

  it('clicking Next step calls nextStep in store', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Next step'))
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('clicking Previous step calls prevStep in store', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Previous step'))
    expect(useStore.getState().currentStep).toBe(1)
  })

  it('clicking Reset sets currentStep to 0', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Reset'))
    expect(useStore.getState().currentStep).toBe(0)
  })
})

describe('Controls — step counter display', () => {
  it('shows 001 / 001 when no steps', () => {
    useStore.setState({ steps: [], currentStep: 0 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('001 / 001')).toBeInTheDocument()
  })

  it('shows 001 / 003 at first step with 3 steps', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 0 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('001 / 003')).toBeInTheDocument()
  })

  it('shows 003 / 003 at last step with 3 steps', () => {
    useStore.setState({ steps: [{}, {}, {}], currentStep: 2 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('003 / 003')).toBeInTheDocument()
  })
})

describe('Controls — speed display label', () => {
  it('shows 2× label when speed < 200', () => {
    useStore.setState({ speed: 100 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('2×')).toBeInTheDocument()
  })

  it('shows 1× label when speed is between 200 and 600', () => {
    useStore.setState({ speed: 400 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('1×')).toBeInTheDocument()
  })

  it('shows ½× label when speed >= 600', () => {
    useStore.setState({ speed: 800 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    expect(screen.getByText('½×')).toBeInTheDocument()
  })

  it('speed slider value is inverted: value = 1550 - speed', () => {
    useStore.setState({ speed: 500 })
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    const slider = screen.getByRole('slider')
    expect(Number(slider.value)).toBe(1550 - 500) // 1050
  })

  it('changing speed slider updates store speed (inverted)', () => {
    render(<Controls onGenerate={vi.fn()} onRun={vi.fn()} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '1050' } })
    expect(useStore.getState().speed).toBe(1550 - 1050) // 500
  })
})
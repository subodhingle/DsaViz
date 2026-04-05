import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BarChart2, GitBranch, Binary, Search,
  Play, ChevronRight, Zap, Code2, Layers,
  ArrowRight, Hexagon, Wand2, Eye, LayoutTemplate
} from 'lucide-react'
import Navbar from '../components/Navbar'
import LiveSortingDemo from '../components/landing/LiveSortingDemo'
import LiveGraphDemo from '../components/landing/LiveGraphDemo'
import LiveTreeDemo from '../components/landing/LiveTreeDemo'
import WorkflowSection from '../components/landing/WorkflowSection'
import FeatureCard from '../components/landing/FeatureCard'

// ── Data ──────────────────────────────────────────────────────────────────────
const ALGO_TICKER = [
  { label: 'Bubble Sort',   category: 'Sorting',   color: '#4F8CFF', icon: BarChart2 },
  { label: 'Merge Sort',    category: 'Sorting',   color: '#4F8CFF', icon: BarChart2 },
  { label: 'Quick Sort',    category: 'Sorting',   color: '#4F8CFF', icon: BarChart2 },
  { label: 'Heap Sort',     category: 'Sorting',   color: '#4F8CFF', icon: BarChart2 },
  { label: 'BFS',           category: 'Graph',     color: '#7C6FE8', icon: GitBranch },
  { label: 'DFS',           category: 'Graph',     color: '#7C6FE8', icon: GitBranch },
  { label: 'Dijkstra',      category: 'Graph',     color: '#7C6FE8', icon: GitBranch },
  { label: 'A* Search',     category: 'Graph',     color: '#7C6FE8', icon: GitBranch },
  { label: 'BST Insert',    category: 'Tree',      color: '#C8873A', icon: Binary },
  { label: 'BST Delete',    category: 'Tree',      color: '#C8873A', icon: Binary },
  { label: 'Inorder',       category: 'Tree',      color: '#C8873A', icon: Binary },
  { label: 'Linear Search', category: 'Searching', color: '#4BAF78', icon: Search },
  { label: 'Binary Search', category: 'Searching', color: '#4BAF78', icon: Search },
]

const FEATURES = [
  { icon: Eye,            title: 'Step-by-Step Visualization', color: '#4F8CFF', desc: 'Watch every comparison, swap, and node visit animate in real time. Pause, rewind, or scrub through any step.' },
  { icon: Code2,          title: 'Live Pseudocode Tracing',    color: '#7C6FE8', desc: 'Pseudocode highlights line-by-line in sync with the animation. Variables update live so you see exactly what the algorithm is thinking.' },
  { icon: Wand2,          title: 'Custom Algorithm Builder',   color: '#C8873A', desc: 'Write your own sorting logic using compare(), swap(), mark(). The interpreter parses it and animates it instantly.' },
  { icon: LayoutTemplate, title: 'Split-Screen Mode',          color: '#4BAF78', desc: 'Run visualization and pseudocode side-by-side. Perfect for deep learning sessions and interview prep.' },
  { icon: Layers,         title: 'Multiple Themes',            color: '#9B6FD4', desc: 'Switch between Default, Violet, and Terminal themes to match your environment and preference.' },
  { icon: Zap,            title: 'Complexity Insights',        color: '#C8873A', desc: 'Live stats panel shows comparisons, swaps, and time/space complexity for every algorithm as it runs.' },
]

const THEMES = [
  { id: 'neon',     label: 'Default',  bg: 'linear-gradient(160deg,#0B0F14,#0F141A)', accent: '#4F8CFF', border: 'rgba(79,140,255,0.2)' },
  { id: 'glass',    label: 'Violet',   bg: 'linear-gradient(160deg,#0D0B1A,#12102A)', accent: '#7C6FE8', border: 'rgba(124,111,232,0.2)' },
  { id: 'military', label: 'Terminal', bg: 'linear-gradient(160deg,#0A0D0A,#0D1210)', accent: '#3D9E5C', border: 'rgba(61,158,92,0.2)' },
]

const PREVIEW_BARS = [38, 72, 28, 95, 52, 33, 78, 61, 44, 70, 29, 58]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [activeTheme, setActiveTheme] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveTheme(p => (p + 1) % THEMES.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--canvas)' }}>
      <Navbar />
      <HeroSection navigate={navigate} />
      <AlgoTicker items={ALGO_TICKER} />
      <LiveDemoSection />
      <WorkflowSection />
      <FeaturesSection features={FEATURES} />
      <ThemesSection themes={THEMES} activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      <CTASection navigate={navigate} />
      <footer
        className="py-10 text-center"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Hexagon size={11} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>DSAViz</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>
          Built for learners, by learners. Master DSA visually.
        </p>
      </footer>
    </div>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function HeroSection({ navigate }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
      {/* Subtle radial gradients — low opacity, professional */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(79,140,255,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 100% 100%, rgba(120,80,200,0.05) 0%, transparent 70%)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16,1,0.3,1] }}
        className="flex items-center gap-2 px-3 py-1 rounded-full mb-8 text-xs"
        style={{
          background: 'var(--elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: 'var(--accent)' }} />
        Interactive DSA Learning Platform
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.55, ease: [0.16,1,0.3,1] }}
        className="text-5xl sm:text-6xl lg:text-7xl font-black text-center leading-[1.08] tracking-tight mb-5 max-w-4xl"
      >
        <span style={{ color: 'var(--text-primary)' }}>Understand </span>
        <span style={{
          background: 'linear-gradient(135deg, #6EA8FF 0%, #4F8CFF 50%, #7C6FE8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Algorithms</span>
        <br />
        <span style={{ color: 'var(--text-secondary)' }}>Through Visualization</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5, ease: [0.16,1,0.3,1] }}
        className="text-base sm:text-lg text-center max-w-xl mb-10 leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        Step through sorting, searching, graphs, and trees with real-time animation,
        live pseudocode tracing, and a custom algorithm builder.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.45, ease: [0.16,1,0.3,1] }}
        className="flex flex-wrap gap-3 justify-center mb-16"
      >
        <button
          onClick={() => navigate('/app')}
          className="btn-accent flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Play size={14} fill="white" /> Launch Visualizer
        </button>
        <a
          href="#workflow"
          className="btn-ghost flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
        >
          See How It Works <ChevronRight size={14} />
        </a>
      </motion.div>

      {/* App preview window */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.6, ease: [0.16,1,0.3,1] }}
        className="w-full max-w-3xl"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--border-subtle)',
          }}
        >
          {/* Chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--elevated)' }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C95555' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C8873A' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4BAF78' }} />
            <span className="ml-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>DSAViz — Bubble Sort</span>
            <div className="ml-auto flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md"
              style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: 'var(--accent)' }} />
              Live
            </div>
          </div>
          {/* Live demo */}
          <div style={{ height: 200, position: 'relative', padding: '12px 16px 8px' }}>
            <LiveSortingDemo />
          </div>
          {/* Fake controls */}
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--elevated)' }}
          >
            <div className="flex gap-1.5">
              {['⏮','⏪','▶','⏩'].map(s => (
                <span key={s} className="w-6 h-6 rounded flex items-center justify-center text-xs"
                  style={{ background: 'var(--canvas)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                  {s}
                </span>
              ))}
            </div>
            <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
              <motion.div
                animate={{ width: ['0%', '65%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="h-full rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Bubble Sort</span>
          </div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 flex flex-col items-center gap-1"
        style={{ color: 'var(--text-disabled)' }}
      >
        <span className="text-[11px]">Scroll to explore</span>
        <ChevronRight size={13} className="rotate-90" />
      </motion.div>
    </section>
  )
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function AlgoTicker({ items }) {
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div
      className="overflow-hidden py-2.5"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--elevated)' }}
    >
      <motion.div
        className="flex shrink-0"
        animate={{ x: ['0px', `-${items.length * 152}px`] }}
        transition={{ duration: items.length * 1.5, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      >
        {doubled.map((a, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0 px-4" style={{ width: 152 }}>
            <a.icon size={12} style={{ color: a.color, opacity: 0.8 }} />
            <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{a.label}</span>
            <span className="ml-auto" style={{ color: 'var(--border-default)' }}>·</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── LIVE DEMOS ────────────────────────────────────────────────────────────────
function LiveDemoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const demos = [
    { title: 'Sorting',       subtitle: 'Bars animate to sorted positions',  color: '#4F8CFF', icon: BarChart2, component: <LiveSortingDemo />, tags: ['Bubble','Merge','Quick','Heap'] },
    { title: 'Graph',         subtitle: 'BFS spreading through nodes live',  color: '#7C6FE8', icon: GitBranch, component: <LiveGraphDemo />,   tags: ['BFS','DFS','Dijkstra','A*'] },
    { title: 'Binary Tree',   subtitle: 'Inorder traversal with live path',  color: '#C8873A', icon: Binary,    component: <LiveTreeDemo />,    tags: ['Insert','Delete','Inorder','Preorder'] },
  ]

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge="Live Demos" title="See It In Action"
          sub="Every algorithm runs live — no screenshots, no GIFs. Real animations, real data."
          inView={inView} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12">
          {demos.map((demo, i) => (
            <motion.div key={demo.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.45, ease: [0.16,1,0.3,1] }}
              className="rounded-xl overflow-hidden flex flex-col"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 shrink-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${demo.color}15`, border: `1px solid ${demo.color}25` }}>
                  <demo.icon size={13} style={{ color: demo.color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{demo.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{demo.subtitle}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: `${demo.color}12`, color: demo.color, border: `1px solid ${demo.color}20` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: demo.color }} />
                  Live
                </div>
              </div>
              {/* Animation */}
              <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                {demo.component}
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 px-4 py-3 shrink-0"
                style={{ borderTop: '1px solid var(--border-subtle)' }}>
                {demo.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono"
                    style={{ background: 'var(--canvas)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
function FeaturesSection({ features }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} className="py-24 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge="Features" title="Everything You Need to Master DSA"
          sub="Built for students, interview preppers, and curious minds who learn by doing."
          inView={inView} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} inView={inView} />)}
        </div>
      </div>
    </section>
  )
}

// ── THEMES ────────────────────────────────────────────────────────────────────
function ThemesSection({ themes, activeTheme, setActiveTheme }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const t = themes[activeTheme]

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader badge="Themes" title="Your Environment, Your Way"
          sub="Three carefully crafted themes — each with its own character and purpose."
          inView={inView} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-6">

          {/* Selector */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--elevated)', border: '1px solid var(--border-subtle)' }}>
            {themes.map((theme, i) => (
              <button key={theme.id} onClick={() => setActiveTheme(i)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={
                  activeTheme === i
                    ? { background: theme.accent, color: '#fff', boxShadow: `0 0 0 1px ${theme.accent}40` }
                    : { color: 'var(--text-muted)' }
                }
                onMouseEnter={e => { if (activeTheme !== i) e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { if (activeTheme !== i) e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                {theme.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTheme}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
              className="w-full rounded-2xl overflow-hidden"
              style={{ background: t.bg, border: `1px solid ${t.border}`, boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${t.border}` }}
            >
              {/* Chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${t.border}`, background: 'rgba(0,0,0,0.25)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C95555' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C8873A' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4BAF78' }} />
                <span className="ml-3 text-xs font-mono" style={{ color: t.accent }}>DSAViz — {t.label}</span>
                <div className="ml-auto text-[10px] px-2 py-0.5 rounded"
                  style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}25` }}>
                  Running
                </div>
              </div>
              {/* Fake app */}
              <div className="flex" style={{ height: 200 }}>
                {/* Sidebar */}
                <div className="w-32 shrink-0 p-3 space-y-1.5" style={{ borderRight: `1px solid ${t.border}` }}>
                  {['Sorting','Searching','Graph','Tree','Custom'].map((item, i) => (
                    <div key={item} className="px-2.5 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        background: i === 0 ? t.accent : `${t.accent}10`,
                        color: i === 0 ? '#fff' : t.accent,
                      }}>
                      {item}
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div className="flex-1 p-4 flex flex-col gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 flex items-end gap-1 pb-1">
                      {PREVIEW_BARS.map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 3
                              ? `linear-gradient(to bottom, ${t.accent}, ${t.accent}99)`
                              : i === 7
                              ? 'linear-gradient(to bottom, #C95555, #A83A3A)'
                              : `linear-gradient(to bottom, ${t.accent}55, ${t.accent}30)`,
                            boxShadow: i === 3 ? `0 0 8px ${t.accent}50` : 'none',
                          }} />
                      ))}
                    </div>
                    <div className="absolute bottom-1 inset-x-0 h-px" style={{ background: `${t.accent}20` }} />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {['Comparisons: 24', 'Swaps: 11', 'O(n²)'].map(s => (
                      <span key={s} className="text-[10px] px-2 py-1 rounded font-mono"
                        style={{ background: `${t.accent}12`, color: t.accent, border: `1px solid ${t.accent}20` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection({ navigate }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} className="py-24 px-6" style={{ background: 'var(--surface)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <div
          className="rounded-2xl p-12 relative overflow-hidden"
          style={{
            background: 'var(--elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,140,255,0.12) 0%, transparent 70%)' }} />

          <div
            className="w-12 h-12 rounded-xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent-border), 0 8px 24px rgba(79,140,255,0.25)' }}
          >
            <Hexagon size={22} className="text-white" strokeWidth={2} />
          </div>

          <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Ready to Level Up?
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Stop memorizing. Start understanding. Visualize every algorithm,
            trace every step, build your own logic.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="btn-accent inline-flex items-center gap-2.5 px-8 py-3 rounded-xl font-semibold text-sm"
          >
            Start Visualizing <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </section>
  )
}

// ── SHARED ────────────────────────────────────────────────────────────────────
function SectionHeader({ badge, title, sub, inView }) {
  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
        style={{ background: 'var(--elevated)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        {badge}
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08 }}
        className="text-3xl sm:text-4xl font-black mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {title}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.14 }}
        className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {sub}
      </motion.p>
    </div>
  )
}

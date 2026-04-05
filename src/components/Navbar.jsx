import { motion } from 'framer-motion'
import { LayoutTemplate, Columns2, Code2, ArrowLeft, Hexagon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../store/useStore'

const THEMES = [
  { id: 'neon',     label: 'Default',  dot: '#4F8CFF' },
  { id: 'glass',    label: 'Violet',   dot: '#7C6FE8' },
  { id: 'military', label: 'Terminal', dot: '#3D9E5C' },
]

const VIEWS = [
  { id: 'visual', label: 'Visual', icon: LayoutTemplate },
  { id: 'split',  label: 'Split',  icon: Columns2 },
  { id: 'logic',  label: 'Logic',  icon: Code2 },
]

export default function Navbar() {
  const { theme, setTheme, view, setView } = useStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const isApp     = location.pathname === '/app'

  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 h-12"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 var(--border-subtle)',
      }}
    >
      {/* ── Logo ── */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 group"
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent-border)' }}
        >
          <Hexagon size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          DSA<span style={{ color: 'var(--accent)' }}>Viz</span>
        </span>
        {isApp && (
          <span
            className="flex items-center gap-1 text-xs ml-1 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={10} /> Home
          </span>
        )}
      </button>

      {/* ── View toggle (app only) ── */}
      {isApp ? (
        <div
          className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: 'var(--canvas)', border: '1px solid var(--border-subtle)' }}
        >
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150"
              style={
                view === id
                  ? { background: 'var(--elevated)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => navigate('/app')}
          className="btn-accent text-xs px-4 py-1.5 rounded-lg"
        >
          Launch App
        </button>
      )}

      {/* ── Theme dots ── */}
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>Theme</span>
        <div className="flex gap-1.5">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              className="w-4 h-4 rounded-full transition-all duration-200"
              style={{
                background: t.dot,
                outline: theme === t.id ? `2px solid ${t.dot}` : '2px solid transparent',
                outlineOffset: '2px',
                opacity: theme === t.id ? 1 : 0.45,
              }}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

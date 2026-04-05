import { motion } from 'framer-motion'

export default function FeatureCard({ feature, index, inView }) {
  const { icon: Icon, title, desc, color } = feature

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-xl p-5 cursor-default"
      style={{
        background: 'var(--elevated)',
        border: '1px solid var(--border-subtle)',
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.22s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.borderColor = 'var(--border-default)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }}
      />

      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3.5"
        style={{
          background: `${color}12`,
          border: `1px solid ${color}25`,
        }}
      >
        <Icon size={16} style={{ color }} strokeWidth={1.75} />
      </div>

      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {desc}
      </p>
    </motion.div>
  )
}

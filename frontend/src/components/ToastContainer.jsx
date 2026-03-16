export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null

  const icons = { success: '✓', error: '✕', info: '→' }
  const colors = {
    success: { bg: '#f0faf5', border: 'rgba(74,112,96,0.3)', icon: 'var(--sage)' },
    error:   { bg: '#fdf3f0', border: 'rgba(184,92,56,0.3)', icon: 'var(--rust)' },
    info:    { bg: 'var(--cream)', border: 'var(--border-strong)', icon: 'var(--gold)' },
  }

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      {toasts.map(({ id, msg, type }) => {
        const c = colors[type] || colors.info
        return (
          <div key={id} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '0.85rem',
            color: 'var(--ink)',
            animation: 'toastIn 0.3s ease both',
            minWidth: 260, maxWidth: 380,
          }}>
            <span style={{ color: c.icon, fontWeight: 600, flexShrink: 0 }}>{icons[type] || '→'}</span>
            <span>{msg}</span>
          </div>
        )
      })}
    </div>
  )
}

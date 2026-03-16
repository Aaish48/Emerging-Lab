export default function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(245, 242, 235, 0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      animation: 'slideDown 0.5s ease both',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'baseline', gap: 6, textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.5rem',
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
        }}>DocMind</span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.6rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          background: 'var(--gold-dim)',
          border: '1px solid rgba(201,168,76,0.3)',
          padding: '2px 6px',
          borderRadius: 2,
        }}>AI</span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.7rem',
          color: 'var(--muted)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--sage)',
            boxShadow: '0 0 0 2px rgba(74,112,96,0.2)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Backend Connected
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.65rem',
          color: 'var(--muted)',
          border: '1px solid var(--border-strong)',
          padding: '3px 8px',
          borderRadius: 2,
          letterSpacing: '0.08em',
        }}>LLM-RAG</span>
      </div>
    </header>
  )
}

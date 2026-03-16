import { useRef, useState } from 'react'

export default function Sidebar({ uploadedFile, isUploading, isReady, onFileUpload, onRemoveFile, messageCount }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileUpload(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onFileUpload(file)
    e.target.value = ''
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <aside style={{
      background: 'var(--cream)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      gap: '2rem',
      animation: 'fadeInLeft 0.6s 0.1s ease both',
      overflowY: 'auto',
    }}>

      {/* Upload Section */}
      <div>
        <p style={labelStyle}>Document</p>

        {!uploadedFile ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `1.5px dashed ${dragOver ? 'var(--gold)' : 'var(--border-strong)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--gold-dim)' : 'transparent',
              transition: 'all 0.25s ease',
              position: 'relative',
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} style={{ display: 'none' }} />

            {/* PDF Icon */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ margin: '0 auto 1rem', display: 'block' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>

            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.35rem' }}>
              Drop your PDF here
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              Drag & drop or click to browse
            </p>
            <span style={{
              display: 'inline-block',
              marginTop: '0.875rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              border: '1px solid rgba(201,168,76,0.4)',
              padding: '6px 14px',
              borderRadius: 2,
            }}>Browse Files</span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            background: 'var(--paper)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            animation: 'fadeInUp 0.3s ease both',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Gold left accent */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--gold)' }} />

            <div style={{
              width: 32, height: 32,
              background: 'var(--rust)',
              borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontSize: '0.6rem',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}>PDF</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {uploadedFile.name}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                {formatSize(uploadedFile.size)} · {isUploading ? 'Processing...' : isReady ? 'Ready' : 'Uploaded'}
              </p>
            </div>

            <button
              onClick={onRemoveFile}
              style={{
                width: 24, height: 24, border: 'none', background: 'none',
                cursor: 'pointer', color: 'var(--muted)', borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.background = 'rgba(184,92,56,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ height: 3, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.5rem' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                borderRadius: 99,
                width: '70%',
                animation: 'none',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)' }}>
              Extracting text from PDF...
            </p>
          </div>
        )}

        {/* Ready indicator */}
        {isReady && !isUploading && (
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--sage)' }}>
              Ready to answer questions
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div>
        <p style={labelStyle}>Session Stats</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <StatCard value={uploadedFile ? '1' : '0'} label="Documents" />
          <StatCard value={String(messageCount)} label="Queries" />
        </div>
      </div>

      {/* How to use */}
      <div style={{ marginTop: 'auto' }}>
        <p style={labelStyle}>How to use</p>
        <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {['Upload a PDF document', 'Wait for processing to complete', 'Ask any question about the document'].map((step, i) => (
            <li key={i} style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{step}</li>
          ))}
        </ol>
      </div>
    </aside>
  )
}

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--paper)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '0.75rem',
    }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--ink)', lineHeight: 1, marginBottom: 3 }}>
        {value}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {label}
      </div>
    </div>
  )
}

const labelStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.65rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '0.75rem',
}

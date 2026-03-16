import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  'What is this document about?',
  'Summarize the key points',
  'What are the main conclusions?',
  'Who are the authors or contributors?',
]

export default function ChatArea({ messages, isAsking, isReady, onAsk, onClear }) {
  const [question, setQuestion] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAsking])

  const handleSend = () => {
    if (!question.trim() || isAsking) return
    onAsk(question)
    setQuestion('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e) => {
    setQuestion(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const showHero = messages.length === 0 && !isAsking

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeInRight 0.6s 0.15s ease both',
      overflow: 'hidden',
      height: 'calc(100vh - 64px)',
    }}>

      {/* Chat area / Hero */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {showHero ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '4rem 2rem', textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 70%, rgba(74,112,96,0.04) 0%, transparent 70%)',
            }} />

            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '0.7rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ flex: 1, maxWidth: 40, height: 1, background: 'var(--gold)', opacity: 0.4, display: 'block' }} />
              Document Intelligence
              <span style={{ flex: 1, maxWidth: 40, height: 1, background: 'var(--gold)', opacity: 0.4, display: 'block' }} />
            </div>

            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              color: 'var(--ink)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}>
              Ask anything about<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>your document</em>
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: 480, lineHeight: 1.65, marginBottom: '3rem' }}>
              Upload a PDF in the sidebar, then ask questions in natural language.
            </p>

            {isReady && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: 560 }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(s)}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--paper-2)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 99,
                      fontSize: '0.8rem',
                      color: 'var(--slate)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--paper)'; e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper-2)'; e.currentTarget.style.color = 'var(--slate)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'none' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {!isReady && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Upload a PDF to get started
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Clear button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClear}
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '0.65rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--muted)', background: 'none',
                  border: '1px solid var(--border)', padding: '4px 10px',
                  borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.borderColor = 'var(--rust)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                Clear chat
              </button>
            </div>

            {messages.map((msg, i) => (
              <Message key={i} {...msg} />
            ))}

            {isAsking && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '1.25rem 2rem',
        background: 'var(--cream)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.75rem',
          background: 'var(--paper)',
          border: '1.5px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1rem',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
          onFocus={e => {
            if (e.currentTarget.contains(e.target)) {
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--gold-dim)'
            }
          }}
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={isReady ? 'Ask a question about your document...' : 'Upload a PDF first...'}
            disabled={!isReady || isAsking}
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '0.9rem',
              color: 'var(--ink)',
              resize: 'none',
              lineHeight: 1.6,
              maxHeight: 120,
              overflowY: 'auto',
              padding: 0,
            }}
          />

          <button
            onClick={handleSend}
            disabled={!question.trim() || isAsking || !isReady}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius)',
              border: 'none',
              background: question.trim() && isReady && !isAsking ? 'var(--ink)' : 'var(--border)',
              color: question.trim() && isReady && !isAsking ? 'var(--paper)' : 'var(--muted)',
              cursor: question.trim() && isReady && !isAsking ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s ease',
            }}
          >
            {isAsking ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', color: 'var(--muted)', marginTop: '0.5rem', textAlign: 'center' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </main>
  )
}

function Message({ role, text, time }) {
  const isUser = role === 'user'
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: '1rem',
      animation: 'messageIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? 'var(--slate)' : 'var(--ink)',
        color: isUser ? '#fff' : 'var(--paper)',
        fontSize: isUser ? '0.65rem' : '1rem',
        fontFamily: isUser ? "'DM Mono', monospace" : "'DM Serif Display', serif",
        letterSpacing: isUser ? '0.05em' : 0,
        fontWeight: isUser ? 600 : 400,
      }}>
        {isUser ? 'YOU' : 'D'}
      </div>

      <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: isUser
            ? 'var(--radius-lg) 2px var(--radius-lg) var(--radius-lg)'
            : '2px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
          background: isUser ? 'var(--ink)' : 'var(--cream)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: isUser ? 'var(--paper)' : 'var(--ink)',
          fontSize: '0.9rem',
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
        }}>
          {text}
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', color: 'var(--muted)' }}>{time}</span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '1rem', animation: 'messageIn 0.4s ease both' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--ink)', color: 'var(--paper)',
        fontFamily: "'DM Serif Display', serif", fontSize: '1rem',
      }}>D</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '1rem 1.25rem',
        background: 'var(--cream)',
        border: '1px solid var(--border)',
        borderRadius: '2px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
      }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <div key={i} style={{
            width: 6, height: 6, background: 'var(--muted)', borderRadius: '50%',
            animation: `typingBounce 1.2s ease-in-out ${delay}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

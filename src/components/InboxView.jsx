import { useState } from 'react'
import { Mail, Search, Filter, Bookmark, Sparkles, Feather } from 'lucide-react'

export function InboxView({ letters = [], onOpenLetter, onCompose }) {
  const [filterMode, setFilterMode] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const inboxLetters = letters.filter(l => l.status === 'inbox')

  const filteredLetters = inboxLetters.filter(letter => {
    if (filterMode === 'unread' && !letter.unread) return false
    if (filterMode === 'keepsakes' && !letter.isKeepsake) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchSender = letter.sender?.toLowerCase().includes(q)
      const matchSubject = letter.subject?.toLowerCase().includes(q)
      const matchBody = letter.body?.toLowerCase().includes(q)
      if (!matchSender && !matchSubject && !matchBody) return false
    }
    return true
  })

  return (
    <div className="desk-sanctum">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="greeting-kicker">
            <span>VALENTIA POSTAL REGISTRY</span>
            <span>~</span>
            <span>MAILBOX</span>
          </div>
          <h1 className="sanctum-title">Received Correspondence</h1>
          <p className="sanctum-subtext">
            Letters and folios arrived via rail and carriage to Camden Basin.
          </p>
        </div>

        <button 
          className="sidebar-write-btn" 
          onClick={onCompose}
          style={{ margin: 0 }}
        >
          <Feather size={15} />
          <span>Write a Letter</span>
        </button>
      </div>

      <div style={{
        background: '#EAE0D1',
        border: '1px solid #D5C2AB',
        borderRadius: '4px',
        padding: '12px 18px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFDF9',
          border: '1px solid #CFC0AD',
          borderRadius: '3px',
          padding: '6px 12px',
          width: '280px'
        }}>
          <Search size={14} color="var(--brown)" />
          <input
            type="text"
            placeholder="Search by sender or missive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              color: 'var(--ink)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`ritual-action-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
            style={filterMode === 'all' ? { background: 'var(--burgundy)', color: '#FFF', borderColor: 'var(--burgundy)' } : {}}
          >
            All Folios ({inboxLetters.length})
          </button>

          <button 
            className={`ritual-action-btn ${filterMode === 'unread' ? 'active' : ''}`}
            onClick={() => setFilterMode('unread')}
            style={filterMode === 'unread' ? { background: 'var(--burgundy)', color: '#FFF', borderColor: 'var(--burgundy)' } : {}}
          >
            Unread ({inboxLetters.filter(l => l.unread).length})
          </button>

          <button 
            className={`ritual-action-btn ${filterMode === 'keepsakes' ? 'active' : ''}`}
            onClick={() => setFilterMode('keepsakes')}
            style={filterMode === 'keepsakes' ? { background: 'var(--burgundy)', color: '#FFF', borderColor: 'var(--burgundy)' } : {}}
          >
            ★ Keepsakes ({inboxLetters.filter(l => l.isKeepsake).length})
          </button>
        </div>
      </div>

      {filteredLetters.length === 0 ? (
        <div style={{
          background: '#FFFDF9',
          border: '1px dashed #D6C4AD',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', margin: '0 0 6px' }}>
            No letters match your query
          </h3>
          <p style={{ color: 'var(--brown)', fontSize: '13px', margin: 0 }}>
            Check back when the next northern mail coach arrives.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              onClick={() => onOpenLetter(letter)}
              style={{
                background: '#FFFDF9',
                border: '1px solid #D5C2AB',
                borderRadius: '4px',
                padding: '20px 20px 16px',
                position: 'relative',
                boxShadow: '0 6px 18px rgba(48,40,32,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(48,40,32,0.14)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(48,40,32,0.08)'
              }}
            >
              <div className="airmail-trim-top" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="par-avion-label" style={{ fontSize: '9px', padding: '2px 6px' }}>
                    PAR AVION
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--brown)', marginTop: '4px' }}>
                    From: <strong>{letter.sender}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {letter.unread && (
                    <span className="nav-badge-pill" style={{ background: 'var(--burgundy)', color: '#FFF' }}>
                      NEW
                    </span>
                  )}
                  <div className="postage-stamp-widget" style={{ width: '40px', height: '50px', transform: 'rotate(2deg)' }}>
                    <div className="stamp-inner-border">
                      <span className="stamp-value" style={{ fontSize: '12px' }}>24</span>
                      <span className="stamp-legend" style={{ fontSize: '5px' }}>POST</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ margin: '14px 0 10px 10px' }}>
                <div className="to-the-hand-of" style={{ fontSize: '9px' }}>MISSIVE:</div>
                <h3 style={{
                  margin: '2px 0 6px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '20px',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  lineHeight: 1.2
                }}>
                  {letter.subject}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '11.5px',
                  color: 'var(--coffee)',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  "{letter.body.substring(0, 85)}..."
                </p>
              </div>

              <div style={{
                borderTop: '1px dashed #E2D4C3',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '10px',
                color: '#8A7664'
              }}>
                <span>{letter.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--burgundy)' }}>
                  <span>Inspect Missive</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

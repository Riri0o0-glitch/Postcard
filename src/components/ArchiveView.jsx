import { useState } from 'react'
import { Archive, Search, RotateCcw, Eye, Bookmark, Calendar, Feather } from 'lucide-react'

export function ArchiveView({ letters = [], onOpenLetter, onRestoreLetter, onCompose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState('all')

  const archivedLetters = letters.filter(l => l.status === 'archive' || l.isKeepsake)

  const filteredLetters = archivedLetters.filter(letter => {
    if (activeTag === 'edinburgh' && !letter.senderAddress?.toLowerCase().includes('edinburgh') && !letter.recipientAddress?.toLowerCase().includes('edinburgh')) {
      return false
    }
    if (activeTag === 'keepsakes' && !letter.isKeepsake) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchSender = letter.sender?.toLowerCase().includes(q)
      const matchRecipient = letter.recipient?.toLowerCase().includes(q)
      const matchSubject = letter.subject?.toLowerCase().includes(q)
      const matchBody = letter.body?.toLowerCase().includes(q)
      if (!matchSender && !matchRecipient && !matchSubject && !matchBody) return false
    }
    return true
  })

  return (
    <div className="desk-sanctum">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="greeting-kicker">
            <span>PRESERVED CORRESPONDENCE</span>
            <span>~</span>
            <span>CARD CATALOG & FOLIOS</span>
          </div>
          <h1 className="sanctum-title">Our Archive & Keepsakes</h1>
          <p className="sanctum-subtext">
            A chronological chest of cherished missives, botanical pressings, and postcards.
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
          width: '300px'
        }}>
          <Search size={14} color="var(--brown)" />
          <input
            type="text"
            placeholder="Search keywords, thoughts, authors..."
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
            className={`ritual-action-btn ${activeTag === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTag('all')}
            style={activeTag === 'all' ? { background: 'var(--burgundy)', color: '#FFF', borderColor: 'var(--burgundy)' } : {}}
          >
            All Archives ({archivedLetters.length})
          </button>

          <button 
            className={`ritual-action-btn ${activeTag === 'edinburgh' ? 'active' : ''}`}
            onClick={() => setActiveTag('edinburgh')}
            style={activeTag === 'edinburgh' ? { background: 'var(--burgundy)', color: '#FFF', borderColor: 'var(--burgundy)' } : {}}
          >
            Edinburgh Letters
          </button>

          <button 
            className={`ritual-action-btn ${activeTag === 'keepsakes' ? 'active' : ''}`}
            onClick={() => setActiveTag('keepsakes')}
            style={activeTag === 'keepsakes' ? { background: 'var(--burgundy)', color: '#FFF', borderColor: 'var(--burgundy)' } : {}}
          >
            ★ Botanical Keepsakes
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
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📁</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', margin: '0 0 6px' }}>
            No archived letters match this filter
          </h3>
          <p style={{ color: 'var(--brown)', fontSize: '13px', margin: 0 }}>
            Letters archived from your inbox or marked as keepsakes will appear here.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              style={{
                background: '#FFFDF9',
                border: '1px solid #D5C2AB',
                borderRadius: '3px',
                padding: '20px',
                boxShadow: '0 4px 14px rgba(48,40,32,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '210px',
                position: 'relative'
              }}
            >
              {letter.isKeepsake && (
                <div className="card-ribbon-bookmark" style={{ background: '#C5A059' }} />
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>{letter.postmark?.split('•')[0] || 'POSTAL RECORD'}</span>
                  <span>{letter.date}</span>
                </div>

                <h3 style={{
                  margin: '4px 0 8px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '20px',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--ink)'
                }}>
                  {letter.subject}
                </h3>

                <div style={{ fontSize: '11px', color: '#7E6B5A', marginBottom: '10px' }}>
                  From: <strong>{letter.sender}</strong> → To: <strong>{letter.recipient}</strong>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--coffee)',
                  lineHeight: 1.45,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  "{letter.body}"
                </p>
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '10px',
                borderTop: '1px dashed #E2D4C3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {letter.status === 'archive' && (
                  <button
                    className="ritual-action-btn"
                    onClick={() => onRestoreLetter(letter.id)}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    title="Restore missive to active inbox"
                  >
                    <RotateCcw size={11} />
                    <span>Restore to Inbox</span>
                  </button>
                )}

                <button
                  className="ritual-action-btn ritual-primary-btn"
                  onClick={() => onOpenLetter(letter)}
                  style={{ marginLeft: 'auto', fontSize: '11px', padding: '5px 12px' }}
                >
                  <Eye size={12} />
                  <span>Unfold Folio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

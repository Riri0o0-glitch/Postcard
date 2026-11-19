import { useState, useEffect } from 'react'
import { X, Reply, Archive, Bookmark, Check, Printer, RotateCw } from 'lucide-react'
import { STATIONERY_OPTIONS, FONT_OPTIONS } from '../data/initialLetters'
import { audioEngine } from '../utils/audio'

export function LetterReaderModal({ 
  letter, 
  onClose, 
  onReply, 
  onToggleArchive, 
  onToggleKeepsake 
}) {
  const [isOpenAnimationDone, setIsOpenAnimationDone] = useState(false)
  const [showEnvelopeView, setShowEnvelopeView] = useState(false)

  useEffect(() => {
    audioEngine.playPaperSlide()
    const timer = setTimeout(() => {
      setIsOpenAnimationDone(true)
    }, 450)
    return () => clearTimeout(timer)
  }, [letter])

  if (!letter) return null

  const stationeryObj = STATIONERY_OPTIONS.find(s => s.id === letter.stationery) || STATIONERY_OPTIONS[0]
  const fontObj = FONT_OPTIONS.find(f => f.id === letter.font) || FONT_OPTIONS[0]

  return (
    <div className="sending-modal-backdrop" onClick={onClose}>
      <div 
        className="sending-ceremony-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          padding: '0',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          textAlign: 'left'
        }}
      >
        <div style={{
          background: '#231A14',
          border: '1px solid #3E2F23',
          borderTopLeftRadius: '6px',
          borderTopRightRadius: '6px',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--ivory)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--gold)', fontSize: '14px' }}>✉</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', letterSpacing: '0.08em' }}>
              FOLIO FROM: {letter.sender.toUpperCase()}
            </span>
            {letter.isKeepsake && (
              <span className="nav-badge-pill" style={{ background: '#59441B', color: '#F0D799', border: '1px solid #C5A059' }}>
                ★ Keepsake
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="ritual-action-btn"
              onClick={() => setShowEnvelopeView(!showEnvelopeView)}
              style={{ fontSize: '11px', padding: '4px 10px', background: '#362920', color: 'var(--ivory)', borderColor: '#4E3A2D' }}
              title="Toggle envelope / sheet view"
            >
              <RotateCw size={12} />
              <span>{showEnvelopeView ? 'Read Letter Sheet' : 'Inspect Envelope'}</span>
            </button>

            <button 
              className="ritual-action-btn"
              onClick={() => {
                onToggleKeepsake && onToggleKeepsake(letter.id)
                audioEngine.playPaperSlide()
              }}
              style={{ fontSize: '11px', padding: '4px 10px', background: '#362920', color: letter.isKeepsake ? 'var(--gold)' : 'var(--ivory)', borderColor: '#4E3A2D' }}
              title="Mark as saved keepsake"
            >
              <Bookmark size={12} />
              <span>{letter.isKeepsake ? 'Kept' : 'Keep'}</span>
            </button>

            <button 
              onClick={onClose}
              style={{ color: '#C5B5A3', padding: '4px', marginLeft: '6px' }}
              aria-label="Close missive"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {!showEnvelopeView ? (
          <div 
            className={`composer-sheet ${stationeryObj.bgClass}`}
            style={{
              fontFamily: fontObj.family,
              color: letter.inkColor || '#302820',
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              minHeight: 'auto',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div className="composer-header-row">
              <div>
                <span className="to-the-hand-of">POSTMARK & ORIGIN:</span>
                <div style={{ fontSize: '13px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: 'var(--burgundy)', letterSpacing: '0.06em', marginTop: '2px' }}>
                  {letter.postmark || 'VALENTIA AIR MAIL • DISPATCHED'}
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'Lora, serif', color: 'var(--brown)', marginTop: '2px' }}>
                  {letter.senderAddress}
                </div>
              </div>

              <div className="composer-date" style={{ textAlign: 'right' }}>
                <div>{letter.date}</div>
                <div style={{ fontSize: '10px', color: 'var(--coffee)', fontStyle: 'normal', letterSpacing: '0.08em' }}>
                  POSTE RESTANTE
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div className="to-the-hand-of">DELIVERED TO:</div>
              <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                {letter.recipient}
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'Lora, serif', color: 'var(--brown)' }}>
                {letter.recipientAddress}
              </div>
            </div>

            <div style={{ margin: '18px 0', borderBottom: '1px dashed rgba(128,107,88,0.25)', paddingBottom: '10px' }}>
              <h2 style={{ 
                margin: 0, 
                fontFamily: 'Cormorant Garamond, serif', 
                fontSize: '26px', 
                fontStyle: 'italic', 
                fontWeight: 600,
                color: letter.inkColor || 'var(--ink)'
              }}>
                {letter.subject}
              </h2>
            </div>

            <div style={{
              whiteSpace: 'pre-line',
              lineHeight: '32px',
              fontSize: letter.font === 'Caveat' ? '23px' : '17px',
              marginBottom: '32px'
            }}>
              {letter.body}
            </div>

            {letter.attachment && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid #B89E84',
                borderRadius: '3px',
                margin: '10px 0 24px',
                fontFamily: 'Lora, serif',
                fontSize: '12px',
                color: 'var(--coffee)',
                boxShadow: '0 4px 12px rgba(48,40,32,0.08)',
                transform: 'rotate(-0.5deg)'
              }}>
                <span style={{ fontSize: '24px' }}>🌿</span>
                <div>
                  <strong style={{ color: 'var(--ink)' }}>Enclosure: {letter.attachment.title}</strong>
                  <div style={{ fontSize: '10px', color: '#7E6957', marginTop: '2px' }}>
                    {letter.attachment.note}
                  </div>
                </div>
              </div>
            )}

            <div className="composer-signature-box">
              <span className="to-the-hand-of">IN CORRESPONDENCE,</span>
              <div style={{
                fontFamily: letter.font === 'Caveat' ? "'Caveat', cursive" : "'Caveat', cursive",
                fontSize: '32px',
                color: letter.inkColor || 'var(--ink)',
                marginTop: '4px'
              }}>
                — {letter.sender.split(' ')[0]}
              </div>
            </div>

            <div style={{
              marginTop: '36px',
              paddingTop: '16px',
              borderTop: '1px dashed rgba(128,107,88,0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="ritual-action-btn"
                  onClick={() => {
                    onToggleArchive && onToggleArchive(letter.id)
                    onClose()
                  }}
                >
                  <Archive size={13} />
                  <span>{letter.status === 'archive' ? 'Restore to Inbox' : 'Archive Missive'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="ritual-action-btn ritual-primary-btn"
                  onClick={() => {
                    onReply && onReply(letter)
                    onClose()
                  }}
                  style={{ padding: '8px 18px' }}
                >
                  <Reply size={14} />
                  <span>Reply to {letter.sender.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#F4EBDD',
            padding: '40px',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px'
          }}>
            <div style={{
              maxWidth: '480px',
              margin: '0 auto',
              background: '#FFFDF9',
              border: '1px solid #D5C2AB',
              borderRadius: '4px',
              padding: '24px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              position: 'relative'
            }}>
              <div className="airmail-trim-top" />
              <div className="airmail-trim-bottom" />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span className="par-avion-label">PAR AVION</span>
                  <div className="return-address-block">
                    <div className="return-ex-libris">EX LIBRIS {letter.sender.toUpperCase()}</div>
                    <div>{letter.senderAddress}</div>
                  </div>
                </div>

                <div className="postmark-and-stamp-area">
                  <div className="vintage-postmark-seal">
                    <span>ROYAL<br />POST</span>
                    <strong>1996</strong>
                    <span>POSTAGE 24</span>
                  </div>
                  <div className="postage-stamp-widget" style={{ transform: 'none' }}>
                    <div className="stamp-inner-border">
                      <span className="stamp-legend">SCOTIA</span>
                      <span className="stamp-value">24</span>
                      <span className="stamp-legend">AIR MAIL</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ margin: '28px 0 20px 24px' }}>
                <div className="to-the-hand-of">TO THE HAND OF:</div>
                <div className="recipient-calligraphy-name" style={{ fontSize: '24px' }}>
                  {letter.recipient}
                </div>
                <div className="recipient-calligraphy-address" style={{ fontSize: '16px' }}>
                  {letter.recipientAddress}
                </div>
              </div>

              <div style={{
                borderTop: '1px dashed #D6C2AB',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--brown)'
              }}>
                <span>Sealed with {letter.sealColor || '#743D45'} Wax</span>
                <span>Dispatch: {letter.date}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

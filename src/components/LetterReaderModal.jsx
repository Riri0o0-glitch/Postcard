import { useState } from 'react'
import { X, Reply, Archive, Bookmark, RotateCw, Feather } from 'lucide-react'
import { PhysicalEnvelope } from './PhysicalEnvelope'
import { STATIONERY_OPTIONS, FONT_OPTIONS } from '../data/initialLetters'
import { audioEngine } from '../utils/audio'

export function LetterReaderModal({ 
  letter, 
  onClose, 
  onReply, 
  onToggleArchive, 
  onToggleKeepsake 
}) {
  // Always start on envelope view so recipient inspects front, flips to wax seal, and watches paper slide out!
  const [viewState, setViewState] = useState('envelope')
  const [isFlipped, setIsFlipped] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  if (!letter) return null

  const stationeryObj = STATIONERY_OPTIONS.find(s => s.id === letter.stationery) || STATIONERY_OPTIONS[0]
  const fontObj = FONT_OPTIONS.find(f => f.id === letter.font) || FONT_OPTIONS[0]

  const handleOpenLetterFromSeal = () => {
    setIsOpening(true)
    audioEngine.playSealCrack()
    audioEngine.playPaperSlide()
    setTimeout(() => {
      setViewState('letter')
      setIsOpening(false)
    }, 750)
  }

  return (
    <div className="sending-modal-backdrop" onClick={onClose}>
      <div 
        className="sending-ceremony-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: viewState === 'envelope' ? '560px' : '780px',
          padding: '0',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          textAlign: 'left',
          transition: 'max-width 0.3s ease'
        }}
      >
        {/* Top Control Bar */}
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
              FOLIO: {letter.sender.toUpperCase()}
            </span>
            {letter.isKeepsake && (
              <span className="nav-badge-pill" style={{ background: '#59441B', color: '#F0D799', border: '1px solid #C5A059' }}>
                ★ Keepsake
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {viewState === 'letter' && (
              <button
                className="ritual-action-btn"
                onClick={() => {
                  setViewState('envelope')
                  setIsFlipped(false)
                  setIsOpening(false)
                  audioEngine.playPaperSlide()
                }}
                style={{ fontSize: '11px', padding: '4px 10px', background: '#362920', color: 'var(--ivory)', borderColor: '#4E3A2D' }}
              >
                <RotateCw size={12} />
                <span>Inspect Envelope & Seal</span>
              </button>
            )}

            <button 
              onClick={onClose}
              style={{ color: '#C5B5A3', padding: '4px', marginLeft: '6px' }}
              aria-label="Close missive"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* VIEW 1: ENVELOPE INSPECTION (FRONT -> FLIP -> INSPECT SEAL -> SLIDE OUT) */}
        {viewState === 'envelope' ? (
          <div style={{
            background: '#F4EBDD',
            padding: '32px 24px 28px',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            border: '1px solid #D6C4AD',
            borderTop: 'none',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600 }}>
                {isFlipped ? '✦ BACK OF ENVELOPE • WAX SEAL INSPECTION' : '✦ FRONT OF ENVELOPE • DISPATCH POSTMARK'}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="ritual-action-btn"
                  onClick={() => {
                    setIsFlipped(!isFlipped)
                    audioEngine.playPaperSlide()
                  }}
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                >
                  <RotateCw size={11} />
                  <span>{isFlipped ? 'Flip to Address Front' : 'Flip to Wax Seal'}</span>
                </button>

                <button
                  className="ritual-action-btn ritual-primary-btn"
                  onClick={handleOpenLetterFromSeal}
                  style={{ fontSize: '11px', padding: '4px 14px' }}
                >
                  <span>PEEL SEAL & OPEN</span>
                </button>
              </div>
            </div>

            {/* The 3D Flippable Physical Envelope with slide-out animation */}
            <div style={{ padding: '10px 0 20px' }}>
              <PhysicalEnvelope
                letter={letter}
                isFlipped={isFlipped}
                onFlip={setIsFlipped}
                onOpen={handleOpenLetterFromSeal}
                isOpening={isOpening}
                interactive={true}
                size="large"
              />
            </div>

            <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--coffee)', fontStyle: 'italic' }}>
              Click anywhere on the envelope to turn it over • Click the wax seal to peel it open.
            </div>
          </div>
        ) : (
          /* VIEW 2: UNFOLDED HANDWRITTEN LETTER FOLIO */
          <div 
            className={`composer-sheet ${stationeryObj.bgClass}`}
            style={{
              fontFamily: fontObj.family,
              color: letter.inkColor || '#302820',
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              margin: '0',
              padding: '40px 48px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              maxHeight: '78vh',
              overflowY: 'auto'
            }}
          >
            {/* Missive Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid rgba(128, 107, 88, 0.25)',
              paddingBottom: '18px',
              marginBottom: '28px'
            }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--brown)',
                  marginBottom: '4px',
                  fontFamily: 'Cormorant Garamond, serif'
                }}>
                  RECEIVED DISPATCH
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  color: 'var(--ink)'
                }}>
                  {letter.subject}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--brown)', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600 }}>{letter.date}</div>
                <div style={{ fontSize: '11px', fontStyle: 'italic' }}>{letter.postmark}</div>
              </div>
            </div>

            {/* Sender / Recipient Callout */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '26px',
              fontSize: '13px',
              background: 'rgba(232, 217, 195, 0.35)',
              padding: '12px 18px',
              borderRadius: '3px',
              border: '1px solid rgba(213, 194, 171, 0.5)'
            }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', display: 'block' }}>
                  FROM
                </span>
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>{letter.sender}</strong>
                {letter.senderAddress && (
                  <div style={{ fontSize: '11.5px', color: 'var(--coffee)' }}>{letter.senderAddress}</div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', display: 'block' }}>
                  ADDRESSED TO
                </span>
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>{letter.recipient}</strong>
                {letter.recipientAddress && (
                  <div style={{ fontSize: '11.5px', color: 'var(--coffee)' }}>{letter.recipientAddress}</div>
                )}
              </div>
            </div>

            {/* Letter Body */}
            <div style={{
              fontSize: '19px',
              lineHeight: '1.75',
              whiteSpace: 'pre-wrap',
              marginBottom: '36px',
              minHeight: '140px'
            }}>
              {letter.body}
            </div>

            {/* Signature & Seal Signoff */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid rgba(128, 107, 88, 0.25)',
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: letter.sealColor || '#743D45',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFF',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '20px',
                  fontWeight: 700
                }}>
                  {letter.sealEmblem || 'P'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--brown)', lineHeight: 1.3 }}>
                  <div>POSTMARKED VERIFIED FOLIO</div>
                  <div style={{ fontStyle: 'italic' }}>Pressed in natural sealing wax</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="ritual-action-btn"
                  onClick={() => onToggleKeepsake(letter.id)}
                  style={{ fontSize: '11.5px' }}
                >
                  <Bookmark size={13} fill={letter.isKeepsake ? 'var(--gold)' : 'none'} color={letter.isKeepsake ? 'var(--gold)' : 'currentColor'} />
                  <span>{letter.isKeepsake ? 'Keepsake' : 'Keep as Keepsake'}</span>
                </button>

                <button
                  className="ritual-action-btn"
                  onClick={() => onToggleArchive(letter.id)}
                  style={{ fontSize: '11.5px' }}
                >
                  <Archive size={13} />
                  <span>{letter.status === 'archive' ? 'Return to Inbox' : 'Move to Archive'}</span>
                </button>

                <button
                  className="ritual-action-btn ritual-primary-btn"
                  onClick={() => {
                    onClose()
                    onReply(letter)
                  }}
                  style={{ fontSize: '11.5px' }}
                >
                  <Feather size={13} />
                  <span>Reply with Dip Pen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

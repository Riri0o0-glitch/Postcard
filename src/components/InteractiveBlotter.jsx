import { useState } from 'react'
import { RotateCw, Scissors, Sparkles, Feather, Compass, Check } from 'lucide-react'
import { audioEngine } from '../utils/audio'

export function InteractiveBlotter({ 
  featuredLetter, 
  onOpenLetter, 
  onOpenDraft,
  caddyLetters = [],
  selectedWaxColor,
  onSelectWaxColor,
  selectedNib,
  onSelectNib
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isOpenerReady, setIsOpenerReady] = useState(true)
  const [isPeeling, setIsPeeling] = useState(false)

  const letter = featuredLetter || {
    id: 'missive-julian-1596',
    sender: 'Julian Vance',
    senderAddress: 'No. 12 St Stephen Street, Stockbridge, Edinburgh',
    recipient: 'Clara Linnea Hastings',
    recipientAddress: 'The Studio Attic, 44 Canal Basin, Camden, LONDON • UNITED KINGDOM',
    subject: 'On the quiet cobblestones of the Old Town...',
    postmark: 'EDINBURGH POST • 14 OCT 1996 • POSTAGE 24',
    sealColor: '#743D45',
    sealEmblem: 'J'
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    audioEngine.playPaperSlide()
  }

  const handleToggleOpener = () => {
    setIsOpenerReady(!isOpenerReady)
    audioEngine.playPaperSlide()
  }

  const handlePeelSeal = () => {
    setIsPeeling(true)
    audioEngine.playSealCrack()
    setTimeout(() => {
      onOpenLetter(letter)
      setIsPeeling(false)
    }, 450)
  }

  return (
    <div className="desk-blotter-pad">
      <div className="blotter-corner blotter-corner-tl" />
      <div className="blotter-corner blotter-corner-tr" />
      <div className="blotter-corner blotter-corner-bl" />
      <div className="blotter-corner blotter-corner-br" />

      <div className="blotter-parchment-sheet">
        <div className="ritual-bar">
          <div className="ritual-title-group">
            <span className="ritual-tag">
              <span>✦</span>
              <span>RITUAL OF THE SEAL</span>
            </span>
            <span className="ritual-instruction">
              Turn envelope over to inspect the wax seal, then gently peel open.
            </span>
          </div>

          <div className="ritual-actions">
            <button 
              className="ritual-action-btn"
              onClick={handleFlip}
              title="Flip between front and back of envelope"
            >
              <RotateCw size={12} />
              <span>{isFlipped ? 'Flip to Address Front' : 'Flip to Seal Back'}</span>
            </button>

            <button 
              className={`ritual-action-btn ${isOpenerReady ? 'active' : ''}`}
              onClick={handleToggleOpener}
              title="Toggle Sheffield bone folder / letter opener"
            >
              <Scissors size={12} />
              <span>Letter Opener: {isOpenerReady ? 'Ready' : 'Holstered'}</span>
            </button>

            <button 
              className="ritual-action-btn ritual-primary-btn"
              onClick={handlePeelSeal}
            >
              <span>PEEL BURGUNDY SEAL</span>
            </button>
          </div>
        </div>

        <div className="blotter-stage-grid">
          <div className="envelope-3d-stage">
            <div 
              className={`envelope-card-flipper ${isFlipped ? 'is-flipped' : ''}`}
              onClick={handleFlip}
              title="Click anywhere to turn envelope over"
            >
              <div className="envelope-face envelope-face-front">
                <div className="airmail-trim-top" />
                <div className="airmail-trim-bottom" />

                <div className="envelope-front-header">
                  <div>
                    <span className="par-avion-label">PAR AVION</span>
                    <div className="return-address-block">
                      <div className="return-ex-libris">EX LIBRIS JULIAN VANCE</div>
                      <div>No. 12 St Stephen Street,</div>
                      <div>Stockbridge, Edinburgh</div>
                    </div>
                  </div>

                  <div className="postmark-and-stamp-area">
                    <div className="vintage-postmark-seal">
                      <span>EDINBURGH<br />POST</span>
                      <strong>14 OCT 1996</strong>
                      <span>POSTAGE 24</span>
                    </div>

                    <div className="postmark-wavy-lines">
                      <div className="postmark-wave" />
                      <div className="postmark-wave" />
                      <div className="postmark-wave" />
                    </div>

                    <div className="postage-stamp-widget">
                      <div className="stamp-inner-border">
                        <span className="stamp-legend">SCOTIA</span>
                        <span className="stamp-value">24</span>
                        <span className="stamp-legend">AIR MAIL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="envelope-recipient-box">
                  <div className="to-the-hand-of">TO THE HAND OF:</div>
                  <div className="recipient-calligraphy-name">
                    Clara Linnea Hastings
                  </div>
                  <div className="recipient-calligraphy-address">
                    The Studio Attic, 44 Canal Basin, Camden<br />
                    <span style={{ fontSize: '13px', letterSpacing: '0.1em', fontFamily: 'Lora, serif' }}>
                      LONDON • UNITED KINGDOM
                    </span>
                  </div>
                </div>

                <div className="envelope-front-footer">
                  <span>✦ Click and flip to check flap & seal</span>
                </div>
              </div>

              <div className="envelope-face envelope-face-back">
                <div className="envelope-back-fold-left" />
                <div className="envelope-back-fold-right" />
                <div className="envelope-back-fold-bottom" />
                <div className={`envelope-back-flap ${isPeeling ? 'open' : ''}`} />

                <div 
                  className="wax-seal-button"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, #9E5660 0%, ${letter.sealColor || '#743D45'} 60%, #401B22 100%)`
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePeelSeal()
                  }}
                  title="Peel wax seal to open missive"
                >
                  <span>{letter.sealEmblem || 'J'}</span>
                </div>
              </div>
            </div>

            <div className="envelope-blotter-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--burgundy)' }} />
                <span className="sealed-missive-snippet">
                  <strong>Sealed missive:</strong> "{letter.subject}"
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="ritual-action-btn"
                  onClick={handleFlip}
                  style={{ padding: '4px 8px', fontSize: '10.5px' }}
                >
                  <RotateCw size={11} />
                  <span>FLIP ENVELOPE</span>
                </button>
                <button 
                  className="ritual-action-btn ritual-primary-btn"
                  onClick={handlePeelSeal}
                  style={{ padding: '4px 10px', fontSize: '10.5px' }}
                >
                  <span>PEEL WAX SEAL</span>
                </button>
              </div>
            </div>
          </div>

          <div className="blotter-tools-column">
            <div className="vintage-tool-card">
              <div className="caddy-header">
                <span className="caddy-title">
                  <span>LETTER-CADDY</span>
                </span>
                <span className="caddy-slotted-tag">3 slotted</span>
              </div>

              <div className="caddy-item-list">
                <div 
                  className="caddy-item-row"
                  onClick={() => onOpenLetter && onOpenLetter(caddyLetters[0])}
                  title="Read Parisian map postcard"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px' }}>✉</span>
                    <span className="caddy-item-name">Parisian map postcard</span>
                  </div>
                  <span className="caddy-item-date">Sep 20</span>
                </div>

                <div 
                  className="caddy-item-row"
                  onClick={() => onOpenLetter && onOpenLetter(caddyLetters[1])}
                  title="Read Pressed ferns folio"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px' }}>✉</span>
                    <span className="caddy-item-name">Pressed ferns folio</span>
                  </div>
                  <span className="caddy-item-date">Aug 14</span>
                </div>

                <div 
                  className="caddy-item-row"
                  onClick={() => onOpenDraft && onOpenDraft()}
                  title="Open Railway timetable draft"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px' }}>✎</span>
                    <span className="caddy-item-name">Railway timetable draft</span>
                  </div>
                  <span className="caddy-item-date">Jul 02</span>
                </div>
              </div>
            </div>

            <div className="vintage-tool-card">
              <div className="opener-tool-widget">
                <div className="bone-folder-icon">
                  <span>🗡️</span>
                </div>
                <div className="opener-tool-info">
                  <div className="tool-meta-eyebrow">IVORY & BRASS LETTER OPENER</div>
                  <div className="tool-name">1888 Sheffield Tool</div>
                  <div className="tool-caption">
                    Glides through laid rag envelopes without tearing
                  </div>
                </div>
              </div>
            </div>

            <div className="vintage-tool-card">
              <div className="dip-pen-widget">
                <div className="ink-bottle-art">
                  <strong>QUINK</strong>
                  <span>Sepia</span>
                </div>
                <div className="opener-tool-info">
                  <div className="tool-meta-eyebrow">DIP PEN & STAND</div>
                  <div className="tool-name">Brause Steno 361 Nib</div>
                  <div className="ink-meter-bar">
                    <div className="ink-meter-fill" style={{ width: '82%' }} />
                  </div>
                  <div style={{ fontSize: '9px', color: '#968170', marginTop: '3px' }}>
                    82% Inkwell
                  </div>
                </div>
              </div>
            </div>

            <div className="barometer-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={13} />
                <span>Barometer: 1013 hPa</span>
              </div>
              <span style={{ fontStyle: 'italic' }}>Rain threatens dusk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

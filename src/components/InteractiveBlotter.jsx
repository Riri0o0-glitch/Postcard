import { useState } from 'react'
import { RotateCw, Scissors, Sparkles, Feather, Compass, Check } from 'lucide-react'
import { PhysicalEnvelope } from './PhysicalEnvelope'
import { audioEngine } from '../utils/audio'

export function InteractiveBlotter({ 
  featuredLetter, 
  onOpenLetter, 
  onOpenDraft,
  caddyLetters = []
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isOpenerReady, setIsOpenerReady] = useState(true)
  const [isOpening, setIsOpening] = useState(false)

  const letter = featuredLetter || {
    id: 'missive-julian-1596',
    sender: 'Julian Vance',
    senderAddress: 'No. 12 St Stephen Street, Stockbridge, Edinburgh',
    recipient: 'Clara Linnea Hastings',
    recipientAddress: 'The Studio Attic, 44 Canal Basin, Camden, LONDON • UNITED KINGDOM',
    subject: 'On the quiet cobblestones of the Old Town...',
    postmark: 'EDINBURGH POST • 14 OCT 1996 • POSTAGE 24',
    sealColor: '#743D45',
    sealEmblem: 'J',
    body: 'Dearest Clara,\n\nThe autumn has settled deeply into Edinburgh. Dusk descends at four in the afternoon...'
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
    if (!isFlipped) {
      setIsFlipped(true)
      audioEngine.playPaperSlide()
      setTimeout(() => {
        triggerOpenSequence()
      }, 400)
    } else {
      triggerOpenSequence()
    }
  }

  const triggerOpenSequence = () => {
    setIsOpening(true)
    audioEngine.playSealCrack()
    audioEngine.playPaperSlide()
    setTimeout(() => {
      onOpenLetter(letter)
      setIsOpening(false)
    }, 650)
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <PhysicalEnvelope
              letter={letter}
              isFlipped={isFlipped}
              onFlip={setIsFlipped}
              onOpen={handlePeelSeal}
              isOpening={isOpening}
              interactive={true}
              size="large"
            />

            <div className="envelope-blotter-controls" style={{ marginTop: '20px' }}>
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
                  <span>{isFlipped ? 'SHOW ADDRESS' : 'FLIP ENVELOPE'}</span>
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

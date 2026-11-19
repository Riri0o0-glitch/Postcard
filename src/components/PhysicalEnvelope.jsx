import { useState } from 'react'
import { RotateCw, Check } from 'lucide-react'
import { audioEngine } from '../utils/audio'

export function PhysicalEnvelope({ 
  letter, 
  isFlipped, 
  onFlip, 
  onOpen, 
  isOpening = false,
  interactive = true,
  size = 'large' // 'large' or 'compact'
}) {
  const [internalFlipped, setInternalFlipped] = useState(false)
  
  // Controlled or uncontrolled flip
  const flipped = isFlipped !== undefined ? isFlipped : internalFlipped

  const handleToggleFlip = (e) => {
    e.stopPropagation()
    if (!interactive) return
    audioEngine.playPaperSlide()
    if (onFlip) {
      onFlip(!flipped)
    } else {
      setInternalFlipped(!flipped)
    }
  }

  const handleSealClick = (e) => {
    e.stopPropagation()
    if (onOpen) {
      onOpen()
    }
  }

  const sender = letter?.sender || 'Julian Vance'
  const senderAddress = letter?.senderAddress || 'No. 12 St Stephen Street, Stockbridge, Edinburgh'
  const recipient = letter?.recipient || 'Clara Linnea Hastings'
  const recipientAddress = letter?.recipientAddress || 'The Studio Attic, 44 Canal Basin, Camden, London'
  const sealColor = letter?.sealColor || '#743D45'
  const sealEmblem = letter?.sealEmblem || (letter?.sender ? letter.sender.charAt(0).toUpperCase() : 'P')
  const postmark = letter?.postmark || 'POSTMARKED • 14 OCT 1996 • SCOTIA 24'

  const height = size === 'compact' ? '230px' : '290px'

  return (
    <div 
      className="envelope-container-stage"
      style={{
        width: '100%',
        maxWidth: '510px',
        height: height,
        perspective: '1400px',
        WebkitPerspective: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* 3D Flipper Box */}
      <div 
        className="envelope-3d-flipper"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transition: 'transform 0.75s cubic-bezier(0.25, 0.8, 0.25, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: interactive ? 'pointer' : 'default'
        }}
        onClick={handleToggleFlip}
      >
        {/* ===================== FRONT FACE ===================== */}
        <div 
          className="envelope-face envelope-face-front"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#FFFDF9',
            border: '1.5px solid #D5C2AB',
            borderRadius: '4px',
            boxShadow: '0 12px 34px rgba(48,40,32,0.2)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            zIndex: flipped ? 1 : 2,
            boxSizing: 'border-box'
          }}
        >
          {/* Airmail Red & Navy Border Stripes */}
          <div className="airmail-trim-top" />
          <div className="airmail-trim-bottom" />

          {/* Paper Sheet Sliding Out from Front (Emerges above envelope when opening!) */}
          <div
            style={{
              position: 'absolute',
              left: '12%',
              right: '12%',
              height: '85%',
              background: '#FFFDF9',
              border: '1px solid #D8C6AE',
              borderRadius: '2px',
              padding: '16px 20px',
              boxShadow: '0 -8px 24px rgba(40,30,20,0.22)',
              zIndex: 10,
              transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s',
              transform: isOpening ? 'translateY(-140px)' : 'translateY(40px)',
              opacity: isOpening ? 1 : 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            <div style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '6px' }}>
              ✦ UNROLLING LETTER FOLIO...
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.4 }}>
              {letter?.body?.substring(0, 110) || 'Dearest friend, The post arrives softly in the evening twilight...'}...
            </div>
          </div>

          {/* Top Header: PAR AVION & Cancellation Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 3 }}>
            <div>
              <span className="par-avion-label">PAR AVION</span>
              <div style={{ marginTop: '8px', fontSize: '10.5px', color: 'var(--brown)', lineHeight: 1.35 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink)' }}>
                  EX LIBRIS {sender.toUpperCase()}
                </div>
                <div>{senderAddress}</div>
              </div>
            </div>

            {/* Stamp & Cancellation Rings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="vintage-postmark-seal">
                <span>ROYAL<br />POST</span>
                <strong>1996</strong>
                <span>SCOTIA</span>
              </div>
              <div className="postmark-wavy-lines">
                <div className="postmark-wave" />
                <div className="postmark-wave" />
                <div className="postmark-wave" />
              </div>
              <div className="postage-stamp-widget" style={{ transform: 'rotate(2deg)' }}>
                <div className="stamp-inner-border">
                  <span className="stamp-legend">POST</span>
                  <span className="stamp-value">24</span>
                  <span className="stamp-legend">SCOTIA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Calligraphy */}
          <div style={{ margin: '12px 0 8px 24px', position: 'relative', zIndex: 3 }}>
            <div className="to-the-hand-of">TO THE HAND OF:</div>
            <div className="recipient-calligraphy-name" style={{ fontSize: '24px' }}>
              {recipient}
            </div>
            <div className="recipient-calligraphy-address" style={{ fontSize: '16px' }}>
              {recipientAddress}
            </div>
          </div>

          {/* Front Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#9A8574', position: 'relative', zIndex: 3 }}>
            <span style={{ fontStyle: 'italic' }}>Postmarked Royal Mail • 1996</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--burgundy)', fontWeight: 600 }}>
              <RotateCw size={11} />
              <span>Turn over to inspect wax seal ↻</span>
            </span>
          </div>
        </div>

        {/* ===================== BACK FACE ===================== */}
        <div 
          className="envelope-face envelope-face-back"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#F4EBDD',
            border: '1.5px solid #D1C0AA',
            borderRadius: '4px',
            boxShadow: '0 12px 34px rgba(48,40,32,0.22)',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: flipped ? 2 : 1,
            boxSizing: 'border-box'
          }}
        >
          {/* Triangular Fold Creases */}
          <div 
            style={{
              position: 'absolute',
              left: 0, bottom: 0,
              width: '50%', height: '100%',
              background: 'rgba(215, 197, 176, 0.45)',
              clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              right: 0, bottom: 0,
              width: '50%', height: '100%',
              background: 'rgba(205, 187, 166, 0.55)',
              clipPath: 'polygon(100% 0, 0 50%, 100% 100%)'
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '52%',
              background: '#E8D9C3',
              clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
              borderTop: '1px solid #D4C1AB'
            }} 
          />

          {/* The Written Paper Sheet Sliding Out (Like image 2!) */}
          <div
            style={{
              position: 'absolute',
              left: '12%',
              right: '12%',
              height: '85%',
              background: '#FFFDF9',
              border: '1px solid #D6C4AD',
              borderRadius: '2px',
              padding: '16px 20px',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.2)',
              zIndex: 4,
              transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s',
              transform: isOpening ? 'translateY(-140px)' : 'translateY(30px)',
              opacity: isOpening ? 1 : 0.25,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            <div style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '6px' }}>
              ✦ FOLIO UNFOLDING...
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.4 }}>
              {letter?.body?.substring(0, 110) || 'Dearest Clara, The autumn has settled deeply into Edinburgh...'}...
            </div>
          </div>

          {/* Top Flap (Pivots open when peeling seal) */}
          <div 
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '56%',
              background: '#DECDB7',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              borderBottom: '1.5px solid #C4B099',
              zIndex: isOpening ? 2 : 5,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transformOrigin: 'top',
              transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transform: isOpening ? 'rotateX(180deg)' : 'rotateX(0deg)'
            }} 
          />

          {/* Center 3D Wax Seal Button */}
          <div 
            className="wax-seal-button"
            style={{
              position: 'absolute',
              top: '48%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '74px',
              height: '74px',
              borderRadius: '48% 52% 49% 51% / 53% 47% 53% 47%',
              background: `radial-gradient(circle at 35% 35%, #9E5660 0%, ${sealColor} 60%, #3D181F 100%)`,
              boxShadow: '0 8px 18px rgba(40, 15, 20, 0.6), inset 2px 2px 5px rgba(255,255,255,0.3), inset -2px -2px 6px rgba(0,0,0,0.4)',
              display: 'grid',
              placeItems: 'center',
              color: '#ECC2BB',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '34px',
              fontWeight: 700,
              zIndex: 6,
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onClick={handleSealClick}
            title="Click to break wax seal and unfold letter"
          >
            <span>{sealEmblem}</span>
          </div>

          {/* Instructions below seal */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '10.5px',
            color: 'var(--coffee)',
            letterSpacing: '0.06em',
            zIndex: 4,
            fontWeight: 500
          }}>
            <span>✦ Click wax seal to open • Click anywhere to flip</span>
          </div>
        </div>
      </div>
    </div>
  )
}

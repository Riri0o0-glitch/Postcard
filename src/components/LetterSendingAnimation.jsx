import { useState, useEffect } from 'react'
import { CheckCircle2, ArrowRight, BookOpen, Send, Sparkles } from 'lucide-react'
import { audioEngine } from '../utils/audio'

export function LetterSendingAnimation({ 
  letter, 
  onComplete, 
  onViewSent, 
  onReturnDesk 
}) {
  const [stage, setStage] = useState(1)

  useEffect(() => {
    audioEngine.playPaperSlide()

    const t1 = setTimeout(() => {
      setStage(2)
      audioEngine.playPaperSlide()
    }, 900)

    const t2 = setTimeout(() => {
      setStage(3)
    }, 1800)

    const t3 = setTimeout(() => {
      setStage(4)
      audioEngine.playSealCrack()
    }, 2600)

    const t4 = setTimeout(() => {
      setStage(5)
      audioEngine.playStampThud()
    }, 3400)

    const t5 = setTimeout(() => {
      setStage(6)
      audioEngine.playPaperSlide()
    }, 4200)

    const t6 = setTimeout(() => {
      setStage(7)
      onComplete && onComplete()
    }, 5000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [])

  return (
    <div className="sending-modal-backdrop">
      <div className="sending-ceremony-card">
        {stage < 7 ? (
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '8px' }}>
              DISPATCH RITUAL • STAGE {stage} OF 6
            </div>

            <h2 className="ceremony-stage-title">
              {stage === 1 && '1. Folding the handwritten vellum...'}
              {stage === 2 && '2. Sliding folio into handmade envelope...'}
              {stage === 3 && '3. Closing envelope flap...'}
              {stage === 4 && '4. Pouring hot wax & stamping seal...'}
              {stage === 5 && '5. Inking Royal Mail postmark & stamp...'}
              {stage === 6 && '6. Gliding missive into post chute...'}
            </h2>

            <p className="ceremony-stage-caption">
              {stage === 1 && 'Your words are folded along traditional three-part creases.'}
              {stage === 2 && 'Protected within 140gsm laid rag paper.'}
              {stage === 3 && 'Prepared for the sealing wax.'}
              {stage === 4 && `Imperial seal embossed with monogram '${letter?.sealEmblem || 'C'}'.`}
              {stage === 5 && 'Postmarked at Camden Basin for Edinburgh express transit.'}
              {stage === 6 && 'Deposited in the evening dispatch collection.'}
            </p>

            <div style={{
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              margin: '20px auto 10px',
              maxWidth: '420px'
            }}>
              {stage === 1 && (
                <div style={{
                  width: '260px',
                  height: '200px',
                  background: '#F4EBDD',
                  border: '1px solid #C4B099',
                  borderRadius: '3px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transform: 'scale(0.9) rotate(-1deg)',
                  transition: 'all 0.5s ease',
                  padding: '16px',
                  fontFamily: 'Caveat, cursive',
                  fontSize: '14px',
                  color: 'var(--ink)'
                }}>
                  <div style={{ height: '33%', borderBottom: '1px dashed #A38C7A' }}>
                    Dearest {letter?.recipient || 'Julian'}...
                  </div>
                  <div style={{ height: '33%', borderBottom: '1px dashed #A38C7A', paddingTop: '8px' }}>
                    {letter?.subject || 'A letter across the miles'}
                  </div>
                  <div style={{ height: '33%', paddingTop: '8px', textAlign: 'right' }}>
                    — {letter?.signature || 'Clara'}
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div style={{
                  width: '320px',
                  height: '180px',
                  background: '#E8D9C3',
                  border: '1px solid #C4B099',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '3px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                  <div style={{
                    width: '240px',
                    height: '120px',
                    background: '#F4EBDD',
                    border: '1px solid #B8A28B',
                    margin: '30px auto 0',
                    transform: 'translateY(-20px)',
                    transition: 'transform 0.6s ease',
                    textAlign: 'center',
                    padding: '8px',
                    fontFamily: 'Caveat, cursive',
                    fontSize: '15px'
                  }}>
                    Folio tucked safely into pocket
                  </div>
                </div>
              )}

              {stage === 3 && (
                <div style={{
                  width: '320px',
                  height: '190px',
                  background: '#E8D9C3',
                  border: '1px solid #C4B099',
                  position: 'relative',
                  borderRadius: '3px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '55%',
                    background: '#D9C5AD',
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                    borderBottom: '1.5px solid #BCAB94',
                    transformOrigin: 'top',
                    transition: 'transform 0.4s ease'
                  }} />
                </div>
              )}

              {stage === 4 && (
                <div style={{
                  width: '320px',
                  height: '190px',
                  background: '#E8D9C3',
                  border: '1px solid #C4B099',
                  position: 'relative',
                  borderRadius: '3px',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.25)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '55%',
                    background: '#D9C5AD',
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                    borderBottom: '1.5px solid #BCAB94'
                  }} />
                  <div 
                    className="wax-seal-button"
                    style={{
                      transform: 'translate(-50%, -50%) scale(1.15)',
                      background: `radial-gradient(circle at 35% 35%, #9E5660 0%, ${letter?.sealColor || '#743D45'} 60%, #401B22 100%)`
                    }}
                  >
                    <span>{letter?.sealEmblem || 'C'}</span>
                  </div>
                </div>
              )}

              {stage === 5 && (
                <div style={{
                  width: '340px',
                  height: '200px',
                  background: '#FFFDF9',
                  border: '1px solid #D5C2AB',
                  position: 'relative',
                  borderRadius: '3px',
                  padding: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
                }}>
                  <div className="airmail-trim-top" />
                  <div className="airmail-trim-bottom" />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="par-avion-label">PAR AVION</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="vintage-postmark-seal" style={{ width: '70px', height: '70px', fontSize: '7px' }}>
                        <span>CAMDEN<br />POST</span>
                        <strong>14 OCT 1996</strong>
                        <span>DISPATCHED</span>
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
                  <div style={{ margin: '14px 0 0 16px' }}>
                    <div className="to-the-hand-of">TO:</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '18px' }}>
                      {letter?.recipient || 'Julian Vance'}
                    </div>
                  </div>
                </div>
              )}

              {stage === 6 && (
                <div style={{
                  width: '340px',
                  height: '200px',
                  background: '#FFFDF9',
                  border: '1px solid #D5C2AB',
                  borderRadius: '3px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(-30px) rotate(4deg) scale(0.9)',
                  opacity: 0.85,
                  transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  padding: '16px'
                }}>
                  <div className="airmail-trim-top" />
                  <div className="airmail-trim-bottom" />
                  <span className="par-avion-label">DISPATCHED</span>
                  <div style={{ textAlign: 'center', marginTop: '45px', fontFamily: 'Caveat, cursive', fontSize: '20px', color: 'var(--burgundy)' }}>
                    Traveling north upon the night train...
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <button 
                onClick={() => {
                  setStage(7)
                  onComplete && onComplete()
                }}
                style={{ fontSize: '11px', color: 'var(--brown)', textDecoration: 'underline' }}
              >
                Fast-forward ritual →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              borderRadius: '50%', 
              background: 'var(--burgundy)',
              color: 'var(--ivory)',
              display: 'grid', 
              placeItems: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              boxShadow: '0 4px 14px rgba(116,61,69,0.4)'
            }}>
              ✓
            </div>

            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--burgundy)', marginBottom: '6px' }}>
              DISPATCH CERTIFICATE NO. 1597
            </div>

            <h2 className="ceremony-stage-title" style={{ fontSize: '32px' }}>
              Your letter is on its way!
            </h2>

            <p className="ceremony-stage-caption" style={{ maxWidth: '420px', margin: '0 auto 24px' }}>
              Your missive to <strong>{letter?.recipient || 'Julian Vance'}</strong> has been sealed with hot wax and consigned to the Royal Mail evening carriage.
            </p>

            <div style={{
              background: '#FFFDF9',
              border: '1px solid #D6C4AD',
              borderRadius: '4px',
              padding: '16px 20px',
              maxWidth: '440px',
              margin: '0 auto 28px',
              textAlign: 'left',
              fontSize: '12px',
              color: 'var(--coffee)',
              lineHeight: 1.6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0D2C2', paddingBottom: '6px', marginBottom: '8px' }}>
                <span>Recipient:</span>
                <strong>{letter?.recipient}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0D2C2', paddingBottom: '6px', marginBottom: '8px' }}>
                <span>Destination:</span>
                <span>{letter?.recipientAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0D2C2', paddingBottom: '6px', marginBottom: '8px' }}>
                <span>Departure Post:</span>
                <span>London Camden Central • Oct 14, 1996</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Arrival:</span>
                <span>2 days via Northern Express</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button 
                className="ritual-action-btn"
                onClick={onReturnDesk}
                style={{ padding: '10px 18px' }}
              >
                <BookOpen size={14} />
                <span>Return to My Desk</span>
              </button>

              <button 
                className="ritual-action-btn ritual-primary-btn"
                onClick={onViewSent}
                style={{ padding: '10px 20px' }}
              >
                <Send size={14} />
                <span>View in Sent Letters</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

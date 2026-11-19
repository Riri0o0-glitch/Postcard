import { useState } from 'react'
import { X, UserPlus, LogIn, Mail, Check, Feather } from 'lucide-react'
import { WAX_COLORS } from '../data/initialLetters'
import { audioEngine } from '../utils/audio'

export function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister,
  currentUser 
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [sealColor, setSealColor] = useState('#743D45')
  const [sealEmblem, setSealEmblem] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isRegisterMode) {
      if (!name.trim()) {
        alert('Please enter your name for the correspondence registry.')
        return
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@postmarked.desk`,
        address: address.trim() || 'No. 1 Post Restante, Camden',
        sealColor,
        sealEmblem: (sealEmblem || name.charAt(0)).toUpperCase()
      }

      audioEngine.playSealCrack()
      onRegister(newUser)
      onClose()
    } else {
      if (!name.trim() && !email.trim()) {
        alert('Please enter your name or email to retrieve your desk.')
        return
      }
      onLogin({
        name: name.trim() || 'Correspondent',
        email: email.trim()
      })
      audioEngine.playPaperSlide()
      onClose()
    }
  }

  return (
    <div className="sending-modal-backdrop" onClick={onClose}>
      <div 
        className="sending-ceremony-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          background: '#FFFDF9',
          border: '2px solid #D6C4AD',
          borderRadius: '4px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #ECE1D3', paddingBottom: '14px' }}>
          <div>
            <div className="greeting-kicker" style={{ fontSize: '9px', marginBottom: '2px' }}>
              <span>POSTAL BUREAU LEDGER</span>
              <span>~</span>
              <span>REGISTRY</span>
            </div>
            <h2 style={{
              margin: 0,
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '24px',
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--ink)'
            }}>
              {isRegisterMode ? 'Register Your Writing Desk' : 'Sign In to Your Desk'}
            </h2>
          </div>

          <button 
            onClick={onClose}
            style={{ color: 'var(--brown)', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '4px' }}>
              Your Name / Inscription
            </label>
            <input
              type="text"
              className="toolbar-select"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!sealEmblem && e.target.value) {
                  setSealEmblem(e.target.value.charAt(0).toUpperCase())
                }
              }}
              placeholder="e.g. Clara Linnea Hastings"
              style={{ width: '100%', fontSize: '14px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '4px' }}>
              Postal Email
            </label>
            <input
              type="email"
              className="toolbar-select"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. clara@camdenstudio.co.uk"
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          {isRegisterMode && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '4px' }}>
                  Your City / Studio Address
                </label>
                <input
                  type="text"
                  className="toolbar-select"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. The Studio Attic, Camden Basin, London"
                  style={{ width: '100%', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
                  Choose Your Wax Seal & Monogram
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                    {WAX_COLORS.map((wax) => (
                      <button
                        type="button"
                        key={wax.id}
                        onClick={() => setSealColor(wax.id)}
                        style={{
                          flex: 1,
                          padding: '6px 2px',
                          borderRadius: '2px',
                          border: sealColor === wax.id ? '2px solid var(--burgundy)' : '1px solid #D5C2AB',
                          background: sealColor === wax.id ? '#F8EFE4' : '#FFF',
                          fontSize: '10px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: wax.color, margin: '0 auto 3px' }} />
                        <span>{wax.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    maxLength={1}
                    value={sealEmblem}
                    onChange={(e) => setSealEmblem(e.target.value.toUpperCase())}
                    placeholder="P"
                    style={{
                      width: '40px',
                      height: '38px',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '18px',
                      fontFamily: 'Cormorant Garamond, serif',
                      border: '1px solid #D5C2AB',
                      borderRadius: '2px',
                      background: '#FFF'
                    }}
                    title="Seal monogram letter"
                  />
                </div>
              </div>

              <div style={{
                background: '#FAF5ED',
                border: '1px dashed #D6C4AD',
                padding: '10px 14px',
                borderRadius: '3px',
                fontSize: '11px',
                color: 'var(--coffee)',
                marginBottom: '18px',
                lineHeight: 1.4
              }}>
                ✦ <strong>First-Time Register:</strong> You will immediately receive an official welcome missive in your inbox from <strong>POSTMARKED</strong>!
              </div>
            </>
          )}

          <button
            type="submit"
            className="ritual-action-btn ritual-primary-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '13px' }}
          >
            {isRegisterMode ? (
              <>
                <UserPlus size={15} />
                <span>Register & Open Writing Desk</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Sign In to Postmarked</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--brown)' }}>
          {isRegisterMode ? (
            <span>
              Already registered in the ledger?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                style={{ color: 'var(--burgundy)', textDecoration: 'underline', fontWeight: 600 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Writing from a new desk?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                style={{ color: 'var(--burgundy)', textDecoration: 'underline', fontWeight: 600 }}
              >
                Register Here (Receive Welcome Missive)
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

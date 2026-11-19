import { useState } from 'react'
import { Save, Volume2, RefreshCw, Trash2, Check, User } from 'lucide-react'
import { 
  STATIONERY_OPTIONS, 
  FONT_OPTIONS, 
  INK_OPTIONS, 
  WAX_COLORS 
} from '../data/initialLetters'
import { audioEngine } from '../utils/audio'

export function SettingsView({ 
  settings, 
  onSaveSettings, 
  onResetData, 
  isAmbienceActive, 
  setIsAmbienceActive 
}) {
  const [userName, setUserName] = useState(settings?.userName || 'Clara Linnea Hastings')
  const [userAddress, setUserAddress] = useState(settings?.userAddress || 'The Studio Attic, 44 Canal Basin, Camden, London')
  const [correspondentName, setCorrespondentName] = useState(settings?.correspondentName || 'Julian Vance')
  const [correspondentAddress, setCorrespondentAddress] = useState(settings?.correspondentAddress || 'No. 12 St Stephen Street, Stockbridge, Edinburgh')
  
  const [defaultStationery, setDefaultStationery] = useState(settings?.defaultStationery || 'Classic aged parchment')
  const [defaultFont, setDefaultFont] = useState(settings?.defaultFont || 'Caveat')
  const [defaultInkColor, setDefaultInkColor] = useState(settings?.defaultInkColor || '#302820')
  const [defaultSealColor, setDefaultSealColor] = useState(settings?.defaultSealColor || '#743D45')
  const [defaultSealEmblem, setDefaultSealEmblem] = useState(settings?.defaultSealEmblem || 'C')
  
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    const updated = {
      ...settings,
      userName,
      userAddress,
      correspondentName,
      correspondentAddress,
      defaultStationery,
      defaultFont,
      defaultInkColor,
      defaultSealColor,
      defaultSealEmblem
    }
    onSaveSettings(updated)
    audioEngine.playPaperSlide()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleToggleSound = () => {
    const active = audioEngine.toggleAmbience()
    setIsAmbienceActive(active)
  }

  return (
    <div className="desk-sanctum">
      <div style={{ marginBottom: '28px' }}>
        <div className="greeting-kicker">
          <span>DESK REGISTRY</span>
          <span>~</span>
          <span>PREFERENCES</span>
        </div>
        <h1 className="sanctum-title">Bureau Settings & Identity</h1>
        <p className="sanctum-subtext">
          Customize your correspondence details, default stationery, and ink choices.
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          background: '#231A14',
          color: 'var(--gold)',
          border: '1px solid var(--gold)',
          padding: '12px 20px',
          borderRadius: '3px',
          fontSize: '13px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Check size={16} />
          <span>Bureau registry updated. All settings preserved in your browser's local memory.</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px'
      }}>
        <div style={{
          background: '#FFFDF9',
          border: '1px solid #D5C2AB',
          borderRadius: '4px',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(48,40,32,0.06)'
        }}>
          <h2 style={{
            margin: '0 0 16px',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--ink)',
            borderBottom: '1px solid #ECE1D3',
            paddingBottom: '8px'
          }}>
            Correspondent Identity
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Your Name (Sender)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="toolbar-select"
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Studio Address
            </label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="toolbar-select"
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Primary Pen Pal / Recipient
            </label>
            <input
              type="text"
              value={correspondentName}
              onChange={(e) => setCorrespondentName(e.target.value)}
              className="toolbar-select"
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Pen Pal Address
            </label>
            <input
              type="text"
              value={correspondentAddress}
              onChange={(e) => setCorrespondentAddress(e.target.value)}
              className="toolbar-select"
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{
          background: '#FFFDF9',
          border: '1px solid #D5C2AB',
          borderRadius: '4px',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(48,40,32,0.06)'
        }}>
          <h2 style={{
            margin: '0 0 16px',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--ink)',
            borderBottom: '1px solid #ECE1D3',
            paddingBottom: '8px'
          }}>
            Default Writing Tools
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Preferred Paper Stock
            </label>
            <select
              value={defaultStationery}
              onChange={(e) => setDefaultStationery(e.target.value)}
              className="toolbar-select"
              style={{ width: '100%' }}
            >
              {STATIONERY_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Default Script Font
            </label>
            <select
              value={defaultFont}
              onChange={(e) => setDefaultFont(e.target.value)}
              className="toolbar-select"
              style={{ width: '100%' }}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Default Wax Seal Color
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {WAX_COLORS.map((wax) => (
                <button
                  key={wax.id}
                  onClick={() => setDefaultSealColor(wax.id)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '2px',
                    border: defaultSealColor === wax.id ? '2px solid var(--burgundy)' : '1px solid #D5C2AB',
                    background: defaultSealColor === wax.id ? '#F8EFE4' : '#FFF',
                    fontSize: '11px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: wax.color, margin: '0 auto 4px' }} />
                  <span>{wax.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>
              Default Seal Monogram
            </label>
            <input
              type="text"
              maxLength={2}
              value={defaultSealEmblem}
              onChange={(e) => setDefaultSealEmblem(e.target.value.toUpperCase())}
              className="toolbar-select"
              style={{ width: '60px', textAlign: 'center', fontWeight: 'bold' }}
            />
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '28px',
        background: '#FFFDF9',
        border: '1px solid #D5C2AB',
        borderRadius: '4px',
        padding: '24px',
        boxShadow: '0 4px 14px rgba(48,40,32,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600 }}>
            Atmospheric Audio Synthesis
          </h3>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--coffee)' }}>
            Gentle rain upon the studio casement window and fountain pen nib sounds.
          </p>
        </div>

        <button 
          className={`ritual-action-btn ${isAmbienceActive ? 'ritual-primary-btn' : ''}`}
          onClick={handleToggleSound}
          style={{ padding: '8px 16px' }}
        >
          <Volume2 size={14} />
          <span>Ambience Sound: {isAmbienceActive ? 'Active (Playing)' : 'Muted'}</span>
        </button>
      </div>

      <div style={{
        marginTop: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <button
          className="ritual-action-btn"
          onClick={() => {
            if (confirm('Reset correspondence to default 1996 letters from Julian and Clara?')) {
              onResetData()
            }
          }}
          style={{ color: '#8A5555', borderColor: '#D9C5B8' }}
        >
          <RefreshCw size={13} />
          <span>Restore Default Letters & Lore</span>
        </button>

        <button
          className="ritual-action-btn ritual-primary-btn"
          onClick={handleSave}
          style={{ padding: '12px 28px', fontSize: '14px' }}
        >
          <Save size={14} />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  )
}

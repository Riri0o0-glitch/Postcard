import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Menu, Mail, BookOpen, User, Sparkles } from 'lucide-react'
import { audioEngine } from '../utils/audio'

export function Header({ activeSection, onToggleSidebar, onNavigate, lettersCount, unreadCount, isAmbienceActive, setIsAmbienceActive }) {
  const [currentDateStr, setCurrentDateStr] = useState('')

  useEffect(() => {
    setCurrentDateStr('Wednesday, October 14, 1996 • Twilight Dispatch')
  }, [])

  const handleToggleSound = () => {
    const newState = audioEngine.toggleAmbience()
    setIsAmbienceActive(newState)
  }

  return (
    <header className="vintage-topbar">
      <div className="topbar-left">
        <button 
          className="icon-button mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>

        <div className="bureau-seal-badge">
          <span style={{ fontSize: '13px' }}>✦</span>
          <span>POSTMARKED BUREAU DISPATCH</span>
        </div>

        <span className="dispatch-route" style={{ display: 'none' }}>
          Valentia Post Air Mail No. 44
        </span>
      </div>

      <div className="topbar-right">
        <button 
          className={`ambience-toggle-btn ${isAmbienceActive ? 'active' : ''}`}
          onClick={handleToggleSound}
          title="Toggle ambient rain & pen audio"
        >
          <span className="ambience-dot" />
          {isAmbienceActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>Pen & Rain Ambience • {isAmbienceActive ? 'Active' : 'Muted'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onNavigate('Inbox')}
            title="Received Letters"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--coffee)' }}
          >
            <Mail size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-6px',
                width: '7px',
                height: '7px',
                background: 'var(--burgundy)',
                borderRadius: '50%'
              }} />
            )}
          </button>

          <button 
            onClick={() => onNavigate('Our Archive')}
            title="Preserved Archives"
            style={{ display: 'flex', alignItems: 'center', color: 'var(--coffee)' }}
          >
            <BookOpen size={16} />
          </button>

          <button 
            onClick={() => onNavigate('Settings')}
            title="Desk Settings"
            style={{ display: 'flex', alignItems: 'center', color: 'var(--coffee)' }}
          >
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

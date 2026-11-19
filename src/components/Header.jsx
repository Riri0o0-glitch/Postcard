import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Menu, Mail, BookOpen, User, UserCheck, Sparkles } from 'lucide-react'
import { audioEngine } from '../utils/audio'

export function Header({ 
  activeSection, 
  onToggleSidebar, 
  onNavigate, 
  lettersCount, 
  unreadCount, 
  isAmbienceActive, 
  setIsAmbienceActive,
  currentUser,
  onOpenAuth
}) {
  const [currentDateStr, setCurrentDateStr] = useState('')

  useEffect(() => {
    // Vintage 1996 aesthetic date matching lore
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
        {/* Ambience audio toggle */}
        <button 
          className={`ambience-toggle-btn ${isAmbienceActive ? 'active' : ''}`}
          onClick={handleToggleSound}
          title="Toggle ambient rain & pen audio"
        >
          <span className="ambience-dot" />
          {isAmbienceActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>Pen & Rain Ambience • {isAmbienceActive ? 'Active' : 'Muted'}</span>
        </button>

        {/* Registry & User Account Button */}
        <button
          className="ritual-action-btn"
          onClick={onOpenAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            padding: '5px 12px',
            background: '#FAF5ED',
            borderColor: '#D4C3AE',
            color: 'var(--ink)'
          }}
          title="Postal Bureau Registry, Sign In & Registration"
        >
          {currentUser ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: currentUser.sealColor || 'var(--burgundy)',
                color: '#FFF',
                fontSize: '10px',
                fontWeight: 700,
                display: 'grid',
                placeItems: 'center'
              }}>
                {currentUser.sealEmblem || currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
            </>
          ) : (
            <>
              <User size={13} color="var(--burgundy)" />
              <span style={{ fontWeight: 600 }}>Registry / Sign In</span>
            </>
          )}
        </button>

        {/* Quick status icons */}
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
        </div>
      </div>
    </header>
  )
}

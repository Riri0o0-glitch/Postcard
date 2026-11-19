import { 
  BookOpen, 
  Inbox, 
  Send, 
  Archive, 
  FileText, 
  Settings, 
  PenTool, 
  X,
  Heart
} from 'lucide-react'

export function Sidebar({ 
  activeSection, 
  onNavigate, 
  unreadCount, 
  draftsCount, 
  archiveCount, 
  isOpen, 
  onClose,
  settings 
}) {
  const navItems = [
    { id: 'My Desk', label: 'My Desk', icon: BookOpen, badge: 'STUDY', badgeClass: 'study-tag' },
    { id: 'Inbox', label: 'Received Letters', icon: Inbox, badge: unreadCount > 0 ? `${unreadCount} unread` : null },
    { id: 'Sent Letters', label: 'Sent Letters', icon: Send, badge: '✦' },
    { id: 'Our Archive', label: 'Our Archive', icon: Archive, badge: `${archiveCount || 28} Keepsakes` },
    { id: 'Drafts', label: 'Drafts', icon: FileText, badge: draftsCount > 0 ? `${draftsCount}` : null },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ]

  return (
    <aside className={`vintage-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-crest">P</div>
        <div style={{ flex: 1 }}>
          <h2 className="brand-title">POSTMARKED</h2>
          <p className="brand-tagline">Some feelings deserve a letter.</p>
        </div>
        <button 
          onClick={onClose} 
          className="mobile-close-btn"
          aria-label="Close sidebar"
          style={{ display: 'none', color: 'var(--ivory)' }}
        >
          <X size={18} />
        </button>
      </div>

      <button 
        className="sidebar-write-btn"
        onClick={() => {
          onNavigate('Write a Letter')
          if (onClose) onClose()
        }}
      >
        <PenTool size={16} />
        <span>Write a Letter</span>
      </button>

      <div className="nav-section-title">CORRESPONDENCE BUREAU</div>
      <nav className="sidebar-nav" aria-label="Bureau Navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              className={`vintage-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id)
                if (onClose) onClose()
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge-pill">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-bottom-plaque">
        <div className="correspondence-brass-tag">
          <div className="brass-tag-header">
            <span>♡ CLARA & JULIAN</span>
            <span>No. 1596</span>
          </div>
          <div className="brass-tag-meta">
            Every few days across the distance
          </div>
          <div className="brass-tag-sub">
            ✒ Black Gall Ink (74%) • Autumn 1996
          </div>
          <div className="brass-tag-footer">
            <span>October 14 • 1996</span>
            <span>POSTE RESTANTE</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

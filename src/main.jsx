import { useState } from 'react'
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Clock3,
  Feather,
  Inbox,
  Mail,
  Menu,
  Settings,
  Send,
  X,
} from 'lucide-react'
import './styles.css'

const letters = [
  { sender: 'Eleanor', subject: 'A little bit of spring', date: 'May 18, 1994', color: 'rose', unread: true },
  { sender: 'Theo', subject: 'From the coast', date: 'May 12, 1994', color: 'blue', unread: false },
  { sender: 'Margaret', subject: 'The recipe you asked for', date: 'May 03, 1994', color: 'olive', unread: false },
]

const navItems = [
  { label: 'My Desk', icon: BookOpen },
  { label: 'Inbox', icon: Inbox, count: 2 },
  { label: 'Sent Letters', icon: Send },
  { label: 'Drafts', icon: Feather, count: 1 },
  { label: 'Archive', icon: Archive },
]

function App() {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState('My Desk')
  const [menuOpen, setMenuOpen] = useState(false)

  if (!entered) {
    return <Landing onEnter={() => setEntered(true)} />
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand-mark">P</div>
          <div>
            <p className="brand-name">Postmarked</p>
            <p className="brand-caption">A private post office</p>
          </div>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="desk-label">Your correspondence</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon, count }) => (
            <button
              className={`nav-item ${active === label ? 'active' : ''}`}
              key={label}
              onClick={() => { setActive(label); setMenuOpen(false) }}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{label}</span>
              {count && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-postmark">EST. 1994</div>
          <button className="nav-item settings-item" onClick={() => setActive('Settings')}>
            <Settings size={18} strokeWidth={1.7} />
            <span>Settings</span>
          </button>
          <p className="sidebar-note">Slow mail for<br />meaningful things.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="breadcrumb"><span>Postmarked</span><ChevronRight size={14} /><strong>{active}</strong></div>
          <div className="topbar-date">Wednesday, May 25, 1994</div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">Good afternoon, Clara</p>
              <h1>Your desk is waiting.</h1>
              <p className="intro-copy">A quiet place for the words that deserve more than a screen.</p>
            </div>
            <button className="primary-button" onClick={() => setActive('Write a Letter')}>
              <Feather size={17} /> Write a letter <ArrowUpRight size={16} />
            </button>
          </section>

          <section className="desk-grid">
            <div className="desk-paper">
              <div className="paper-topline">
                <span>MY DESK</span>
                <span className="paper-number">No. 0047</span>
              </div>
              <div className="paper-rule" />
              <div className="paper-body">
                <div>
                  <p className="paper-kicker">A note to self</p>
                  <h2>There are still<br /><em>beautiful ways</em><br />to stay in touch.</h2>
                  <p className="paper-message">Take your time. Choose your words. Let them travel.</p>
                </div>
                <div className="wax-seal" aria-label="Burgundy wax seal">P</div>
              </div>
              <div className="paper-signature">— your little post office</div>
            </div>

            <div className="mailbox-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">The mailbox</p>
                  <h3>Incoming mail</h3>
                </div>
                <span className="unread-badge">2 unread</span>
              </div>
              <div className="mailbox-illustration">
                <div className="mailbox-flag" />
                <div className="mailbox-roof" />
                <div className="mailbox-body"><div className="mailbox-slot" /></div>
                <div className="mailbox-post" />
                <div className="mailbox-ground" />
              </div>
              <div className="mailbox-footer"><span>Last checked just now</span><Clock3 size={14} /></div>
            </div>
          </section>

          <section className="letters-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">On the writing desk</p>
                <h2>Recently received</h2>
              </div>
              <button className="text-button" onClick={() => setActive('Inbox')}>View all letters <ArrowUpRight size={15} /></button>
            </div>
            <div className="letter-list">
              {letters.map((letter) => <LetterCard letter={letter} key={letter.subject} />)}
            </div>
          </section>

          <footer className="desk-footer">
            <span><span className="footer-dot" /> Your correspondence is kept on this desk.</span>
            <span>POSTMARKED &nbsp;·&nbsp; 1994</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

function Landing({ onEnter }) {
  return (
    <main className="landing">
      <div className="landing-grain" />
      <nav className="landing-nav">
        <div className="landing-brand"><span className="brand-mark">P</span><span>Postmarked</span></div>
        <span className="landing-est">EST. 1994 &nbsp;·&nbsp; PRIVATE CORRESPONDENCE</span>
      </nav>
      <div className="landing-content">
        <div className="landing-copy">
          <p className="eyebrow light">A place for your words</p>
          <h1>Not everything<br />needs to be said<br /><em>instantly.</em></h1>
          <p className="landing-description">Postmarked is a quiet corner for letters between people who have something real to say.</p>
          <div className="landing-actions">
            <button className="landing-cta" onClick={onEnter}>Enter the post office <ArrowUpRight size={17} /></button>
            <button className="landing-secondary" onClick={() => document.querySelector('.how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works <ChevronRight size={16} /></button>
          </div>
        </div>
        <EnvelopeIllustration />
      </div>
      <div className="landing-footer">
        <span>Some feelings deserve a letter.</span>
        <span className="scroll-hint">Scroll to wander <span>↓</span></span>
      </div>
      <section className="how-it-works"><p className="eyebrow light">The old-fashioned way</p><h2>Write slowly. Send thoughtfully.<br /><em>Keep something.</em></h2></section>
    </main>
  )
}

function EnvelopeIllustration() {
  return (
    <div className="envelope-scene" aria-label="Vintage envelope illustration">
      <div className="postmark">PAR AVION<br /><strong>25</strong><br />MAY 1994</div>
      <div className="airmail-stamp">✦<br /><small>AIR<br />MAIL</small></div>
      <div className="envelope">
        <div className="envelope-flap" />
        <div className="envelope-fold left" />
        <div className="envelope-fold right" />
        <div className="address-lines"><span>Clara Morgan</span><span>14 Willow Lane</span><span>Somewhere, Always</span></div>
        <div className="envelope-seal">P</div>
      </div>
      <div className="paper-slip">FOR: <strong>YOU</strong></div>
    </div>
  )
}

function LetterCard({ letter }) {
  return (
    <article className={`letter-card ${letter.unread ? 'letter-unread' : ''}`}>
      <div className={`stamp stamp-${letter.color}`}><span>✦</span><small>POST<br />1994</small></div>
      <div className="letter-details">
        <div className="letter-meta"><span>{letter.date}</span>{letter.unread && <span className="new-label">NEW</span>}</div>
        <h3>{letter.subject}</h3>
        <p>From <strong>{letter.sender}</strong></p>
      </div>
      <button className="letter-arrow" aria-label={`Open letter from ${letter.sender}`}><ArrowUpRight size={18} /></button>
    </article>
  )
}

export default App

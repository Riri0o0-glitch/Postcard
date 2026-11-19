import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { DeskDashboard } from './components/DeskDashboard'
import { LetterComposer } from './components/LetterComposer'
import { LetterSendingAnimation } from './components/LetterSendingAnimation'
import { LetterReaderModal } from './components/LetterReaderModal'
import { AuthModal } from './components/AuthModal'
import { InboxView } from './components/InboxView'
import { SentLettersView } from './components/SentLettersView'
import { DraftsView } from './components/DraftsView'
import { ArchiveView } from './components/ArchiveView'
import { SettingsView } from './components/SettingsView'
import { 
  INITIAL_LETTERS, 
  INITIAL_DRAFTS, 
  INITIAL_SETTINGS 
} from './data/initialLetters'
import { audioEngine } from './utils/audio'
import { postmarkedRequest } from './utils/mailApi'
import './styles.css'

export default function App() {
  // Directly open to main dashboard: My Desk
  const [activeSection, setActiveSection] = useState('My Desk')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAmbienceActive, setIsAmbienceActive] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Current logged in user / Bureau identity
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('postmarked_current_user')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  // LocalStorage state management
  const [letters, setLetters] = useState(() => {
    try {
      const saved = localStorage.getItem('postmarked_letters')
      return saved ? JSON.parse(saved) : INITIAL_LETTERS
    } catch (e) {
      return INITIAL_LETTERS
    }
  })

  const [drafts, setDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem('postmarked_drafts')
      return saved ? JSON.parse(saved) : INITIAL_DRAFTS
    } catch (e) {
      return INITIAL_DRAFTS
    }
  })

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('postmarked_settings')
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS
    } catch (e) {
      return INITIAL_SETTINGS
    }
  })

  // Selected stationery preferences for quick desk toggles
  const [selectedWaxColor, setSelectedWaxColor] = useState(settings?.defaultSealColor || '#743D45')
  const [selectedNib, setSelectedNib] = useState(settings?.penNib || 'Brause Steno 361 Nib')

  // Modals & Interactive Overlays
  const [readingLetter, setReadingLetter] = useState(null)
  const [composerData, setComposerData] = useState(null)
  const [letterInTransit, setLetterInTransit] = useState(null)

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('postmarked_letters', JSON.stringify(letters))
    } catch (e) {}
  }, [letters])

  useEffect(() => {
    try {
      localStorage.setItem('postmarked_drafts', JSON.stringify(drafts))
    } catch (e) {}
  }, [drafts])

  useEffect(() => {
    try {
      localStorage.setItem('postmarked_settings', JSON.stringify(settings))
    } catch (e) {}
  }, [settings])

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('postmarked_current_user', JSON.stringify(currentUser))
      }
    } catch (e) {}
  }, [currentUser])

  // Support reading shared missives via URL without needing local code installed
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const letterParam = params.get('letter')
      if (letterParam) {
        const decoded = JSON.parse(decodeURIComponent(letterParam))
        const sharedMissive = {
          id: `shared-${Date.now()}`,
          sender: decoded.sender || 'A Secret Correspondent',
          senderAddress: decoded.senderAddress || 'Postmarked Bureau Dispatch',
          recipient: decoded.recipient || settings.userName || 'You',
          recipientAddress: decoded.recipientAddress || 'Your Writing Desk',
          subject: decoded.subject || 'A Sealed Missive',
          body: decoded.body || 'Some feelings deserve a letter.',
          date: 'Special Dispatch • 1996',
          postmark: 'POSTMARKED • SPECIAL AIRMAIL • 1996',
          sealColor: decoded.sealColor || '#743D45',
          sealEmblem: (decoded.sender || 'P').charAt(0).toUpperCase(),
          stationery: decoded.stationery || 'Classic aged parchment',
          font: decoded.font || 'Caveat',
          status: 'inbox',
          unread: true,
          isKeepsake: true
        }

        // Open directly in the 3D envelope reader so they can flip and peel!
        setReadingLetter(sharedMissive)
        setLetters(prev => [sharedMissive, ...prev.filter(l => l.id !== sharedMissive.id)])
      } else if (params.get('write') === 'true') {
        setActiveSection('Write a Letter')
      }
    } catch (err) {
      console.warn('Could not parse shared missive parameter:', err)
    }
  }, [])

  useEffect(() => {
    const receiveMailbox = (event) => {
      const mailbox = event.detail || []
      if (!mailbox.length) return
      setLetters(prev => {
        const ids = new Set(prev.map(letter => letter.id))
        return [...mailbox.filter(letter => !ids.has(letter.id)), ...prev]
      })
    }
    window.addEventListener('postmarked-mailbox', receiveMailbox)
    return () => window.removeEventListener('postmarked-mailbox', receiveMailbox)
  }, [])

  // Unread & Counter stats
  const unreadCount = letters.filter(l => l.status === 'inbox' && l.unread).length
  const draftsCount = drafts.length
  const archiveCount = letters.filter(l => l.status === 'archive' || l.isKeepsake).length

  // Handlers
  const handleOpenLetter = (letter) => {
    if (!letter) return
    // Mark as read
    if (letter.unread) {
      setLetters(prev => prev.map(l => l.id === letter.id ? { ...l, unread: false } : l))
    }
    setReadingLetter(letter)
  }

  const handleReplyToLetter = (letter) => {
    setComposerData({
      recipient: letter.sender.replace(' (You)', ''),
      recipientAddress: letter.senderAddress || '',
      subject: letter.subject.startsWith('Re:') ? letter.subject : `Re: ${letter.subject}`,
      body: `\n\n— On ${letter.date}, ${letter.sender} wrote:\n> "${letter.body.substring(0, 120)}..."\n\n`,
      stationery: settings.defaultStationery || 'Classic aged parchment',
      font: settings.defaultFont || 'Caveat',
      sealColor: selectedWaxColor
    })
    setActiveSection('Write a Letter')
  }

  const handleToggleArchive = (letterId) => {
    setLetters(prev => prev.map(l => {
      if (l.id === letterId) {
        const nextStatus = l.status === 'archive' ? 'inbox' : 'archive'
        return { ...l, status: nextStatus }
      }
      return l
    }))
  }

  const handleToggleKeepsake = (letterId) => {
    setLetters(prev => prev.map(l => {
      if (l.id === letterId) {
        return { ...l, isKeepsake: !l.isKeepsake }
      }
      return l
    }))
  }

  const handleSaveDraft = (draftData) => {
    setDrafts(prev => {
      const idx = prev.findIndex(d => d.id === draftData.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = draftData
        return next
      }
      return [draftData, ...prev]
    })
  }

  const handleDeleteDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId))
  }

  const handleEditDraft = (draft) => {
    setComposerData(draft)
    setActiveSection('Write a Letter')
  }

  // Trigger Send Letter (Starts 7-stage sending ritual!)
  const handleSendLetter = (letterData) => {
    setLetterInTransit(letterData)
  }

  // Complete Send Letter (Saved into Sent Letters)
  const handleCompleteSend = async () => {
    if (letterInTransit) {
      setLetters(prev => [letterInTransit, ...prev])
      if (letterInTransit.recipientEmail) {
        try {
          await postmarkedRequest('send', { letter: letterInTransit })
        } catch (error) {
          alert(`The letter was saved locally, but delivery failed: ${error.message}`)
        }
      }
      // Remove draft if sending from draft
      if (composerData?.id) {
        setDrafts(prev => prev.filter(d => d.id !== composerData.id))
      }
      setComposerData(null)
    }
  }

  // User Registration Handler: Dispatches official welcome letter from POSTMARKED!
  const handleRegister = (newUser) => {
    setCurrentUser(newUser)
    
    // Update settings with user's registered name and seal
    setSettings(prev => ({
      ...prev,
      userName: newUser.name,
      userAddress: newUser.address,
      defaultSealColor: newUser.sealColor,
      defaultSealEmblem: newUser.sealEmblem
    }))
    setSelectedWaxColor(newUser.sealColor)

    // Official First-Time Welcome Missive from POSTMARKED!
    const welcomeLetter = {
      id: `missive-welcome-${Date.now()}`,
      sender: 'POSTMARKED (Chief Postmaster)',
      senderAddress: 'The Central Bureau of Letters, No. 1 Old Post Office Court',
      recipient: newUser.name,
      recipientAddress: newUser.address || 'The Studio Attic, Camden Basin',
      subject: 'Welcome to Postmarked — Your writing desk awaits',
      date: 'Wednesday, October 14, 1996 • First Dispatch',
      postmark: 'POSTMARKED BUREAU • 1996 • ROYAL MAIL',
      stationery: 'Classic aged parchment',
      font: 'Cormorant Garamond',
      inkColor: '#302820',
      sealColor: '#743D45',
      sealEmblem: 'P',
      status: 'inbox',
      unread: true,
      isKeepsake: true,
      featuredOnDesk: true,
      body: `Dearest ${newUser.name},\n\nWelcome to Postmarked — your private sanctum for handwritten thoughts and slow correspondence.\n\nIn a world that moves in frantic seconds, this desk was carved out for feelings that deserve patience, ink on rag parchment, and the intimate quiet of an unfolded letter.\n\nEvery missive you receive here begins sealed in authentic wax. Turn it over in your hands, inspect the seal and postal cancellations, and peel it open to watch your letter slide into view.\n\nYou may unroll fresh vellum to write, send missives directly via postal mail or shareable links to companions across the world without them needing anything installed, and preserve every memory in your personal archive.\n\nMay your pen never run dry, and may every letter you send find a warm hearth.\n\nFaithfully yours,\nThe Chief Postmaster\nPOSTMARKED BUREAU`
    }

    setLetters(prev => [welcomeLetter, ...prev])
    setActiveSection('My Desk')
    return true
  }

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    setSettings(prev => ({
      ...prev,
      userName: userData.name,
      userAddress: userData.address,
      defaultSealColor: userData.sealColor,
      defaultSealEmblem: userData.sealEmblem
    }))
    setSelectedWaxColor(userData.sealColor)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('postmarked_current_user')
  }

  const handleResetData = () => {
    setLetters(INITIAL_LETTERS)
    setDrafts(INITIAL_DRAFTS)
    setSettings(INITIAL_SETTINGS)
    localStorage.removeItem('postmarked_letters')
    localStorage.removeItem('postmarked_drafts')
    localStorage.removeItem('postmarked_settings')
    localStorage.removeItem('postmarked_current_user')
    setCurrentUser(null)
    alert('Restored original 1996 correspondence archive!')
  }

  return (
    <div className="app-container">
      {/* Vintage Wood Paneled Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={(section) => {
          setActiveSection(section)
          if (section === 'Write a Letter' && !composerData) {
            setComposerData(null)
          }
        }}
        unreadCount={unreadCount}
        draftsCount={draftsCount}
        archiveCount={archiveCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        settings={settings}
      />

      {/* Main Viewport Workspace */}
      <main className="main-viewport">
        {/* Top Bureau Navigation Bar */}
        <Header
          activeSection={activeSection}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={setActiveSection}
          lettersCount={letters.length}
          unreadCount={unreadCount}
          isAmbienceActive={isAmbienceActive}
          setIsAmbienceActive={setIsAmbienceActive}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* View Switcher */}
        {activeSection === 'My Desk' && (
          <DeskDashboard
            letters={letters}
            onNavigate={setActiveSection}
            onOpenLetter={handleOpenLetter}
            onOpenDraft={() => {
              if (drafts.length > 0) {
                handleEditDraft(drafts[0])
              } else {
                setActiveSection('Write a Letter')
              }
            }}
            settings={settings}
            selectedWaxColor={selectedWaxColor}
            setSelectedWaxColor={setSelectedWaxColor}
            selectedNib={selectedNib}
            setSelectedNib={setSelectedNib}
          />
        )}

        {activeSection === 'Write a Letter' && (
          <LetterComposer
            initialData={composerData}
            onSaveDraft={handleSaveDraft}
            onSendLetter={handleSendLetter}
            onCancel={() => {
              setComposerData(null)
              setActiveSection('My Desk')
            }}
            settings={settings}
          />
        )}

        {activeSection === 'Inbox' && (
          <InboxView
            letters={letters}
            onOpenLetter={handleOpenLetter}
            onCompose={() => {
              setComposerData(null)
              setActiveSection('Write a Letter')
            }}
          />
        )}

        {activeSection === 'Sent Letters' && (
          <SentLettersView
            letters={letters}
            onOpenLetter={handleOpenLetter}
            onCompose={() => {
              setComposerData(null)
              setActiveSection('Write a Letter')
            }}
          />
        )}

        {activeSection === 'Drafts' && (
          <DraftsView
            drafts={drafts}
            onEditDraft={handleEditDraft}
            onDeleteDraft={handleDeleteDraft}
            onNewLetter={() => {
              setComposerData(null)
              setActiveSection('Write a Letter')
            }}
          />
        )}

        {activeSection === 'Our Archive' && (
          <ArchiveView
            letters={letters}
            onOpenLetter={handleOpenLetter}
            onRestoreLetter={handleToggleArchive}
            onCompose={() => {
              setComposerData(null)
              setActiveSection('Write a Letter')
            }}
          />
        )}

        {activeSection === 'Settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={setSettings}
            onResetData={handleResetData}
            isAmbienceActive={isAmbienceActive}
            setIsAmbienceActive={setIsAmbienceActive}
          />
        )}
      </main>

      {/* Interactive Letter Reader Modal (Flippable Envelope, Seal, Slide-Out Paper, Folio) */}
      {readingLetter && (
        <LetterReaderModal
          letter={readingLetter}
          onClose={() => setReadingLetter(null)}
          onReply={handleReplyToLetter}
          onToggleArchive={handleToggleArchive}
          onToggleKeepsake={handleToggleKeepsake}
        />
      )}

      {/* 7-Stage Letter Sending Ritual Animation Modal */}
      {letterInTransit && (
        <LetterSendingAnimation
          letter={letterInTransit}
          onComplete={handleCompleteSend}
          onViewSent={() => {
            setLetterInTransit(null)
            setActiveSection('Sent Letters')
          }}
          onReturnDesk={() => {
            setLetterInTransit(null)
            setActiveSection('My Desk')
          }}
        />
      )}

      {/* Postal Bureau Registry & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  )
}

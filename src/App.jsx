import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { DeskDashboard } from './components/DeskDashboard'
import { LetterComposer } from './components/LetterComposer'
import { LetterSendingAnimation } from './components/LetterSendingAnimation'
import { LetterReaderModal } from './components/LetterReaderModal'
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
import './styles.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('My Desk')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAmbienceActive, setIsAmbienceActive] = useState(false)

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

  const [selectedWaxColor, setSelectedWaxColor] = useState(settings?.defaultSealColor || '#743D45')
  const [selectedNib, setSelectedNib] = useState(settings?.penNib || 'Brause Steno 361 Nib')

  const [readingLetter, setReadingLetter] = useState(null)
  const [composerData, setComposerData] = useState(null)
  const [letterInTransit, setLetterInTransit] = useState(null)

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

  const unreadCount = letters.filter(l => l.status === 'inbox' && l.unread).length
  const draftsCount = drafts.length
  const archiveCount = letters.filter(l => l.status === 'archive' || l.isKeepsake).length

  const handleOpenLetter = (letter) => {
    if (!letter) return
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

  const handleSendLetter = (letterData) => {
    setLetterInTransit(letterData)
  }

  const handleCompleteSend = () => {
    if (letterInTransit) {
      setLetters(prev => [letterInTransit, ...prev])
      if (composerData?.id) {
        setDrafts(prev => prev.filter(d => d.id !== composerData.id))
      }
      setComposerData(null)
    }
  }

  const handleResetData = () => {
    setLetters(INITIAL_LETTERS)
    setDrafts(INITIAL_DRAFTS)
    setSettings(INITIAL_SETTINGS)
    localStorage.removeItem('postmarked_letters')
    localStorage.removeItem('postmarked_drafts')
    localStorage.removeItem('postmarked_settings')
    alert('Restored original 1996 correspondence archive!')
  }

  return (
    <div className="app-container">
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

      <main className="main-viewport">
        <Header
          activeSection={activeSection}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={setActiveSection}
          lettersCount={letters.length}
          unreadCount={unreadCount}
          isAmbienceActive={isAmbienceActive}
          setIsAmbienceActive={setIsAmbienceActive}
        />

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

      {readingLetter && (
        <LetterReaderModal
          letter={readingLetter}
          onClose={() => setReadingLetter(null)}
          onReply={handleReplyToLetter}
          onToggleArchive={handleToggleArchive}
          onToggleKeepsake={handleToggleKeepsake}
        />
      )}

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
    </div>
  )
}

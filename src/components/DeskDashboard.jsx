import { Feather, ArrowRight, ExternalLink, Sparkles, RefreshCw } from 'lucide-react'
import { InteractiveBlotter } from './InteractiveBlotter'
import { WAX_COLORS } from '../data/initialLetters'

export function DeskDashboard({ 
  letters = [], 
  onNavigate, 
  onOpenLetter, 
  onOpenDraft,
  settings, 
  selectedWaxColor,
  setSelectedWaxColor,
  selectedNib,
  setSelectedNib
}) {
  const featured = letters.find(l => l.featuredOnDesk) || letters[0]
  const recentMissives = letters.slice(0, 3)
  const caddyLetters = letters.slice(1, 4)

  const userName = settings?.userName ? settings.userName.split(' ')[0] : 'Clara'
  const correspondentName = settings?.correspondentName ? settings.correspondentName.split(' ')[0] : 'Julian'

  return (
    <div className="desk-sanctum">
      <section className="sanctum-greeting">
        <div>
          <div className="greeting-kicker">
            <span>DESK BUREAU • SANCTUM</span>
            <span>~</span>
            <span>Warm bergamot tea</span>
          </div>
          <h1 className="sanctum-title">Good evening, {userName}</h1>
          <p className="sanctum-subtext">
            {correspondentName} sent a sealed folio 2 days ago from Edinburgh • Gentle rain upon the north casement window
          </p>
        </div>

        <div className="pinned-dispatch-note">
          <div className="brass-pin" />
          <div className="pinned-note-eyebrow">BUREAU DISPATCH NOTE</div>
          <p className="pinned-note-text">
            The post collector arrives at twilight.
          </p>
        </div>
      </section>

      <InteractiveBlotter 
        featuredLetter={featured}
        onOpenLetter={onOpenLetter}
        onOpenDraft={onOpenDraft}
        caddyLetters={caddyLetters}
        selectedWaxColor={selectedWaxColor}
        onSelectWaxColor={setSelectedWaxColor}
        selectedNib={selectedNib}
        onSelectNib={setSelectedNib}
      />

      <div className="sanctum-lower-grid">
        <section>
          <div className="correspondence-section-header">
            <h2 className="correspondence-title">
              <span>✉</span>
              <span>Recent Correspondence</span>
            </h2>
            <button 
              className="correspondence-link"
              onClick={() => onNavigate('Our Archive')}
            >
              <span>OPEN ARCHIVE</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="recent-missives-row">
            {recentMissives.map((missive, idx) => (
              <div 
                key={missive.id || idx}
                className="folded-missive-card"
                onClick={() => onOpenLetter(missive)}
                title={`Open folio from ${missive.sender}`}
              >
                {(missive.unread || idx === 0) && (
                  <div className="card-ribbon-bookmark" />
                )}

                <div>
                  <div className="missive-card-meta">
                    <span>
                      {missive.sender.includes('(You)') ? 'FROM CLARA (YOU)' : `FROM ${missive.sender.toUpperCase()}`}
                    </span>
                    <span>{missive.date ? missive.date.split(',')[0] : 'OCT 12'}</span>
                  </div>

                  <h3 className="missive-card-title">
                    {missive.subject}
                  </h3>

                  <p className="missive-card-excerpt">
                    "{missive.body.substring(0, 110)}..."
                  </p>
                </div>

                <div className="missive-card-footer">
                  <span>
                    {missive.postmark?.includes('EDINBURGH') ? 'Edinburgh Dispatch' : 
                     missive.deliveryStatus || 'Delivered & Read'}
                  </span>
                  <span>{missive.unread ? '✉ Unread' : 'Keepsake Drawer'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="stationery-drawer-box">
          <div className="drawer-header">
            <span className="drawer-title">
              <span>🗄</span>
              <span>Stationery Drawer</span>
            </span>
            <button 
              onClick={() => onNavigate('Write a Letter')}
              style={{ fontSize: '10px', color: 'var(--brown)', textDecoration: 'underline' }}
            >
              Open Cabinet
            </button>
          </div>

          <div className="wax-stock-section">
            <div className="wax-stock-title">
              <span>SEALING WAX STOCK</span>
              <span>3 Varieties</span>
            </div>

            <div className="wax-stick-palette">
              {WAX_COLORS.slice(0, 3).map((wax) => (
                <div 
                  key={wax.id}
                  className={`wax-stick-choice ${selectedWaxColor === wax.id ? 'selected' : ''}`}
                  onClick={() => setSelectedWaxColor(wax.id)}
                  title={`Select ${wax.name}`}
                >
                  <div 
                    className="wax-color-dot" 
                    style={{ background: wax.color }}
                  />
                  <div className="wax-choice-label">
                    <strong>{wax.name.split(' ')[0]}</strong>
                    <div style={{ fontSize: '8px', opacity: 0.8 }}>Sticks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pen-nib-section">
            <div className="wax-stock-title">
              <span>PEN NIB SELECTION</span>
              <span style={{ fontStyle: 'italic' }}>Flexible EF</span>
            </div>

            <div 
              className={`nib-choice-row ${selectedNib === 'Gillott 303 Nib' ? 'selected' : ''}`}
              onClick={() => setSelectedNib('Gillott 303 Nib')}
            >
              <div>
                <strong>Gillott 303 Nib</strong>
                <div style={{ fontSize: '9px', color: 'var(--brown)' }}>Extra Fine Calligraphy</div>
              </div>
              <span style={{ fontSize: '14px' }}>✒</span>
            </div>

            <div 
              className={`nib-choice-row ${selectedNib === 'Hunt 101 Imperial' ? 'selected' : ''}`}
              onClick={() => setSelectedNib('Hunt 101 Imperial')}
            >
              <div>
                <strong>Hunt 101 Imperial</strong>
                <div style={{ fontSize: '9px', color: 'var(--brown)' }}>High Flex Script</div>
              </div>
              <span style={{ fontSize: '14px' }}>✒</span>
            </div>
          </div>

          <button 
            className="ritual-action-btn"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            onClick={() => onNavigate('Write a Letter')}
          >
            <span>📜 Replenish Papers & Envelopes</span>
          </button>
        </aside>
      </div>

      <section className="prompt-call-banner">
        <div className="prompt-quote-group">
          <div className="prompt-icon-box">
            <Feather size={20} />
          </div>
          <div>
            <div style={{ fontSize: '9.5px', letterSpacing: '0.12em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: '2px' }}>
              YOUR PEN IS DIPPED
            </div>
            <p className="prompt-quote-text">
              "The rain has stopped in London. Would you write back before midnight?"
            </p>
          </div>
        </div>

        <button 
          className="unroll-vellum-btn"
          onClick={() => onNavigate('Write a Letter')}
        >
          <Feather size={15} />
          <span>Unroll Fresh Vellum</span>
        </button>
      </section>

      <footer className="vintage-desk-footer">
        <span>BUREAU OF PRIVATE CORRESPONDENCE & HAND PRESSED MAIL</span>
        <span>Stationery printed on 120gsm rag vellum</span>
        <span>MCMXCIV • VALENTIA POST</span>
      </footer>
    </div>
  )
}

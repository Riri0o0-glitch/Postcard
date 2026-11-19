import { useState } from 'react'
import { 
  Save, 
  Send, 
  Eye, 
  Share2, 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  Feather 
} from 'lucide-react'
import { 
  STATIONERY_OPTIONS, 
  FONT_OPTIONS, 
  INK_OPTIONS, 
  WAX_COLORS, 
  ATTACHMENT_OPTIONS 
} from '../data/initialLetters'
import { audioEngine } from '../utils/audio'

export function LetterComposer({ 
  initialData, 
  onSaveDraft, 
  onSendLetter, 
  onCancel,
  settings 
}) {
  const [recipient, setRecipient] = useState(initialData?.recipient || settings?.correspondentName || 'Julian Vance')
  const [recipientEmail, setRecipientEmail] = useState(initialData?.recipientEmail || '')
  const [recipientAddress, setRecipientAddress] = useState(
    initialData?.recipientAddress || settings?.correspondentAddress || 'No. 12 St Stephen Street, Stockbridge, Edinburgh'
  )
  const [subject, setSubject] = useState(initialData?.subject || '')
  const [body, setBody] = useState(initialData?.body || '')
  const [signature, setSignature] = useState(initialData?.signature || settings?.userName ? settings.userName.split(' ')[0] : 'Clara')
  
  const [stationery, setStationery] = useState(initialData?.stationery || settings?.defaultStationery || 'Classic aged parchment')
  const [font, setFont] = useState(initialData?.font || settings?.defaultFont || 'Caveat')
  const [inkColor, setInkColor] = useState(initialData?.inkColor || settings?.defaultInkColor || '#302820')
  const [sealColor, setSealColor] = useState(initialData?.sealColor || settings?.defaultSealColor || '#743D45')
  const [selectedAttachment, setSelectedAttachment] = useState(initialData?.attachment?.type || null)
  
  const [toastMessage, setToastMessage] = useState('')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const selectedStationeryObj = STATIONERY_OPTIONS.find(s => s.id === stationery) || STATIONERY_OPTIONS[0]
  const selectedFontObj = FONT_OPTIONS.find(f => f.id === font) || FONT_OPTIONS[0]

  const handleBodyChange = (e) => {
    setBody(e.target.value)
    if (Math.random() > 0.4) {
      audioEngine.playPenScratch()
    }
  }

  const handleSaveDraft = () => {
    const draftData = {
      id: initialData?.id || `draft-${Date.now()}`,
      recipient,
      recipientEmail,
      recipientAddress,
      subject: subject || 'Untitled missive',
      body,
      signature,
      stationery,
      font,
      inkColor,
      sealColor,
      sealEmblem: settings?.defaultSealEmblem || 'C',
      attachment: selectedAttachment ? ATTACHMENT_OPTIONS.find(a => a.id === selectedAttachment) : null,
      date: 'October 14, 1996',
      updatedAt: 'Just now'
    }

    onSaveDraft(draftData)
    audioEngine.playPaperSlide()
    setToastMessage('Draft preserved in your desk drawer.')
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleTriggerSend = () => {
    if (!body.trim()) {
      alert('Your vellum sheet is still blank. Pour some words onto the page before sealing.')
      return
    }

    const letterData = {
      id: `missive-sent-${Date.now()}`,
      sender: `${settings?.userName || 'Clara Linnea Hastings'} (You)`,
      senderAddress: settings?.userAddress || 'The Studio Attic, 44 Canal Basin, Camden, London',
      recipient: recipient || 'Julian Vance',
      recipientEmail: recipientEmail.trim(),
      recipientAddress: recipientAddress || 'Stockbridge, Edinburgh',
      subject: subject || 'Letter from Camden',
      body,
      signature,
      stationery,
      font,
      inkColor,
      sealColor,
      sealEmblem: settings?.defaultSealEmblem || 'C',
      attachment: selectedAttachment ? ATTACHMENT_OPTIONS.find(a => a.id === selectedAttachment) : null,
      date: 'October 14, 1996',
      postmark: 'LONDON CAMDEN POST • 14 OCT 1996 • VALENTIA 24',
      status: 'sent',
      deliveryStatus: recipientEmail ? `Dispatched to ${recipientEmail}` : 'In Transit across the distance',
      unread: false,
      isKeepsake: false
    }

    onSendLetter(letterData)
  }

  const handleCopyShareLink = () => {
    const payload = {
      sender: settings?.userName || 'A Secret Correspondent',
      senderAddress: settings?.userAddress || 'London',
      recipient: recipient || 'You',
      subject: subject || 'A Missive from Postmarked',
      body: body || 'Some feelings deserve a letter.',
      sealColor,
      stationery
    }
    const encoded = encodeURIComponent(JSON.stringify(payload))
    const shareUrl = `${window.location.origin}${window.location.pathname}?letter=${encoded}`

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }).catch(() => {
      prompt('Copy this shareable letter link for your correspondent:', shareUrl)
    })
  }

  const handleSendViaEmailClient = () => {
    const mailtoSubject = encodeURIComponent(subject || 'A letter for you from Postmarked')
    const mailtoBody = encodeURIComponent(
      `Dearest ${recipient},\n\nI have penned a letter for you on Postmarked:\n\n"${body}"\n\n— ${signature}\n\n(Sent via Postmarked: Some feelings deserve a letter.)`
    )
    window.open(`mailto:${recipientEmail || ''}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank')
  }

  return (
    <div className="composer-view-wrap">
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '64px',
          right: '32px',
          background: '#231A14',
          color: 'var(--gold)',
          border: '1px solid var(--gold)',
          padding: '10px 18px',
          borderRadius: '3px',
          fontSize: '12px',
          zIndex: 99,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          fontFamily: 'Cormorant Garamond, serif',
          letterSpacing: '0.05em'
        }}>
          ✦ {toastMessage}
        </div>
      )}

      <div className="composer-toolbar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="toolbar-group">
            <span className="toolbar-label">📜 Paper:</span>
            <select 
              className="toolbar-select"
              value={stationery} 
              onChange={(e) => {
                setStationery(e.target.value)
                audioEngine.playPaperSlide()
              }}
            >
              {STATIONERY_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <span className="toolbar-label">✒ Script:</span>
            <select 
              className="toolbar-select"
              value={font} 
              onChange={(e) => setFont(e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <span className="toolbar-label">🖋 Ink:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {INK_OPTIONS.map((ink) => (
                <button
                  key={ink.id}
                  onClick={() => setInkColor(ink.id)}
                  title={ink.name}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: ink.color,
                    border: inkColor === ink.id ? '2px solid #FFF' : '1px solid #AAA',
                    boxShadow: inkColor === ink.id ? '0 0 0 1.5px var(--burgundy)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="toolbar-group">
            <span className="toolbar-label">🕯 Seal:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {WAX_COLORS.map((wax) => (
                <button
                  key={wax.id}
                  onClick={() => setSealColor(wax.id)}
                  title={wax.name}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: wax.color,
                    border: sealColor === wax.id ? '2px solid #FFF' : '1px solid #888',
                    boxShadow: sealColor === wax.id ? '0 0 0 1.5px var(--gold)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">🌿 Enclosure:</span>
          <select 
            className="toolbar-select"
            value={selectedAttachment || ''} 
            onChange={(e) => setSelectedAttachment(e.target.value || null)}
          >
            <option value="">None (Plain)</option>
            {ATTACHMENT_OPTIONS.map((att) => (
              <option key={att.id} value={att.id}>{att.icon} {att.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div 
        className={`composer-sheet ${selectedStationeryObj.bgClass}`}
        style={{
          fontFamily: selectedFontObj.family,
          color: inkColor
        }}
      >
        <div className="composer-header-row">
          <div>
            <span className="to-the-hand-of">LOCATION & STUDIO:</span>
            <div style={{ fontSize: '13px', fontFamily: 'Lora, serif', color: 'var(--coffee)', marginTop: '2px' }}>
              {settings?.userAddress || 'The Studio Attic, 44 Canal Basin, Camden, London'}
            </div>
          </div>

          <div className="composer-date">
            Wednesday, October 14, 1996 • 10:45 PM
          </div>
        </div>

        <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <div className="to-the-hand-of">RECIPIENT NAME:</div>
            <input
              type="text"
              className="composer-field-input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Julian Vance"
              style={{ 
                fontWeight: 600, 
                fontSize: '20px',
                fontFamily: font === 'Caveat' ? "'Caveat', cursive" : 'inherit',
                color: inkColor 
              }}
            />
          </div>

          <div>
            <div className="to-the-hand-of">DESTINATION EMAIL (OPTIONAL FOR DIRECT MAIL):</div>
            <input
              type="email"
              className="composer-field-input"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g. friend@somewhere.com"
              style={{ fontSize: '14px', fontFamily: 'Lora, serif', color: 'var(--brown)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div className="to-the-hand-of">MISSIVE TITLE / SUBJECT:</div>
          <input
            type="text"
            className="composer-field-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject: The smell of autumn rain upon the canal..."
            style={{ 
              fontFamily: 'Cormorant Garamond, serif', 
              fontSize: '22px', 
              fontStyle: 'italic',
              color: inkColor 
            }}
          />
        </div>

        <textarea
          className="composer-textarea"
          value={body}
          onChange={handleBodyChange}
          placeholder="Dearest Julian,&#10;&#10;The water in the canal is black tonight under the gas lamps..."
          style={{
            fontFamily: selectedFontObj.family,
            color: inkColor,
            fontSize: font === 'Caveat' ? '24px' : '18px'
          }}
        />

        {selectedAttachment && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.65)',
            border: '1px dashed #B89E84',
            borderRadius: '3px',
            margin: '20px 0',
            fontFamily: 'Lora, serif',
            fontSize: '11px',
            color: 'var(--coffee)',
            transform: 'rotate(-1deg)'
          }}>
            <span style={{ fontSize: '18px' }}>
              {ATTACHMENT_OPTIONS.find(a => a.id === selectedAttachment)?.icon}
            </span>
            <div>
              <strong>Enclosed:</strong> {ATTACHMENT_OPTIONS.find(a => a.id === selectedAttachment)?.name}
            </div>
          </div>
        )}

        <div className="composer-signature-box">
          <span className="to-the-hand-of">YOUR HAND / SIGNATURE:</span>
          <input
            type="text"
            className="composer-signature-input"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="— Clara"
            style={{ color: inkColor }}
          />
        </div>
      </div>

      <div className="composer-actions-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="ritual-action-btn"
            onClick={onCancel}
          >
            <span>Discard</span>
          </button>

          <button 
            className="ritual-action-btn"
            onClick={handleSaveDraft}
          >
            <Save size={13} />
            <span>Save Draft</span>
          </button>

          <button 
            className="ritual-action-btn"
            onClick={handleCopyShareLink}
            title="Generate a direct link to this letter so anyone can open and read it"
          >
            {copiedLink ? <Check size={13} color="green" /> : <Share2 size={13} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Letter Link'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {recipientEmail && (
            <button 
              className="ritual-action-btn"
              onClick={handleSendViaEmailClient}
              title="Open your email client with this letter pre-filled"
            >
              <Mail size={13} />
              <span>Send via Email</span>
            </button>
          )}

          <button 
            className="ritual-action-btn"
            onClick={() => setShowPreviewModal(true)}
          >
            <Eye size={13} />
            <span>Preview Envelope</span>
          </button>

          <button 
            className="ritual-action-btn ritual-primary-btn"
            onClick={handleTriggerSend}
            style={{ padding: '10px 22px', fontSize: '13px' }}
          >
            <Send size={14} />
            <span>Seal & Send Letter</span>
          </button>
        </div>
      </div>

      {showPreviewModal && (
        <div className="sending-modal-backdrop" onClick={() => setShowPreviewModal(false)}>
          <div 
            className="sending-ceremony-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <h3 className="ceremony-stage-title">Folded Missive Preview</h3>
            <p className="ceremony-stage-caption">
              How your envelope will arrive at {recipient}'s doorstep.
            </p>

            <div style={{
              background: '#FFFDF9',
              border: '1px solid #D5C2AB',
              borderRadius: '4px',
              padding: '24px',
              position: 'relative',
              textAlign: 'left',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="par-avion-label">PAR AVION</span>
                <div className="postage-stamp-widget" style={{ transform: 'none' }}>
                  <div className="stamp-inner-border">
                    <span className="stamp-legend">SCOTIA</span>
                    <span className="stamp-value">24</span>
                    <span className="stamp-legend">AIR MAIL</span>
                  </div>
                </div>
              </div>

              <div style={{ margin: '24px 0 16px 20px' }}>
                <div className="to-the-hand-of">DELIVER TO:</div>
                <div className="recipient-calligraphy-name" style={{ fontSize: '22px' }}>
                  {recipient || 'Julian Vance'}
                </div>
                <div className="recipient-calligraphy-address" style={{ fontSize: '15px' }}>
                  {recipientAddress || 'Stockbridge, Edinburgh'}
                </div>
              </div>

              <div style={{ 
                marginTop: '16px', 
                paddingTop: '10px', 
                borderTop: '1px dashed #D6C2AB',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--brown)'
              }}>
                <span>From: {settings?.userName || 'Clara Linnea Hastings'}</span>
                <span>Sealed with {WAX_COLORS.find(w => w.id === sealColor)?.name}</span>
              </div>
            </div>

            <button 
              className="ritual-action-btn ritual-primary-btn"
              onClick={() => setShowPreviewModal(false)}
              style={{ marginTop: '20px' }}
            >
              <span>Return to Writing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

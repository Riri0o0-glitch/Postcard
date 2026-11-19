import { useState } from 'react'
import { FileText, Trash2, Edit3, Clock, Feather } from 'lucide-react'
import { audioEngine } from '../utils/audio'

export function DraftsView({ drafts = [], onEditDraft, onDeleteDraft, onNewLetter }) {
  return (
    <div className="desk-sanctum">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="greeting-kicker">
            <span>UNFINISHED VELLUM</span>
            <span>~</span>
            <span>DRAWER OF DRAFTS</span>
          </div>
          <h1 className="sanctum-title">Saved Drafts</h1>
          <p className="sanctum-subtext">
            Pages begun in ink, awaiting your return to complete and seal.
          </p>
        </div>

        <button 
          className="sidebar-write-btn" 
          onClick={onNewLetter}
          style={{ margin: 0 }}
        >
          <Feather size={15} />
          <span>Write a Letter</span>
        </button>
      </div>

      {drafts.length === 0 ? (
        <div style={{
          background: '#FFFDF9',
          border: '1px dashed #D6C4AD',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>✎</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', margin: '0 0 6px' }}>
            No unfinished drafts in your drawer
          </h3>
          <p style={{ color: 'var(--brown)', fontSize: '13px', margin: 0 }}>
            Every word you started has been sealed and dispatched.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {drafts.map((draft) => (
            <div
              key={draft.id}
              style={{
                background: '#FAF6EE',
                border: '1px solid #D5C2AB',
                borderRadius: '4px',
                padding: '22px',
                position: 'relative',
                boxShadow: '0 6px 16px rgba(48,40,32,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--brown)', textTransform: 'uppercase' }}>
                    DRAFT TO: {draft.recipient?.toUpperCase() || 'UNTITLED'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#9E8876', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />
                    <span>{draft.updatedAt || 'Recently'}</span>
                  </span>
                </div>

                <h3 style={{
                  margin: '0 0 10px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '22px',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--ink)'
                }}>
                  {draft.subject || 'Untitled Folio'}
                </h3>

                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: 'var(--coffee)',
                  lineHeight: 1.5,
                  fontFamily: draft.font === 'Caveat' ? 'Caveat, cursive' : 'Lora, serif',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {draft.body || '(Empty sheet of vellum)'}
                </p>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '12px',
                borderTop: '1px dashed #E2D4C3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  className="ritual-action-btn"
                  onClick={() => {
                    if (confirm('Discard this draft forever?')) {
                      onDeleteDraft(draft.id)
                    }
                  }}
                  style={{ color: '#8A5555', borderColor: '#D9C5B8' }}
                  title="Discard draft"
                >
                  <Trash2 size={13} />
                  <span>Discard</span>
                </button>

                <button
                  className="ritual-action-btn ritual-primary-btn"
                  onClick={() => onEditDraft(draft)}
                  style={{ padding: '6px 14px' }}
                >
                  <Edit3 size={13} />
                  <span>Resume Writing</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

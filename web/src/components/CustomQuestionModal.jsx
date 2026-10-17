import React, { useState } from 'react';
import { Sparkles, X, Send, Heart, Flame } from 'lucide-react';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function CustomQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  partnerName = 'Partner'
}) {
  const [questionText, setQuestionText] = useState('');

  if (!isOpen) return null;

  const quickIdeas = [
    "What was the exact moment you felt closest to me?",
    "What is a dream you haven't shared with anyone else?",
    "What is something small I do that makes your day better?",
    "If we had tomorrow completely free, how would you spend it with me?"
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!questionText.trim()) return;
    playChimeSound();
    onSubmit(questionText.trim());
    setQuestionText('');
    onClose();
  };

  const handlePickIdea = (idea) => {
    playClickSound();
    setQuestionText(idea);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 99999,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="modal-content soft-card" style={{
        maxWidth: 'min(94vw, 460px)',
        width: '100%',
        padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 24px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Close button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
          title="Close"
        >
          <X size={17} strokeWidth={2.4} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', paddingRight: '24px', paddingLeft: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(198, 136, 44, 0.15)',
            border: '1px solid rgba(198, 136, 44, 0.35)',
            color: '#C6882C',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <Sparkles size={12} strokeWidth={2.4} />
            <span>Surprise Card</span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-ink)',
            lineHeight: 1.25,
            marginBottom: '6px'
          }}>
            Ask a Secret Question
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.4 }}>
            This card will be wax-sealed into your deck for {partnerName} to encounter next.
          </p>
        </div>

        {/* Text Input */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your secret question here..."
            rows={4}
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-hairline)',
              background: 'var(--color-surface)',
              fontFamily: 'var(--font-serif)',
              fontSize: '16px',
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
          />

          {/* Quick Ideas */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--color-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              Or pick an intimate prompt:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {quickIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickIdea(idea)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-hairline)',
                    background: 'var(--color-surface-subtle)',
                    fontSize: '12px',
                    color: 'var(--color-body)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-ember)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-hairline)';
                  }}
                >
                  “{idea}”
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!questionText.trim()}
            className="btn-primary"
            style={{
              marginTop: '6px',
              opacity: questionText.trim() ? 1 : 0.45,
              cursor: questionText.trim() ? 'pointer' : 'not-allowed',
              gap: '8px'
            }}
          >
            <Send size={16} strokeWidth={2.4} />
            <span>Seal & Slip into Deck</span>
          </button>
        </form>
      </div>
    </div>
  );
}

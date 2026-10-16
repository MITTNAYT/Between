import React, { useState } from 'react';
import { WILDCARD_INSPIRATIONS } from '../utils/engine';
import { playClickSound } from '../utils/audio';

export default function QuestionCard({
  question,
  turnIndicator,
  relationshipType = 'COUPLE',
  onPassTurn,
  isBookmarked = false,
  onToggleBookmark
}) {
  const [hintExpanded, setHintExpanded] = useState(false);
  const [selectedWildcardPrompt, setSelectedWildcardPrompt] = useState(null);
  const [wildcardOffset, setWildcardOffset] = useState(0);

  const isWildcard = question?.isWildcard || question?.id?.startsWith('wildcard');
  const allPrompts = WILDCARD_INSPIRATIONS[relationshipType] || WILDCARD_INSPIRATIONS.COUPLE;

  const currentVisiblePrompts = [
    allPrompts[wildcardOffset % allPrompts.length],
    allPrompts[(wildcardOffset + 1) % allPrompts.length],
    allPrompts[(wildcardOffset + 2) % allPrompts.length]
  ];

  const handleShuffleWildcard = () => {
    playClickSound();
    setWildcardOffset(prev => (prev + 3) % allPrompts.length);
  };

  const handleSelectPrompt = (prompt) => {
    playClickSound();
    setSelectedWildcardPrompt(prev => prev === prompt ? null : prompt);
  };

  return (
    <div className={`soft-card ${isWildcard ? 'wildcard-card' : ''}`} style={{
      width: '100%',
      padding: '28px 24px',
      position: 'relative',
      minHeight: '340px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      {/* Top Header Row: Turn indicator + Bookmark */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        {/* Turn Pill (Clickable to switch turn) */}
        <button
          onClick={() => {
            playClickSound();
            onPassTurn?.();
          }}
          className={`pill-badge ${isWildcard ? 'pill-badge-ember' : 'pill-badge-surface'}`}
          style={{
            cursor: 'pointer',
            transition: 'transform 0.15s',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Click to pass turn to your friend"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
          <span>{turnIndicator}</span>
        </button>

        {/* Bookmark Moment Star */}
        <button
          onClick={() => {
            playClickSound();
            onToggleBookmark?.();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: isBookmarked ? 'var(--color-ember)' : 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          title={isBookmarked ? "Moment saved" : "Save this moment"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>

      {/* Wildcard Badge if applicable */}
      {isWildcard && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(217, 78, 52, 0.1)',
          color: 'var(--color-ember)',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          <span>✨</span>
          <span>WILDCARD · ASK ANYTHING</span>
        </div>
      )}

      {/* Main Question Text */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '8px 0' }}>
        <h2 className="question-serif">
          {isWildcard 
            ? (selectedWildcardPrompt ? `“${selectedWildcardPrompt}”` : question.text)
            : question.text
          }
        </h2>
      </div>

      {/* Hint Drawer for normal questions */}
      {!isWildcard && question.hint && (
        <div style={{ width: '100%', marginTop: '16px' }}>
          {!hintExpanded ? (
            <button
              onClick={() => {
                playClickSound();
                setHintExpanded(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-muted)',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                transition: 'background-color 0.2s'
              }}
            >
              <span>💡</span>
              <span>Need a starting point?</span>
            </button>
          ) : (
            <div style={{
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--color-body)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span>{question.hint}</span>
              <button
                onClick={() => setHintExpanded(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Wildcard Inspiration Cards & Shuffle */}
      {isWildcard && (
        <div style={{ width: '100%', marginTop: '18px', textAlign: 'left' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
              NEED INSPIRATION?
            </span>
            <button
              onClick={handleShuffleWildcard}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-ember)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🔄</span>
              <span>Shuffle ideas</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentVisiblePrompts.map((promptText, idx) => {
              const isSelected = selectedWildcardPrompt === promptText;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectPrompt(promptText)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(217, 78, 52, 0.08)' : 'var(--color-canvas)',
                    border: `1px solid ${isSelected ? 'var(--color-ember)' : 'var(--color-hairline)'}`,
                    fontSize: '13px',
                    color: isSelected ? 'var(--color-ink)' : 'var(--color-body)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: isSelected ? '600' : '400'
                  }}
                >
                  <span>“{promptText}”</span>
                  {isSelected && <span style={{ color: 'var(--color-ember)', fontSize: '14px' }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

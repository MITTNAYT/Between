import React, { useState } from 'react';
import { ArrowRightLeft, Bookmark, Sparkles, Shuffle, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import InteractiveCard3D from './InteractiveCard3D';
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
    <InteractiveCard3D isWildcard={isWildcard} className="question-card-inner">
      <div style={{
        padding: '32px 28px',
        minHeight: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Top Header Row: Turn indicator pill + Bookmark button */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          {/* Turn Switcher Pill */}
          <button
            onClick={() => {
              playClickSound();
              onPassTurn?.();
            }}
            className={`pill-badge ${isWildcard ? 'pill-badge-ember' : 'pill-badge-surface'}`}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.15s, background-color 0.2s',
              boxShadow: 'var(--shadow-sm)',
              gap: '6px'
            }}
            title="Click to pass turn to your friend"
          >
            <ArrowRightLeft size={13} strokeWidth={2.4} />
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
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title={isBookmarked ? 'Moment saved' : 'Save this moment'}
          >
            <Bookmark
              size={20}
              strokeWidth={2.2}
              fill={isBookmarked ? 'currentColor' : 'none'}
              color={isBookmarked ? 'var(--color-ember)' : 'var(--color-muted)'}
            />
          </button>
        </div>

        {/* Wildcard Badge if applicable */}
        {isWildcard && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(217, 78, 52, 0.1)',
            border: '1px solid rgba(217, 78, 52, 0.25)',
            color: 'var(--color-ember)',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <Sparkles size={13} strokeWidth={2.5} />
            <span>WILDCARD · ASK ANYTHING</span>
          </div>
        )}

        {/* Main Question Text with Editorial Serif */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '12px 0'
        }}>
          <h2 className="question-serif">
            {isWildcard 
              ? (selectedWildcardPrompt ? `“${selectedWildcardPrompt}”` : question.text)
              : question.text
            }
          </h2>
        </div>

        {/* Hint Drawer for standard questions */}
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
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'color 0.2s, background-color 0.2s'
                }}
              >
                <span>Gentle guidance</span>
                <ChevronDown size={14} strokeWidth={2.4} />
              </button>
            ) : (
              <div style={{
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                textAlign: 'left',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-ember)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Reflection Prompt
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      setHintExpanded(false);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '2px' }}
                  >
                    <ChevronUp size={14} strokeWidth={2.4} />
                  </button>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-body)', lineHeight: '1.5' }}>
                  {question.hint}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wildcard Inspiration Cards & Shuffle */}
        {isWildcard && (
          <div style={{ width: '100%', marginTop: '18px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Or pick an inspiration:
              </span>
              <button
                onClick={handleShuffleWildcard}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-ember)',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Shuffle size={13} strokeWidth={2.4} />
                <span>Shuffle</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentVisiblePrompts.map((promptText, idx) => {
                const isSelected = selectedWildcardPrompt === promptText;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(promptText)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '1.5px solid var(--color-ember)' : '1px solid var(--color-hairline)',
                      background: isSelected ? 'rgba(217, 78, 52, 0.05)' : 'var(--color-surface-subtle)',
                      color: isSelected ? 'var(--color-ember)' : 'var(--color-ink)',
                      fontSize: '13px',
                      textAlign: 'left',
                      lineHeight: '1.4',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    “{promptText}”
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </InteractiveCard3D>
  );
}

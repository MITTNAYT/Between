import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Bookmark, Sparkles, Shuffle, ChevronDown, ChevronUp, RotateCw, Eye, EyeOff, Send, Check } from 'lucide-react';
import InteractiveCard3D from './InteractiveCard3D';
import { WILDCARD_INSPIRATIONS } from '../utils/engine';
import { playClickSound, playChimeSound, playHandshakeSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export default function QuestionCard({
  question,
  turnIndicator,
  relationshipType = 'COUPLE',
  onPassTurn,
  isBookmarked = false,
  onToggleBookmark,
  swipeClass = '',
  onSwipeLeft,
  onSwipeRight,
  blindState = { myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false },
  onUpdateBlindAnswer,
  onSubmitBlindAnswer,
  myName = 'You',
  peerName = 'Partner',
  isSolo = false,
  hostName = 'Partner 1',
  guestName = 'Partner 2',
  wildcardPrompt = null,
  onSelectWildcardPrompt = null,
  onSkipQuestion = null,
  isPartnerSpeaking = false
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [backTab, setBackTab] = useState('BLIND'); // 'BLIND' | 'NOTES'
  const [hintExpanded, setHintExpanded] = useState(false);
  const [selectedWildcardPrompt, setSelectedWildcardPrompt] = useState(wildcardPrompt || null);
  const [customWildcardInput, setCustomWildcardInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const isWildcard = question?.isWildcard || question?.id?.startsWith('wildcard');
  const isMystery = question?.isMystery || question?.category === 'MYSTERY';
  const allPrompts = WILDCARD_INSPIRATIONS[relationshipType] || WILDCARD_INSPIRATIONS.COUPLE;

  const [wildcardOffset, setWildcardOffset] = useState(() => Math.floor(Math.random() * (allPrompts.length || 6)));
  const [noteText, setNoteText] = useState('');

  // Keep in sync if peer selected a wildcard prompt
  useEffect(() => {
    if (wildcardPrompt) {
      setSelectedWildcardPrompt(wildcardPrompt);
    }
  }, [wildcardPrompt]);

  const currentVisiblePrompts = [
    allPrompts[wildcardOffset % allPrompts.length],
    allPrompts[(wildcardOffset + 1) % allPrompts.length],
    allPrompts[(wildcardOffset + 2) % allPrompts.length]
  ];

  const handleShuffleWildcard = () => {
    playClickSound();
    setWildcardOffset(Math.floor(Math.random() * allPrompts.length));
  };

  const handleSelectPrompt = (prompt) => {
    playChimeSound();
    setSelectedWildcardPrompt(prompt);
    onSelectWildcardPrompt?.(prompt);
  };

  const handleApplyCustomWildcard = () => {
    if (!customWildcardInput.trim()) return;
    playChimeSound();
    const custom = customWildcardInput.trim();
    setSelectedWildcardPrompt(custom);
    onSelectWildcardPrompt?.(custom);
    setShowCustomInput(false);
  };

  const toggleFlip = () => {
    playClickSound();
    triggerHaptic('light');
    setIsFlipped(prev => !prev);
  };

  const activeQuestionText = isWildcard
    ? (wildcardPrompt || selectedWildcardPrompt || question.text)
    : question.text;

  const isBothRevealed = blindState.mySubmitted && blindState.peerSubmitted;

  // FRONT CONTENT
  const frontContent = (
    <div style={{
      padding: 'clamp(20px, 4.5vw, 30px) clamp(16px, 4vw, 26px)',
      minHeight: 'clamp(300px, 46vh, 400px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      {/* Top Header Row */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {/* Turn Switcher Pill with Live Speaking Glow */}
        <button
          onClick={() => {
            playClickSound();
            triggerHaptic('light');
            onPassTurn?.();
          }}
          className={`pill-badge ${isWildcard ? 'pill-badge-ember' : 'pill-badge-surface'}`}
          style={{
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isPartnerSpeaking ? '0 0 16px rgba(56, 123, 106, 0.55)' : 'var(--shadow-sm)',
            borderColor: isPartnerSpeaking ? '#387B6A' : undefined,
            gap: '6px'
          }}
          title={isPartnerSpeaking ? `${peerName} is currently speaking` : "Click to pass turn to your partner"}
        >
          <ArrowRightLeft size={13} strokeWidth={2.4} />
          <span>{turnIndicator}</span>
          {isPartnerSpeaking && (
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#387B6A',
              boxShadow: '0 0 8px #387B6A',
              display: 'inline-block'
            }} />
          )}
        </button>

        {/* Right Corner Buttons: Flip & Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={toggleFlip}
            className="pill-badge pill-badge-surface"
            style={{ cursor: 'pointer', gap: '4px', fontSize: '11px', padding: '5px 10px' }}
            title="Flip card for Notes & Blind Reveal"
          >
            <RotateCw size={12} strokeWidth={2.4} />
            <span>Flip</span>
          </button>

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
              size={19}
              strokeWidth={2.2}
              fill={isBookmarked ? 'currentColor' : 'none'}
              color={isBookmarked ? 'var(--color-ember)' : 'var(--color-muted)'}
            />
          </button>
        </div>
      </div>

      {/* Wildcard Badge */}
      {isWildcard && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
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

      {/* Mystery / Secret Question Badge */}
      {isMystery && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(198, 136, 44, 0.15)',
          border: '1px solid rgba(198, 136, 44, 0.35)',
          color: '#C6882C',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          <Sparkles size={13} strokeWidth={2.5} />
          <span>SECRET QUESTION FROM {question.author ? question.author.toUpperCase() : 'PARTNER'}</span>
        </div>
      )}

      {/* Main Question Text */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '10px 0'
      }}>
        <h2 className="question-serif">
          {isWildcard
            ? (activeQuestionText ? `“${activeQuestionText}”` : question.text)
            : question.text
          }
        </h2>
      </div>

      {/* Hint Drawer */}
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
                transition: 'color 0.2s'
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

      {/* Wildcard: Interactive Random Chooser */}
      {isWildcard && (
        <div style={{ width: '100%', marginTop: '18px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-ember)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Choose a question to ask:
            </span>
            <button
              onClick={handleShuffleWildcard}
              className="btn-secondary"
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                gap: '4px',
                borderColor: 'var(--color-hairline)'
              }}
              title="Roll 3 new random questions"
            >
              <Shuffle size={12} strokeWidth={2.4} color="var(--color-ember)" />
              <span>Roll 3 More</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentVisiblePrompts.map((promptText, idx) => {
              const isSelected = (selectedWildcardPrompt === promptText) || (wildcardPrompt === promptText);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(promptText)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--color-ember)' : '1px solid var(--color-hairline)',
                    background: isSelected ? 'rgba(217, 78, 52, 0.08)' : 'var(--color-surface-subtle)',
                    color: isSelected ? 'var(--color-ember)' : 'var(--color-ink)',
                    fontSize: '13px',
                    textAlign: 'left',
                    lineHeight: '1.4',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <span>“{promptText}”</span>
                  {isSelected && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      background: 'var(--color-ember)',
                      color: '#FFF',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      whiteSpace: 'nowrap'
                    }}>
                      Chosen
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Option to type custom question */}
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {!showCustomInput ? (
              <button
                onClick={() => {
                  playClickSound();
                  setShowCustomInput(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Or write your own custom question...
              </button>
            ) : (
              <div style={{
                display: 'flex',
                gap: '6px',
                marginTop: '6px',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <input
                  type="text"
                  value={customWildcardInput}
                  onChange={(e) => setCustomWildcardInput(e.target.value)}
                  placeholder="Type any question you want to ask..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-hairline)',
                    background: 'var(--color-surface-subtle)',
                    outline: 'none',
                    color: 'var(--color-ink)'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyCustomWildcard();
                  }}
                />
                <button
                  onClick={handleApplyCustomWildcard}
                  disabled={!customWildcardInput.trim()}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  Ask
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // BACK CONTENT (3D Flipped Side: Blind Reveal & Notes)
  const backContent = (
    <div style={{
      padding: 'clamp(20px, 4.5vw, 28px) clamp(16px, 4vw, 24px)',
      minHeight: 'clamp(300px, 46vh, 400px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      textAlign: 'left'
    }}>
      {/* Back Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {/* Sub Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface-subtle)', padding: '3px', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => { playClickSound(); setBackTab('BLIND'); }}
            style={{
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: backTab === 'BLIND' ? '700' : '500',
              background: backTab === 'BLIND' ? 'var(--color-surface)' : 'transparent',
              color: backTab === 'BLIND' ? 'var(--color-ink)' : 'var(--color-muted)',
              cursor: 'pointer'
            }}
          >
            Blind Reveal
          </button>
          <button
            onClick={() => { playClickSound(); setBackTab('NOTES'); }}
            style={{
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: backTab === 'NOTES' ? '700' : '500',
              background: backTab === 'NOTES' ? 'var(--color-surface)' : 'transparent',
              color: backTab === 'NOTES' ? 'var(--color-ink)' : 'var(--color-muted)',
              cursor: 'pointer'
            }}
          >
            Scratchpad
          </button>
        </div>

        <button
          onClick={toggleFlip}
          className="pill-badge pill-badge-surface"
          style={{ cursor: 'pointer', gap: '4px', fontSize: '11px', padding: '5px 10px' }}
        >
          <RotateCw size={12} strokeWidth={2.4} />
          <span>Flip to Front</span>
        </button>
      </div>

      {/* TAB 1: BLIND REVEAL */}
      {backTab === 'BLIND' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-ember)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Double Blind Reveal
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '2px' }}>
              Both write your honest answer in secret. Neither sees until both press submit!
            </p>
          </div>

          {!isBothRevealed ? (
            <>
              <textarea
                rows={3}
                value={blindState.myAnswer}
                onChange={(e) => onUpdateBlindAnswer?.(e.target.value)}
                disabled={blindState.mySubmitted}
                placeholder="Type your private answer here..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-hairline)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                  {blindState.peerSubmitted ? (
                    <span style={{ color: 'var(--color-sage)', fontWeight: '600' }}>✓ {peerName} has written!</span>
                  ) : (
                    <span>Waiting for {peerName} to write...</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    playHandshakeSound();
                    triggerHaptic('success');
                    onSubmitBlindAnswer?.();
                  }}
                  disabled={!blindState.myAnswer.trim() || blindState.mySubmitted}
                  className="btn-primary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    width: 'auto',
                    minHeight: '38px',
                    opacity: blindState.myAnswer.trim() && !blindState.mySubmitted ? 1 : 0.6
                  }}
                >
                  <Send size={13} strokeWidth={2.4} />
                  <span>{blindState.mySubmitted ? 'Submitted!' : 'Submit Answer'}</span>
                </button>
              </div>
            </>
          ) : (
            // Both have submitted: Simultaneous Reveal!
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(217, 78, 52, 0.08)',
                border: '1px solid rgba(217, 78, 52, 0.25)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-ember)', textTransform: 'uppercase' }}>
                  {isSolo ? `${hostName}'s Answer` : `${myName}'s Answer`}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-ink)', marginTop: '4px', fontStyle: 'italic' }}>
                  “{blindState.myAnswer}”
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 123, 106, 0.08)',
                border: '1px solid rgba(56, 123, 106, 0.25)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-sage)', textTransform: 'uppercase' }}>
                  {isSolo ? `${guestName}'s Answer` : `${peerName}'s Answer`}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-ink)', marginTop: '4px', fontStyle: 'italic' }}>
                  “{blindState.peerAnswer || 'Both answers unlocked!'}”
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCRATCHPAD */}
      {backTab === 'NOTES' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Scratchpad
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>
              Jot down quick thoughts, jokes, or key takeaways from this card.
            </p>
          </div>

          <textarea
            rows={5}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Jot down notes or quotes here..."
            style={{
              width: '100%',
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-hairline)',
              background: 'var(--color-surface-subtle)',
              fontSize: '14px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <InteractiveCard3D 
      isWildcard={isWildcard} 
      swipeClass={swipeClass}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      isFlipped={isFlipped}
      frontContent={frontContent}
      backContent={backContent}
      className="question-card-inner"
    />
  );
}

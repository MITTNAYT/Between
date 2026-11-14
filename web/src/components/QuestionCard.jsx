import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Bookmark, Sparkles, Shuffle, RotateCw, Check, Flame, Clock, Play, X, Edit3 } from 'lucide-react';
import InteractiveCard3D from './InteractiveCard3D';
import { getCardMascot, getCardThemeColor, getCardStickerLabel } from './CardMascots';
import { WILDCARD_INSPIRATIONS, getDigDeeperData } from '../utils/engine';
import { playClickSound, playChimeSound, playHandshakeSound, playCardFlipSound, playCardShuffleSound } from '../utils/audio';
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
  myName = 'You',
  peerName = 'Partner',
  wildcardPrompt = null,
  onSelectWildcardPrompt = null,
  onSkipQuestion = null,
  isPartnerSpeaking = false
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedWildcardPrompt, setSelectedWildcardPrompt] = useState(wildcardPrompt || null);
  const [customWildcardInput, setCustomWildcardInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Dig Deeper & Micro-Challenge State
  const digDeeperData = getDigDeeperData(question, false);
  const [challengeOffset, setChallengeOffset] = useState(0);
  const challengeList = digDeeperData.challenges || [digDeeperData.challenge];
  const currentChallenge = challengeList[challengeOffset % challengeList.length] || challengeList[0];

  const [timerSecondsLeft, setTimerSecondsLeft] = useState(currentChallenge?.timerSeconds || 15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Reset challenge offset when card changes
  useEffect(() => {
    setChallengeOffset(0);
  }, [question?.id]);

  // Reset timer if question or challenge changes
  useEffect(() => {
    setIsTimerRunning(false);
    setTimerCompleted(false);
    setTimerSecondsLeft(currentChallenge?.timerSeconds || 15);
  }, [question?.id, currentChallenge?.id]);

  // Interactive Countdown Interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            setTimerCompleted(true);
            playHandshakeSound();
            triggerHaptic('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const isWildcard = question?.isWildcard || question?.id?.startsWith('wildcard');
  const isMystery = question?.isMystery || question?.category === 'MYSTERY';
  const allPrompts = WILDCARD_INSPIRATIONS[relationshipType] || WILDCARD_INSPIRATIONS.COUPLE;

  const [wildcardOffset, setWildcardOffset] = useState(() => Math.floor(Math.random() * (allPrompts.length || 6)));

  // Keep in sync if peer selected a wildcard prompt
  useEffect(() => {
    if (wildcardPrompt) {
      setSelectedWildcardPrompt(wildcardPrompt);
    }
  }, [wildcardPrompt]);

  // Initialize wildcard prompt if empty
  useEffect(() => {
    if (isWildcard && !selectedWildcardPrompt && !wildcardPrompt && allPrompts.length > 0) {
      const initialPrompt = allPrompts[wildcardOffset % allPrompts.length];
      setSelectedWildcardPrompt(initialPrompt);
    }
  }, [isWildcard, selectedWildcardPrompt, wildcardPrompt, wildcardOffset, allPrompts]);

  const handleShuffleWildcard = (e) => {
    if (e) e.stopPropagation();
    playCardShuffleSound();
    triggerHaptic('medium');
    const nextOffset = (wildcardOffset + 1) % allPrompts.length;
    setWildcardOffset(nextOffset);
    const nextPrompt = allPrompts[nextOffset];
    setSelectedWildcardPrompt(nextPrompt);
    onSelectWildcardPrompt?.(nextPrompt);
  };

  const handleApplyCustomWildcard = (e) => {
    if (e) e.preventDefault();
    if (!customWildcardInput.trim()) return;
    playChimeSound();
    triggerHaptic('success');
    const custom = customWildcardInput.trim();
    setSelectedWildcardPrompt(custom);
    onSelectWildcardPrompt?.(custom);
    setShowCustomModal(false);
  };

  const toggleFlip = (e) => {
    if (e) e.stopPropagation();
    playCardFlipSound();
    triggerHaptic('light');
    setIsFlipped(prev => !prev);
  };

  const activeQuestionText = isWildcard
    ? (wildcardPrompt || selectedWildcardPrompt || allPrompts[wildcardOffset % allPrompts.length] || question.text)
    : question.text;

  const themeColor = getCardThemeColor(question);
  const Mascot = getCardMascot(question?.category, question?.id, question?.depth);

  // FRONT CONTENT (Authentic Tabletop Playing Card Face)
  const frontContent = (
    <div
      className="card-face-canvas"
      style={{
        background: themeColor,
        borderRadius: '16px',
        padding: 'clamp(14px, 3.5vw, 18px) clamp(12px, 3vw, 16px)',
        minHeight: 'clamp(370px, 52vh, 450px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        boxSizing: 'border-box',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.4)'
      }}
    >
      {/* Top Header Row: Pure Tabletop Aesthetic matching reference photo */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '4px'
      }}>
        {/* Left: Tabletop Star Circle Badge matching photo */}
        <div className="tabletop-star-badge" title="Between Tabletop Deck" aria-hidden="true">
          ★
        </div>

        {/* Right: Tactile White Bookmark Coin Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            onToggleBookmark?.();
          }}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28, 25, 23, 0.12)',
            borderRadius: '50%',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isBookmarked ? 'var(--color-ember)' : '#1C1917',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={isBookmarked ? 'Moment saved to your hand' : 'Save this moment'}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this card'}
        >
          <Bookmark
            size={15}
            strokeWidth={2.4}
            fill={isBookmarked ? 'currentColor' : 'none'}
            color={isBookmarked ? 'var(--color-ember)' : '#1C1917'}
          />
        </button>
      </div>

      {/* Center Hero Area: Handcrafted Ink Mascot directly matching reference card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '6px 0 4px',
        filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))',
        userSelect: 'none'
      }}>
        <Mascot size={118} />
      </div>

      {/* White Sticker/Label Badge directly matching photo (e.g. DOWNCYCLING, NÄHCAFE, SPECKGÜRTEL) */}
      <div style={{ margin: '4px 0 6px', userSelect: 'none' }}>
        <div className="card-label-sticker">
          <span>{getCardStickerLabel(question)}</span>
        </div>
      </div>

      {/* Main Question Text: High-contrast, clean modern font matching German card prompts */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '4px 8px 6px'
      }}>
        <h2 className="card-prompt-text" style={{
          maxWidth: '430px',
          margin: 0,
          textAlign: 'center'
        }}>
          {isWildcard
            ? (activeQuestionText ? `“${activeQuestionText}”` : question.text)
            : question.text
          }
        </h2>
      </div>

      {/* Wildcard Tactile Action Pills (Keeps the card face completely clean & physical!) */}
      {isWildcard && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          margin: '6px 0 4px',
          userSelect: 'none'
        }}>
          <button
            type="button"
            onClick={handleShuffleWildcard}
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: '700',
              gap: '5px',
              background: '#FFFFFF',
              borderColor: 'rgba(28, 25, 23, 0.15)',
              color: '#1C1917',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.06)',
              borderRadius: '9999px'
            }}
            title="Shuffle to another wildcard question"
          >
            <Shuffle size={12} strokeWidth={2.4} />
            <span>Inspire Me</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              setShowCustomModal(true);
            }}
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: '700',
              gap: '5px',
              background: '#FFFFFF',
              borderColor: 'rgba(28, 25, 23, 0.15)',
              color: '#1C1917',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.06)',
              borderRadius: '9999px'
            }}
            title="Type your own custom wildcard question"
          >
            <Edit3 size={12} strokeWidth={2.4} color="#C6882C" />
            <span>Write Custom</span>
          </button>
        </div>
      )}

      {/* Primary Action: Tactile Flip Button */}
      <button
        type="button"
        onClick={toggleFlip}
        className="card-label-sticker"
        style={{
          cursor: 'pointer',
          gap: '7px',
          fontSize: '11.5px',
          padding: '7px 18px',
          background: '#FFFFFF',
          color: '#1C1917',
          marginTop: '6px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          transition: 'all 0.18s'
        }}
        title="Flip card for follow-up question & challenge"
      >
        <RotateCw size={12} strokeWidth={2.4} color="#C6882C" />
        <span>Flip for Follow-up & Challenge</span>
      </button>
    </div>
  );

  // BACK CONTENT (3D Flipped Side: The Unspoken Layer & Micro-Challenge)
  const backContent = (
    <div
      className="card-face-canvas card-face-canvas-back"
      style={{
        background: themeColor,
        borderRadius: '16px',
        padding: 'clamp(14px, 3.5vw, 18px) clamp(12px, 3vw, 16px)',
        minHeight: 'clamp(370px, 52vh, 450px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        textAlign: 'left',
        position: 'relative',
        boxSizing: 'border-box',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
        gap: '10px'
      }}
    >
      {/* Back Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '4px'
      }}>
        {/* Left: Tabletop Star Circle Badge + Sticker Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="tabletop-star-badge" title="Between Tabletop Deck (Reverse)" aria-hidden="true">
            ★
          </div>
          <div className="card-label-sticker" style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }}>
            <Sparkles size={11} color="#C6882C" />
            <span>THE UNSPOKEN LAYER</span>
          </div>
        </div>

        <button
          onClick={toggleFlip}
          className="pill-badge"
          style={{ 
            cursor: 'pointer', 
            gap: '4px', 
            fontSize: '11px', 
            fontWeight: '700',
            padding: '5px 12px',
            background: '#FFFFFF',
            border: '1px solid rgba(28, 25, 23, 0.15)',
            color: '#1C1917',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
          }}
          title="Flip back to front face"
        >
          <RotateCw size={11} strokeWidth={2.4} />
          <span>Front</span>
        </button>
      </div>

      {/* Main Back Content: Tailored Follow-up & Connection Challenge */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.25s ease-out' }}>
        {/* Section 1: The Tailored Follow-up Questions */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '12px',
          background: '#FFFFFF',
          border: '1px solid rgba(28, 25, 23, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10px',
              fontWeight: '800',
              color: '#1C1917',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              <Flame size={12} strokeWidth={2.4} color="#D94E34" />
              <span>Follow-Up · The Unspoken Layer</span>
            </div>
            {digDeeperData.followUps && digDeeperData.followUps.length > 1 && (
              <span style={{ fontSize: '10px', color: '#8C8278', fontWeight: '700' }}>
                {digDeeperData.followUps.length} Prompts
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(digDeeperData.followUps || [digDeeperData.followUp]).map((fu, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                {digDeeperData.followUps && digDeeperData.followUps.length > 1 && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#1C1917',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '800',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {idx + 1}
                  </span>
                )}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(13px, 3.4vw, 15px)',
                  fontWeight: '600',
                  lineHeight: '1.4',
                  color: '#1C1917',
                  margin: 0
                }}>
                  “{fu}”
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Connection Micro-Challenge */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '12px',
          background: '#FFFFFF',
          border: '1px solid rgba(28, 25, 23, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10px',
              fontWeight: '800',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#1C1917'
            }}>
              <Sparkles size={11} color="#C6882C" />
              <span>CHALLENGE · {currentChallenge.tag}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playCardShuffleSound();
                triggerHaptic('light');
                setChallengeOffset(prev => prev + 1);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#8C8278',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Roll another connection challenge"
            >
              <Shuffle size={11} strokeWidth={2.2} />
              <span>Roll Next</span>
            </button>
          </div>

          <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#1C1917' }}>
            {currentChallenge.title}
          </div>

          <p style={{ fontSize: '12.5px', color: '#4A443E', lineHeight: '1.4', margin: 0 }}>
            {currentChallenge.instruction}
          </p>

          {/* Optional Countdown Timer Widget */}
          {currentChallenge.hasTimer && (
            <div style={{ marginTop: '4px' }}>
              {timerCompleted ? (
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(56, 123, 106, 0.12)',
                  border: '1px solid rgba(56, 123, 106, 0.3)',
                  color: 'var(--color-sage)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <Check size={13} strokeWidth={2.6} />
                  <span>{currentChallenge.title} Completed ✨</span>
                </div>
              ) : isTimerRunning ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    setIsTimerRunning(false);
                  }}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    fontSize: '12px',
                    background: '#1C1917',
                    color: '#FFFFFF',
                    animation: 'pulse 1.2s infinite',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Clock size={14} strokeWidth={2.4} />
                  <span>00:{String(timerSecondsLeft).padStart(2, '0')} · {currentChallenge.timerLabel || 'Timer'} (Tap to Stop)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    triggerHaptic('medium');
                    setIsTimerRunning(true);
                  }}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderColor: 'rgba(28, 25, 23, 0.15)',
                    color: '#1C1917',
                    background: '#FFFFFF'
                  }}
                >
                  <Play size={12} fill="currentColor" strokeWidth={0} />
                  <span>Start {currentChallenge.timerSeconds}s {currentChallenge.timerLabel || 'Timer'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
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

      {/* Clean Tactile Modal for Custom Wildcard Question Input */}
      {showCustomModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(28, 25, 23, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="tabletop-playing-card"
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '20px',
              background: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="tabletop-star-badge" style={{ width: '24px', height: '24px', fontSize: '11px' }}>
                  ★
                </div>
                <div className="card-label-sticker" style={{ fontSize: '11px', padding: '3px 10px' }}>
                  WILDCARD CREATOR
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="btn-icon"
                style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                title="Close"
              >
                <X size={15} />
              </button>
            </div>

            <h3 style={{
              fontSize: '17px',
              fontWeight: '800',
              color: '#1C1917',
              margin: '0 0 4px',
              fontFamily: 'var(--font-display)'
            }}>
              Write Your Wildcard Question
            </h3>
            <p style={{
              fontSize: '12.5px',
              color: 'var(--color-body)',
              lineHeight: '1.4',
              margin: '0 0 14px'
            }}>
              Ask your partner anything you have been wondering about. When submitted, the card on both screens will update in real time.
            </p>

            <form onSubmit={handleApplyCustomWildcard}>
              <textarea
                value={customWildcardInput}
                onChange={(e) => setCustomWildcardInput(e.target.value)}
                placeholder="What is something you've always wanted to ask me?"
                rows={3}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(28, 25, 23, 0.18)',
                  fontSize: '14.5px',
                  lineHeight: '1.45',
                  color: '#1C1917',
                  background: '#FAF6F0',
                  boxSizing: 'border-box',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '12px'
                }}
              />

              {/* Quick Inspiration Starters */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: '800', letterSpacing: '0.06em', color: '#8C8278', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Quick Inspirations:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    "What's a memory of us that always makes you smile?",
                    "What is something you've been putting off telling me?",
                    "What is a dream you're still working toward?",
                    "When did you last feel completely understood by me?"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomWildcardInput(sug)}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        border: '1px solid rgba(28, 25, 23, 0.1)',
                        background: '#F4ECE2',
                        fontSize: '11px',
                        color: '#1C1917',
                        cursor: 'pointer',
                        textAlign: 'left',
                        lineHeight: '1.3'
                      }}
                    >
                      “{sug.slice(0, 36)}...”
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, minHeight: '44px', borderRadius: 'var(--radius-pill)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customWildcardInput.trim()}
                  className="btn-primary"
                  style={{
                    flex: 1.5,
                    minHeight: '44px',
                    borderRadius: 'var(--radius-pill)',
                    opacity: !customWildcardInput.trim() ? 0.45 : 1
                  }}
                >
                  Set as Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

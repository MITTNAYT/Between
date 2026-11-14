import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Bookmark, Sparkles, Shuffle, ChevronDown, ChevronUp, RotateCw, Eye, EyeOff, Send, Check, Flame, Clock, Play, RotateCcw, Download } from 'lucide-react';
import InteractiveCard3D from './InteractiveCard3D';
import { getCardMascot, getCardThemeColor } from './CardMascots';
import { WILDCARD_INSPIRATIONS, getDigDeeperData, DIG_DEEPER_CHALLENGES } from '../utils/engine';
import { playClickSound, playChimeSound, playHandshakeSound, playCardFlipSound, playCardShuffleSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { downloadCardAsPng } from '../utils/cardExporter';

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
  const [backTab, setBackTab] = useState('DIG_DEEPER'); // 'DIG_DEEPER' | 'BLIND'
  const [hintExpanded, setHintExpanded] = useState(false);
  const [selectedWildcardPrompt, setSelectedWildcardPrompt] = useState(wildcardPrompt || null);
  const [customWildcardInput, setCustomWildcardInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isExportingCard, setIsExportingCard] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const handleExportCard = async () => {
    try {
      playClickSound();
      triggerHaptic('medium');
      setIsExportingCard(true);
      await downloadCardAsPng(question);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 2200);
    } catch (e) {
      console.warn('Export mini card error:', e);
    } finally {
      setIsExportingCard(false);
    }
  };

  // Dig Deeper & Micro-Challenge State (Tailored to question & mode: Offline vs Open Space)
  const digDeeperData = getDigDeeperData(question, isSolo);
  const [challengeOffset, setChallengeOffset] = useState(0);
  const challengeList = digDeeperData.challenges || [digDeeperData.challenge];
  const currentChallenge = challengeList[challengeOffset % challengeList.length] || challengeList[0];

  const [timerSecondsLeft, setTimerSecondsLeft] = useState(currentChallenge?.timerSeconds || 15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Reset challenge offset when card or mode changes
  useEffect(() => {
    setChallengeOffset(0);
  }, [question?.id, isSolo]);

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
    playCardShuffleSound();
    triggerHaptic('medium');
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
    playCardFlipSound();
    triggerHaptic('light');
    setIsFlipped(prev => !prev);
  };

  const activeQuestionText = isWildcard
    ? (wildcardPrompt || selectedWildcardPrompt || question.text)
    : question.text;

  const isBothRevealed = blindState.mySubmitted && blindState.peerSubmitted;
  const themeColor = getCardThemeColor(question);
  const Mascot = getCardMascot(question?.category, question?.id, question?.depth);

  // FRONT CONTENT (Tabletop Playing Card Face)
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
      {/* Top Header Row */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '6px'
      }}>
        {/* Left: Tabletop Star Circle Badge */}
        <div className="tabletop-star-badge" title="Between Tabletop Deck" aria-hidden="true">
          ★
        </div>

        {/* Right: Turn Switcher Pill & Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              playClickSound();
              triggerHaptic('light');
              onPassTurn?.();
            }}
            className="pill-badge pill-badge-surface"
            style={{
              cursor: 'pointer',
              gap: '5px',
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '6px 12px',
              background: '#FFFFFF',
              color: '#1C1917',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.06)'
            }}
            title="Click to pass turn to your partner"
          >
            <ArrowRightLeft size={12} strokeWidth={2.4} />
            <span>{turnIndicator}</span>
          </button>

          <button
            onClick={() => {
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
          >
            <Bookmark
              size={15}
              strokeWidth={2.2}
              fill={isBookmarked ? 'currentColor' : 'none'}
              color={isBookmarked ? 'var(--color-ember)' : 'inherit'}
            />
          </button>
        </div>
      </div>

      {/* Center Hero Area: Handcrafted Ink Mascot directly matching reference card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '4px 0 2px',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08))',
        userSelect: 'none'
      }}>
        <Mascot size={104} />
      </div>

      {/* White Sticker/Label Badge directly matching photo (e.g. DOWNCYCLING, NÄHCAFE, SPECKGÜRTEL) */}
      <div style={{ margin: '2px 0 8px', userSelect: 'none' }}>
        <div className="card-label-sticker">
          <span>
            {isWildcard
              ? 'WILDCARD · ASK ANYTHING'
              : (isMystery
                ? `SECRET · FROM ${question.author ? question.author.toUpperCase() : 'PARTNER'}`
                : (question.category || 'BETWEEN')
              )
            }
          </span>
        </div>
      </div>

      {/* Main Question Text: High-contrast, clean sans-serif matching German card prompts */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '2px 6px 6px'
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

      {/* Hint Drawer */}
      {!isWildcard && question.hint && (
        <div style={{ width: '100%', marginTop: '4px' }}>
          {!hintExpanded ? (
            <button
              onClick={() => {
                playClickSound();
                setHintExpanded(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(28, 25, 23, 0.1)',
                color: '#1C1917',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span>Gentle guidance</span>
              <ChevronDown size={13} strokeWidth={2.4} />
            </button>
          ) : (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28, 25, 23, 0.12)',
              borderRadius: '12px',
              padding: '12px 14px',
              textAlign: 'left',
              animation: 'fadeIn 0.2s ease-out',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#1C1917', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Reflection Prompt
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    setHintExpanded(false);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1917', padding: '2px' }}
                >
                  <ChevronUp size={13} strokeWidth={2.4} />
                </button>
              </div>
              <p style={{ fontSize: '12.5px', color: '#4A443E', lineHeight: '1.45', margin: 0 }}>
                {question.hint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Wildcard: Interactive Random Chooser */}
      {isWildcard && (
        <div style={{ width: '100%', marginTop: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#1C1917', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Choose a question to ask:
            </span>
            <button
              onClick={handleShuffleWildcard}
              className="btn-secondary"
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                gap: '4px',
                background: '#FFFFFF',
                borderColor: 'rgba(28, 25, 23, 0.15)',
                color: '#1C1917'
              }}
              title="Roll 3 new random questions"
            >
              <Shuffle size={11} strokeWidth={2.4} />
              <span>Roll 3 More</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {currentVisiblePrompts.map((promptText, idx) => {
              const isSelected = (selectedWildcardPrompt === promptText) || (wildcardPrompt === promptText);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(promptText)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #1C1917' : '1px solid rgba(28, 25, 23, 0.1)',
                    background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                    color: '#1C1917',
                    fontSize: '12.5px',
                    textAlign: 'left',
                    lineHeight: '1.35',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    boxShadow: isSelected ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none'
                  }}
                >
                  <span>“{promptText}”</span>
                  {isSelected && (
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: '800',
                      background: '#1C1917',
                      color: '#FFF',
                      padding: '2px 6px',
                      borderRadius: '9999px',
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
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            {!showCustomInput ? (
              <button
                onClick={() => {
                  playClickSound();
                  setShowCustomInput(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1C1917',
                  fontSize: '11.5px',
                  fontWeight: '700',
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
                    padding: '6px 10px',
                    fontSize: '12.5px',
                    borderRadius: '8px',
                    border: '1px solid rgba(28, 25, 23, 0.15)',
                    background: '#FFFFFF',
                    outline: 'none',
                    color: '#1C1917'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyCustomWildcard();
                  }}
                />
                <button
                  onClick={handleApplyCustomWildcard}
                  disabled={!customWildcardInput.trim()}
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  Ask
                </button>
              </div>
            )}
          </div>
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
          fontSize: '12px',
          padding: '8px 20px',
          background: '#FFFFFF',
          color: '#1C1917',
          marginTop: '10px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          transition: 'all 0.18s'
        }}
        title="Flip card for follow-up question & challenge"
      >
        <RotateCw size={13} strokeWidth={2.4} color="#C6882C" />
        <span>Flip for Follow-up & Challenge</span>
      </button>
    </div>
  );

  // BACK CONTENT (3D Flipped Side: Dig Deeper & Secret Reveal)
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
        {/* Left: Tabletop Star Circle Badge + Sub Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="tabletop-star-badge" title="Between Tabletop Deck (Reverse)" aria-hidden="true">
            ★
          </div>

          {/* Sub Tabs */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(255, 255, 255, 0.85)', padding: '3px', borderRadius: 'var(--radius-pill)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <button
              onClick={() => { playClickSound(); triggerHaptic('light'); setBackTab('DIG_DEEPER'); }}
              style={{
                border: 'none',
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '11px',
                fontWeight: backTab === 'DIG_DEEPER' ? '800' : '600',
                background: backTab === 'DIG_DEEPER' ? '#1C1917' : 'transparent',
                color: backTab === 'DIG_DEEPER' ? '#FFFFFF' : '#1C1917',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s'
              }}
            >
              <Sparkles size={11} color={backTab === 'DIG_DEEPER' ? '#FFF' : '#C6882C'} />
              <span>Dig Deeper</span>
            </button>
            <button
              onClick={() => { playClickSound(); triggerHaptic('light'); setBackTab('BLIND'); }}
              style={{
                border: 'none',
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '11px',
                fontWeight: backTab === 'BLIND' ? '800' : '600',
                background: backTab === 'BLIND' ? '#1C1917' : 'transparent',
                color: backTab === 'BLIND' ? '#FFFFFF' : '#1C1917',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s'
              }}
            >
              <Eye size={11} />
              <span>Secret Reveal</span>
            </button>
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

      {/* TAB 1: DIG DEEPER (Tailored Follow-up & Connection Challenge) */}
      {backTab === 'DIG_DEEPER' && (
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
                <span>The Unspoken Layer · Follow-Up</span>
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
                    fontFamily: 'var(--font-sans)',
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
                onClick={() => {
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
                    onClick={() => {
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
                    onClick={() => {
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
      )}

      {/* TAB 2: SECRET DOUBLE-BLIND REVEAL */}
      {backTab === 'BLIND' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.25s ease-out' }}>
          <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(28, 25, 23, 0.1)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
            <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#1C1917', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Secret Double-Blind Answer
            </div>
            <p style={{ fontSize: '12.5px', color: '#4A443E', margin: '4px 0 8px' }}>
              Both write your honest answer in secret. Neither sees until both press submit!
            </p>

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
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(28, 25, 23, 0.15)',
                    background: '#F9F7F4',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    color: '#1C1917',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: '#8C8278' }}>
                    {blindState.peerSubmitted ? (
                      <span style={{ color: 'var(--color-sage)', fontWeight: '700' }}>✓ {peerName} has written!</span>
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
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: '#1C1917',
                      color: '#FFFFFF',
                      width: 'auto',
                      minHeight: '34px',
                      opacity: blindState.myAnswer.trim() && !blindState.mySubmitted ? 1 : 0.6
                    }}
                  >
                    <Send size={12} strokeWidth={2.4} />
                    <span>{blindState.mySubmitted ? 'Submitted!' : 'Submit Answer'}</span>
                  </button>
                </div>
              </>
            ) : (
              // Both have submitted: Simultaneous Reveal!
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px', animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(217, 78, 52, 0.08)',
                  border: '1px solid rgba(217, 78, 52, 0.25)'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-ember)', textTransform: 'uppercase' }}>
                    {isSolo ? `${hostName}'s Answer` : `${myName}'s Answer`}
                  </div>
                  <div style={{ fontSize: '13px', color: '#1C1917', marginTop: '3px', fontStyle: 'italic', fontWeight: '600' }}>
                    “{blindState.myAnswer}”
                  </div>
                </div>

                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(56, 123, 106, 0.08)',
                  border: '1px solid rgba(56, 123, 106, 0.25)'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-sage)', textTransform: 'uppercase' }}>
                    {isSolo ? `${guestName}'s Answer` : `${peerName}'s Answer`}
                  </div>
                  <div style={{ fontSize: '13px', color: '#1C1917', marginTop: '3px', fontStyle: 'italic', fontWeight: '600' }}>
                    “{blindState.peerAnswer || 'Both answers unlocked!'}”
                  </div>
                </div>
              </div>
            )}
          </div>
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

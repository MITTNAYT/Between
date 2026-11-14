import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import QuestionCard from './QuestionCard';
import { getCardMascot, getCardThemeColor } from './CardMascots';
import { playClickSound, playCardSlideSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

/**
 * CardDeckCarousel:
 * Authentic physical tabletop card game carousel.
 * Renders the active card centered with 3D depth and interaction,
 * accompanied by adjacent peek cards fanned out on the left and right,
 * with smooth horizontal swipe/scroll dealing animations.
 */
export default function CardDeckCarousel({
  questions = [],
  currentIndex = 0,
  onSelectIndex,
  onAdvanceCard,
  onPreviousCard,
  // QuestionCard props
  turnIndicator,
  relationshipType,
  onPassTurn,
  isBookmarked,
  onToggleBookmark,
  myName,
  peerName,
  wildcardPrompt,
  onSelectWildcardPrompt,
  onSkipQuestion,
  isPartnerSpeaking
}) {
  const containerRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentQuestion = questions[currentIndex] || null;
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        onAdvanceCard?.();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPreviousCard?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, onAdvanceCard, onPreviousCard]);

  // Touch and pointer swipe handlers
  const handlePointerDown = (e) => {
    // Avoid dragging when clicking buttons, inputs, or textareas
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
      return;
    }
    startXRef.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const deltaX = clientX - startXRef.current;
    // Dampen drag slightly for natural resistance
    setDragOffset(deltaX * 0.75);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -60 && currentIndex < questions.length - 1) {
      playCardSlideSound();
      triggerHaptic('light');
      onAdvanceCard?.();
    } else if (dragOffset > 60 && currentIndex > 0) {
      playCardSlideSound();
      triggerHaptic('light');
      onPreviousCard?.();
    }
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  /**
   * Helper to render inactive tabletop peek cards (previous / next)
   */
  const renderPeekCard = (q, position = 'left') => {
    if (!q) return null;
    const isLeft = position === 'left';
    const themeColor = getCardThemeColor(q);
    const Mascot = getCardMascot(q.category, q.id, q.depth);
    const isWildcard = q.isWildcard || q.id?.startsWith('wildcard');

    return (
      <div
        onClick={() => {
          playCardSlideSound();
          triggerHaptic('light');
          if (isLeft) onPreviousCard?.();
          else onAdvanceCard?.();
        }}
        className={`peek-card-wrapper ${isLeft ? 'peek-left' : 'peek-right'}`}
        style={{
          position: 'absolute',
          top: '50%',
          [isLeft ? 'left' : 'right']: '-14%',
          width: '74%',
          maxWidth: '350px',
          transform: `translateY(-50%) ${
            isLeft 
              ? `rotate(-6deg) scale(0.86) translateX(${dragOffset * 0.25}px)` 
              : `rotate(6deg) scale(0.86) translateX(${dragOffset * 0.25}px)`
          }`,
          opacity: 0.52,
          filter: 'blur(0.4px)',
          zIndex: 1,
          cursor: 'pointer',
          transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isDragging ? 'none' : 'auto'
        }}
        title={isLeft ? 'Click to draw previous card' : 'Click to deal next card'}
        aria-hidden="true"
      >
        {/* Physical Card Outer White Frame */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '22px',
          padding: '10px',
          boxShadow: '0 12px 30px -8px rgba(28, 25, 23, 0.16), 0 4px 10px -2px rgba(28, 25, 23, 0.08)',
          userSelect: 'none'
        }}>
          {/* Inner Pastel Block */}
          <div style={{
            background: themeColor,
            borderRadius: '14px',
            padding: '14px 12px',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            {/* Header star badge */}
            <div style={{ width: '100%', display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#1C1917',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px'
              }}>
                ★
              </div>
            </div>

            {/* Center Mascot */}
            <div style={{ opacity: 0.9, transform: 'scale(0.85)' }}>
              <Mascot size={76} />
            </div>

            {/* Sticker Label */}
            <div className="card-label-sticker" style={{ fontSize: '9.5px', padding: '3px 10px' }}>
              {isWildcard ? 'WILDCARD' : (q.category || 'BETWEEN')}
            </div>

            {/* Truncated hint prompt */}
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#1C1917',
              textAlign: 'center',
              lineHeight: '1.35',
              margin: '6px 0 0',
              opacity: 0.85,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {q.text}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Tabletop Card Arena with Peek Cards and Drag Physics */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '1400px',
          overflow: 'visible',
          touchAction: 'pan-y',
          padding: '10px 0 16px'
        }}
      >
        {/* Left Peek Card (Previous) */}
        {renderPeekCard(prevQuestion, 'left')}

        {/* Center Active Interactive Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            position: 'relative',
            zIndex: 10,
            transform: `translateX(${dragOffset}px) rotateZ(${dragOffset * 0.04}deg)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <QuestionCard
            question={currentQuestion}
            turnIndicator={turnIndicator}
            relationshipType={relationshipType}
            onPassTurn={onPassTurn}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
            myName={myName}
            peerName={peerName}
            wildcardPrompt={wildcardPrompt}
            onSelectWildcardPrompt={onSelectWildcardPrompt}
            onSkipQuestion={onSkipQuestion}
            isPartnerSpeaking={isPartnerSpeaking}
          />
        </div>

        {/* Right Peek Card (Next) */}
        {renderPeekCard(nextQuestion, 'right')}
      </div>

      {/* Tabletop Wooden/Ivory Turn Token resting on the table below the deck */}
      {onPassTurn && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '2px', marginBottom: '6px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              triggerHaptic('light');
              onPassTurn?.();
            }}
            className="tabletop-turn-coin"
            title="Click to pass turn to your partner"
          >
            <ArrowRightLeft size={13} strokeWidth={2.4} />
            <span style={{ fontWeight: '800' }}>{turnIndicator}</span>
            <span className="turn-coin-hint">· Tap to pass</span>
          </button>
        </div>
      )}
    </div>
  );
}

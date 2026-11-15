import React, { useState, useEffect, useRef } from 'react';
import { Smile, X } from 'lucide-react';
import { playReactionSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export const PRIMARY_REACTIONS = [
  {
    id: 'heart',
    symbol: '❤️',
    label: 'Adore',
    hint: 'I love and cherish this',
    color: '#E11D48',
    glow: 'rgba(225, 29, 72, 0.28)',
    haptic: 'heartbeat'
  },
  {
    id: 'melted',
    symbol: '🥹',
    label: 'Melted',
    hint: 'Touched my soul / vulnerable',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.28)',
    haptic: 'pop'
  },
  {
    id: 'embrace',
    symbol: '🫂',
    label: 'Embrace',
    hint: 'Safe space / holding you close',
    color: '#2DD4BF',
    glow: 'rgba(45, 212, 191, 0.28)',
    haptic: 'medium'
  },
  {
    id: 'cheers',
    symbol: '🥂',
    label: 'Cheers',
    hint: 'Spark & chemistry / to us',
    color: '#D97706',
    glow: 'rgba(217, 119, 6, 0.28)',
    haptic: 'pop'
  },
  {
    id: 'magic',
    symbol: '✨',
    label: 'Goosebumps',
    hint: 'Magic / chills / in awe',
    color: '#CA8A04',
    glow: 'rgba(202, 138, 4, 0.28)',
    haptic: 'light'
  },
  {
    id: 'fire',
    symbol: '🔥',
    label: 'Electric',
    hint: 'Passionate / spicy / raw truth',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.28)',
    haptic: 'pop'
  },
  {
    id: 'sweet',
    symbol: '🥺',
    label: 'Sweetheart',
    hint: 'Pure softness & tenderness',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.28)',
    haptic: 'light'
  }
];

export const EXTRA_REACTIONS = [
  { id: 'kiss', symbol: '💋', label: 'Kiss', hint: 'Deep romantic kiss', haptic: 'pop' },
  { id: 'heart_hands', symbol: '🫶', label: 'Heart Hands', hint: 'So proud of you', haptic: 'medium' },
  { id: 'in_love', symbol: '🥰', label: 'In Love', hint: 'Smiling ear to ear', haptic: 'pop' },
  { id: 'shy', symbol: '🫣', label: 'Blushing', hint: 'Cute shyness & butterflies', haptic: 'light' },
  { id: 'letter', symbol: '💌', label: 'Keepsake', hint: 'Saving this memory forever', haptic: 'pop' },
  { id: 'moon', symbol: '🌙', label: 'Night Owl', hint: 'Late night soul talk', haptic: 'light' },
  { id: 'thought', symbol: '💭', label: 'Felt That', hint: 'Deeply reflecting on this', haptic: 'light' },
  { id: 'dove', symbol: '🕊️', label: 'Peace', hint: 'Gentle harmony & calm', haptic: 'light' }
];

export default function ReactionBar({ onSendReaction }) {
  const [combos, setCombos] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showExtraTray, setShowExtraTray] = useState(false);
  const comboTimersRef = useRef({});
  const dockRef = useRef(null);

  // Close extra tray on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setShowExtraTray(false);
      }
    };
    if (showExtraTray) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [showExtraTray]);

  const handleTap = (item) => {
    const itemId = item.id;
    const currentCount = (combos[itemId] || 0) + 1;

    setCombos(prev => ({ ...prev, [itemId]: currentCount }));

    // Reset combo timer
    if (comboTimersRef.current[itemId]) {
      clearTimeout(comboTimersRef.current[itemId]);
    }
    comboTimersRef.current[itemId] = setTimeout(() => {
      setCombos(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }, 1200);

    // Audio & Haptic feedback
    playReactionSound(item.symbol, currentCount - 1);
    triggerHaptic(item.haptic || 'pop');

    // Notify parent
    onSendReaction?.(item.symbol, {
      id: item.id,
      label: item.label,
      combo: currentCount
    });
  };

  return (
    <div ref={dockRef} className="reaction-dock" role="toolbar" aria-label="Reaction Bar">
      <span className="reaction-dock-label">
        React
      </span>

      {/* Primary Curated Emojis */}
      {PRIMARY_REACTIONS.map((item) => {
        const comboCount = combos[item.id] || 0;
        const isHovered = hoveredItem?.id === item.id;

        return (
          <div key={item.id} style={{ position: 'relative' }}>
            {/* Combo Count Badge */}
            {comboCount > 1 && (
              <span className="reaction-combo-badge">
                x{comboCount}
              </span>
            )}

            {/* Hover Tooltip */}
            {isHovered && (
              <div className="reaction-tooltip">
                <span>{item.label}</span>
              </div>
            )}

            {/* Tactile Emoji Button */}
            <button
              type="button"
              className="reaction-btn"
              onClick={() => handleTap(item)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              aria-label={`${item.label} reaction: ${item.hint}`}
              title={item.hint}
              style={{
                textShadow: isHovered ? `0 0 16px ${item.glow}` : 'none'
              }}
            >
              <span style={{ display: 'inline-block', filter: isHovered ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' : 'none' }}>
                {item.symbol}
              </span>
            </button>
          </div>
        );
      })}

      {/* More / Extra Tray Toggle Button */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setShowExtraTray(prev => !prev)}
          className="reaction-btn"
          style={{
            width: 'clamp(34px, 8vw, 38px)',
            height: 'clamp(34px, 8vw, 38px)',
            fontSize: '15px',
            color: showExtraTray ? 'var(--color-accent)' : 'var(--color-muted)',
            background: showExtraTray ? 'rgba(217, 78, 52, 0.1)' : 'transparent'
          }}
          aria-label={showExtraTray ? 'Close extra reactions' : 'Open more intimate reactions'}
          title={showExtraTray ? 'Close reactions tray' : 'More reactions'}
        >
          {showExtraTray ? <X size={17} strokeWidth={2.5} /> : <Smile size={18} strokeWidth={2.2} />}
        </button>

        {/* Floating Extended Reaction Tray Popover */}
        {showExtraTray && (
          <div className="reaction-tray-popover" role="dialog" aria-label="Extra reactions">
            {EXTRA_REACTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="reaction-tray-btn"
                onClick={() => {
                  handleTap(item);
                }}
                title={item.hint}
                aria-label={`${item.label}: ${item.hint}`}
              >
                {item.symbol}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { playReactionSound, playClickSound } from '../utils/audio';

const REACTIONS = ['❤️', '🥹', '✨', '👏', '🕊️'];

export default function ReactionBar({ onSendReaction }) {
  const handleTap = (emoji) => {
    playReactionSound();
    onSendReaction(emoji);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '8px 14px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginRight: '2px' }}>
        React:
      </span>
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleTap(emoji)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '50%',
            transition: 'transform 0.15s var(--ease-spring)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={`Send ${emoji} to your friend`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

import React from 'react';
import { Heart, Sparkles, Flame, ThumbsUp, Feather } from 'lucide-react';
import { playReactionSound } from '../utils/audio';

const REACTION_ITEMS = [
  { id: 'heart', label: 'Love', icon: Heart, color: '#DE4D6A', symbol: '❤️' },
  { id: 'sparkles', label: 'Inspiring', icon: Sparkles, color: '#C6882C', symbol: '✨' },
  { id: 'flame', label: 'Raw & Real', icon: Flame, color: '#D94E34', symbol: '🔥' },
  { id: 'peace', label: 'Peace', icon: Feather, color: '#387B6A', symbol: '🕊️' },
  { id: 'resonance', label: 'Felt That', icon: ThumbsUp, color: '#3E6FA8', symbol: '👏' }
];

export default function ReactionBar({ onSendReaction }) {
  const handleTap = (item) => {
    playReactionSound();
    onSendReaction(item.symbol);
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      background: 'var(--color-surface)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <span style={{
        fontSize: '10px',
        fontWeight: '700',
        color: 'var(--color-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginRight: '4px'
      }}>
        REACT:
      </span>

      {REACTION_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => handleTap(item)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--color-body)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.18s, color 0.18s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = item.color;
              e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
              e.currentTarget.style.transform = 'scale(1.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-body)';
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.18)'}
            title={item.label}
            aria-label={item.label}
          >
            <Icon size={16} strokeWidth={2.4} />
          </button>
        );
      })}
    </div>
  );
}

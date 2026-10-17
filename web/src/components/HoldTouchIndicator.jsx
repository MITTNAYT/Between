import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export default function HoldTouchIndicator({
  isLocalHolding,
  isPartnerHolding,
  onHoldStart,
  onHoldEnd,
  partnerName = 'Partner',
  isSolo = false
}) {
  const isBothHolding = isLocalHolding && isPartnerHolding;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          onHoldStart();
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          onHoldEnd();
        }}
        onPointerLeave={(e) => {
          e.preventDefault();
          onHoldEnd();
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          onHoldEnd();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onHoldStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onHoldEnd();
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          onHoldEnd();
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          minHeight: '44px',
          padding: '10px 16px',
          maxWidth: '100%',
          borderRadius: 'var(--radius-pill)',
          background: isBothHolding
            ? 'linear-gradient(135deg, rgba(229, 169, 60, 0.4), rgba(217, 78, 52, 0.35))'
            : isLocalHolding
            ? 'rgba(229, 169, 60, 0.22)'
            : 'var(--color-surface)',
          border: isBothHolding
            ? '1.5px solid rgba(229, 169, 60, 0.9)'
            : isLocalHolding
            ? '1.5px solid rgba(229, 169, 60, 0.6)'
            : '1px solid var(--color-hairline)',
          color: isBothHolding || isLocalHolding ? 'var(--color-ink)' : 'var(--color-body)',
          cursor: 'pointer',
          boxShadow: isBothHolding
            ? '0 0 25px rgba(229, 169, 60, 0.6), var(--shadow-md)'
            : 'var(--shadow-sm)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isLocalHolding ? 'scale(0.96)' : 'scale(1)',
          touchAction: 'none'
        }}
        title="Press and hold at the same time to feel each other's presence"
      >
        <Flame
          size={16}
          strokeWidth={2.4}
          color={isBothHolding || isLocalHolding ? '#E5A93C' : 'var(--color-muted)'}
          fill={isBothHolding || isLocalHolding ? '#E5A93C' : 'none'}
        />
        <span style={{ fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: '700', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
          {isBothHolding
            ? 'Touching hands ✨'
            : isLocalHolding
            ? (isSolo ? 'Holding presence...' : `Waiting for ${partnerName}...`)
            : (isPartnerHolding ? `${partnerName} is holding! Press to touch` : 'Hold to Touch')}
        </span>
      </button>

      {/* Subtle hint when partner is reaching out */}
      {isPartnerHolding && !isLocalHolding && !isSolo && (
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#E5A93C',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          ✨ {partnerName} is holding their thumb on the screen
        </span>
      )}
    </div>
  );
}

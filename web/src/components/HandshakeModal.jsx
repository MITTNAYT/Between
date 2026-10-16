import React from 'react';
import { playClickSound } from '../utils/audio';

export default function HandshakeModal({
  isOpen,
  isHost,
  myReady,
  peerReady,
  onConfirmReady,
  onDecline
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        {/* Soft Glowing Heart / Lock Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 18px',
          borderRadius: '50%',
          background: 'rgba(217, 78, 52, 0.1)',
          border: '1px solid rgba(217, 78, 52, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '30px' }}>🤝</span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--color-ink)',
          marginBottom: '8px'
        }}>
          Deeper waters ahead
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-body)',
          lineHeight: '1.55',
          marginBottom: '22px'
        }}>
          This next question opens a door into deeper vulnerability and honesty. Are you both comfortable stepping into this space together?
        </p>

        {/* Readiness Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '12px',
          background: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ fontWeight: '600' }}>You:</span>
            <span style={{
              color: myReady ? 'var(--color-sage)' : 'var(--color-muted)',
              fontWeight: '700'
            }}>
              {myReady ? 'Ready ✓' : 'Deciding...'}
            </span>
          </div>
          <div style={{ width: '1px', background: 'var(--color-hairline)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ fontWeight: '600' }}>Friend:</span>
            <span style={{
              color: peerReady ? 'var(--color-sage)' : 'var(--color-muted)',
              fontWeight: '700'
            }}>
              {peerReady ? 'Ready ✓' : 'Waiting...'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={() => {
              playClickSound();
              onConfirmReady();
            }}
            disabled={myReady}
            style={{
              background: myReady ? 'var(--color-sage)' : 'var(--color-ink)',
              opacity: myReady ? 0.9 : 1
            }}
          >
            {myReady ? 'Waiting for friend...' : "Yes, I'm ready"}
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              playClickSound();
              onDecline();
            }}
          >
            Keep it lighter for now
          </button>
        </div>
      </div>
    </div>
  );
}

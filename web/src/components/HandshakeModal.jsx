import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function HandshakeModal({
  isOpen,
  isHost,
  myReady,
  peerReady,
  onConfirmReady,
  onDecline,
  myName = 'You',
  peerName = 'Partner'
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        {/* Glowing Shield / Sacred Space Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 18px',
          borderRadius: '50%',
          background: 'rgba(217, 78, 52, 0.1)',
          border: '1px solid rgba(217, 78, 52, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-ember)'
        }}>
          <ShieldCheck size={32} strokeWidth={2.2} />
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--color-ink)',
          marginBottom: '8px'
        }}>
          Deeper Waters Ahead
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-body)',
          lineHeight: '1.55',
          marginBottom: '22px'
        }}>
          The next tier moves into vulnerability and authentic honesty. Are you both comfortable stepping into this space together?
        </p>

        {/* Readiness Indicators with Lucide CheckCircle2 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '12px',
          background: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: myReady ? 'var(--color-sage)' : 'var(--color-muted)'
          }}>
            <CheckCircle2 size={16} strokeWidth={2.4} color={myReady ? 'var(--color-sage)' : 'var(--color-muted)'} />
            <span>{myName}: {myReady ? 'Ready' : 'Waiting'}</span>
          </div>

          <div style={{ width: '1px', background: 'var(--color-hairline)' }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: peerReady ? 'var(--color-sage)' : 'var(--color-muted)'
          }}>
            <CheckCircle2 size={16} strokeWidth={2.4} color={peerReady ? 'var(--color-sage)' : 'var(--color-muted)'} />
            <span>{peerName}: {peerReady ? 'Ready' : 'Waiting'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              playClickSound();
              onConfirmReady();
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', gap: '8px' }}
          >
            <span>{myReady ? `Waiting for ${peerName}...` : 'Yes, I am Ready'}</span>
            <ArrowRight size={17} strokeWidth={2.4} />
          </button>

          <button
            onClick={() => {
              playClickSound();
              onDecline();
            }}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', gap: '6px' }}
          >
            <span>Stay Lighter for Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

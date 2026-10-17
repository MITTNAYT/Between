import React, { useEffect } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { playChimeSound, playClickSound } from '../utils/audio';

export default function IncomingCallModal({
  isOpen,
  callerName = 'Partner',
  onAccept,
  onDecline
}) {
  useEffect(() => {
    if (isOpen) {
      playChimeSound();
      // Gentle vibration if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([200, 100, 200, 100, 200]);
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.72)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 99999,
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div className="modal-content soft-card" style={{
        maxWidth: 'min(92vw, 400px)',
        width: '100%',
        padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 24px)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
      }}>
        {/* Pulsing Phone Ring Avatar */}
        <div style={{
          position: 'relative',
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'rgba(56, 123, 106, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#387B6A'
        }}>
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '2px solid rgba(56, 123, 106, 0.4)',
            animation: 'touchRippleExpand 1.8s infinite ease-out'
          }} />
          <Phone size={32} strokeWidth={2.2} />
        </div>

        {/* Text */}
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--color-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Voice Connection
          </span>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-ink)',
            marginTop: '4px',
            lineHeight: 1.2
          }}>
            {callerName} is calling...
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-muted)',
            marginTop: '6px'
          }}>
            Speak directly with studio-grade audio while you explore questions together.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          marginTop: '6px'
        }}>
          <button
            onClick={() => {
              playClickSound();
              onDecline();
            }}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              color: '#D94E34',
              borderColor: 'rgba(217, 78, 52, 0.35)',
              gap: '6px'
            }}
          >
            <PhoneOff size={16} strokeWidth={2.2} />
            <span>Decline</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onAccept();
            }}
            className="btn-primary"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              background: '#387B6A',
              color: '#FFF',
              gap: '6px'
            }}
          >
            <Phone size={16} strokeWidth={2.2} />
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}

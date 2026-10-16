import React, { useState, useEffect } from 'react';
import { ArrowRight, Wind } from 'lucide-react';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function ArrivalPauseModal({ isOpen, onComplete }) {
  const [phase, setPhase] = useState('Inhale'); // Inhale (4s), Hold (4s), Exhale (4s)
  const [secondsLeft, setSecondsLeft] = useState(24);

  useEffect(() => {
    if (!isOpen) return;

    const phases = ['Inhale', 'Hold', 'Exhale'];
    let phaseIndex = 0;

    const cycleInterval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setPhase(phases[phaseIndex]);
      if (phases[phaseIndex] === 'Inhale') {
        playChimeSound();
      }
    }, 4000);

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(cycleInterval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(cycleInterval);
      clearInterval(timer);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(16px)' }}>
      <div className="modal-content" style={{ textAlign: 'center', padding: '36px 28px', maxWidth: '420px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(217, 78, 52, 0.08)',
          color: 'var(--color-ember)',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          <Wind size={13} strokeWidth={2.4} />
          <span>Grounding Moment</span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--color-ink)',
          marginBottom: '8px'
        }}>
          Take a breath to arrive
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-body)',
          lineHeight: '1.5',
          marginBottom: '28px'
        }}>
          Before the first card opens, let the day go. Breathe in sync with your partner or friend.
        </p>

        {/* Breathing Animated Sphere */}
        <div style={{
          width: '160px',
          height: '160px',
          margin: '0 auto 28px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Outer Breathing Ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229, 169, 60, 0.25) 0%, rgba(217, 78, 52, 0.08) 60%, rgba(217, 78, 52, 0) 70%)',
              border: '1.5px solid rgba(229, 169, 60, 0.45)',
              transform: phase === 'Inhale' ? 'scale(1.15)' : (phase === 'Hold' ? 'scale(1.15)' : 'scale(0.85)'),
              transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          {/* Inner Glowing Center */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(229, 169, 60, 0.3) 0%, rgba(217, 78, 52, 0.2) 100%)',
              border: '1px solid rgba(217, 78, 52, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(229, 169, 60, 0.25)',
              transform: phase === 'Inhale' ? 'scale(1.1)' : (phase === 'Hold' ? 'scale(1.1)' : 'scale(0.9)'),
              transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-ink)'
            }}>
              {phase}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
              {secondsLeft}s
            </span>
          </div>
        </div>

        {/* Skip / Begin Early Button */}
        <button
          onClick={() => {
            playClickSound();
            onComplete();
          }}
          className="btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: '14px', gap: '8px' }}
        >
          <span>Ready to Begin Questions</span>
          <ArrowRight size={17} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

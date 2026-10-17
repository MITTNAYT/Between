import React, { useState } from 'react';
import { ShieldCheck, FileText, X, Lock, HeartHandshake, MicOff, DatabaseZap } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function LegalModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('PRIVACY'); // 'PRIVACY' | 'TERMS'

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
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="modal-content soft-card" style={{
        maxWidth: 'min(94vw, 540px)',
        width: '100%',
        maxHeight: 'min(90dvh, 88vh)',
        padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 24px) 20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
          title="Close"
          aria-label="Close"
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px', paddingRight: '20px', paddingLeft: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(56, 123, 106, 0.12)',
            color: 'var(--color-sage)',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            <ShieldCheck size={13} strokeWidth={2.4} />
            <span>Transparency & Ethics</span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-ink)',
            lineHeight: 1.2
          }}>
            Privacy Policy & Terms
          </h3>
        </div>

        {/* Segmented Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--color-surface-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '16px'
        }}>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('PRIVACY');
            }}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'PRIVACY' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'PRIVACY' ? 'var(--color-ink)' : 'var(--color-muted)',
              fontWeight: activeTab === 'PRIVACY' ? '700' : '500',
              fontSize: '13px',
              boxShadow: activeTab === 'PRIVACY' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Lock size={13} strokeWidth={2.2} />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('TERMS');
            }}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'TERMS' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'TERMS' ? 'var(--color-ink)' : 'var(--color-muted)',
              fontWeight: activeTab === 'TERMS' ? '700' : '500',
              fontSize: '13px',
              boxShadow: activeTab === 'TERMS' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={13} strokeWidth={2.2} />
            <span>Terms of Use</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          overflowY: 'auto',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontSize: '13px',
          lineHeight: '1.6',
          color: 'var(--color-body)'
        }}>
          {activeTab === 'PRIVACY' ? (
            <>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MicOff size={15} color="var(--color-sage)" />
                  1. Voice Calls & Microphone Access
                </h4>
                <p>
                  Voice calls operate directly <strong>peer-to-peer (P2P) via WebRTC</strong>. Your microphone audio streams exclusively between your device and your partner's device with end-to-end transport security. <strong>Your voice is never recorded, stored, transcribed, or retained on any server.</strong>
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DatabaseZap size={15} color="var(--color-ember)" />
                  2. Ephemeral Session Memory (Zero Database Storage)
                </h4>
                <p>
                  Your card answers, scratchpad notes, appreciation letters, and mystery questions exist <strong>only in active device memory</strong> during your session. Once you leave the room or close the browser tab, that data is wiped completely. We do not store conversation logs.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px' }}>
                  3. Zero Tracking Cookies or Ads
                </h4>
                <p>
                  Between does not use third-party tracking pixels, advertising networks, or cross-site fingerprinting. We do not monetize or sell your personal information.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px' }}>
                  4. Local Device Storage
                </h4>
                <p>
                  We store your chosen display name and theme setting locally on your browser (via <code>localStorage</code>) so you don't have to re-type it each time. You can clear this at any time in your browser settings.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HeartHandshake size={15} color="var(--color-ember)" />
                  1. Not Therapy or Medical Advice
                </h4>
                <p>
                  Between is designed as a conversational catalyst and intimacy ritual for entertainment and personal reflection. <strong>It is not licensed couples therapy, psychiatric counseling, or crisis healthcare.</strong> If you or your partner are experiencing psychological distress, please seek professional support or a local crisis helpline.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px' }}>
                  2. Mutual Consent & Respect
                </h4>
                <p>
                  Between is built for consensual, respectful conversations. Players agree not to use the app for harassment, non-consensual recordings of calls, or unauthorized distribution of private statements.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px' }}>
                  3. Age Recommendation
                </h4>
                <p>
                  This application is intended for participants aged <strong>16 and older</strong> (or 18+ for deeper adult relationship themes).
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)', marginBottom: '4px' }}>
                  4. Disclaimer of Warranties
                </h4>
                <p>
                  Between is provided on an "as is" and "as available" basis without warranties of any kind. We strive for uninterrupted connectivity but cannot guarantee continuous service during network disruptions.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Button */}
        <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid var(--color-hairline)' }}>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { toggleAmbientSoundscape, playClickSound } from '../utils/audio';

export default function Header({ 
  roomCode, 
  connectionStatus, 
  isHost, 
  phaseName, 
  onExit,
  isSessionActive = false 
}) {
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    playClickSound();
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      prompt('Copy this link to send to your friend:', url);
    });
  };

  const handleToggleAudio = () => {
    playClickSound();
    const playing = toggleAmbientSoundscape();
    setIsPlayingSoundscape(playing);
  };

  return (
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 0 16px',
      borderBottom: isSessionActive ? '1px solid var(--color-hairline)' : 'none',
      marginBottom: isSessionActive ? '16px' : '0'
    }}>
      {/* Left: Exit or Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isSessionActive ? (
          <button 
            className="btn-icon" 
            onClick={onExit}
            aria-label="Exit session"
            title="Leave conversation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ember)" strokeWidth="2.2">
                <circle cx="9" cy="12" r="6" stroke="var(--color-ember)" fill="none" opacity="0.85" />
                <circle cx="15" cy="12" r="6" stroke="var(--color-ember)" fill="none" opacity="0.85" />
              </svg>
            </div>
            <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.02em' }}>
              Between
            </span>
          </div>
        )}

        {/* Phase Pill in Active Session */}
        {isSessionActive && phaseName && (
          <div className="pill-badge pill-badge-surface" style={{ fontSize: '12px', fontWeight: '600' }}>
            {phaseName}
          </div>
        )}
      </div>

      {/* Center/Right: Room Code Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {roomCode && (
          <button 
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: connectionStatus === 'CONNECTED' ? 'rgba(56, 123, 106, 0.1)' : 'rgba(217, 78, 52, 0.08)',
              border: `1px solid ${connectionStatus === 'CONNECTED' ? 'rgba(56, 123, 106, 0.3)' : 'rgba(217, 78, 52, 0.25)'}`,
              borderRadius: 'var(--radius-pill)',
              color: connectionStatus === 'CONNECTED' ? 'var(--color-sage)' : 'var(--color-ember)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Click to copy invite link for your friend"
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: connectionStatus === 'CONNECTED' ? 'var(--color-sage)' : 'var(--color-ember)'
            }}></span>
            <span>Room {roomCode}</span>
            <span style={{ opacity: 0.75, fontSize: '11px' }}>
              {copied ? '✓ Copied!' : '🔗 Copy'}
            </span>
          </button>
        )}

        {/* Ambient Soundscape Toggle */}
        <button 
          className="btn-icon"
          onClick={handleToggleAudio}
          title={isPlayingSoundscape ? "Mute warm soundscape" : "Play warm ambient soundscape"}
          style={{
            borderColor: isPlayingSoundscape ? 'var(--color-ember)' : 'var(--color-hairline)',
            background: isPlayingSoundscape ? 'rgba(217, 78, 52, 0.08)' : 'var(--color-surface)'
          }}
        >
          {isPlayingSoundscape ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"></line>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

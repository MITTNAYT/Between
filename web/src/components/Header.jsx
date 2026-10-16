import React, { useState } from 'react';
import { Sparkles, Radio, Volume2, VolumeX, Copy, Check, LogOut, Moon, Sun, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import BetweenLogo from './BetweenLogo';
import { toggleAmbientSoundscape, playClickSound } from '../utils/audio';

export default function Header({ 
  roomCode, 
  connectionStatus, 
  isHost, 
  phaseName, 
  onExit,
  isSessionActive = false,
  theme = 'sandstone',
  onToggleTheme,
  voiceCallState = 'IDLE',
  isVoiceMuted = false,
  onToggleVoiceCall,
  onToggleVoiceMute
}) {
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    playClickSound();
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => {
      prompt('Copy invite link:', url);
    });
  };

  const handleToggleAudio = () => {
    playClickSound();
    const playing = toggleAmbientSoundscape();
    setIsPlayingSoundscape(playing);
  };

  const isConnected = connectionStatus === 'CONNECTED';

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
      {/* Left: Exit or Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isSessionActive ? (
          <button 
            className="btn-icon" 
            onClick={onExit}
            aria-label="Exit session"
            title="Leave conversation"
          >
            <LogOut size={18} strokeWidth={2.2} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BetweenLogo size={38} />
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: 1.1,
                color: 'var(--color-ink)'
              }}>
                Between
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--color-muted)',
                letterSpacing: '0.04em'
              }}>
                Rituals of Closeness
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Phase or Active Room Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isSessionActive && (
          <div className="pill-badge pill-badge-surface" style={{ gap: '6px' }}>
            <Sparkles size={12} strokeWidth={2.4} color="var(--color-ember)" />
            <span style={{ fontSize: '11px', fontWeight: '700' }}>{phaseName}</span>
          </div>
        )}

        {roomCode && (
          <button
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--color-ink)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.18s'
            }}
            title="Click to copy invite link"
          >
            <span style={{ color: 'var(--color-muted)', fontSize: '10px', textTransform: 'uppercase' }}>ROOM</span>
            <span style={{ letterSpacing: '0.08em', fontFamily: 'monospace' }}>{roomCode}</span>
            {copied ? <Check size={13} strokeWidth={2.6} color="#387B6A" /> : <Copy size={13} strokeWidth={2.2} color="var(--color-muted)" />}
          </button>
        )}
      </div>

      {/* Right Controls: Voice Call, Candlelight Toggle, Ambient Sound */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* P2P Live Voice Call Toggle */}
        {roomCode && isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {voiceCallState === 'CONNECTED' ? (
              <>
                <button
                  className="btn-icon"
                  onClick={onToggleVoiceMute}
                  title={isVoiceMuted ? 'Unmute microphone' : 'Mute microphone'}
                  style={{
                    color: isVoiceMuted ? 'var(--color-ember)' : 'var(--color-sage)',
                    borderColor: isVoiceMuted ? 'var(--color-ember)' : 'var(--color-sage)'
                  }}
                >
                  {isVoiceMuted ? <MicOff size={16} strokeWidth={2.2} /> : <Mic size={16} strokeWidth={2.2} />}
                </button>

                <button
                  className="btn-icon"
                  onClick={onToggleVoiceCall}
                  title="End voice call"
                  style={{ color: '#D94E34', borderColor: 'rgba(217, 78, 52, 0.4)' }}
                >
                  <PhoneOff size={16} strokeWidth={2.2} />
                </button>
              </>
            ) : (
              <button
                className="btn-icon"
                onClick={onToggleVoiceCall}
                title={voiceCallState === 'CALLING' ? 'Calling...' : 'Start Voice Call with Friend'}
                style={{
                  color: voiceCallState === 'CALLING' ? 'var(--color-ember)' : 'var(--color-body)'
                }}
              >
                <Phone size={16} strokeWidth={2.2} />
              </button>
            )}
          </div>
        )}

        {/* Candlelight / Bedtime Night Mode Toggle */}
        <button
          className="btn-icon"
          onClick={() => {
            playClickSound();
            onToggleTheme?.();
          }}
          aria-label="Toggle Candlelight Bedtime Mode"
          title={theme === 'candlelight' ? 'Switch to Warm Sandstone' : 'Switch to Candlelight Night Mode'}
          style={{
            color: theme === 'candlelight' ? '#E5A93C' : 'var(--color-body)'
          }}
        >
          {theme === 'candlelight' ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
        </button>

        {/* Ambient Soundscape Toggle */}
        <button
          className="btn-icon"
          onClick={handleToggleAudio}
          aria-label="Toggle ambient soundscape"
          title={isPlayingSoundscape ? 'Mute ambient soundscape' : 'Play calming soundscape'}
          style={{
            borderColor: isPlayingSoundscape ? 'var(--color-ember)' : 'var(--color-hairline)',
            color: isPlayingSoundscape ? 'var(--color-ember)' : 'var(--color-body)'
          }}
        >
          {isPlayingSoundscape ? <Volume2 size={17} strokeWidth={2.2} /> : <VolumeX size={17} strokeWidth={2.2} />}
        </button>
      </div>
    </header>
  );
}

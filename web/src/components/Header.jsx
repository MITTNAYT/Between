import React, { useState } from 'react';
import { Sparkles, Radio, Volume2, VolumeX, Copy, Check, LogOut, Flame, Sun, Moon, Mic, MicOff, Phone, PhoneOff, Home, ChevronLeft } from 'lucide-react';
import BetweenLogo from './BetweenLogo';
import { toggleAmbientSoundscape, playClickSound } from '../utils/audio';

export default function Header({ 
  roomCode, 
  connectionStatus, 
  isHost, 
  phaseName, 
  onExit,
  isSessionActive = false,
  theme = 'candlelight',
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
  const [callSeconds, setCallSeconds] = useState(0);

  React.useEffect(() => {
    let interval = null;
    if (voiceCallState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallSeconds(s => s + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [voiceCallState]);

  const formatCallTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      padding: '8px 0 14px',
      borderBottom: isSessionActive ? '1px solid var(--color-hairline)' : 'none',
      marginBottom: isSessionActive ? '14px' : '0'
    }}>
      {/* Left: Exit/Home or Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexShrink: 1 }}>
        {isSessionActive ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              className="btn-icon" 
              onClick={onExit}
              aria-label="Return to Home"
              title="Return to Home"
            >
              <Home size={17} strokeWidth={2.2} />
            </button>
            <button 
              className="btn-secondary" 
              onClick={onExit}
              aria-label="Exit session"
              title="Exit ritual and return to home"
              style={{ padding: '6px 10px', fontSize: '12px', gap: '5px' }}
            >
              <LogOut size={13} strokeWidth={2.2} />
              <span className="hide-on-compact">Exit</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {roomCode && (
              <button 
                className="btn-icon" 
                onClick={onExit}
                aria-label="Back to Lobby"
                title="Cancel room and return to Home"
                style={{ width: '40px', height: '40px' }}
              >
                <ChevronLeft size={18} strokeWidth={2.4} />
              </button>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: roomCode ? 'pointer' : 'default',
                minWidth: 0
              }}
              onClick={roomCode ? onExit : undefined}
              title={roomCode ? 'Click to return to Home' : undefined}
            >
              <BetweenLogo size={36} />
              <div style={{ minWidth: 0 }}>
                <div className="header-brand-title" style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: 1.1,
                  color: 'var(--color-ink)'
                }}>
                  Between
                </div>
                <div className="header-subtitle" style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--color-muted)',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap'
                }}>
                  Rituals of Closeness
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Phase or Active Room Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {isSessionActive && (
          <div className="pill-badge pill-badge-surface" style={{ gap: '5px', padding: '5px 10px' }}>
            <Sparkles size={11} strokeWidth={2.4} color="var(--color-ember)" />
            <span style={{ fontSize: '10px', fontWeight: '700' }}>{phaseName}</span>
          </div>
        )}

        {roomCode && (
          <button
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
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
            <span className="room-pill-label" style={{ color: 'var(--color-muted)', fontSize: '10px', textTransform: 'uppercase' }}>ROOM</span>
            <span style={{ letterSpacing: '0.06em', fontFamily: 'monospace' }}>{roomCode}</span>
            {copied ? <Check size={12} strokeWidth={2.6} color="#387B6A" /> : <Copy size={12} strokeWidth={2.2} color="var(--color-muted)" />}
          </button>
        )}
      </div>

      {/* Right Controls: Voice Call, Candlelight Toggle, Ambient Sound */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {/* P2P Live Voice Call Toggle */}
        {roomCode && isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {voiceCallState === 'CONNECTED' ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px 4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(56, 123, 106, 0.12)',
                border: '1px solid rgba(56, 123, 106, 0.35)'
              }}>
                {/* Speaking waveform bars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                  <span style={{
                    width: '3px',
                    height: isVoiceMuted ? '4px' : '12px',
                    backgroundColor: isVoiceMuted ? 'var(--color-muted)' : '#387B6A',
                    borderRadius: '2px',
                    animation: isVoiceMuted ? 'none' : 'voicePulse1 0.7s infinite alternate ease-in-out'
                  }} />
                  <span style={{
                    width: '3px',
                    height: isVoiceMuted ? '4px' : '16px',
                    backgroundColor: isVoiceMuted ? 'var(--color-muted)' : '#387B6A',
                    borderRadius: '2px',
                    animation: isVoiceMuted ? 'none' : 'voicePulse2 0.85s infinite alternate ease-in-out 0.2s'
                  }} />
                  <span style={{
                    width: '3px',
                    height: isVoiceMuted ? '4px' : '9px',
                    backgroundColor: isVoiceMuted ? 'var(--color-muted)' : '#387B6A',
                    borderRadius: '2px',
                    animation: isVoiceMuted ? 'none' : 'voicePulse3 0.65s infinite alternate ease-in-out 0.4s'
                  }} />
                </div>

                {/* Call Duration */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: isVoiceMuted ? 'var(--color-muted)' : '#387B6A',
                  fontFamily: 'monospace',
                  letterSpacing: '0.04em'
                }}>
                  {formatCallTime(callSeconds)}
                </span>

                {/* Mute button */}
                <button
                  onClick={onToggleVoiceMute}
                  title={isVoiceMuted ? 'Unmute microphone' : 'Mute microphone'}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    color: isVoiceMuted ? 'var(--color-ember)' : '#387B6A',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {isVoiceMuted ? <MicOff size={14} strokeWidth={2.4} /> : <Mic size={14} strokeWidth={2.4} />}
                </button>

                {/* End Call button */}
                <button
                  onClick={onToggleVoiceCall}
                  title="End voice call"
                  style={{
                    border: 'none',
                    background: '#D94E34',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#FFF',
                    marginLeft: '2px',
                    boxShadow: '0 1px 4px rgba(217, 78, 52, 0.4)'
                  }}
                >
                  <PhoneOff size={11} strokeWidth={2.6} />
                </button>
              </div>
            ) : (
              <button
                className="btn-icon"
                onClick={onToggleVoiceCall}
                title={voiceCallState === 'CALLING' ? 'Calling partner...' : 'Start Voice Call with Partner'}
                style={{
                  color: voiceCallState === 'CALLING' ? 'var(--color-ember)' : 'var(--color-body)',
                  borderColor: voiceCallState === 'CALLING' ? 'var(--color-ember)' : 'var(--color-hairline)',
                  position: 'relative'
                }}
              >
                <Phone size={16} strokeWidth={2.2} />
                {voiceCallState === 'CALLING' && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-ember)',
                    boxShadow: '0 0 8px var(--color-ember)'
                  }} />
                )}
              </button>
            )}
          </div>
        )}

        {/* Candlelight Theme Toggle */}
        <button
          className="btn-icon"
          onClick={() => {
            playClickSound();
            onToggleTheme?.();
          }}
          aria-label="Toggle Candlelight Mode"
          title={theme === 'candlelight' ? 'Candlelight Theme Active (Click for Sandstone)' : 'Switch to Candlelight Theme'}
          style={{
            borderColor: theme === 'candlelight' ? 'rgba(229, 169, 60, 0.45)' : 'var(--color-hairline)',
            color: theme === 'candlelight' ? '#E5A93C' : 'var(--color-body)',
            boxShadow: theme === 'candlelight' ? '0 0 14px rgba(229, 169, 60, 0.28)' : 'var(--shadow-sm)'
          }}
        >
          <Flame size={17} strokeWidth={2.2} fill={theme === 'candlelight' ? '#E5A93C' : 'none'} />
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

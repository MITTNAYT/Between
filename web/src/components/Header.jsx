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
  onToggleVoiceMute,
  onShowToast,
  isPartnerSpeaking = false,
  peerName = ''
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

  const handlePhoneClick = () => {
    playClickSound();
    if (voiceCallState === 'CONNECTED' || voiceCallState === 'CALLING') {
      onToggleVoiceCall?.();
    } else if (roomCode && isConnected) {
      onToggleVoiceCall?.();
    } else if (roomCode && !isConnected) {
      onShowToast?.('Waiting for partner to connect before starting voice call 📞');
    } else {
      onShowToast?.('Voice call connects 2 players in a synchronized room 📞');
    }
  };

  return (
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '6px',
      padding: '8px 0 14px',
      borderBottom: (isSessionActive || roomCode) ? '1px solid var(--color-hairline)' : 'none',
      marginBottom: (isSessionActive || roomCode) ? '14px' : '0',
      flexWrap: 'nowrap'
    }}>
      {/* Left: Home & Exit Buttons or Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
        {isSessionActive || roomCode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => {
                playClickSound();
                onExit?.();
              }}
              aria-label="Return to Home"
              title="Return to Home"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 9px',
                minHeight: '38px',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Home size={15} strokeWidth={2.4} />
              <span className="header-btn-label">Home</span>
            </button>

            <button 
              className="btn-secondary" 
              onClick={() => {
                playClickSound();
                onExit?.();
              }}
              aria-label="Exit session"
              title="Exit ritual and leave room"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 9px',
                minHeight: '38px',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--color-ember)',
                borderColor: 'rgba(217, 78, 52, 0.35)',
                background: 'rgba(217, 78, 52, 0.06)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <LogOut size={13} strokeWidth={2.4} />
              <span className="header-btn-label">Exit</span>
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              playClickSound();
              onExit?.();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
            title="Between - Rituals of Closeness"
          >
            <BetweenLogo size={34} />
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: '600',
                lineHeight: 1.1,
                color: 'var(--color-ink)'
              }}>
                Between
              </div>
              <div className="header-subtitle" style={{
                fontSize: '10px',
                fontWeight: '600',
                color: 'var(--color-muted)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap'
              }}>
                Rituals of Closeness
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Room Code or Phase Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 1, minWidth: 0, justifyContent: 'center' }}>
        {roomCode && (
          <button
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 9px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--color-ink)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.18s',
              whiteSpace: 'nowrap'
            }}
            title="Click to copy invite link"
          >
            <span style={{ letterSpacing: '0.06em', fontFamily: 'monospace' }}>{roomCode}</span>
            {copied ? <Check size={12} strokeWidth={2.6} color="#387B6A" /> : <Copy size={12} strokeWidth={2.2} color="var(--color-muted)" />}
          </button>
        )}

        {isSessionActive && phaseName && (
          <div className="pill-badge pill-badge-surface hide-on-compact" style={{ gap: '4px', padding: '5px 8px', fontSize: '10px' }}>
            <Sparkles size={11} strokeWidth={2.4} color="var(--color-ember)" />
            <span>{phaseName}</span>
          </div>
        )}
      </div>

      {/* Right Controls: Phone Call (Always Visible), Candlelight Toggle, Ambient Sound */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {/* P2P Live Voice Call: Connected State */}
        {voiceCallState === 'CONNECTED' ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            background: isPartnerSpeaking ? 'rgba(56, 123, 106, 0.22)' : 'rgba(56, 123, 106, 0.12)',
            border: isPartnerSpeaking ? '1.5px solid #387B6A' : '1px solid rgba(56, 123, 106, 0.35)',
            boxShadow: isPartnerSpeaking ? '0 0 14px rgba(56, 123, 106, 0.55)' : 'none',
            minHeight: '38px',
            transition: 'all 0.18s ease-out'
          }}>
            {/* Speaking waveform bars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
              <span style={{
                width: '2.5px',
                height: isVoiceMuted ? '4px' : (isPartnerSpeaking ? '14px' : '10px'),
                backgroundColor: isVoiceMuted ? 'var(--color-muted)' : (isPartnerSpeaking ? '#2D937B' : '#387B6A'),
                borderRadius: '2px',
                animation: isVoiceMuted ? 'none' : 'voicePulse1 0.6s infinite alternate ease-in-out',
                transition: 'height 0.15s, background-color 0.15s'
              }} />
              <span style={{
                width: '2.5px',
                height: isVoiceMuted ? '4px' : (isPartnerSpeaking ? '17px' : '14px'),
                backgroundColor: isVoiceMuted ? 'var(--color-muted)' : (isPartnerSpeaking ? '#2D937B' : '#387B6A'),
                borderRadius: '2px',
                animation: isVoiceMuted ? 'none' : 'voicePulse2 0.75s infinite alternate ease-in-out 0.15s',
                transition: 'height 0.15s, background-color 0.15s'
              }} />
              <span style={{
                width: '2.5px',
                height: isVoiceMuted ? '4px' : (isPartnerSpeaking ? '12px' : '8px'),
                backgroundColor: isVoiceMuted ? 'var(--color-muted)' : (isPartnerSpeaking ? '#2D937B' : '#387B6A'),
                borderRadius: '2px',
                animation: isVoiceMuted ? 'none' : 'voicePulse3 0.55s infinite alternate ease-in-out 0.3s',
                transition: 'height 0.15s, background-color 0.15s'
              }} />
            </div>

            {/* Speaking Dot Indicator */}
            {isPartnerSpeaking && (
              <span 
                title={`${peerName || 'Partner'} speaking`}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#387B6A',
                  boxShadow: '0 0 8px #387B6A'
                }}
              />
            )}

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
              aria-label={isVoiceMuted ? 'Unmute microphone' : 'Mute microphone'}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '2px',
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
              aria-label="End voice call"
              style={{
                border: 'none',
                background: '#D94E34',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFF',
                marginLeft: '1px',
                boxShadow: '0 1px 4px rgba(217, 78, 52, 0.4)'
              }}
            >
              <PhoneOff size={10} strokeWidth={2.6} />
            </button>
          </div>
        ) : (
          /* Phone Call Button - Always Visible on Phone Web */
          <button
            className="btn-icon"
            onClick={handlePhoneClick}
            title={voiceCallState === 'CALLING' ? 'Calling partner...' : 'Live Voice Call with Partner'}
            aria-label="Live Voice Call"
            style={{
              minWidth: '38px',
              minHeight: '38px',
              width: '38px',
              height: '38px',
              color: voiceCallState === 'CALLING' ? 'var(--color-ember)' : (roomCode && isConnected ? '#387B6A' : 'var(--color-body)'),
              borderColor: voiceCallState === 'CALLING' ? 'var(--color-ember)' : (roomCode && isConnected ? 'rgba(56, 123, 106, 0.45)' : 'var(--color-hairline)'),
              background: (roomCode && isConnected) ? 'rgba(56, 123, 106, 0.08)' : 'var(--color-surface)',
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

        {/* Candlelight Theme Toggle - Always Visible */}
        <button
          className="btn-icon"
          onClick={() => {
            playClickSound();
            onToggleTheme?.();
          }}
          aria-label="Toggle Candlelight Mode"
          title={theme === 'candlelight' ? 'Candlelight Theme Active (Click for Sandstone)' : 'Switch to Candlelight Theme'}
          style={{
            minWidth: '38px',
            minHeight: '38px',
            width: '38px',
            height: '38px',
            borderColor: theme === 'candlelight' ? 'rgba(229, 169, 60, 0.45)' : 'var(--color-hairline)',
            color: theme === 'candlelight' ? '#E5A93C' : 'var(--color-body)',
            boxShadow: theme === 'candlelight' ? '0 0 12px rgba(229, 169, 60, 0.28)' : 'var(--shadow-sm)'
          }}
        >
          <Flame size={16} strokeWidth={2.2} fill={theme === 'candlelight' ? '#E5A93C' : 'none'} />
        </button>

        {/* Ambient Soundscape Toggle - Always Visible */}
        <button
          className="btn-icon"
          onClick={handleToggleAudio}
          aria-label="Toggle ambient soundscape"
          title={isPlayingSoundscape ? 'Mute ambient soundscape' : 'Play calming soundscape'}
          style={{
            minWidth: '38px',
            minHeight: '38px',
            width: '38px',
            height: '38px',
            borderColor: isPlayingSoundscape ? 'var(--color-ember)' : 'var(--color-hairline)',
            color: isPlayingSoundscape ? 'var(--color-ember)' : 'var(--color-body)'
          }}
        >
          {isPlayingSoundscape ? <Volume2 size={16} strokeWidth={2.2} /> : <VolumeX size={16} strokeWidth={2.2} />}
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Copy, Check, LogOut, Sun, Moon, Phone, PhoneCall, PhoneOff, Mic, MicOff } from 'lucide-react';
import BetweenLogo from './BetweenLogo';
import { playClickSound } from '../utils/audio';

export default function Header({ 
  roomCode = '', 
  connectionStatus = 'IDLE', 
  isHost = false, 
  phaseName = '', 
  onExit,
  isSessionActive = false,
  theme = 'tabletop',
  onToggleTheme,
  onShowToast,
  onOpenRoomModal,
  callState = 'IDLE',
  isMuted = false,
  callDuration = 0,
  onStartCall,
  onEndCall,
  onToggleMute
}) {
  const [copied, setCopied] = useState(false);

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    playClickSound();
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      onShowToast?.('Invite link copied! Share it with your partner 💌');
    }).catch(() => {
      prompt('Copy invite link:', url);
    });
  };

  return (
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      padding: '8px 0 12px',
      borderBottom: isSessionActive ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
      marginBottom: isSessionActive ? '12px' : '0',
      userSelect: 'none'
    }}>
      {/* Left: Brand Identity or Leave Session */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {isSessionActive ? (
          <button 
            className="btn-secondary" 
            onClick={() => {
              playClickSound();
              if (window.confirm('Leave current session and return to the game menu?')) {
                onExit?.();
              }
            }}
            aria-label="Leave session"
            title="Leave current session"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              minHeight: '40px',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--color-ink)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <LogOut size={14} strokeWidth={2.4} color="#D94E34" />
            <span>Leave</span>
          </button>
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
            title="Between - Tabletop Connection Game"
          >
            <BetweenLogo size={32} />
            <div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--color-ink)'
              }}>
                Between
              </div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)'
              }}>
                Tabletop Edition
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Session Room Badge & Optional Voice Call Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
        {isSessionActive && roomCode && (
          <button
            onClick={handleCopyLink}
            className="card-label-sticker"
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              background: '#FFFFFF',
              color: '#1C1917',
              cursor: 'pointer',
              gap: '5px'
            }}
            title="Click to copy room code & invite link"
          >
            {connectionStatus === 'CONNECTED' && (
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#387B6A', display: 'inline-block' }} />
            )}
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>{roomCode}</span>
            {copied ? <Check size={11} strokeWidth={2.6} color="#387B6A" /> : <Copy size={11} strokeWidth={2} />}
          </button>
        )}

        {/* Optional Voice Call Button / In-Call Bar (shown when in session and connected) */}
        {isSessionActive && connectionStatus === 'CONNECTED' && (
          <>
            {callState === 'IDLE' && (
              <button
                onClick={() => {
                  playClickSound();
                  onStartCall?.();
                }}
                className="card-label-sticker"
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  background: '#FFFFFF',
                  color: '#1C1917',
                  cursor: 'pointer',
                  gap: '5px',
                  border: '1px solid rgba(56, 123, 106, 0.4)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title="Start optional voice call with your partner"
              >
                <Phone size={12} strokeWidth={2.4} color="#387B6A" />
                <span style={{ fontWeight: '700', color: '#387B6A' }}>Call</span>
              </button>
            )}

            {callState === 'CALLING' && (
              <div
                className="card-label-sticker"
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  background: '#FFF5F2',
                  color: '#D94E34',
                  gap: '6px',
                  border: '1px solid rgba(217, 78, 52, 0.4)',
                  animation: 'pulseCall 1.8s infinite ease-in-out'
                }}
              >
                <PhoneCall size={12} strokeWidth={2.4} color="#D94E34" />
                <span style={{ fontWeight: '700' }}>Calling...</span>
                <button
                  onClick={() => {
                    playClickSound();
                    onEndCall?.();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8C8278',
                    cursor: 'pointer',
                    padding: '0 2px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    lineHeight: 1
                  }}
                  title="Cancel call"
                >
                  ✕
                </button>
              </div>
            )}

            {callState === 'CONNECTED' && (
              <div
                className="card-label-sticker"
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  background: '#F0F9F5',
                  color: '#1C1917',
                  gap: '6px',
                  border: '1.2px solid rgba(56, 123, 106, 0.5)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#387B6A',
                  boxShadow: '0 0 6px rgba(56, 123, 106, 0.6)',
                  animation: 'pulseDot 1.5s infinite ease-in-out'
                }} />
                
                <span className="tabular-nums" style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  fontSize: '11px',
                  color: '#387B6A'
                }}>
                  {formatCallDuration(callDuration)}
                </span>

                <button
                  onClick={() => {
                    playClickSound();
                    onToggleMute?.();
                  }}
                  style={{
                    background: isMuted ? '#FFF0ED' : '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isMuted ? '#D94E34' : '#1C1917',
                    padding: 0
                  }}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff size={11} strokeWidth={2.4} /> : <Mic size={11} strokeWidth={2.4} />}
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    onEndCall?.();
                  }}
                  style={{
                    background: '#D94E34',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    padding: 0
                  }}
                  title="End voice call"
                >
                  <PhoneOff size={11} strokeWidth={2.4} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Controls: Light / Dark Mode Tabletop Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* Tabletop Day vs Candlelight Evening */}
        <button
          className="btn-icon"
          onClick={() => {
            playClickSound();
            onToggleTheme?.();
          }}
          aria-label={theme === 'candlelight' ? 'Switch to Daylight Tabletop Mode' : 'Switch to Candlelight Night Mode'}
          title={theme === 'candlelight' ? 'Candlelight Night Mode active · Click for Daylight Mode' : 'Daylight Mode active · Click for Candlelight Night Mode'}
          style={{
            minWidth: '40px',
            minHeight: '40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--color-surface)',
            border: theme === 'candlelight' ? '1px solid rgba(229, 169, 60, 0.4)' : '1px solid var(--color-hairline)',
            boxShadow: theme === 'candlelight' ? '0 0 14px rgba(229, 169, 60, 0.28), var(--shadow-sm)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme === 'candlelight' ? '#E5A93C' : 'var(--color-ink)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {theme === 'candlelight' ? (
            <Sun size={17} strokeWidth={2.4} />
          ) : (
            <Moon size={17} strokeWidth={2.4} />
          )}
        </button>
      </div>
    </header>
  );
}

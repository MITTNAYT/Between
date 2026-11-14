import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, LogOut, Flame, Sun, Sparkles, Users } from 'lucide-react';
import BetweenLogo from './BetweenLogo';
import { toggleAmbientSoundscape, playClickSound } from '../utils/audio';

export default function Header({ 
  roomCode = '', 
  connectionStatus = 'IDLE', 
  isHost = false, 
  phaseName = '', 
  onExit,
  isSessionActive = false,
  theme = 'tabletop',
  onToggleTheme,
  onShowToast
}) {
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleToggleAudio = () => {
    playClickSound();
    const playing = toggleAmbientSoundscape();
    setIsPlayingSoundscape(playing);
    onShowToast?.(playing ? 'Ambient soundscape playing 🎵' : 'Soundscape muted 🔇');
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
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.1)',
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

      {/* Center: Session Room Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, justifyContent: 'center' }}>
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
            <Users size={12} strokeWidth={2.4} color="#387B6A" />
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{roomCode}</span>
            {copied ? <Check size={11} strokeWidth={2.6} color="#387B6A" /> : <Copy size={11} strokeWidth={2} />}
          </button>
        )}
      </div>

      {/* Right Controls: Only Soundscape & Day/Night Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* Ambient Soundscape */}
        <button
          className="btn-icon"
          onClick={handleToggleAudio}
          aria-label="Toggle ambient soundscape"
          title={isPlayingSoundscape ? 'Mute ambient soundscape' : 'Play calming soundscape'}
          style={{
            minWidth: '40px',
            minHeight: '40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isPlayingSoundscape ? 'var(--color-ember)' : 'var(--color-body)'
          }}
        >
          {isPlayingSoundscape ? <Volume2 size={16} strokeWidth={2.2} /> : <VolumeX size={16} strokeWidth={2.2} />}
        </button>

        {/* Tabletop Day vs Candlelight Evening */}
        <button
          className="btn-icon"
          onClick={() => {
            playClickSound();
            onToggleTheme?.();
          }}
          aria-label="Toggle Theme Mode"
          title={theme === 'candlelight' ? 'Candlelight Evening Active (Click for Tabletop Day)' : 'Switch to Candlelight Evening'}
          style={{
            minWidth: '40px',
            minHeight: '40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: theme === 'candlelight' ? '0 0 12px rgba(229, 169, 60, 0.35)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme === 'candlelight' ? '#E5A93C' : 'var(--color-body)'
          }}
        >
          <Flame size={16} strokeWidth={2.2} fill={theme === 'candlelight' ? '#E5A93C' : 'none'} />
        </button>
      </div>
    </header>
  );
}

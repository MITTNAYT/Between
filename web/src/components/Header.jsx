import React, { useState } from 'react';
import { Sparkles, Radio, Volume2, VolumeX, Copy, Check, LogOut, Mic, MicOff, Phone, PhoneOff, Palette } from 'lucide-react';
import BetweenLogo from './BetweenLogo';
import { toggleAmbientSoundscape, playClickSound } from '../utils/audio';

export const THEMES = [
  {
    id: 'unisex',
    label: 'Unisex',
    sublabel: 'Sandstone Linen',
    icon: '🌿',
    bg: '#F4ECE2',
    accent: '#D94E34'
  },
  {
    id: 'masculine',
    label: 'Men',
    sublabel: 'Obsidian Slate',
    icon: '🌑',
    bg: '#121418',
    accent: '#D98236'
  },
  {
    id: 'feminine',
    label: 'Women',
    sublabel: 'Blush Cashmere',
    icon: '🌸',
    bg: '#FBF4F2',
    accent: '#D64562'
  }
];

export default function Header({ 
  roomCode, 
  connectionStatus, 
  isHost, 
  phaseName, 
  onExit,
  isSessionActive = false,
  theme = 'unisex',
  onSelectTheme,
  voiceCallState = 'IDLE',
  isVoiceMuted = false,
  onToggleVoiceCall,
  onToggleVoiceMute
}) {
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [copied, setCopied] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const normalizedTheme = (theme === 'candlelight' ? 'masculine' : (theme === 'sandstone' ? 'unisex' : theme)) || 'unisex';
  const currentThemeObj = THEMES.find(t => t.id === normalizedTheme) || THEMES[0];

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

        {/* Theme Selector (Unisex / Men / Women) */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={() => {
              playClickSound();
              setThemeMenuOpen(prev => !prev);
            }}
            aria-label="Select Theme"
            title={`Atmosphere: ${currentThemeObj.label} (${currentThemeObj.sublabel})`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px'
            }}
          >
            <span>{currentThemeObj.icon}</span>
          </button>

          {themeMenuOpen && (
            <>
              {/* Invisible Backdrop to close on tap outside */}
              <div
                onClick={() => setThemeMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 90 }}
              />

              {/* Theme Popover Menu */}
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '210px',
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  zIndex: 91,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  animation: 'fadeIn 0.18s ease-out'
                }}
              >
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  padding: '6px 10px 4px'
                }}>
                  Visual Theme
                </div>

                {THEMES.map((t) => {
                  const isSelected = normalizedTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onSelectTheme?.(t.id);
                        setThemeMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--color-hairline-strong)' : '1px solid transparent',
                        background: isSelected ? 'var(--color-surface-subtle)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px' }}>{t.icon}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '600', color: 'var(--color-ink)' }}>
                            {t.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                            {t.sublabel}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: t.accent,
                        boxShadow: isSelected ? '0 0 0 2px var(--color-surface), 0 0 0 3.5px var(--color-ink)' : 'none'
                      }} />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

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

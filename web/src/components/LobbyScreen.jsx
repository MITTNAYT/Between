import React, { useState, useEffect } from 'react';
import { Heart, Users, Compass, Sparkles, ShieldCheck, Copy, Check, ArrowRight, Radio, Shuffle, User, ChevronDown, ChevronUp } from 'lucide-react';
import { RELATIONSHIP_TYPES, SESSION_LENGTHS } from '../utils/engine';
import { playClickSound } from '../utils/audio';
import { generateRandomCode } from '../utils/peer';
import { THEMES } from './Header';

const REL_ICONS = {
  COUPLE: Heart,
  FRIEND: Users,
  JUST_MET: Compass
};

export default function LobbyScreen({
  onCreateRoom,
  onJoinRoom,
  onStartSolo,
  initialRoomCode = '',
  isWaitingForGuest = false,
  roomCode = '',
  isConnected = false,
  onStartSession,
  peerName = '',
  theme = 'unisex',
  onSelectTheme
}) {
  const [tab, setTab] = useState(initialRoomCode ? 'JOIN' : 'CREATE');
  const [selectedRel, setSelectedRel] = useState('COUPLE');
  const [selectedLength, setSelectedLength] = useState('FIFTEEN_MIN');
  const [joinCodeInput, setJoinCodeInput] = useState(initialRoomCode);
  const [copiedLink, setCopiedLink] = useState(false);

  // Player Names
  const [hostNameInput, setHostNameInput] = useState(() => localStorage.getItem('between_user_name') || '');
  const [guestNameInput, setGuestNameInput] = useState(() => localStorage.getItem('between_user_name') || '');
  const [soloP1Input, setSoloP1Input] = useState(() => localStorage.getItem('between_p1_name') || localStorage.getItem('between_user_name') || '');
  const [soloP2Input, setSoloP2Input] = useState(() => localStorage.getItem('between_p2_name') || '');
  const [showSoloConfig, setShowSoloConfig] = useState(false);

  // Randomly Generated Room Code
  const [randomRoomCode, setRandomRoomCode] = useState(() => generateRandomCode(5));

  useEffect(() => {
    if (initialRoomCode) {
      setTab('JOIN');
      setJoinCodeInput(initialRoomCode);
    }
  }, [initialRoomCode]);

  const handleRegenerateCode = () => {
    playClickSound();
    setRandomRoomCode(generateRandomCode(5));
  };

  const handleCopyInviteLink = () => {
    playClickSound();
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }).catch(() => {
      prompt('Copy invite link:', url);
    });
  };

  const handleCreateSubmit = (e) => {
    if (e) e.preventDefault();
    playClickSound();
    const myName = hostNameInput.trim() || 'Partner 1';
    localStorage.setItem('between_user_name', myName);
    onCreateRoom({
      relationshipType: selectedRel,
      sessionLength: selectedLength,
      roomCode: randomRoomCode,
      userName: myName
    });
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    playClickSound();
    const myName = guestNameInput.trim() || 'Partner 2';
    localStorage.setItem('between_user_name', myName);
    onJoinRoom({
      roomCode: joinCodeInput.trim().toUpperCase(),
      userName: myName
    });
  };

  const handleSoloSubmit = () => {
    playClickSound();
    const p1 = soloP1Input.trim() || 'Partner 1';
    const p2 = soloP2Input.trim() || 'Partner 2';
    localStorage.setItem('between_p1_name', p1);
    localStorage.setItem('between_p2_name', p2);
    onStartSolo({
      relationshipType: selectedRel,
      sessionLength: selectedLength,
      p1Name: p1,
      p2Name: p2
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      animation: 'fadeIn 0.35s ease-out'
    }}>
      {/* Brand Hero Greeting */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(217, 78, 52, 0.08)',
          border: '1px solid rgba(217, 78, 52, 0.2)',
          color: 'var(--color-ember)',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          <Sparkles size={12} strokeWidth={2.5} />
          <span>Intimate Multiplayer</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '34px',
          fontWeight: '600',
          color: 'var(--color-ink)',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          Closeness Across Distance
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'var(--color-body)',
          lineHeight: '1.55',
          maxWidth: '420px',
          margin: '0 auto'
        }}>
          A synchronized card ritual for two screens. Flip questions, pass turns, and share moments in real-time.
        </p>
      </div>

      {/* Host waiting room card */}
      {isWaitingForGuest ? (
        <div className="soft-card" style={{
          padding: '32px 24px',
          textAlign: 'center',
          border: '1.5px solid rgba(217, 78, 52, 0.35)',
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isConnected ? 'rgba(56, 123, 106, 0.12)' : 'rgba(217, 78, 52, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: isConnected ? 'var(--color-sage)' : 'var(--color-ember)'
          }}>
            {isConnected ? <Sparkles size={28} strokeWidth={2.2} /> : <Radio size={28} strokeWidth={2.2} className="audio-bar" />}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '6px'
          }}>
            {isConnected ? `${peerName || 'Partner'} Connected!` : 'Waiting for Partner'}
          </h2>

          <p style={{
            fontSize: '14px',
            color: 'var(--color-body)',
            marginBottom: '20px'
          }}>
            {isConnected 
              ? `Both screens are synchronized! Press below when you and ${peerName || 'your partner'} are ready to begin.`
              : `Share this randomly generated link or room code with your partner to connect.`}
          </p>

          {/* Big Code Pill with quick copy */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            background: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '0.08em' }}>ROOM CODE:</span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '0.18em',
              color: 'var(--color-ember)'
            }}>
              {roomCode}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleCopyInviteLink}
              className="btn-secondary"
              style={{ width: '100%', padding: '13px', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {copiedLink ? <Check size={18} strokeWidth={2.4} color="#387B6A" /> : <Copy size={18} strokeWidth={2.2} />}
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy 1-Click Invite Link'}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onStartSession();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '15px' }}
            >
              <span>{isConnected ? `Begin Intimate Ritual with ${peerName || 'Partner'}` : 'Start Session (Or Play Solo)'}</span>
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Segmented Switcher: CREATE ROOM vs JOIN ROOM */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.04)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)'
          }}>
            <button
              type="button"
              onClick={() => { playClickSound(); setTab('CREATE'); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: tab === 'CREATE' ? 'var(--color-surface)' : 'transparent',
                color: tab === 'CREATE' ? 'var(--color-ink)' : 'var(--color-muted)',
                fontWeight: tab === 'CREATE' ? '700' : '500',
                fontSize: '14px',
                boxShadow: tab === 'CREATE' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.18s'
              }}
            >
              Create Room
            </button>

            <button
              type="button"
              onClick={() => { playClickSound(); setTab('JOIN'); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: tab === 'JOIN' ? 'var(--color-surface)' : 'transparent',
                color: tab === 'JOIN' ? 'var(--color-ink)' : 'var(--color-muted)',
                fontWeight: tab === 'JOIN' ? '700' : '500',
                fontSize: '14px',
                boxShadow: tab === 'JOIN' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.18s'
              }}
            >
              Join Room
            </button>
          </div>

          {/* TAB 1: CREATE ROOM */}
          {tab === 'CREATE' && (
            <div className="soft-card" style={{ padding: '24px' }}>
              {/* Name Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: '8px'
                }}>
                  <User size={13} strokeWidth={2.4} />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={hostNameInput}
                  onChange={(e) => setHostNameInput(e.target.value)}
                  placeholder="e.g. Sarah"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-hairline)',
                    background: 'var(--color-surface-subtle)',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--color-ink)',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-ember)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-hairline)'}
                />
              </div>

              {/* Relationship Selector */}
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: '10px'
              }}>
                Select Connection Type
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {Object.values(RELATIONSHIP_TYPES).map((rel) => {
                  const isSelected = selectedRel === rel.id;
                  const Icon = REL_ICONS[rel.id] || Heart;
                  return (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => { playClickSound(); setSelectedRel(rel.id); }}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${rel.color}` : '1px solid var(--color-hairline)',
                        background: isSelected ? 'var(--color-surface)' : 'var(--color-surface-subtle)',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isSelected ? `${rel.color}18` : 'rgba(0,0,0,0.04)',
                        color: rel.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                        transition: 'transform 0.2s'
                      }}>
                        <Icon size={17} strokeWidth={2.4} />
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isSelected ? '700' : '600',
                        color: isSelected ? 'var(--color-ink)' : 'var(--color-body)'
                      }}>
                        {rel.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Duration Selector */}
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: '10px'
              }}>
                Ritual Length
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {Object.values(SESSION_LENGTHS).map((len) => {
                  const isSelected = selectedLength === len.id;
                  return (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => { playClickSound(); setSelectedLength(len.id); }}
                      style={{
                        padding: '12px 6px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-ink)' : '1px solid var(--color-hairline)',
                        background: isSelected ? 'var(--color-surface)' : 'var(--color-surface-subtle)',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-ink)' }}>
                        {len.tabLabel}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '2px' }}>
                        {len.count} cards
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Visual Atmosphere Theme Selector */}
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: '10px'
              }}>
                Visual Atmosphere
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {THEMES.map((t) => {
                  const normalizedTheme = (theme === 'candlelight' ? 'masculine' : (theme === 'sandstone' ? 'unisex' : theme)) || 'unisex';
                  const isSelected = normalizedTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onSelectTheme?.(t.id);
                      }}
                      style={{
                        padding: '12px 6px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-ink)' : '1px solid var(--color-hairline)',
                        background: isSelected ? 'var(--color-surface)' : 'var(--color-surface-subtle)',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{t.icon}</span>
                      <div style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '600', color: 'var(--color-ink)' }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                        {t.sublabel}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Random Room Code Preview */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(217, 78, 52, 0.05)',
                border: '1px dashed rgba(217, 78, 52, 0.25)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '22px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Random Room Code
                  </span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '18px',
                    fontWeight: '800',
                    letterSpacing: '0.12em',
                    color: 'var(--color-ember)'
                  }}>
                    {randomRoomCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="pill-badge pill-badge-surface"
                  style={{ cursor: 'pointer', gap: '5px', padding: '6px 12px', fontSize: '12px', border: '1px solid var(--color-hairline)' }}
                  title="Generate a new random room code"
                >
                  <Shuffle size={12} strokeWidth={2.4} />
                  <span>Randomize</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCreateSubmit}
                  className="btn-primary"
                  style={{ width: '100%', padding: '15px' }}
                >
                  <span>Create Synchronized Room</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </button>

                {/* Offline Pass the Phone Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowSoloConfig(prev => !prev);
                  }}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Play Solo / Pass the Phone (Offline)</span>
                  {showSoloConfig ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Expandable Player Names for Offline Mode */}
                {showSoloConfig && (
                  <div style={{
                    padding: '16px',
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-ink)' }}>
                      Enter Both Player Names:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--color-muted)', marginBottom: '4px' }}>
                          PLAYER 1 NAME
                        </label>
                        <input
                          type="text"
                          maxLength={20}
                          value={soloP1Input}
                          onChange={(e) => setSoloP1Input(e.target.value)}
                          placeholder="e.g. Sarah"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-hairline)',
                            background: 'var(--color-surface)',
                            color: 'var(--color-ink)',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--color-muted)', marginBottom: '4px' }}>
                          PLAYER 2 NAME
                        </label>
                        <input
                          type="text"
                          maxLength={20}
                          value={soloP2Input}
                          onChange={(e) => setSoloP2Input(e.target.value)}
                          placeholder="e.g. Alex"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-hairline)',
                            background: 'var(--color-surface)',
                            color: 'var(--color-ink)',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSoloSubmit}
                      className="btn-primary"
                      style={{ width: '100%', padding: '12px', marginTop: '4px' }}
                    >
                      <span>Start Offline Ritual</span>
                      <ArrowRight size={16} strokeWidth={2.4} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: JOIN ROOM */}
          {tab === 'JOIN' && (
            <form onSubmit={handleJoinSubmit} className="soft-card" style={{ padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '22px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Join Friend's Room
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>
                  Enter your name and the room code your friend or partner shared with you.
                </p>
              </div>

              {/* Guest Name Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: '6px'
                }}>
                  <User size={13} strokeWidth={2.4} />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="e.g. Alex"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-hairline)',
                    background: 'var(--color-surface-subtle)',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--color-ink)',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-ember)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-hairline)'}
                />
              </div>

              {/* Room Code Input */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: '6px'
                }}>
                  Room Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. K7M2W"
                  style={{
                    width: '100%',
                    padding: '14px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '28px',
                    fontWeight: '800',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink)',
                    background: 'var(--color-surface-subtle)',
                    border: '1.5px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={joinCodeInput.trim().length < 4}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  opacity: joinCodeInput.trim().length >= 4 ? 1 : 0.5,
                  cursor: joinCodeInput.trim().length >= 4 ? 'pointer' : 'not-allowed'
                }}
              >
                <span>Connect to Room</span>
                <ArrowRight size={18} strokeWidth={2.4} />
              </button>
            </form>
          )}
        </>
      )}

      {/* Reassurance Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--color-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <ShieldCheck size={14} strokeWidth={2.2} />
        <span>Peer-to-peer encrypted · Zero accounts required · Private & open source</span>
      </div>
    </div>
  );
}

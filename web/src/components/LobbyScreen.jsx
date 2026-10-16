import React, { useState, useEffect } from 'react';
import { Heart, Users, Compass, Clock, Sparkles, ShieldCheck, Copy, Check, ArrowRight, Lock, Radio } from 'lucide-react';
import { RELATIONSHIP_TYPES, SESSION_LENGTHS } from '../utils/engine';
import { playClickSound } from '../utils/audio';

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
  onStartSession
}) {
  const [tab, setTab] = useState(initialRoomCode ? 'JOIN' : 'CREATE');
  const [selectedRel, setSelectedRel] = useState('COUPLE');
  const [selectedLength, setSelectedLength] = useState('FIFTEEN_MIN');
  const [joinCodeInput, setJoinCodeInput] = useState(initialRoomCode);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (initialRoomCode) {
      setTab('JOIN');
      setJoinCodeInput(initialRoomCode);
    }
  }, [initialRoomCode]);

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
    e.preventDefault();
    playClickSound();
    onCreateRoom({
      relationshipType: selectedRel,
      sessionLength: selectedLength
    });
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    playClickSound();
    onJoinRoom(joinCodeInput.trim().toUpperCase());
  };

  const handleSoloSubmit = () => {
    playClickSound();
    onStartSolo({
      relationshipType: selectedRel,
      sessionLength: selectedLength
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
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDFB 100%)',
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
            {isConnected ? 'Friend Connected!' : 'Waiting for Friend'}
          </h2>

          <p style={{
            fontSize: '14px',
            color: 'var(--color-body)',
            marginBottom: '20px'
          }}>
            {isConnected 
              ? 'Both screens are synchronized. Press below when you are ready to begin.'
              : 'Send this 1-click link to your partner or friend. No signups required.'}
          </p>

          {/* Big Code Pill */}
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
              <span>{isConnected ? 'Begin Intimate Ritual' : 'Start Session (Or Play Solo)'}</span>
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
                1. Select Connection Type
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '24px'
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
                2. Ritual Length
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '26px'
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

                <button
                  type="button"
                  onClick={handleSoloSubmit}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  Play Solo / Pass the Phone (Offline)
                </button>
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
                  Enter the 4-letter room code your partner or friend shared with you.
                </p>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <input
                  type="text"
                  maxLength={4}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="ABCD"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '16px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '34px',
                    fontWeight: '800',
                    letterSpacing: '0.28em',
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
                disabled={joinCodeInput.trim().length !== 4}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  opacity: joinCodeInput.trim().length === 4 ? 1 : 0.5,
                  cursor: joinCodeInput.trim().length === 4 ? 'pointer' : 'not-allowed'
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

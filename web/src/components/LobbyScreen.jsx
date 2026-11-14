import React, { useState, useEffect } from 'react';
import { Heart, Users, Compass, QrCode, Sparkles, ShieldCheck, Copy, Check, ArrowRight, Radio, Shuffle, User, Home, ChevronLeft } from 'lucide-react';
import QRCode from 'qrcode';
import { RELATIONSHIP_TYPES, SESSION_LENGTHS } from '../utils/engine';
import { playClickSound } from '../utils/audio';
import { generateRandomCode } from '../utils/peer';
import { NeedleMascot, GhostMascot, PizzaMascot } from './CardMascots';

const REL_ICONS = {
  COUPLE: Heart,
  FRIEND: Users,
  JUST_MET: Compass
};

export default function LobbyScreen({
  onCreateRoom,
  onJoinRoom,
  initialRoomCode = '',
  isWaitingForGuest = false,
  connectionStatus = 'IDLE',
  isHost = false,
  errorMessage = '',
  onCancelRoom,
  roomCode = '',
  isConnected = false,
  onStartSession,
  peerName = '',
  myName = 'Partner 1',
  onOpenLegal
}) {
  // Mode: 'CREATE' | 'JOIN'
  const [mode, setMode] = useState(initialRoomCode ? 'JOIN' : 'CREATE');
  const [selectedRel, setSelectedRel] = useState('COUPLE');
  const [selectedLength, setSelectedLength] = useState('FIFTEEN_MIN');
  const [joinCodeInput, setJoinCodeInput] = useState(initialRoomCode);
  const [copiedLink, setCopiedLink] = useState(false);

  // Player Name
  const [userNameInput, setUserNameInput] = useState(() => localStorage.getItem('between_user_name') || '');

  // QR Code
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Random 5-character Room Code for host
  const [randomRoomCode, setRandomRoomCode] = useState(() => generateRandomCode(5));

  useEffect(() => {
    if (initialRoomCode) {
      setMode('JOIN');
      setJoinCodeInput(initialRoomCode);
    }
  }, [initialRoomCode]);

  useEffect(() => {
    if (roomCode) {
      const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
      QRCode.toDataURL(url, {
        margin: 1,
        width: 240,
        color: { dark: '#1C1917', light: '#FFFFFF' }
      }).then(urlData => {
        setQrDataUrl(urlData);
      }).catch(err => console.warn('QR code generation error:', err));
    } else {
      setQrDataUrl('');
    }
  }, [roomCode]);

  const handleCopyInviteLink = () => {
    playClickSound();
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }).catch(() => prompt('Copy invite link:', url));
  };

  const handleCreateRoomSubmit = (e) => {
    if (e) e.preventDefault();
    playClickSound();
    const myName = userNameInput.trim() || 'Partner 1';
    localStorage.setItem('between_user_name', myName);
    onCreateRoom({
      relationshipType: selectedRel,
      sessionLength: selectedLength,
      roomCode: randomRoomCode,
      userName: myName
    });
  };

  const handleJoinRoomSubmit = (e) => {
    if (e) e.preventDefault();
    if (!joinCodeInput.trim()) return;
    playClickSound();
    const myName = userNameInput.trim() || 'Partner 2';
    localStorage.setItem('between_user_name', myName);
    onJoinRoom({
      roomCode: joinCodeInput.trim().toUpperCase(),
      userName: myName
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '460px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'fadeIn 0.3s ease-out',
      userSelect: 'none'
    }}>
      {/* Tabletop Box Header */}
      <div style={{ textAlign: 'center', padding: '4px 0 2px' }}>
        <div className="card-label-sticker" style={{ margin: '0 auto 8px', gap: '6px' }}>
          <span>★ Tabletop Edition</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(22px, 5.5vw, 28px)',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          lineHeight: '1.25',
          margin: '0 0 6px'
        }}>
          A Tabletop Game for Two
        </h1>
        <p style={{
          fontSize: '13.5px',
          color: 'var(--color-body)',
          lineHeight: '1.45',
          maxWidth: '380px',
          margin: '0 auto 12px'
        }}>
          Thought-provoking questions, tailored follow-ups, and interactive challenges.
        </p>

        {/* Visual Tabletop Card Preview Fan matching the German reference photo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          margin: '0 auto 4px',
          padding: '6px 0',
          userSelect: 'none'
        }}>
          {/* Card 1: Nähcafe */}
          <div style={{
            width: '74px',
            height: '104px',
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '4px',
            boxShadow: '0 8px 18px rgba(28, 25, 23, 0.12)',
            transform: 'rotate(-9deg) translateY(4px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: '#A8CEEB',
              borderRadius: '6px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 2px'
            }}>
              <div style={{ alignSelf: 'flex-start', width: '12px', height: '12px', borderRadius: '50%', background: '#1C1917', color: '#FFF', fontSize: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>★</div>
              <NeedleMascot size={34} />
              <div style={{ background: '#FFF', color: '#1C1917', fontSize: '6px', fontWeight: '800', padding: '1px 3px', borderRadius: '2px', textTransform: 'uppercase' }}>NÄHCAFE</div>
            </div>
          </div>

          {/* Card 2: Downcycling (Ghost) */}
          <div style={{
            width: '84px',
            height: '118px',
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '5px',
            boxShadow: '0 12px 24px rgba(28, 25, 23, 0.16)',
            transform: 'translateY(-4px)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: '#A8CEEB',
              borderRadius: '7px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 3px'
            }}>
              <div style={{ alignSelf: 'flex-start', width: '14px', height: '14px', borderRadius: '50%', background: '#1C1917', color: '#FFF', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>★</div>
              <GhostMascot size={44} />
              <div style={{ background: '#FFF', color: '#1C1917', fontSize: '7px', fontWeight: '800', padding: '1px 4px', borderRadius: '2px', textTransform: 'uppercase' }}>DOWNCYCLING</div>
            </div>
          </div>

          {/* Card 3: Speckgürtel (Pizza) */}
          <div style={{
            width: '74px',
            height: '104px',
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '4px',
            boxShadow: '0 8px 18px rgba(28, 25, 23, 0.12)',
            transform: 'rotate(9deg) translateY(4px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: '#A8CEEB',
              borderRadius: '6px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 2px'
            }}>
              <div style={{ alignSelf: 'flex-start', width: '12px', height: '12px', borderRadius: '50%', background: '#1C1917', color: '#FFF', fontSize: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>★</div>
              <PizzaMascot size={34} />
              <div style={{ background: '#FFF', color: '#1C1917', fontSize: '6px', fontWeight: '800', padding: '1px 3px', borderRadius: '2px', textTransform: 'uppercase' }}>SPECKGÜRTEL</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. ERROR STATE */}
      {(errorMessage || connectionStatus === 'ERROR') ? (
        <div className="tabletop-playing-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(217, 78, 52, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: 'var(--color-ember)'
          }}>
            <ShieldCheck size={26} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: 'var(--color-ink)' }}>
            Connection Failed
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-body)', margin: '0 0 16px' }}>
            {errorMessage || 'Could not connect to room. Check code and partner connection.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => onCancelRoom?.()}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', minHeight: '44px' }}
            >
              Return to Menu
            </button>
          </div>
        </div>
      ) : (!isHost && connectionStatus === 'CONNECTING') ? (
        /* 2. GUEST CONNECTING STATE */
        <div className="tabletop-playing-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(229, 169, 60, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: 'var(--color-gold)'
          }}>
            <Radio size={26} strokeWidth={2.4} className="audio-bar" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: 'var(--color-ink)' }}>
            Connecting to Room {roomCode}...
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-body)', margin: '0 0 16px' }}>
            Synchronizing cards with your partner...
          </p>
          <button
            onClick={() => onCancelRoom?.()}
            className="btn-secondary"
            style={{ width: '100%', padding: '10px', minHeight: '44px' }}
          >
            Cancel
          </button>
        </div>
      ) : (!isHost && isConnected) ? (
        /* 3. GUEST CONNECTED WAITING FOR HOST */
        <div className="tabletop-playing-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(56, 123, 106, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: 'var(--color-sage)'
          }}>
            <Sparkles size={26} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: 'var(--color-ink)' }}>
            Connected with {peerName || 'Host'}!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-body)', margin: '0 0 16px' }}>
            Both screens are synchronized. Waiting for {peerName || 'host'} to deal the first card...
          </p>
          <button
            onClick={() => onCancelRoom?.()}
            className="btn-secondary"
            style={{ width: '100%', padding: '10px', minHeight: '44px' }}
          >
            Leave Room
          </button>
        </div>
      ) : isWaitingForGuest ? (
        /* 4. HOST WAITING ROOM */
        <div className="tabletop-playing-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: isConnected ? 'rgba(56, 123, 106, 0.12)' : 'rgba(217, 78, 52, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            color: isConnected ? 'var(--color-sage)' : 'var(--color-ember)'
          }}>
            {isConnected ? <Sparkles size={24} strokeWidth={2.4} /> : <Radio size={24} strokeWidth={2.4} />}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            {isConnected ? `${peerName || 'Partner'} is Ready!` : 'Room Created'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-body)', margin: '0 0 14px' }}>
            {isConnected ? 'Both screens are linked. Tap below to deal the deck!' : 'Share this 5-letter room code with your partner:'}
          </p>

          {/* Large Room Code Token */}
          <div style={{
            background: '#F6F3EE',
            border: '2px dashed rgba(28, 25, 23, 0.18)',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '28px',
              fontWeight: '900',
              letterSpacing: '0.14em',
              color: 'var(--color-ink)'
            }}>
              {roomCode}
            </span>
            <button
              onClick={handleCopyInviteLink}
              className="card-label-sticker"
              style={{ cursor: 'pointer', padding: '6px 12px', gap: '4px', fontSize: '11px' }}
            >
              {copiedLink ? <Check size={12} strokeWidth={2.6} color="#387B6A" /> : <Copy size={12} strokeWidth={2.2} />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* QR Code Toggle */}
          {qrDataUrl && (
            <div style={{ marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => { playClickSound(); setShowQrCode(!showQrCode); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--color-ember)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <QrCode size={13} strokeWidth={2.4} />
                <span>{showQrCode ? 'Hide QR Code' : 'Show Camera QR Code'}</span>
              </button>
              {showQrCode && (
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                  <img src={qrDataUrl} alt="Scan to join" style={{ width: '130px', height: '130px', borderRadius: '8px' }} />
                </div>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => {
                playClickSound();
                onStartSession();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', minHeight: '46px', fontSize: '14px', fontWeight: '800' }}
            >
              <span>{isConnected ? `Deal Cards with ${peerName}` : 'Deal Deck & Start'}</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </button>
            <button
              onClick={() => onCancelRoom?.()}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', minHeight: '44px', fontSize: '12.5px' }}
            >
              Cancel & Return Home
            </button>
          </div>
        </div>
      ) : (
        /* 5. MAIN CLEAN MENU */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Segmented Mode Switcher: 2 Clear Options */}
          <div style={{
            display: 'flex',
            background: 'rgba(28, 25, 23, 0.06)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => { playClickSound(); setMode('CREATE'); }}
              style={{
                flex: 1,
                minHeight: '44px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: mode === 'CREATE' ? '#FFFFFF' : 'transparent',
                color: mode === 'CREATE' ? '#1C1917' : 'var(--color-muted)',
                fontWeight: mode === 'CREATE' ? '800' : '600',
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: mode === 'CREATE' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.18s'
              }}
            >
              <Users size={15} strokeWidth={2.4} />
              <span>Create Room</span>
            </button>

            <button
              type="button"
              onClick={() => { playClickSound(); setMode('JOIN'); }}
              style={{
                flex: 1,
                minHeight: '44px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: mode === 'JOIN' ? '#FFFFFF' : 'transparent',
                color: mode === 'JOIN' ? '#1C1917' : 'var(--color-muted)',
                fontWeight: mode === 'JOIN' ? '800' : '600',
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: mode === 'JOIN' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.18s'
              }}
            >
              <Radio size={15} strokeWidth={2.4} />
              <span>Join Room</span>
            </button>
          </div>

          {/* Card Container for Configuration */}
          <div className="tabletop-playing-card" style={{ padding: '20px 18px' }}>
            {/* 1. Player Names */}
            {mode === 'CREATE' ? (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: '8px'
                }}>
                  Your Name
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  placeholder="e.g. Alex"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    background: '#F9F7F4',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--color-ink)',
                    outline: 'none'
                  }}
                />
              </div>
            ) : (
              /* JOIN TAB INPUTS */
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      marginBottom: '8px'
                    }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={userNameInput}
                      onChange={(e) => setUserNameInput(e.target.value)}
                      placeholder="e.g. Jordan"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(0,0,0,0.1)',
                        background: '#F9F7F4',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'var(--color-ink)',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      marginBottom: '8px'
                    }}>
                      Room Code
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      placeholder="5-LETTERS"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(0,0,0,0.1)',
                        background: '#F9F7F4',
                        fontSize: '14px',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        color: 'var(--color-ink)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Connection Type & Session Length Selection (Only for Create Room) */}
            {mode === 'CREATE' && (
              <>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: '8px'
                }}>
                  Connection Type
                </label>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '16px'
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
                          padding: '12px 6px',
                          minHeight: '82px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #1C1917' : '1px solid rgba(0,0,0,0.08)',
                          background: isSelected ? '#FFFFFF' : '#F9F7F4',
                          boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          position: 'relative',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.18s'
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: '#1C1917',
                            color: '#FFFFFF',
                            fontSize: '8px',
                            fontWeight: '900',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            ★
                          </div>
                        )}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: `${rel.color}22`,
                          color: rel.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={14} strokeWidth={2.4} />
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: isSelected ? '800' : '600',
                          color: '#1C1917'
                        }}>
                          {rel.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Session Length */}
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: '8px'
                }}>
                  Deck Length
                </label>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                  marginBottom: '18px'
                }}>
                  {Object.values(SESSION_LENGTHS).map((len) => {
                    const isSelected = selectedLength === len.id;
                    return (
                      <button
                        key={len.id}
                        type="button"
                        onClick={() => { playClickSound(); setSelectedLength(len.id); }}
                        style={{
                          padding: '8px 4px',
                          minHeight: '48px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #1C1917' : '1px solid rgba(0,0,0,0.08)',
                          background: isSelected ? '#FFFFFF' : '#F9F7F4',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#1C1917' }}>
                          {len.tabLabel}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: '600' }}>
                          {len.count} cards
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Primary Action Button */}
            {mode === 'CREATE' ? (
              <button
                onClick={handleCreateRoomSubmit}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', minHeight: '48px', fontSize: '14.5px', fontWeight: '800' }}
              >
                <span>Deal Tabletop Deck</span>
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
            ) : (
              <button
                onClick={handleJoinRoomSubmit}
                disabled={!joinCodeInput.trim()}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  minHeight: '48px',
                  fontSize: '14.5px',
                  fontWeight: '800',
                  opacity: joinCodeInput.trim() ? 1 : 0.45
                }}
              >
                <span>Connect & Join Deck</span>
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Legal & Privacy */}
      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        <button
          onClick={() => { playClickSound(); onOpenLegal?.(); }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '11px',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Privacy Policy & Terms
        </button>
      </div>
    </div>
  );
}

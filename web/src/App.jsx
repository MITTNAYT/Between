import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Feather, Flame, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import LobbyScreen from './components/LobbyScreen';
import QuestionCard from './components/QuestionCard';
import ReactionBar from './components/ReactionBar';
import HandshakeModal from './components/HandshakeModal';
import ArrivalPauseModal from './components/ArrivalPauseModal';
import ClosingScreen from './components/ClosingScreen';
import ThreeCanvas from './components/ThreeCanvas';
import { buildSession, swapQuestion, RELATIONSHIP_TYPES } from './utils/engine';
import { multiplayerSync } from './utils/peer';
import { playClickSound, playChimeSound, playReactionSound, playHandshakeSound } from './utils/audio';

export default function App() {
  const [screen, setScreen] = useState('LOBBY'); // 'LOBBY' | 'SESSION' | 'CLOSING'
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isSolo, setIsSolo] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('IDLE');
  
  // Player Names
  const [hostName, setHostName] = useState(() => localStorage.getItem('between_host_name') || localStorage.getItem('between_user_name') || 'Partner 1');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('between_guest_name') || 'Partner 2');

  // Theme: 'unisex' (sandstone) | 'masculine' (obsidian slate) | 'feminine' (blush cashmere)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('between_theme');
    if (saved === 'candlelight') return 'masculine';
    if (saved === 'sandstone') return 'unisex';
    return saved || 'unisex';
  });

  const [relationshipType, setRelationshipType] = useState('COUPLE');
  const [sessionLength, setSessionLength] = useState('FIFTEEN_MIN');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState('host'); // 'host' | 'guest'
  const [bookmarkedMoments, setBookmarkedMoments] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [swipeClass, setSwipeClass] = useState('');

  // Presence Touch Ripples
  const [touchRipples, setTouchRipples] = useState([]);

  // Arrival Pause Grounding breath
  const [arrivalPauseOpen, setArrivalPauseOpen] = useState(false);

  // Blind Reveal state
  const [blindState, setBlindState] = useState({
    myAnswer: '',
    peerAnswer: '',
    mySubmitted: false,
    peerSubmitted: false
  });

  // Deep questions handshake state
  const [handshakeOpen, setHandshakeOpen] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [pendingTargetIndex, setPendingTargetIndex] = useState(null);

  // WebRTC Voice Call State
  const [voiceCallState, setVoiceCallState] = useState('IDLE');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const remoteAudioRef = useRef(null);

  // Synchronize document theme
  useEffect(() => {
    const normalizedTheme = (theme === 'candlelight' ? 'masculine' : (theme === 'sandstone' ? 'unisex' : theme)) || 'unisex';
    document.documentElement.setAttribute('data-theme', normalizedTheme);
    localStorage.setItem('between_theme', normalizedTheme);
  }, [theme]);

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Keep a ref to current state for peer callbacks
  const stateRef = useRef({
    screen,
    roomCode,
    isHost,
    isSolo,
    hostName,
    guestName,
    connectionStatus,
    relationshipType,
    sessionLength,
    questions,
    currentIndex,
    currentTurn,
    bookmarkedMoments,
    blindState
  });

  useEffect(() => {
    stateRef.current = {
      screen,
      roomCode,
      isHost,
      isSolo,
      hostName,
      guestName,
      connectionStatus,
      relationshipType,
      sessionLength,
      questions,
      currentIndex,
      currentTurn,
      bookmarkedMoments,
      blindState
    };
  }, [screen, roomCode, isHost, isSolo, hostName, guestName, connectionStatus, relationshipType, sessionLength, questions, currentIndex, currentTurn, bookmarkedMoments, blindState]);

  // Floating reaction spawner
  const spawnReaction = useCallback((emoji, sender) => {
    const id = `${Date.now()}-${Math.random()}`;
    const xPos = 38 + Math.random() * 24;
    setFloatingReactions(prev => [...prev, { id, emoji, sender, xPos }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2600);
  }, []);

  // Spawn presence touch ripple
  const spawnTouchRipple = useCallback((xPercent, yPercent) => {
    const id = `${Date.now()}-${Math.random()}`;
    setTouchRipples(prev => [...prev, { id, x: xPercent, y: yPercent }]);
    playClickSound();
    setTimeout(() => {
      setTouchRipples(prev => prev.filter(r => r.id !== id));
    }, 1600);
  }, []);

  // Peer Event Handlers
  const handleStatusChange = useCallback((statusData) => {
    setConnectionStatus(statusData.status);
    if (statusData.roomCode) setRoomCode(statusData.roomCode);
    if (typeof statusData.isHost === 'boolean') setIsHost(statusData.isHost);

    if (statusData.myName) {
      if (statusData.isHost) setHostName(statusData.myName);
      else setGuestName(statusData.myName);
    }
    if (statusData.peerName) {
      if (statusData.isHost) setGuestName(statusData.peerName);
      else setHostName(statusData.peerName);
    }

    if (statusData.isHost && statusData.status === 'CONNECTED') {
      const cur = stateRef.current;
      multiplayerSync.syncState({
        screen: cur.screen,
        relationshipType: cur.relationshipType,
        sessionLength: cur.sessionLength,
        questions: cur.questions,
        currentIndex: cur.currentIndex,
        currentTurn: cur.currentTurn,
        bookmarkedMoments: cur.bookmarkedMoments,
        hostName: cur.hostName,
        guestName: statusData.peerName || cur.guestName
      });
    }
  }, []);

  const handleStateChange = useCallback((incoming) => {
    if (!incoming) return;

    if (incoming.screen !== undefined && incoming.screen !== stateRef.current.screen) {
      setScreen(incoming.screen);
    }
    if (incoming.relationshipType) setRelationshipType(incoming.relationshipType);
    if (incoming.sessionLength) setSessionLength(incoming.sessionLength);
    if (incoming.questions) setQuestions(incoming.questions);
    if (incoming.hostName) setHostName(incoming.hostName);
    if (incoming.guestName) setGuestName(incoming.guestName);

    if (incoming.currentIndex !== undefined && incoming.currentIndex !== stateRef.current.currentIndex) {
      const isNext = incoming.currentIndex > stateRef.current.currentIndex;
      setSwipeClass(isNext ? 'swipe-out-left' : 'swipe-out-right');
      setTimeout(() => {
        setCurrentIndex(incoming.currentIndex);
        setSwipeClass(isNext ? 'swipe-in-right' : 'swipe-in-left');
        playChimeSound();
        setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
        setTimeout(() => setSwipeClass(''), 360);
      }, 230);
    }

    if (incoming.currentTurn !== undefined) {
      setCurrentTurn(incoming.currentTurn);
    }

    if (incoming.bookmarkedMoments) {
      setBookmarkedMoments(incoming.bookmarkedMoments);
    }

    // Arrival pause sync
    if (incoming.arrivalPauseComplete) {
      setArrivalPauseOpen(false);
    }

    // Blind Reveal sync
    if (incoming.blindAction === 'SUBMIT') {
      setBlindState(prev => {
        const next = {
          ...prev,
          peerSubmitted: true,
          peerAnswer: incoming.answer || ''
        };
        if (prev.mySubmitted) {
          playHandshakeSound();
        }
        return next;
      });
    }

    // Handshake sync
    if (incoming.handshakeAction) {
      if (incoming.handshakeAction === 'OPEN') {
        setPendingTargetIndex(incoming.targetIndex);
        setHandshakeOpen(true);
        setMyReady(false);
        setPeerReady(false);
      } else if (incoming.handshakeAction === 'PEER_READY') {
        setPeerReady(true);
      } else if (incoming.handshakeAction === 'CANCEL') {
        setHandshakeOpen(false);
        setMyReady(false);
        setPeerReady(false);
      }
    }
  }, []);

  const handleReactionReceived = useCallback((payload) => {
    if (payload?.emoji) {
      playReactionSound();
      spawnReaction(payload.emoji, payload.sender);
    }
  }, [spawnReaction]);

  const handleTouchRippleReceived = useCallback((payload) => {
    if (payload?.x !== undefined && payload?.y !== undefined) {
      spawnTouchRipple(payload.x, payload.y);
    }
  }, [spawnTouchRipple]);

  const handleRemoteStream = useCallback((stream) => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = stream;
    }
  }, []);

  const handleCallState = useCallback((state) => {
    setVoiceCallState(state);
  }, []);

  // URL Query Param auto-join detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim().length >= 4) {
      handleJoinRoom({
        roomCode: roomParam.trim().toUpperCase(),
        userName: localStorage.getItem('between_user_name') || 'Partner 2'
      });
    }
  }, []);

  // HOST: Create Room
  const handleCreateRoom = ({ relationshipType: rel, sessionLength: len, roomCode: customCode, userName }) => {
    setIsHost(true);
    setIsSolo(false);
    setRelationshipType(rel);
    setSessionLength(len);
    const myName = userName || 'Partner 1';
    setHostName(myName);
    localStorage.setItem('between_host_name', myName);
    localStorage.setItem('between_user_name', myName);

    const initialDeck = buildSession(rel, len);
    setQuestions(initialDeck);
    setCurrentIndex(0);
    setCurrentTurn('host');

    const code = multiplayerSync.initHost({
      roomCode: customCode,
      userName: myName,
      onStatusChange: handleStatusChange,
      onStateChange: handleStateChange,
      onReaction: handleReactionReceived,
      onTouchRipple: handleTouchRippleReceived,
      onCallStream: handleRemoteStream,
      onCallState: handleCallState
    });
    setRoomCode(code);
    setConnectionStatus('WAITING_FOR_GUEST');
  };

  // GUEST: Join Room
  const handleJoinRoom = (paramsOrCode) => {
    setIsHost(false);
    setIsSolo(false);
    let code = typeof paramsOrCode === 'string' ? paramsOrCode : (paramsOrCode.roomCode || '');
    let userName = typeof paramsOrCode === 'object' && paramsOrCode.userName ? paramsOrCode.userName : (localStorage.getItem('between_user_name') || 'Partner 2');
    code = code.trim().toUpperCase();
    setRoomCode(code);
    setGuestName(userName);
    localStorage.setItem('between_guest_name', userName);
    localStorage.setItem('between_user_name', userName);
    setConnectionStatus('CONNECTING');

    multiplayerSync.joinRoom({
      roomCode: code,
      userName: userName,
      onStatusChange: handleStatusChange,
      onStateChange: handleStateChange,
      onReaction: handleReactionReceived,
      onTouchRipple: handleTouchRippleReceived,
      onCallStream: handleRemoteStream,
      onCallState: handleCallState
    });
  };

  // SOLO / PASS THE PHONE
  const handleStartSolo = ({ relationshipType: rel, sessionLength: len, p1Name, p2Name }) => {
    setIsHost(true);
    setIsSolo(true);
    setRelationshipType(rel);
    setSessionLength(len);
    const p1 = p1Name || 'Partner 1';
    const p2 = p2Name || 'Partner 2';
    setHostName(p1);
    setGuestName(p2);
    localStorage.setItem('between_p1_name', p1);
    localStorage.setItem('between_p2_name', p2);

    const initialDeck = buildSession(rel, len);
    setQuestions(initialDeck);
    setCurrentIndex(0);
    setCurrentTurn('host');
    setConnectionStatus('CONNECTED');
    setScreen('SESSION');
  };

  // Start Session (From Host Lobby waiting room)
  const handleStartSession = () => {
    setScreen('SESSION');
    setArrivalPauseOpen(true);
    if (!isSolo) {
      multiplayerSync.syncState({
        screen: 'SESSION',
        relationshipType,
        sessionLength,
        questions,
        currentIndex: 0,
        currentTurn: 'host',
        bookmarkedMoments: [],
        hostName,
        guestName
      });
    }
  };

  const handleCompleteArrivalPause = () => {
    setArrivalPauseOpen(false);
    if (!isSolo) {
      multiplayerSync.syncState({ arrivalPauseComplete: true });
    }
  };

  // Next Card / Advance
  const handleAdvanceCard = () => {
    const nextIdx = currentIndex + 1;

    if (nextIdx >= questions.length) {
      setScreen('CLOSING');
      if (!isSolo) {
        multiplayerSync.syncState({ screen: 'CLOSING' });
      }
      return;
    }

    const nextQ = questions[nextIdx];
    if (!isSolo && nextQ && nextQ.depth >= 4 && !handshakeOpen) {
      setPendingTargetIndex(nextIdx);
      setHandshakeOpen(true);
      setMyReady(false);
      setPeerReady(false);
      multiplayerSync.syncState({
        handshakeAction: 'OPEN',
        targetIndex: nextIdx
      });
      return;
    }

    playClickSound();
    setSwipeClass('swipe-out-left');

    setTimeout(() => {
      playChimeSound();
      const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
      setCurrentIndex(nextIdx);
      setCurrentTurn(nextTurn);
      setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
      setSwipeClass('swipe-in-right');

      if (!isSolo) {
        multiplayerSync.syncState({
          currentIndex: nextIdx,
          currentTurn: nextTurn
        });
      }

      setTimeout(() => {
        setSwipeClass('');
      }, 360);
    }, 230);
  };

  // Previous Card
  const handlePreviousCard = () => {
    if (currentIndex <= 0) return;
    playClickSound();
    setSwipeClass('swipe-out-right');

    setTimeout(() => {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
      setSwipeClass('swipe-in-left');
      if (!isSolo) {
        multiplayerSync.syncState({ currentIndex: prevIdx });
      }

      setTimeout(() => {
        setSwipeClass('');
      }, 360);
    }, 230);
  };

  // Pass Turn
  const handlePassTurn = () => {
    playClickSound();
    const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
    setCurrentTurn(nextTurn);
    if (!isSolo) {
      multiplayerSync.syncState({ currentTurn: nextTurn });
    }
  };

  // Swap Question
  const handleSwap = (direction) => {
    playClickSound();
    const currentQ = questions[currentIndex];
    const sessionIds = questions.map(q => q.id);
    const replacement = swapQuestion(currentQ, direction, relationshipType, sessionIds);

    if (replacement) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = { ...replacement, phase: currentQ.phase };
      setQuestions(updatedQuestions);
      if (!isSolo) {
        multiplayerSync.syncState({ questions: updatedQuestions });
      }
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    let updatedBookmarks;
    const isAlreadyBookmarked = bookmarkedMoments.some(b => b.id === currentQ.id);

    if (isAlreadyBookmarked) {
      updatedBookmarks = bookmarkedMoments.filter(b => b.id !== currentQ.id);
    } else {
      updatedBookmarks = [...bookmarkedMoments, currentQ];
    }

    setBookmarkedMoments(updatedBookmarks);
    if (!isSolo) {
      multiplayerSync.syncState({ bookmarkedMoments: updatedBookmarks });
    }
  };

  // Reactions
  const handleSendReaction = (emoji) => {
    spawnReaction(emoji, isHost ? 'host' : 'guest');
    if (!isSolo) {
      multiplayerSync.sendReaction(emoji);
    }
  };

  // Presence Touch Ripple on screen
  const handleScreenPointerDown = (e) => {
    if (screen !== 'SESSION') return;
    // Don't trigger on clicks to buttons/inputs
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
      return;
    }
    const xPercent = (e.clientX / window.innerWidth) * 100;
    const yPercent = (e.clientY / window.innerHeight) * 100;
    spawnTouchRipple(xPercent, yPercent);

    if (!isSolo) {
      multiplayerSync.sendPresenceTouch(xPercent, yPercent);
    }
  };

  // Blind Reveal Handlers
  const handleUpdateBlindAnswer = (val) => {
    setBlindState(prev => ({ ...prev, myAnswer: val }));
  };

  const handleSubmitBlindAnswer = () => {
    setBlindState(prev => {
      const next = { ...prev, mySubmitted: true };
      if (prev.peerSubmitted) {
        playHandshakeSound();
      }
      return next;
    });

    if (!isSolo) {
      multiplayerSync.syncState({
        blindAction: 'SUBMIT',
        answer: blindState.myAnswer
      });
    }
  };

  // WebRTC Voice Call Controls
  const handleToggleVoiceCall = async () => {
    playClickSound();
    if (voiceCallState === 'CONNECTED' || voiceCallState === 'CALLING') {
      multiplayerSync.endVoiceCall();
      setVoiceCallState('ENDED');
    } else {
      const ok = await multiplayerSync.startVoiceCall();
      if (!ok) setVoiceCallState('FAILED');
    }
  };

  const handleToggleVoiceMute = () => {
    playClickSound();
    const muted = multiplayerSync.toggleMute();
    setIsVoiceMuted(muted);
  };

  // Handshake Confirmation
  const handleConfirmHandshake = () => {
    playHandshakeSound();
    setMyReady(true);

    if (peerReady) {
      setHandshakeOpen(false);
      const target = pendingTargetIndex !== null ? pendingTargetIndex : currentIndex + 1;
      const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
      setCurrentIndex(target);
      setCurrentTurn(nextTurn);
      setPendingTargetIndex(null);
      setMyReady(false);
      setPeerReady(false);

      if (!isSolo) {
        multiplayerSync.syncState({
          currentIndex: target,
          currentTurn: nextTurn,
          handshakeAction: 'CANCEL'
        });
      }
    } else {
      if (!isSolo) {
        multiplayerSync.syncState({ handshakeAction: 'PEER_READY' });
      }
    }
  };

  const handleDeclineHandshake = () => {
    playClickSound();
    setHandshakeOpen(false);
    setMyReady(false);
    setPeerReady(false);
    setPendingTargetIndex(null);
    handleSwap('LIGHTER');

    if (!isSolo) {
      multiplayerSync.syncState({ handshakeAction: 'CANCEL' });
    }
  };

  // Return to Lobby
  const handleExitToLobby = () => {
    playClickSound();
    multiplayerSync.cleanup();
    setScreen('LOBBY');
    setConnectionStatus('IDLE');
    setRoomCode('');
    setIsHost(false);
    setIsSolo(false);
    setCurrentIndex(0);
    setBookmarkedMoments([]);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const currentQuestion = questions[currentIndex] || {
    id: 'placeholder',
    text: 'Preparing your intimate questions...',
    category: 'DEEP',
    depth: 1
  };

  const isCurrentBookmarked = bookmarkedMoments.some(b => b.id === currentQuestion.id);

  const activeSpeakerName = currentTurn === 'host' ? (hostName || 'Partner 1') : (guestName || 'Partner 2');
  let turnString = `${activeSpeakerName}'s Turn to Speak`;
  if (isSolo) {
    turnString = `${activeSpeakerName}'s Turn to Speak`;
  } else {
    const isMyTurn = (isHost && currentTurn === 'host') || (!isHost && currentTurn === 'guest');
    turnString = isMyTurn ? `Your Turn to Speak (${activeSpeakerName})` : `${activeSpeakerName}'s Turn to Speak`;
  }

  return (
    <div className="wellness-canvas" onPointerDown={handleScreenPointerDown}>
      {/* Hidden audio element for incoming WebRTC voice call */}
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* Interactive 3D Background with Three.js */}
      <ThreeCanvas relationshipType={relationshipType} theme={theme} />

      {/* Atmospheric Radial Backdrop */}
      <div className="app-backdrop" />

      {/* Presence Touch Ripples */}
      {touchRipples.map(r => (
        <div
          key={r.id}
          className="presence-touch-ripple"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        />
      ))}

      {/* Floating live reactions */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
        {floatingReactions.map(r => (
          <div
            key={r.id}
            className="floating-reaction"
            style={{ left: `${r.xPos}%`, bottom: '15%' }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      <div className="app-container">
        {/* Top Header */}
        <Header
          roomCode={roomCode}
          connectionStatus={connectionStatus}
          isHost={isHost}
          phaseName={currentQuestion?.phase || 'WARMUP'}
          onExit={handleExitToLobby}
          isSessionActive={screen === 'SESSION'}
          theme={theme}
          onSelectTheme={handleSelectTheme}
          voiceCallState={voiceCallState}
          isVoiceMuted={isVoiceMuted}
          onToggleVoiceCall={handleToggleVoiceCall}
          onToggleVoiceMute={handleToggleVoiceMute}
        />

        {/* SCREEN 1: LOBBY */}
        {screen === 'LOBBY' && (
          <LobbyScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartSolo={handleStartSolo}
            initialRoomCode={new URLSearchParams(window.location.search).get('room') || ''}
            isWaitingForGuest={connectionStatus === 'WAITING_FOR_GUEST' || (isHost && connectionStatus === 'CONNECTED')}
            roomCode={roomCode}
            isConnected={connectionStatus === 'CONNECTED'}
            onStartSession={handleStartSession}
            peerName={guestName}
            theme={theme}
            onSelectTheme={handleSelectTheme}
          />
        )}

        {/* SCREEN 2: ACTIVE SESSION */}
        {screen === 'SESSION' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {/* Progress bar & question counter */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--color-muted)',
                letterSpacing: '0.08em'
              }}>
                <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
                <span style={{ color: 'var(--color-ember)' }}>DEPTH {currentQuestion.depth}/5</span>
              </div>

              {/* Progress track */}
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(0,0,0,0.06)',
                borderRadius: 'var(--radius-pill)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%`,
                  background: 'var(--color-ember)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Central 3D Question Card with Physical Swipe, 3D Double Flip, and Blind Reveal */}
            <div style={{ width: '100%', margin: '4px 0' }}>
              <QuestionCard
                question={currentQuestion}
                turnIndicator={turnString}
                relationshipType={relationshipType}
                onPassTurn={handlePassTurn}
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={handleToggleBookmark}
                swipeClass={swipeClass}
                onSwipeLeft={handleAdvanceCard}
                onSwipeRight={handlePreviousCard}
                blindState={blindState}
                onUpdateBlindAnswer={handleUpdateBlindAnswer}
                onSubmitBlindAnswer={handleSubmitBlindAnswer}
                myName={isHost ? hostName : guestName}
                peerName={isHost ? guestName : hostName}
                isSolo={isSolo}
                hostName={hostName}
                guestName={guestName}
              />
            </div>

            {/* Navigation & Question Modifier Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              width: '100%'
            }}>
              {/* Back button */}
              <button
                onClick={handlePreviousCard}
                disabled={currentIndex === 0}
                className="btn-icon"
                style={{
                  opacity: currentIndex === 0 ? 0.35 : 1,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                }}
                title="Previous card"
                aria-label="Previous card"
              >
                <ChevronLeft size={20} strokeWidth={2.4} />
              </button>

              {/* Lighter / Deeper Quick Swappers */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleSwap('LIGHTER')}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
                  title="Swap for an easier question"
                >
                  <Feather size={14} strokeWidth={2.4} color="var(--color-sage)" />
                  <span>Lighter</span>
                </button>

                <button
                  onClick={() => handleSwap('DEEPER')}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
                  title="Swap for a deeper question"
                >
                  <Flame size={14} strokeWidth={2.4} color="var(--color-ember)" />
                  <span>Deeper</span>
                </button>
              </div>

              {/* Next button */}
              <button
                onClick={handleAdvanceCard}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '14px', gap: '8px' }}
              >
                <span>{currentIndex === questions.length - 1 ? 'Complete' : 'Next'}</span>
                <ChevronRight size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* Floating Live Reaction Bar */}
            <div style={{ marginTop: '14px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <ReactionBar onSendReaction={handleSendReaction} />
            </div>
          </div>
        )}

        {/* SCREEN 3: CLOSING */}
        {screen === 'CLOSING' && (
          <ClosingScreen
            bookmarkedMoments={bookmarkedMoments}
            relationshipType={relationshipType}
            onReturnHome={handleExitToLobby}
            hostName={hostName}
            guestName={guestName}
            peerName={isHost ? guestName : hostName}
            onStartNew={() => {
              const newDeck = buildSession(relationshipType, sessionLength);
              setQuestions(newDeck);
              setCurrentIndex(0);
              setCurrentTurn('host');
              setBookmarkedMoments([]);
              setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
              setScreen('SESSION');
              if (!isSolo) {
                multiplayerSync.syncState({
                  screen: 'SESSION',
                  questions: newDeck,
                  currentIndex: 0,
                  currentTurn: 'host',
                  bookmarkedMoments: [],
                  hostName,
                  guestName
                });
              }
            }}
          />
        )}

        {/* Arrival Pause Modal (Synchronized Grounding Breath) */}
        <ArrivalPauseModal
          isOpen={arrivalPauseOpen}
          onComplete={handleCompleteArrivalPause}
        />

        {/* Mutual Handshake Modal for Depth 4 & 5 */}
        <HandshakeModal
          isOpen={handshakeOpen}
          isHost={isHost}
          myReady={myReady}
          peerReady={peerReady}
          onConfirmReady={handleConfirmHandshake}
          onDecline={handleDeclineHandshake}
          myName={isHost ? hostName : guestName}
          peerName={isHost ? guestName : hostName}
        />
      </div>
    </div>
  );
}

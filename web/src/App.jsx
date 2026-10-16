import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Feather, Flame, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import LobbyScreen from './components/LobbyScreen';
import QuestionCard from './components/QuestionCard';
import ReactionBar from './components/ReactionBar';
import HandshakeModal from './components/HandshakeModal';
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
  const [connectionStatus, setConnectionStatus] = useState('IDLE'); // 'IDLE' | 'WAITING_FOR_GUEST' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'
  
  const [relationshipType, setRelationshipType] = useState('COUPLE');
  const [sessionLength, setSessionLength] = useState('FIFTEEN_MIN');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState('host'); // 'host' | 'guest'
  const [bookmarkedMoments, setBookmarkedMoments] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [swipeClass, setSwipeClass] = useState('');

  // Deep questions handshake state
  const [handshakeOpen, setHandshakeOpen] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [pendingTargetIndex, setPendingTargetIndex] = useState(null);

  // Keep a ref to current state for peer callbacks
  const stateRef = useRef({
    screen,
    roomCode,
    isHost,
    isSolo,
    connectionStatus,
    relationshipType,
    sessionLength,
    questions,
    currentIndex,
    currentTurn,
    bookmarkedMoments
  });

  useEffect(() => {
    stateRef.current = {
      screen,
      roomCode,
      isHost,
      isSolo,
      connectionStatus,
      relationshipType,
      sessionLength,
      questions,
      currentIndex,
      currentTurn,
      bookmarkedMoments
    };
  }, [screen, roomCode, isHost, isSolo, connectionStatus, relationshipType, sessionLength, questions, currentIndex, currentTurn, bookmarkedMoments]);

  // Floating reaction spawner
  const spawnReaction = useCallback((emoji, sender) => {
    const id = `${Date.now()}-${Math.random()}`;
    const xPos = 38 + Math.random() * 24; // 38% - 62%
    setFloatingReactions(prev => [...prev, { id, emoji, sender, xPos }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2600);
  }, []);

  // Peer Event Handlers
  const handleStatusChange = useCallback((statusData) => {
    setConnectionStatus(statusData.status);
    if (statusData.roomCode) setRoomCode(statusData.roomCode);
    if (typeof statusData.isHost === 'boolean') setIsHost(statusData.isHost);

    // If host and peer just connected, send current state
    if (statusData.isHost && statusData.status === 'CONNECTED') {
      const cur = stateRef.current;
      multiplayerSync.syncState({
        screen: cur.screen,
        relationshipType: cur.relationshipType,
        sessionLength: cur.sessionLength,
        questions: cur.questions,
        currentIndex: cur.currentIndex,
        currentTurn: cur.currentTurn,
        bookmarkedMoments: cur.bookmarkedMoments
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

    if (incoming.currentIndex !== undefined && incoming.currentIndex !== stateRef.current.currentIndex) {
      const isNext = incoming.currentIndex > stateRef.current.currentIndex;
      setSwipeClass(isNext ? 'swipe-out-left' : 'swipe-out-right');
      setTimeout(() => {
        setCurrentIndex(incoming.currentIndex);
        setSwipeClass(isNext ? 'swipe-in-right' : 'swipe-in-left');
        playChimeSound();
        setTimeout(() => setSwipeClass(''), 360);
      }, 230);
    }

    if (incoming.currentTurn !== undefined) {
      setCurrentTurn(incoming.currentTurn);
    }

    if (incoming.bookmarkedMoments) {
      setBookmarkedMoments(incoming.bookmarkedMoments);
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

  // URL Query Param auto-join detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim().length === 4) {
      handleJoinRoom(roomParam.trim().toUpperCase());
    }
  }, []);

  // HOST: Create Room
  const handleCreateRoom = ({ relationshipType: rel, sessionLength: len }) => {
    setIsHost(true);
    setIsSolo(false);
    setRelationshipType(rel);
    setSessionLength(len);

    const initialDeck = buildSession(rel, len);
    setQuestions(initialDeck);
    setCurrentIndex(0);
    setCurrentTurn('host');

    const code = multiplayerSync.initHost(
      handleStatusChange,
      handleStateChange,
      handleReactionReceived
    );
    setRoomCode(code);
    setConnectionStatus('WAITING_FOR_GUEST');
  };

  // GUEST: Join Room
  const handleJoinRoom = (code) => {
    setIsHost(false);
    setIsSolo(false);
    setRoomCode(code);
    setConnectionStatus('CONNECTING');

    multiplayerSync.joinRoom(
      code,
      handleStatusChange,
      handleStateChange,
      handleReactionReceived
    );
  };

  // SOLO / PASS THE PHONE
  const handleStartSolo = ({ relationshipType: rel, sessionLength: len }) => {
    setIsHost(true);
    setIsSolo(true);
    setRelationshipType(rel);
    setSessionLength(len);
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
    if (!isSolo) {
      multiplayerSync.syncState({
        screen: 'SESSION',
        relationshipType,
        sessionLength,
        questions,
        currentIndex: 0,
        currentTurn: 'host',
        bookmarkedMoments: []
      });
    }
  };

  // Next Card / Advance
  const handleAdvanceCard = () => {
    const nextIdx = currentIndex + 1;

    // Check if session completed
    if (nextIdx >= questions.length) {
      setScreen('CLOSING');
      if (!isSolo) {
        multiplayerSync.syncState({ screen: 'CLOSING' });
      }
      return;
    }

    const nextQ = questions[nextIdx];
    // If next question is Depth 4 or 5 and not in solo mode, require handshake confirmation
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

    // Trigger card swiping animation
    playClickSound();
    setSwipeClass('swipe-out-left');

    setTimeout(() => {
      playChimeSound();
      const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
      setCurrentIndex(nextIdx);
      setCurrentTurn(nextTurn);
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

  // Swap Question (Lighter or Deeper)
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

  // Handshake Confirmation
  const handleConfirmHandshake = () => {
    playHandshakeSound();
    setMyReady(true);

    if (peerReady) {
      // Both are ready! Advance
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
      // Broadcast that I am ready
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

    // Swap to a lighter question instead
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

  // Active question calculation
  const currentQuestion = questions[currentIndex] || {
    id: 'placeholder',
    text: 'Preparing your intimate questions...',
    category: 'DEEP',
    depth: 1
  };

  const isCurrentBookmarked = bookmarkedMoments.some(b => b.id === currentQuestion.id);

  // Turn string display
  let turnString = 'Your Turn to Speak';
  if (isSolo) {
    turnString = currentTurn === 'host' ? 'Partner 1 Speaks' : 'Partner 2 Speaks';
  } else {
    const isMyTurn = (isHost && currentTurn === 'host') || (!isHost && currentTurn === 'guest');
    turnString = isMyTurn ? 'Your Turn to Speak' : "Friend's Turn to Speak";
  }

  return (
    <div className="wellness-canvas">
      {/* Interactive 3D Background with Three.js */}
      <ThreeCanvas relationshipType={relationshipType} />

      {/* Atmospheric Blush Glow Backdrop */}
      <div className="app-backdrop" />

      {/* Floating live reactions with subtle drift */}
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

            {/* Central 3D Question Card with Physical Swipe Gesture & Animation */}
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
            onStartNew={() => {
              const newDeck = buildSession(relationshipType, sessionLength);
              setQuestions(newDeck);
              setCurrentIndex(0);
              setCurrentTurn('host');
              setBookmarkedMoments([]);
              setScreen('SESSION');
              if (!isSolo) {
                multiplayerSync.syncState({
                  screen: 'SESSION',
                  questions: newDeck,
                  currentIndex: 0,
                  currentTurn: 'host',
                  bookmarkedMoments: []
                });
              }
            }}
          />
        )}

        {/* Mutual Handshake Modal for Depth 4 & 5 */}
        <HandshakeModal
          isOpen={handshakeOpen}
          isHost={isHost}
          myReady={myReady}
          peerReady={peerReady}
          onConfirmReady={handleConfirmHandshake}
          onDecline={handleDeclineHandshake}
        />
      </div>
    </div>
  );
}

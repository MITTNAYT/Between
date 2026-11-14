import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import LobbyScreen from './components/LobbyScreen';
import CardDeckCarousel from './components/CardDeckCarousel';
import ReactionBar from './components/ReactionBar';
import ClosingScreen from './components/ClosingScreen';
import LegalModal from './components/LegalModal';
import { buildSession } from './utils/engine';
import { multiplayerSync } from './utils/peer';
import { playClickSound, playReactionSound, playCardSlideSound } from './utils/audio';
import { triggerHaptic } from './utils/haptics';

export default function App() {
  const [screen, setScreen] = useState('LOBBY'); // 'LOBBY' | 'SESSION' | 'CLOSING'
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Player Names
  const [hostName, setHostName] = useState(() => localStorage.getItem('between_host_name') || localStorage.getItem('between_user_name') || 'Partner 1');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('between_guest_name') || 'Partner 2');

  // Theme: 'tabletop' (default clean daylight linen & powder blue card face) | 'candlelight' (warm night ambiance)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('between_theme');
    if (!saved || saved === 'sandstone' || saved === 'candlelight') {
      localStorage.setItem('between_theme', 'tabletop');
      return 'tabletop';
    }
    return saved;
  });

  const [relationshipType, setRelationshipType] = useState('COUPLE');
  const [sessionLength, setSessionLength] = useState('FIFTEEN_MIN');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState('host'); // 'host' | 'guest'
  const [bookmarkedMoments, setBookmarkedMoments] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);

  // Wildcard and Appreciation States
  const [activeWildcardPrompt, setActiveWildcardPrompt] = useState(null);
  const [myAppreciationNote, setMyAppreciationNote] = useState('');
  const [peerAppreciationNote, setPeerAppreciationNote] = useState('');

  // Toast message
  const [toastMessage, setToastMessage] = useState(null);

  // Legal / Privacy Policy Modal State
  const [showLegalModal, setShowLegalModal] = useState(false);

  // Synchronize document theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('between_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'candlelight' ? 'tabletop' : 'candlelight');
  };

  // Keep a ref to current state for peer callbacks
  const stateRef = useRef({
    screen,
    roomCode,
    isHost,
    hostName,
    guestName,
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
      hostName,
      guestName,
      connectionStatus,
      relationshipType,
      sessionLength,
      questions,
      currentIndex,
      currentTurn,
      bookmarkedMoments
    };
  }, [screen, roomCode, isHost, hostName, guestName, connectionStatus, relationshipType, sessionLength, questions, currentIndex, currentTurn, bookmarkedMoments]);

  // Floating reaction spawner
  const spawnReaction = useCallback((emoji, sender) => {
    const id = `${Date.now()}-${Math.random()}`;
    const xPos = 38 + Math.random() * 24;
    setFloatingReactions(prev => [...prev, { id, emoji, sender, xPos }]);
    triggerHaptic('pop');
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2600);
  }, []);

  // Peer Event Handlers
  const handleStatusChange = useCallback((statusData) => {
    if (statusData.status === 'ERROR') {
      setConnectionStatus('ERROR');
      setErrorMessage(statusData.error || 'Connection error. Please try again.');
    } else {
      setConnectionStatus(statusData.status);
      if (statusData.status === 'CONNECTED') {
        setErrorMessage('');
      }
    }

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
      playCardSlideSound();
      triggerHaptic('light');
      setCurrentIndex(incoming.currentIndex);
    }

    if (incoming.wildcardPrompt !== undefined) {
      setActiveWildcardPrompt(incoming.wildcardPrompt);
    }

    if (incoming.appreciationNote !== undefined) {
      if (incoming.appreciationSender !== (stateRef.current.isHost ? 'host' : 'guest')) {
        setPeerAppreciationNote(incoming.appreciationNote);
      }
    }

    if (incoming.currentTurn !== undefined) {
      setCurrentTurn(incoming.currentTurn);
    }

    if (incoming.bookmarkedMoments) {
      setBookmarkedMoments(incoming.bookmarkedMoments);
    }
  }, []);

  const handleReactionReceived = useCallback((emoji) => {
    spawnReaction(emoji, stateRef.current.isHost ? 'guest' : 'host');
    playReactionSound();
  }, [spawnReaction]);

  // HOST: Create Room
  const handleCreateRoom = ({ relationshipType: rel, sessionLength: len, roomCode: customCode, userName }) => {
    setIsHost(true);
    setErrorMessage('');
    setRelationshipType(rel);
    setSessionLength(len);
    const myName = userName || 'Partner 1';
    setHostName(myName);
    localStorage.setItem('between_host_name', myName);
    localStorage.setItem('between_user_name', myName);

    const initialDeck = buildSession(rel, len, []);
    setQuestions(initialDeck);
    setCurrentIndex(0);
    setCurrentTurn('host');

    const code = multiplayerSync.initHost({
      roomCode: customCode,
      userName: myName,
      onStatusChange: handleStatusChange,
      onStateChange: handleStateChange,
      onReaction: handleReactionReceived,
      onRequestState: () => {
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
          guestName: cur.guestName
        });
      }
    });
    setRoomCode(code);
    setConnectionStatus('WAITING_FOR_GUEST');
  };

  // GUEST: Join Room
  const handleJoinRoom = (paramsOrCode) => {
    setIsHost(false);
    setErrorMessage('');
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
      onReaction: handleReactionReceived
    });
  };

  // Direct room link join handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      const cleanCode = roomParam.trim().toUpperCase();
      if (cleanCode.length >= 3) {
        handleJoinRoom({
          roomCode: cleanCode,
          userName: localStorage.getItem('between_user_name') || 'Partner 2'
        });
      }
    }
  }, []);

  // Start Session (From Host Lobby waiting room)
  const handleStartSession = () => {
    setScreen('SESSION');
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
  };

  // Pass Turn
  const handlePassTurn = () => {
    playClickSound();
    triggerHaptic('light');
    const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
    setCurrentTurn(nextTurn);
    multiplayerSync.syncState({ currentTurn: nextTurn });
  };

  // Advance to Next Card
  const handleAdvance = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextTurn = currentTurn === 'host' ? 'guest' : 'host';

      playCardSlideSound();
      triggerHaptic('light');

      setCurrentIndex(nextIndex);
      setCurrentTurn(nextTurn);
      setActiveWildcardPrompt(null);

      multiplayerSync.syncState({
        currentIndex: nextIndex,
        currentTurn: nextTurn,
        wildcardPrompt: null
      });
    } else {
      // Reached End of Session
      setScreen('CLOSING');
      multiplayerSync.syncState({ screen: 'CLOSING' });
    }
  };

  // Previous Card
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      playCardSlideSound();
      triggerHaptic('light');

      setCurrentIndex(prevIndex);
      setActiveWildcardPrompt(null);

      multiplayerSync.syncState({
        currentIndex: prevIndex,
        wildcardPrompt: null
      });
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
    multiplayerSync.syncState({ bookmarkedMoments: updatedBookmarks });
  };

  // Reactions
  const handleSendReaction = (emoji) => {
    spawnReaction(emoji, isHost ? 'host' : 'guest');
    multiplayerSync.sendReaction(emoji);
  };

  // Return to Lobby
  const handleExitToLobby = () => {
    playClickSound();
    multiplayerSync.leaveRoom();
    setScreen('LOBBY');
    setConnectionStatus('IDLE');
    setRoomCode('');
    setQuestions([]);
    setCurrentIndex(0);
    setCurrentTurn('host');
    setBookmarkedMoments([]);
    setErrorMessage('');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // Send Appreciation Note
  const handleSendAppreciationNote = (note) => {
    setMyAppreciationNote(note);
    multiplayerSync.syncState({
      appreciationNote: note,
      appreciationSender: isHost ? 'host' : 'guest'
    });
  };

  const currentQuestion = questions[currentIndex] || {
    id: 'placeholder',
    text: 'Preparing your tabletop questions...',
    category: 'DEEP',
    depth: 1
  };

  const isCurrentBookmarked = bookmarkedMoments.some(b => b.id === currentQuestion.id);
  const activeSpeakerName = currentTurn === 'host' ? (hostName || 'Partner 1') : (guestName || 'Partner 2');
  const turnString = ((isHost && currentTurn === 'host') || (!isHost && currentTurn === 'guest'))
    ? `Your Turn (${activeSpeakerName})`
    : `${activeSpeakerName}'s Turn`;

  return (
    <div className="wellness-canvas">
      {/* Warm Tabletop Backdrop */}
      <div className="app-backdrop" />

      {/* Toast Message */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99990,
          padding: '8px 18px',
          borderRadius: 'var(--radius-pill)',
          background: '#1C1917',
          color: '#FFFFFF',
          fontSize: '12.5px',
          fontWeight: '700',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.2s ease-out',
          userSelect: 'none'
        }}>
          {toastMessage}
        </div>
      )}

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
          isSessionActive={screen !== 'LOBBY'}
          theme={theme}
          onToggleTheme={toggleTheme}
          onShowToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />

        {/* SCREEN 1: LOBBY */}
        {screen === 'LOBBY' && (
          <LobbyScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            initialRoomCode={new URLSearchParams(window.location.search).get('room') || ''}
            connectionStatus={connectionStatus}
            isHost={isHost}
            errorMessage={errorMessage}
            onCancelRoom={handleExitToLobby}
            isWaitingForGuest={isHost && (connectionStatus === 'WAITING_FOR_GUEST' || connectionStatus === 'CONNECTED')}
            roomCode={roomCode}
            isConnected={connectionStatus === 'CONNECTED'}
            onStartSession={handleStartSession}
            peerName={isHost ? guestName : hostName}
            myName={isHost ? hostName : guestName}
            onOpenLegal={() => setShowLegalModal(true)}
          />
        )}

        {/* SCREEN 2: ACTIVE SESSION */}
        {screen === 'SESSION' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {/* Tabletop Session Breadcrumb Header */}
            <div style={{
              width: '100%',
              maxWidth: '440px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '0 4px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    fontWeight: '800',
                    color: 'var(--color-ink)'
                  }}>
                    № {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: '700' }}>
                    OF {questions.length}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold)'
                  }}>
                    DEPTH {['I', 'II', 'III', 'IV', 'V'][Math.max(0, (currentQuestion.depth || 1) - 1)]}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-muted)', fontWeight: '600' }}>
                    · {currentQuestion.phase || 'CONNECTION'}
                  </span>
                </div>
              </div>

              {/* Glowing Warm Gold/Ember Progress Track */}
              <div style={{
                width: '100%',
                height: '3px',
                background: 'rgba(0,0,0,0.06)',
                borderRadius: 'var(--radius-pill)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%`,
                  background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-ember) 100%)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width 0.35s ease-out'
                }} />
              </div>
            </div>

            {/* Authentic Tabletop Card Carousel */}
            <CardDeckCarousel
              questions={questions}
              currentIndex={currentIndex}
              onSelectIndex={(idx) => {
                playCardSlideSound();
                triggerHaptic('light');
                setCurrentIndex(idx);
                multiplayerSync.syncState({ currentIndex: idx });
              }}
              onAdvanceCard={handleAdvance}
              onPreviousCard={handlePrevious}
              // QuestionCard props
              turnIndicator={turnString}
              relationshipType={relationshipType}
              onPassTurn={handlePassTurn}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={handleToggleBookmark}
              myName={isHost ? hostName : guestName}
              peerName={isHost ? guestName : hostName}
              wildcardPrompt={activeWildcardPrompt}
              onSelectWildcardPrompt={(prompt) => {
                setActiveWildcardPrompt(prompt);
                multiplayerSync.syncState({ wildcardPrompt: prompt });
              }}
              onSkipQuestion={() => handleAdvance()}
            />

            {/* Tabletop Primary Navigation Controls */}
            <div style={{
              width: '100%',
              maxWidth: '440px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '0 4px',
              marginTop: '4px'
            }}>
              {/* Previous Card Button */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="btn-secondary"
                style={{
                  minHeight: '44px',
                  padding: '8px 16px',
                  opacity: currentIndex === 0 ? 0.35 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-pill)',
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title="Go to previous card"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
                <span>Previous</span>
              </button>

              {/* Deal Next Card Button */}
              <button
                onClick={handleAdvance}
                className="btn-primary"
                style={{
                  minHeight: '44px',
                  padding: '8px 24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: '0 4px 14px rgba(217, 78, 52, 0.25)'
                }}
                title={currentIndex === questions.length - 1 ? 'Finish session and view saved moments' : 'Deal next card'}
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish Session' : 'Next Card'}</span>
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Live Reaction Bar */}
            <div style={{
              marginTop: '12px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
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
            myName={isHost ? hostName : guestName}
            isHost={isHost}
            myAppreciationNote={myAppreciationNote}
            peerAppreciationNote={peerAppreciationNote}
            onSendAppreciationNote={handleSendAppreciationNote}
            onStartNew={() => {
              const newDeck = buildSession(relationshipType, sessionLength);
              setQuestions(newDeck);
              setCurrentIndex(0);
              setCurrentTurn('host');
              setBookmarkedMoments([]);
              setActiveWildcardPrompt(null);
              setMyAppreciationNote('');
              setPeerAppreciationNote('');
              setScreen('SESSION');
              multiplayerSync.syncState({
                screen: 'SESSION',
                questions: newDeck,
                currentIndex: 0,
                currentTurn: 'host',
                bookmarkedMoments: [],
                hostName,
                guestName,
                wildcardPrompt: null,
                appreciationNote: ''
              });
            }}
          />
        )}

        {/* Legal / Privacy Policy & Terms Modal */}
        <LegalModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Feather, Flame, ChevronLeft, ChevronRight, ArrowRight, SkipForward, PenLine, Sparkles } from 'lucide-react';
import Header from './components/Header';
import LobbyScreen from './components/LobbyScreen';
import QuestionCard from './components/QuestionCard';
import ReactionBar from './components/ReactionBar';
import HandshakeModal from './components/HandshakeModal';
import ArrivalPauseModal from './components/ArrivalPauseModal';
import ClosingScreen from './components/ClosingScreen';
import ThreeCanvas from './components/ThreeCanvas';
import CustomQuestionModal from './components/CustomQuestionModal';
import IncomingCallModal from './components/IncomingCallModal';
import HoldTouchIndicator from './components/HoldTouchIndicator';
import LegalModal from './components/LegalModal';
import { buildSession, swapQuestion, RELATIONSHIP_TYPES } from './utils/engine';
import { multiplayerSync } from './utils/peer';
import { playClickSound, playChimeSound, playReactionSound, playHandshakeSound, playHeartbeatPulse } from './utils/audio';
import { triggerHaptic, stopHaptic } from './utils/haptics';

export default function App() {
  const [screen, setScreen] = useState('LOBBY'); // 'LOBBY' | 'SESSION' | 'CLOSING'
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isSolo, setIsSolo] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Player Names
  const [hostName, setHostName] = useState(() => localStorage.getItem('between_host_name') || localStorage.getItem('between_user_name') || 'Partner 1');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('between_guest_name') || 'Partner 2');

  // Theme: 'candlelight' | 'sandstone'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('between_theme');
    if (!saved || saved === 'sandstone') {
      localStorage.setItem('between_theme', 'candlelight');
      return 'candlelight';
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
  const [swipeClass, setSwipeClass] = useState('');

  // Wildcard and Appreciation States
  const [activeWildcardPrompt, setActiveWildcardPrompt] = useState(null);
  const [myAppreciationNote, setMyAppreciationNote] = useState('');
  const [peerAppreciationNote, setPeerAppreciationNote] = useState('');

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
  const [incomingCallInfo, setIncomingCallInfo] = useState(null);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState(false);
  const remoteAudioRef = useRef(null);
  const voiceAudioContextRef = useRef(null);
  const voiceAnalyserRef = useRef(null);
  const voiceSpeakingIntervalRef = useRef(null);

  // Hold-to-Touch Presence State
  const [isHoldingTouchLocal, setIsHoldingTouchLocal] = useState(false);
  const [isHoldingTouchPartner, setIsHoldingTouchPartner] = useState(false);

  // Custom Mystery Question State
  const [showCustomQuestionModal, setShowCustomQuestionModal] = useState(false);
  const [customQuestionToast, setCustomQuestionToast] = useState(null);

  // Legal / Privacy Policy Modal State
  const [showLegalModal, setShowLegalModal] = useState(false);

  // Synchronize document theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('between_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'candlelight' ? 'sandstone' : 'candlelight');
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
    triggerHaptic('pop');
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2600);
  }, []);

  // Spawn presence touch ripple
  const spawnTouchRipple = useCallback((xPercent, yPercent) => {
    const id = `${Date.now()}-${Math.random()}`;
    setTouchRipples(prev => [...prev, { id, x: xPercent, y: yPercent }]);
    playClickSound();
    triggerHaptic('tap');
    setTimeout(() => {
      setTouchRipples(prev => prev.filter(r => r.id !== id));
    }, 1600);
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
      const isNext = incoming.currentIndex > stateRef.current.currentIndex;
      setSwipeClass(isNext ? 'swipe-out-left' : 'swipe-out-right');
      setTimeout(() => {
        setCurrentIndex(incoming.currentIndex);
        setActiveWildcardPrompt(null);
        setSwipeClass(isNext ? 'swipe-in-right' : 'swipe-in-left');
        playChimeSound();
        setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
        setTimeout(() => setSwipeClass(''), 360);
      }, 230);
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

  const cleanupSpeakingDetection = useCallback(() => {
    if (voiceSpeakingIntervalRef.current) {
      clearInterval(voiceSpeakingIntervalRef.current);
      voiceSpeakingIntervalRef.current = null;
    }
    setIsPartnerSpeaking(false);
    if (voiceAudioContextRef.current && voiceAudioContextRef.current.state !== 'closed') {
      try { voiceAudioContextRef.current.close(); } catch (e) {}
      voiceAudioContextRef.current = null;
    }
    voiceAnalyserRef.current = null;
  }, []);

  const handleRemoteStream = useCallback((stream) => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = stream;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && stream && stream.getAudioTracks().length > 0) {
        if (!voiceAudioContextRef.current || voiceAudioContextRef.current.state === 'closed') {
          voiceAudioContextRef.current = new AudioCtx();
        }
        const ctx = voiceAudioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        voiceAnalyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        if (voiceSpeakingIntervalRef.current) clearInterval(voiceSpeakingIntervalRef.current);

        voiceSpeakingIntervalRef.current = setInterval(() => {
          if (!voiceAnalyserRef.current) return;
          voiceAnalyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Threshold of 13+ indicates active speaking vs room silence
          setIsPartnerSpeaking(avg > 13);
        }, 110);
      }
    } catch (e) {
      console.warn('Speaking volume analysis not supported:', e);
    }
  }, []);

  const handleCallState = useCallback((state) => {
    setVoiceCallState(state);
    if (state === 'ENDED' || state === 'IDLE' || state === 'REJECTED' || state === 'FAILED') {
      cleanupSpeakingDetection();
    }
    if (state === 'REJECTED') {
      setCustomQuestionToast('Partner declined voice call');
      setTimeout(() => setCustomQuestionToast(null), 3500);
    } else if (state === 'PERMISSION_DENIED') {
      setCustomQuestionToast('Microphone permission required for voice calls');
      setTimeout(() => setCustomQuestionToast(null), 3500);
    }
  }, [cleanupSpeakingDetection]);

  // Shared Touch Presence Rhythmic Heartbeat Haptic Loop
  useEffect(() => {
    let heartbeatInterval = null;

    if (isHoldingTouchLocal && (isHoldingTouchPartner || isSolo)) {
      // Immediate pulse upon mutual contact
      triggerHaptic('heartbeat');
      playHeartbeatPulse();

      // Recurring rhythmic heartbeat pulse every 1.15 seconds
      heartbeatInterval = setInterval(() => {
        triggerHaptic('heartbeat');
        playHeartbeatPulse();
      }, 1150);
    } else {
      stopHaptic();
    }

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      stopHaptic();
    };
  }, [isHoldingTouchLocal, isHoldingTouchPartner, isSolo]);

  // Mystery / Custom Question Handlers
  const handleReceiveCustomQuestion = useCallback((question) => {
    if (!question) return;
    setQuestions(prev => {
      const nextQuestions = [...prev];
      const targetIdx = stateRef.current.currentIndex + 1;
      nextQuestions.splice(targetIdx, 0, question);
      return nextQuestions;
    });
    playChimeSound();
    const sender = question.author || 'Partner';
    setCustomQuestionToast(`${sender} slipped a secret question into your deck! 💌`);
    setTimeout(() => {
      setCustomQuestionToast(null);
    }, 4500);
  }, []);

  const handleSendCustomQuestion = (text) => {
    const authorName = isHost ? hostName : guestName;
    const mysteryCard = {
      id: `mystery_${Date.now()}`,
      text: text,
      category: 'MYSTERY',
      depth: 5,
      phase: currentQuestion?.phase || 'WARMUP',
      author: authorName,
      isMystery: true
    };

    setQuestions(prev => {
      const nextQuestions = [...prev];
      const targetIdx = currentIndex + 1;
      nextQuestions.splice(targetIdx, 0, mysteryCard);
      return nextQuestions;
    });

    if (!isSolo) {
      multiplayerSync.sendCustomQuestion(mysteryCard);
    }

    setCustomQuestionToast('Secret question sealed into the deck ✨');
    setTimeout(() => {
      setCustomQuestionToast(null);
    }, 3500);
  };

  // Hold-to-Touch Presence Handlers
  const handleHoldStart = () => {
    setIsHoldingTouchLocal(true);
    if (!isSolo) {
      multiplayerSync.sendHoldTouch(true);
    }
  };

  const handleHoldEnd = () => {
    setIsHoldingTouchLocal(false);
    if (!isSolo) {
      multiplayerSync.sendHoldTouch(false);
    }
  };

  // Incoming Voice Call Handlers
  const handleAcceptIncomingCall = async () => {
    setIncomingCallInfo(null);
    const ok = await multiplayerSync.acceptVoiceCall();
    if (!ok) {
      setCustomQuestionToast('Microphone access denied or unavailable');
      setTimeout(() => setCustomQuestionToast(null), 3500);
    }
  };

  const handleDeclineIncomingCall = () => {
    setIncomingCallInfo(null);
    multiplayerSync.declineVoiceCall();
  };

  // URL Query Param auto-join detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      const cleanCode = roomParam.replace(/[^A-Za-z0-9]/g, '').toUpperCase().trim();
      if (cleanCode.length >= 3) {
        handleJoinRoom({
          roomCode: cleanCode,
          userName: localStorage.getItem('between_user_name') || 'Partner 2'
        });
      }
    }
  }, []);

  // HOST: Create Room
  const handleCreateRoom = ({ relationshipType: rel, sessionLength: len, roomCode: customCode, userName }) => {
    setIsHost(true);
    setIsSolo(false);
    setErrorMessage('');
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
      onCallState: handleCallState,
      onIncomingCall: (info) => setIncomingCallInfo(info),
      onHoldTouch: (isHolding) => setIsHoldingTouchPartner(isHolding),
      onCustomQuestion: handleReceiveCustomQuestion,
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
    setIsSolo(false);
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
      onReaction: handleReactionReceived,
      onTouchRipple: handleTouchRippleReceived,
      onCallStream: handleRemoteStream,
      onCallState: handleCallState,
      onIncomingCall: (info) => setIncomingCallInfo(info),
      onHoldTouch: (isHolding) => setIsHoldingTouchPartner(isHolding),
      onCustomQuestion: handleReceiveCustomQuestion
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
    triggerHaptic('medium');
    setSwipeClass('swipe-out-left');

    setTimeout(() => {
      playChimeSound();
      const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
      setCurrentIndex(nextIdx);
      setCurrentTurn(nextTurn);
      setActiveWildcardPrompt(null);
      setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
      setSwipeClass('swipe-in-right');

      if (!isSolo) {
        multiplayerSync.syncState({
          currentIndex: nextIdx,
          currentTurn: nextTurn,
          wildcardPrompt: null
        });
      }

      setTimeout(() => {
        setSwipeClass('');
      }, 360);
    }, 230);
  };

  // Skip Question (Smoothly pass question with state sync)
  const handleSkipQuestion = () => {
    playClickSound();
    triggerHaptic('light');
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

    setSwipeClass('swipe-out-left');
    setTimeout(() => {
      playChimeSound();
      const nextTurn = currentTurn === 'host' ? 'guest' : 'host';
      setCurrentIndex(nextIdx);
      setCurrentTurn(nextTurn);
      setActiveWildcardPrompt(null);
      setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
      setSwipeClass('swipe-in-right');

      if (!isSolo) {
        multiplayerSync.syncState({
          currentIndex: nextIdx,
          currentTurn: nextTurn,
          wildcardPrompt: null
        });
      }

      setTimeout(() => {
        setSwipeClass('');
      }, 360);
    }, 230);
  };

  // Send Appreciation Note
  const handleSendAppreciationNote = (noteText) => {
    setMyAppreciationNote(noteText);
    if (!isSolo) {
      multiplayerSync.syncState({
        appreciationNote: noteText,
        appreciationSender: isHost ? 'host' : 'guest'
      });
    }
  };

  // Previous Card
  const handlePreviousCard = () => {
    if (currentIndex <= 0) return;
    playClickSound();
    triggerHaptic('medium');
    setSwipeClass('swipe-out-right');

    setTimeout(() => {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setActiveWildcardPrompt(null);
      setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
      setSwipeClass('swipe-in-left');
      if (!isSolo) {
        multiplayerSync.syncState({ currentIndex: prevIdx, wildcardPrompt: null });
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
    triggerHaptic('light');
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
    triggerHaptic('success');
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
    multiplayerSync.leaveRoom();
    setScreen('LOBBY');
    setConnectionStatus('IDLE');
    setErrorMessage('');
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

      {/* Hold-to-Touch Presence Edge Glow Overlay */}
      <div className={`hold-presence-overlay ${isHoldingTouchLocal && (isHoldingTouchPartner || isSolo) ? 'active' : ''}`} />

      {/* Active Shared Touch Banner */}
      {isHoldingTouchLocal && (isHoldingTouchPartner || isSolo) && (
        <div className="hold-presence-banner">
          <Sparkles size={14} color="#E5A93C" />
          <span>Holding hands across screens ✨</span>
        </div>
      )}

      {/* Custom Question Alert Toast */}
      {customQuestionToast && (
        <div style={{
          position: 'fixed',
          top: '76px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99990,
          padding: '10px 20px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(28, 25, 23, 0.92)',
          border: '1px solid rgba(229, 169, 60, 0.6)',
          color: '#FBF6F0',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <span>💌</span>
          <span>{customQuestionToast}</span>
        </div>
      )}

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
          isSessionActive={screen !== 'LOBBY'}
          theme={theme}
          onToggleTheme={toggleTheme}
          voiceCallState={voiceCallState}
          isVoiceMuted={isVoiceMuted}
          onToggleVoiceCall={handleToggleVoiceCall}
          onToggleVoiceMute={handleToggleVoiceMute}
          isPartnerSpeaking={isPartnerSpeaking}
          peerName={isHost ? guestName : hostName}
          onShowToast={(msg) => {
            setCustomQuestionToast(msg);
            setTimeout(() => setCustomQuestionToast(null), 3500);
          }}
        />

        {/* SCREEN 1: LOBBY */}
        {screen === 'LOBBY' && (
          <LobbyScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartSolo={handleStartSolo}
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
                wildcardPrompt={activeWildcardPrompt}
                onSelectWildcardPrompt={(prompt) => {
                  setActiveWildcardPrompt(prompt);
                  if (!isSolo) {
                    multiplayerSync.syncState({ wildcardPrompt: prompt });
                  }
                }}
                onSkipQuestion={handleSkipQuestion}
                isPartnerSpeaking={isPartnerSpeaking}
              />
            </div>

            {/* Navigation & Question Modifier Controls - Responsive Two-Tier Layout */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              marginTop: '4px'
            }}>
              {/* Row 1: Swappers / Modifiers (Lighter, Deeper, Secret Card) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                width: '100%'
              }}>
                <button
                  onClick={() => handleSwap('LIGHTER')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 6px',
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    gap: '4px',
                    minHeight: '44px',
                    width: '100%'
                  }}
                  title="Swap for an easier question"
                >
                  <Feather size={14} strokeWidth={2.4} color="var(--color-sage)" />
                  <span>Lighter</span>
                </button>

                <button
                  onClick={() => handleSwap('DEEPER')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 6px',
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    gap: '4px',
                    minHeight: '44px',
                    width: '100%'
                  }}
                  title="Swap for a deeper question"
                >
                  <Flame size={14} strokeWidth={2.4} color="var(--color-ember)" />
                  <span>Deeper</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setShowCustomQuestionModal(true);
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '8px 6px',
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    gap: '4px',
                    minHeight: '44px',
                    width: '100%',
                    borderColor: 'rgba(198, 136, 44, 0.45)',
                    color: '#C6882C'
                  }}
                  title="Write a surprise question for your partner"
                >
                  <PenLine size={14} strokeWidth={2.4} color="#C6882C" />
                  <span>Secret Card</span>
                </button>
              </div>

              {/* Row 2: Card Navigation (Previous, Skip, Next) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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

                {/* Skip button */}
                <button
                  onClick={handleSkipQuestion}
                  className="btn-secondary"
                  style={{
                    padding: '10px 14px',
                    fontSize: '13px',
                    gap: '5px',
                    minHeight: '44px',
                    color: 'var(--color-muted)',
                    flexShrink: 0
                  }}
                  title="Skip this question"
                  aria-label="Skip question"
                >
                  <SkipForward size={14} strokeWidth={2.2} />
                  <span>Skip</span>
                </button>

                {/* Next button */}
                <button
                  onClick={handleAdvanceCard}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    minHeight: '44px',
                    padding: '10px 18px',
                    fontSize: '14px',
                    gap: '6px'
                  }}
                >
                  <span>{currentIndex === questions.length - 1 ? 'Complete' : 'Next'}</span>
                  <ChevronRight size={18} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            {/* Sensory Presence & Live Reaction Row */}
            <div style={{
              marginTop: '16px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <HoldTouchIndicator
                isLocalHolding={isHoldingTouchLocal}
                isPartnerHolding={isHoldingTouchPartner}
                onHoldStart={handleHoldStart}
                onHoldEnd={handleHoldEnd}
                partnerName={isHost ? guestName : hostName}
                isSolo={isSolo}
              />
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
            isSolo={isSolo}
            myAppreciationNote={myAppreciationNote}
            peerAppreciationNote={peerAppreciationNote}
            onSendAppreciationNote={handleSendAppreciationNote}
            onStartNew={() => {
              const newDeck = buildSession(relationshipType, sessionLength);
              setQuestions(newDeck);
              setCurrentIndex(0);
              setCurrentTurn('host');
              setBookmarkedMoments([]);
              setBlindState({ myAnswer: '', peerAnswer: '', mySubmitted: false, peerSubmitted: false });
              setActiveWildcardPrompt(null);
              setMyAppreciationNote('');
              setPeerAppreciationNote('');
              setScreen('SESSION');
              if (!isSolo) {
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

        {/* Incoming WebRTC Voice Call Modal */}
        <IncomingCallModal
          isOpen={!!incomingCallInfo}
          callerName={incomingCallInfo?.callerName || (isHost ? guestName : hostName)}
          onAccept={handleAcceptIncomingCall}
          onDecline={handleDeclineIncomingCall}
        />

        {/* Custom Mystery Question Composer Modal */}
        <CustomQuestionModal
          isOpen={showCustomQuestionModal}
          onClose={() => setShowCustomQuestionModal(false)}
          onSubmit={handleSendCustomQuestion}
          partnerName={isHost ? guestName : hostName}
        />

        {/* Legal / Privacy Policy & Terms Modal */}
        <LegalModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
        />
      </div>
    </div>
  );
}

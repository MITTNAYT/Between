import { createClient } from '@supabase/supabase-js';
import PeerPkg from 'peerjs';

const Peer = PeerPkg?.Peer || PeerPkg?.default?.Peer || PeerPkg?.default || PeerPkg;

export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL)) ||
  'https://eqbciwyqkqiyygwseijq.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmNpd3lxa3FpeXlnd3NlaWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMTYxMzIsImV4cCI6MjEwNzc5MjEzMn0.z-V53hEY5HLrORR0xqqhIsDwsLuB_7-kd2M7dbCXIiA';

export function createSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
      params: {
        eventsPerSecond: 40
      }
    }
  });
}

export function generateRandomCode(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function sanitizeCode(code) {
  return (code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().trim();
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' }
];

class MultiplayerSync {
  constructor() {
    this.clientId = 'u_' + Math.random().toString(36).substring(2, 9);
    this.supabase = createSupabaseClient();
    this.channel = null;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.myName = 'Partner 1';
    this.peerName = 'Partner 2';
    this.isConnected = false;
    this.joinTimeout = null;
    this.handshakeInterval = null;
    this.lifecycleSetup = false;
    this.processedMsgIds = new Set();

    // Callbacks
    this.onStateChangeCallback = null;
    this.onReactionCallback = null;
    this.onStatusChangeCallback = null;
    this.onTouchRippleCallback = null;
    this.onRequestStateCallback = null;
    this.onCallStreamCallback = null;
    this.onCallStateCallback = null;
    this.onIncomingCallCallback = null;
    this.onHoldTouchCallback = null;
    this.onCustomQuestionCallback = null;

    // WebRTC Native Voice Call
    this.rtcPeerConnection = null;
    this.localStream = null;
    this.isMuted = false;
    this.pendingIceCandidates = [];

    this.setupLifecycleListeners();
  }

  setupLifecycleListeners() {
    if (typeof window === 'undefined' || this.lifecycleSetup) return;
    this.lifecycleSetup = true;

    const handleWakeup = () => {
      if (typeof document !== 'undefined' && (document.visibilityState === 'visible' || !document.hidden)) {
        console.log('[MultiplayerSync] Tab active / wake up detected');
        if (this.roomCode && !this.isConnected) {
          try {
            this.supabase.realtime.connect();
          } catch (e) {}
          this.pulseHandshake();
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleWakeup);
    }
    window.addEventListener('focus', handleWakeup);
    window.addEventListener('pageshow', handleWakeup);
    window.addEventListener('online', handleWakeup);
  }

  pulseHandshake() {
    if (!this.roomCode) return;
    if (this.isHost) {
      this.broadcastMessage({
        type: 'HOST_BEACON',
        name: this.myName,
        voicePeerId: this.myVoicePeerId,
        isHost: true
      });
    } else {
      this.broadcastMessage({
        type: 'GUEST_PING',
        name: this.myName,
        voicePeerId: this.myVoicePeerId,
        isHost: false
      });
    }
  }

  generateRoomCode(length = 5) {
    return generateRandomCode(length);
  }

  initHost(optsOrOnStatus, ...rest) {
    let opts = {};
    let onStatusChange, onStateChange, onReaction, onTouchRipple, onCallStream, onCallState;

    if (typeof optsOrOnStatus === 'object' && optsOrOnStatus !== null) {
      opts = optsOrOnStatus;
      onStatusChange = opts.onStatusChange;
      onStateChange = opts.onStateChange;
      onReaction = opts.onReaction;
      onTouchRipple = opts.onTouchRipple;
      onCallStream = opts.onCallStream;
      onCallState = opts.onCallState;
    } else {
      onStatusChange = optsOrOnStatus;
      [onStateChange, onReaction, onTouchRipple, onCallStream, onCallState] = rest;
    }

    this.cleanup();
    this.isHost = true;
    this.myName = opts.userName || 'Partner 1';
    this.peerName = 'Partner 2';
    this.onStatusChangeCallback = onStatusChange;
    this.onStateChangeCallback = onStateChange;
    this.onReactionCallback = onReaction;
    this.onTouchRippleCallback = onTouchRipple;
    this.onCallStreamCallback = onCallStream;
    this.onCallStateCallback = onCallState;
    this.onIncomingCallCallback = opts.onIncomingCall || null;
    this.onHoldTouchCallback = opts.onHoldTouch || null;
    this.onCustomQuestionCallback = opts.onCustomQuestion || null;
    this.onRequestStateCallback = opts.onRequestState || null;

    this.roomCode = sanitizeCode(opts.roomCode || this.generateRoomCode());

    // 1. Setup local BroadcastChannel
    this.setupBroadcastChannel(this.roomCode);

    // 2. Setup Supabase Realtime channel
    this.setupSupabaseChannel();

    // 3. Immediately emit waiting state to UI
    this.onStatusChangeCallback?.({
      status: 'WAITING_FOR_GUEST',
      roomCode: this.roomCode,
      isHost: true,
      myName: this.myName
    });

    // 4. Start active presence beacon (every 1.4s until guest arrives)
    this.pulseHandshake();
    this.handshakeInterval = setInterval(() => {
      if (!this.isConnected && this.roomCode) {
        this.pulseHandshake();
      }
    }, 1400);

    return this.roomCode;
  }

  joinRoom(optsOrCode, ...rest) {
    let opts = {};
    let code = '';
    let onStatusChange, onStateChange, onReaction, onTouchRipple, onCallStream, onCallState;

    if (typeof optsOrCode === 'object' && optsOrCode !== null) {
      opts = optsOrCode;
      code = opts.roomCode || '';
      onStatusChange = opts.onStatusChange;
      onStateChange = opts.onStateChange;
      onReaction = opts.onReaction;
      onTouchRipple = opts.onTouchRipple;
      onCallStream = opts.onCallStream;
      onCallState = opts.onCallState;
    } else {
      code = optsOrCode;
      [onStatusChange, onStateChange, onReaction, onTouchRipple, onCallStream, onCallState] = rest;
    }

    this.cleanup();
    this.isHost = false;
    this.myName = opts.userName || 'Partner 2';
    this.peerName = 'Partner 1';
    this.roomCode = sanitizeCode(code);
    this.onStatusChangeCallback = onStatusChange;
    this.onStateChangeCallback = onStateChange;
    this.onReactionCallback = onReaction;
    this.onTouchRippleCallback = onTouchRipple;
    this.onCallStreamCallback = onCallStream;
    this.onCallStateCallback = onCallState;
    this.onIncomingCallCallback = opts.onIncomingCall || null;
    this.onHoldTouchCallback = opts.onHoldTouch || null;
    this.onCustomQuestionCallback = opts.onCustomQuestion || null;

    if (!this.roomCode || this.roomCode.length < 3) {
      this.onStatusChangeCallback?.({
        status: 'ERROR',
        error: 'Please enter a valid room code.',
        roomCode: this.roomCode,
        isHost: false
      });
      return;
    }

    this.onStatusChangeCallback?.({
      status: 'CONNECTING',
      roomCode: this.roomCode,
      isHost: false
    });

    // 1. Setup local BroadcastChannel
    this.setupBroadcastChannel(this.roomCode);

    // 2. Setup Supabase Realtime channel
    this.setupSupabaseChannel();

    // 3. Continuous Handshake Ping (every 1.2s until connected)
    this.pulseHandshake();
    this.handshakeInterval = setInterval(() => {
      if (!this.isConnected && this.roomCode) {
        this.pulseHandshake();
      }
    }, 1200);

    // 4. Generous 45s safety timeout for mobile app switching
    this.joinTimeout = setTimeout(() => {
      if (!this.isConnected) {
        this.onStatusChangeCallback?.({
          status: 'ERROR',
          error: `Could not find room "${this.roomCode}". Please ensure your partner has the room open and check the code.`,
          roomCode: this.roomCode,
          isHost: false
        });
      }
    }, 45000);

    // 5. Voice call ready on demand via WebRTC
  }

  setupBroadcastChannel(roomCode) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(`between_room_${roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          const data = event.data;
          if (data && data.senderId !== this.clientId) {
            this.handleIncomingData(data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }
  }

  setupSupabaseChannel() {
    if (!this.roomCode) return;

    if (this.channel) {
      try {
        this.channel.untrack();
        this.supabase.removeChannel(this.channel);
      } catch (e) {}
      this.channel = null;
    }

    const channelName = `between_room_${this.roomCode}`;
    this.channel = this.supabase.channel(channelName, {
      config: {
        broadcast: { ack: true, self: false },
        presence: { key: this.clientId }
      }
    });

    // 1. Broadcast Event Listener
    this.channel.on('broadcast', { event: 'game_event' }, ({ payload }) => {
      this.handleIncomingData(payload);
    });

    // 2. Presence Listeners (both sync and join)
    this.channel.on('presence', { event: 'sync' }, () => {
      this.handlePresenceSync();
    });
    this.channel.on('presence', { event: 'join' }, () => {
      this.handlePresenceSync();
    });

    // 3. Presence Leave Listener
    this.channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      if (this.isConnected && leftPresences && leftPresences.length > 0) {
        const otherLeft = leftPresences.some(p => p.clientId !== this.clientId);
        if (otherLeft) {
          this.isConnected = false;
          this.onStatusChangeCallback?.({
            status: 'DISCONNECTED',
            roomCode: this.roomCode,
            isHost: this.isHost,
            peerName: this.peerName,
            myName: this.myName
          });
        }
      }
    });

    // 4. Subscribe and Track Presence
    this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          await this.channel.track({
            clientId: this.clientId,
            isHost: this.isHost,
            name: this.myName,
            voicePeerId: this.myVoicePeerId,
            joinedAt: Date.now()
          });

          // Immediate pulse handshake upon successful subscription
          this.pulseHandshake();
        } catch (e) {
          console.warn('[Supabase Realtime] Track error:', e);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn(`[Supabase Realtime] Channel status: ${status}, retrying in 1.5s...`);
        setTimeout(() => {
          if (!this.isConnected && this.roomCode) {
            try { this.setupSupabaseChannel(); } catch (e) {}
          }
        }, 1500);
      }
    });
  }

  handlePresenceSync() {
    if (!this.channel) return;
    const presenceState = this.channel.presenceState();
    const allUsers = Object.values(presenceState).flat();

    const otherUser = allUsers.find(u => u && u.clientId !== this.clientId);
    if (!otherUser) return;

    // Found partner!
    const wasConnected = this.isConnected;
    this.isConnected = true;

    if (this.joinTimeout) {
      clearTimeout(this.joinTimeout);
      this.joinTimeout = null;
    }
    if (this.handshakeInterval) {
      clearInterval(this.handshakeInterval);
      this.handshakeInterval = null;
    }

    if (otherUser.name) this.peerName = otherUser.name;
    if (otherUser.voicePeerId) this.remoteVoicePeerId = otherUser.voicePeerId;

    if (!wasConnected) {
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost,
        peerName: this.peerName,
        myName: this.myName
      });

      if (this.isHost) {
        // Host immediately triggers state sync
        this.onRequestStateCallback?.();
      }
    }
  }

  handleIncomingData(data) {
    if (!data || typeof data !== 'object') return;
    if (data.senderId === this.clientId) return;
    if (data.roomCode && data.roomCode !== this.roomCode) return;

    // Deduplication check
    const msgId = data.msgId || `${data.type}_${data.senderId}_${data.timestamp}`;
    if (this.processedMsgIds.has(msgId)) return;
    this.processedMsgIds.add(msgId);
    if (this.processedMsgIds.size > 400) {
      const oldest = this.processedMsgIds.values().next().value;
      this.processedMsgIds.delete(oldest);
    }

    if (data.senderName && data.senderName !== this.peerName) {
      this.peerName = data.senderName;
    }

    // A. HOST BEACON or PONG received by GUEST
    if (data.type === 'HOST_BEACON' || data.type === 'HOST_PONG') {
      if (!this.isHost) {
        const wasConnected = this.isConnected;
        this.isConnected = true;

        if (this.joinTimeout) {
          clearTimeout(this.joinTimeout);
          this.joinTimeout = null;
        }
        if (this.handshakeInterval) {
          clearInterval(this.handshakeInterval);
          this.handshakeInterval = null;
        }

        if (data.name) this.peerName = data.name;
        if (data.voicePeerId) this.remoteVoicePeerId = data.voicePeerId;

        // Reply with GUEST_CONNECTED confirmation
        this.broadcastMessage({
          type: 'GUEST_CONNECTED',
          name: this.myName,
          voicePeerId: this.myVoicePeerId
        });

        if (!wasConnected) {
          this.onStatusChangeCallback?.({
            status: 'CONNECTED',
            roomCode: this.roomCode,
            isHost: false,
            peerName: this.peerName,
            myName: this.myName
          });
        }
      }
      return;
    }

    // B. GUEST PING or CONNECTED received by HOST
    if (data.type === 'GUEST_PING' || data.type === 'GUEST_CONNECTED') {
      if (this.isHost) {
        const wasConnected = this.isConnected;
        this.isConnected = true;

        if (this.handshakeInterval) {
          clearInterval(this.handshakeInterval);
          this.handshakeInterval = null;
        }

        if (data.name) this.peerName = data.name;
        if (data.voicePeerId) this.remoteVoicePeerId = data.voicePeerId;

        // Confirm to guest with HOST_PONG
        this.broadcastMessage({
          type: 'HOST_PONG',
          name: this.myName,
          voicePeerId: this.myVoicePeerId
        });

        if (!wasConnected) {
          this.onStatusChangeCallback?.({
            status: 'CONNECTED',
            roomCode: this.roomCode,
            isHost: true,
            peerName: this.peerName,
            myName: this.myName
          });
        }

        // Always sync latest state to guest
        this.onRequestStateCallback?.();
      }
      return;
    }

    // 2. Request State
    if (data.type === 'STATE_REQ' && this.isHost) {
      this.onRequestStateCallback?.();
      return;
    }

    // 3. Partner Left
    if (data.type === 'DISCONNECT') {
      this.isConnected = false;
      this.onStatusChangeCallback?.({
        status: 'DISCONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost,
        peerName: this.peerName,
        myName: this.myName
      });
      return;
    }

    // 4. Game State Sync
    if (data.type === 'STATE_SYNC') {
      if (!this.isConnected) {
        if (this.joinTimeout) {
          clearTimeout(this.joinTimeout);
          this.joinTimeout = null;
        }
        this.isConnected = true;
        this.onStatusChangeCallback?.({
          status: 'CONNECTED',
          roomCode: this.roomCode,
          isHost: this.isHost,
          peerName: this.peerName,
          myName: this.myName
        });
      }
      this.onStateChangeCallback?.(data.payload);
    } else if (data.type === 'REACTION') {
      this.onReactionCallback?.(data.payload);
    } else if (data.type === 'TOUCH_RIPPLE') {
      this.onTouchRippleCallback?.(data.payload);
    }

    // 5. Native WebRTC Voice Call Signaling
    if (data.type === 'VOICE_CALL_REQUEST') {
      this.onIncomingCallCallback?.({ callerName: data.senderName || this.peerName });
      this.onCallStateCallback?.('INCOMING');
      return;
    }

    if (data.type === 'VOICE_CALL_ACCEPT') {
      this.startRtcCaller();
      return;
    }

    if (data.type === 'VOICE_CALL_REJECT') {
      this.cleanupRtc();
      this.onCallStateCallback?.('REJECTED');
      setTimeout(() => {
        if (this.onCallStateCallback) this.onCallStateCallback('IDLE');
      }, 3000);
      return;
    }

    if (data.type === 'VOICE_CALL_END') {
      this.cleanupRtc();
      this.onCallStateCallback?.('IDLE');
      return;
    }

    if (data.type === 'VOICE_CALL_SIGNAL' && data.signal) {
      this.handleRtcSignal(data.signal);
      return;
    }

    // 6. Hold-to-Touch Presence
    if (data.type === 'HOLD_TOUCH') {
      this.onHoldTouchCallback?.(!!data.isHolding);
      return;
    }

    // 7. Custom Mystery Question
    if (data.type === 'CUSTOM_QUESTION' && data.payload) {
      this.onCustomQuestionCallback?.(data.payload);
      return;
    }
  }

  broadcastMessage(message) {
    if (!this.roomCode) return;

    const payload = {
      ...message,
      msgId: `${this.clientId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      senderId: this.clientId,
      senderName: this.myName,
      roomCode: this.roomCode,
      timestamp: Date.now()
    };

    this.processedMsgIds.add(payload.msgId);

    // 1. Send via Supabase Realtime Broadcast (Standard Port 443 HTTPS/WSS)
    if (this.channel) {
      try {
        this.channel.send({
          type: 'broadcast',
          event: 'game_event',
          payload
        });
      } catch (e) {
        console.warn('[Supabase Realtime] Send broadcast error:', e);
      }
    }

    // 2. Send via local BroadcastChannel (instant for tabs on same device)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }
  }

  syncState(state) {
    this.broadcastMessage({
      type: 'STATE_SYNC',
      payload: state
    });
  }

  sendReaction(emoji) {
    this.broadcastMessage({
      type: 'REACTION',
      payload: { emoji, sender: this.isHost ? 'host' : 'guest', timestamp: Date.now() }
    });
  }

  sendPresenceTouch(xPercent, yPercent) {
    this.broadcastMessage({
      type: 'TOUCH_RIPPLE',
      payload: { x: xPercent, y: yPercent, sender: this.isHost ? 'host' : 'guest', timestamp: Date.now() }
    });
  }

  // --- Hold to Touch Shared Presence ---
  sendHoldTouch(isHolding) {
    this.broadcastMessage({
      type: 'HOLD_TOUCH',
      isHolding: !!isHolding
    });
  }

  // --- Custom Mystery Question ---
  sendCustomQuestion(questionData) {
    this.broadcastMessage({
      type: 'CUSTOM_QUESTION',
      payload: questionData
    });
  }

  // --- Native WebRTC Voice Call (Supabase Signaling) ---
  async startVoiceCall() {
    if (!this.roomCode) return false;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      console.warn('Microphone not supported on this browser/platform');
      this.onCallStateCallback?.('UNSUPPORTED');
      return false;
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.onCallStateCallback?.('CALLING');

      // Request call from partner via Supabase
      this.broadcastMessage({
        type: 'VOICE_CALL_REQUEST',
        callerName: this.myName
      });

      return true;
    } catch (e) {
      console.warn('Microphone access denied or error:', e);
      this.onCallStateCallback?.('PERMISSION_DENIED');
      return false;
    }
  }

  async acceptVoiceCall() {
    if (!this.roomCode) return false;
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.onCallStateCallback?.('CONNECTING');

      // Send acceptance to caller
      this.broadcastMessage({
        type: 'VOICE_CALL_ACCEPT',
        name: this.myName
      });

      return true;
    } catch (e) {
      console.warn('Failed to accept voice call:', e);
      this.declineVoiceCall();
      this.onCallStateCallback?.('PERMISSION_DENIED');
      return false;
    }
  }

  declineVoiceCall() {
    this.broadcastMessage({
      type: 'VOICE_CALL_REJECT'
    });
    this.cleanupRtc();
    this.onCallStateCallback?.('IDLE');
  }

  endVoiceCall() {
    this.broadcastMessage({
      type: 'VOICE_CALL_END'
    });
    this.cleanupRtc();
    this.onCallStateCallback?.('IDLE');
  }

  cleanupRtc() {
    if (this.rtcPeerConnection) {
      try {
        this.rtcPeerConnection.ontrack = null;
        this.rtcPeerConnection.onicecandidate = null;
        this.rtcPeerConnection.onconnectionstatechange = null;
        this.rtcPeerConnection.close();
      } catch (e) {}
      this.rtcPeerConnection = null;
    }
    if (this.localStream) {
      try {
        this.localStream.getTracks().forEach(track => track.stop());
      } catch (e) {}
      this.localStream = null;
    }
    this.pendingIceCandidates = [];
    this.isMuted = false;
  }

  createRtcConnection() {
    if (this.rtcPeerConnection) {
      try { this.rtcPeerConnection.close(); } catch (e) {}
    }

    if (typeof RTCPeerConnection === 'undefined') return null;

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.onCallStreamCallback?.(event.streams[0]);
        this.onCallStateCallback?.('CONNECTED');
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.broadcastMessage({
          type: 'VOICE_CALL_SIGNAL',
          signal: { type: 'candidate', candidate: event.candidate }
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        this.onCallStateCallback?.('CONNECTED');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.cleanupRtc();
        this.onCallStateCallback?.('ENDED');
        setTimeout(() => {
          if (this.onCallStateCallback) this.onCallStateCallback('IDLE');
        }, 2000);
      }
    };

    this.rtcPeerConnection = pc;
    return pc;
  }

  async startRtcCaller() {
    try {
      const pc = this.createRtcConnection();
      if (!pc) return;

      const offer = await pc.createOffer({ offerToReceiveAudio: true });
      await pc.setLocalDescription(offer);

      this.broadcastMessage({
        type: 'VOICE_CALL_SIGNAL',
        signal: { type: 'offer', sdp: offer }
      });
    } catch (e) {
      console.warn('Caller WebRTC offer error:', e);
      this.endVoiceCall();
    }
  }

  async handleRtcSignal(signal) {
    if (!signal) return;

    try {
      if (signal.type === 'offer') {
        const pc = this.createRtcConnection();
        if (!pc) return;

        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        // Process any queued candidates
        while (this.pendingIceCandidates.length > 0) {
          const candidate = this.pendingIceCandidates.shift();
          try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        this.broadcastMessage({
          type: 'VOICE_CALL_SIGNAL',
          signal: { type: 'answer', sdp: answer }
        });
      } else if (signal.type === 'answer') {
        if (this.rtcPeerConnection) {
          await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));

          // Process any queued candidates
          while (this.pendingIceCandidates.length > 0) {
            const candidate = this.pendingIceCandidates.shift();
            try { await this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
          }
        }
      } else if (signal.type === 'candidate' && signal.candidate) {
        if (this.rtcPeerConnection && this.rtcPeerConnection.remoteDescription) {
          try {
            await this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (e) {}
        } else {
          this.pendingIceCandidates.push(signal.candidate);
        }
      }
    } catch (e) {
      console.warn('WebRTC signal handling notice:', e);
    }
  }

  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.isMuted = !audioTrack.enabled;
        return this.isMuted;
      }
    }
    return false;
  }

  leaveRoom() {
    this.broadcastMessage({ type: 'DISCONNECT' });
    this.cleanup();
  }

  cleanup() {
    if (this.joinTimeout) {
      clearTimeout(this.joinTimeout);
      this.joinTimeout = null;
    }
    if (this.handshakeInterval) {
      clearInterval(this.handshakeInterval);
      this.handshakeInterval = null;
    }
    this.cleanupRtc();
    this.onCallStateCallback?.('IDLE');

    if (this.channel) {
      try {
        this.channel.untrack();
        this.supabase.removeChannel(this.channel);
      } catch (e) {}
      this.channel = null;
    }

    try {
      if (this.broadcastChannel) {
        this.broadcastChannel.close();
        this.broadcastChannel = null;
      }
    } catch (e) {}

    this.isConnected = false;
    this.roomCode = null;
    this.remoteVoicePeerId = null;
  }
}

export const multiplayerSync = new MultiplayerSync();
export { MultiplayerSync };

import PeerPkg from 'peerjs';
const Peer = PeerPkg?.Peer || PeerPkg?.default?.Peer || PeerPkg?.default || PeerPkg;

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
    this.ws = null;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.myName = 'Partner 1';
    this.peerName = 'Partner 2';
    this.isConnected = false;
    this.joinTimeout = null;
    this.guestHelloTimer = null;
    this.hostWaitingTimer = null;
    this.microPollTimer = null;
    this.heartbeatTimer = null;

    // Deduplication tracking
    this.processedMsgIds = new Set();

    // Callbacks
    this.onStateChangeCallback = null;
    this.onReactionCallback = null;
    this.onStatusChangeCallback = null;
    this.onTouchRippleCallback = null;
    this.onRequestStateCallback = null;
    this.onCallStreamCallback = null;
    this.onCallStateCallback = null;

    // Optional PeerJS Voice Call
    this.peer = null;
    this.mediaCall = null;
    this.localStream = null;
    this.isMuted = false;
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
    this.onRequestStateCallback = opts.onRequestState || null;

    this.roomCode = sanitizeCode(opts.roomCode || this.generateRoomCode());

    // 1. Setup local BroadcastChannel for same-device tabs
    this.setupBroadcastChannel(this.roomCode);

    // 2. Connect to real-time pubsub stream via WebSocket
    this.connectRealtimeStream();

    // 3. Start active HTTP micro-polling fallback
    this.startMicroPolling();

    // 4. Start Host waiting beacon so guest immediately finds host
    this.startHostWaitingBeacon();

    // 5. Immediately emit waiting state
    this.onStatusChangeCallback?.({
      status: 'WAITING_FOR_GUEST',
      roomCode: this.roomCode,
      isHost: true,
      myName: this.myName
    });

    // 6. Initialize optional voice calling
    this.initPeerVoice();

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

    // 2. Connect to real-time pubsub stream via WebSocket
    this.connectRealtimeStream();

    // 3. Start active HTTP micro-polling fallback
    this.startMicroPolling();

    // 4. Timeout for connection (extended to 30 seconds with automatic active retries)
    this.joinTimeout = setTimeout(() => {
      if (!this.isConnected) {
        this.stopGuestHelloPing();
        this.onStatusChangeCallback?.({
          status: 'ERROR',
          error: `Could not connect to room "${this.roomCode}". Please ensure your partner has the room open and check the code.`,
          roomCode: this.roomCode,
          isHost: false
        });
      }
    }, 30000);

    // 5. Start sending hello ping immediately and repeatedly
    this.startGuestHelloPing();

    // 6. Initialize optional voice calling
    this.initPeerVoice();
  }

  setupBroadcastChannel(roomCode) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(`between_room_${roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          const data = event.data;
          if (data && data.senderId !== this.clientId) {
            this.handleIncomingData(data, data.msgId);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }
  }

  connectRealtimeStream() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }

    if (!this.roomCode) return;

    const topic = `between_v2_room_${this.roomCode}`;
    const wsUrl = `wss://ntfy.sh/${topic}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.addEventListener('open', () => {
        if (!this.isHost && !this.isConnected) {
          this.sendHello();
        } else if (this.isHost && !this.isConnected) {
          this.sendHostWaitingBeacon();
        }
      });

      this.ws.addEventListener('message', (event) => {
        try {
          const outer = JSON.parse(event.data);
          if (outer.event === 'message' && outer.message) {
            const data = JSON.parse(outer.message);
            if (data && data.senderId !== this.clientId) {
              this.handleIncomingData(data, data.msgId || outer.id);
            }
          }
        } catch (e) {
          // ignore keepalive or parse errors
        }
      });

      this.ws.addEventListener('error', (err) => {
        console.warn('Realtime WS notice (polling fallback active):', err);
      });

      this.ws.addEventListener('close', () => {
        if (this.roomCode) {
          setTimeout(() => {
            if (this.roomCode && !this.ws) {
              this.connectRealtimeStream();
            }
          }, 2000);
        }
      });
    } catch (e) {
      console.warn('Realtime stream init error:', e);
    }
  }

  startMicroPolling() {
    this.stopMicroPolling();
    const pollInterval = this.isConnected ? 1200 : 750;

    // Immediately poll once
    this.pollOnce();

    this.microPollTimer = setInterval(() => {
      this.pollOnce();
    }, pollInterval);
  }

  stopMicroPolling() {
    if (this.microPollTimer) {
      clearInterval(this.microPollTimer);
      this.microPollTimer = null;
    }
  }

  async pollOnce() {
    if (!this.roomCode) return;
    const topic = `between_v2_room_${this.roomCode}`;
    try {
      const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1&since=1m`, {
        cache: 'no-store'
      });
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;

      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (!line) continue;
        try {
          const item = JSON.parse(line);
          if (item.event === 'message' && item.message) {
            const data = JSON.parse(item.message);
            if (data && data.senderId !== this.clientId) {
              this.handleIncomingData(data, data.msgId || item.id);
            }
          }
        } catch (e) {}
      }
    } catch (e) {
      // Network hiccup - polling will automatically retry
    }
  }

  startHostWaitingBeacon() {
    this.stopHostWaitingBeacon();
    this.sendHostWaitingBeacon();
    this.hostWaitingTimer = setInterval(() => {
      if (!this.isConnected && this.isHost) {
        this.sendHostWaitingBeacon();
      } else {
        this.stopHostWaitingBeacon();
      }
    }, 1200);
  }

  stopHostWaitingBeacon() {
    if (this.hostWaitingTimer) {
      clearInterval(this.hostWaitingTimer);
      this.hostWaitingTimer = null;
    }
  }

  sendHostWaitingBeacon() {
    this.broadcastMessage({
      type: 'HOST_WAITING',
      name: this.myName
    });
  }

  startGuestHelloPing() {
    this.stopGuestHelloPing();
    this.sendHello();
    this.guestHelloTimer = setInterval(() => {
      if (!this.isConnected) {
        this.sendHello();
      } else {
        this.stopGuestHelloPing();
      }
    }, 900);
  }

  stopGuestHelloPing() {
    if (this.guestHelloTimer) {
      clearInterval(this.guestHelloTimer);
      this.guestHelloTimer = null;
    }
  }

  sendHello() {
    this.broadcastMessage({
      type: 'GUEST_HELLO',
      name: this.myName
    });
  }

  handleIncomingData(data, rawId = null) {
    if (!data || typeof data !== 'object') return;
    if (data.type === 'HEARTBEAT') return;

    // Deduplication check
    const msgId = data.msgId || rawId || `${data.type}_${data.senderId}_${data.timestamp}`;
    if (this.processedMsgIds.has(msgId)) {
      return;
    }
    this.processedMsgIds.add(msgId);
    if (this.processedMsgIds.size > 500) {
      const oldest = this.processedMsgIds.values().next().value;
      this.processedMsgIds.delete(oldest);
    }

    // 1. Host sees Guest Hello
    if (data.type === 'GUEST_HELLO') {
      this.stopHostWaitingBeacon();
      this.isConnected = true;
      if (data.name) this.peerName = data.name;

      if (this.isHost) {
        this.broadcastMessage({
          type: 'HOST_CONNECTED',
          name: this.myName
        });
        // Immediately sync current session state to guest
        this.onRequestStateCallback?.();
      }

      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost,
        peerName: this.peerName,
        myName: this.myName
      });

      // Switch to standard polling interval
      this.startMicroPolling();
      return;
    }

    // 2. Guest sees Host Waiting Beacon
    if (data.type === 'HOST_WAITING' && !this.isHost) {
      if (data.name) this.peerName = data.name;
      // Immediately reply with hello to close the handshake loop
      this.sendHello();
      return;
    }

    // 3. Guest receives Host Connected
    if (data.type === 'HOST_CONNECTED') {
      if (this.joinTimeout) {
        clearTimeout(this.joinTimeout);
        this.joinTimeout = null;
      }
      this.stopGuestHelloPing();
      this.isConnected = true;
      if (data.name) this.peerName = data.name;

      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: false,
        peerName: this.peerName,
        myName: this.myName
      });

      // Switch to standard polling interval
      this.startMicroPolling();

      // Request latest session state immediately from host
      this.broadcastMessage({
        type: 'STATE_REQ'
      });
      return;
    }

    if (data.type === 'STATE_REQ' && this.isHost) {
      this.onRequestStateCallback?.();
      return;
    }

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

    if (data.type === 'STATE_SYNC') {
      this.onStateChangeCallback?.(data.payload);
    } else if (data.type === 'REACTION') {
      this.onReactionCallback?.(data.payload);
    } else if (data.type === 'TOUCH_RIPPLE') {
      this.onTouchRippleCallback?.(data.payload);
    }
  }

  broadcastMessage(message) {
    if (!this.roomCode) return;

    const payload = {
      ...message,
      msgId: `${this.clientId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      senderId: this.clientId,
      roomCode: this.roomCode,
      timestamp: Date.now()
    };

    // Remember our own message id so we don't process reflections
    this.processedMsgIds.add(payload.msgId);

    const topic = `between_v2_room_${this.roomCode}`;
    const jsonStr = JSON.stringify(payload);

    // 1. Send via HTTP POST pubsub (with explicit cache headers so poll picks it up)
    try {
      fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'X-Cache': 'yes',
          'Cache': 'yes'
        },
        body: jsonStr
      }).catch((e) => {
        console.warn('PubSub publish notice:', e);
      });
    } catch (e) {}

    // 2. Send via BroadcastChannel (instant for local tabs on same device)
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

  // --- Voice Call WebRTC Support ---
  initPeerVoice() {
    try {
      if (!this.roomCode) return;
      const myPeerId = this.isHost
        ? `between-v2-${this.roomCode.toLowerCase()}`
        : `between-guest-${this.clientId}`;

      this.peer = new Peer(myPeerId, {
        debug: 0,
        config: { iceServers: ICE_SERVERS }
      });

      this.peer.on('call', async (call) => {
        this.mediaCall = call;
        try {
          if (!this.localStream) {
            this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          }
          call.answer(this.localStream);
          this.onCallStateCallback?.('CONNECTED');

          call.on('stream', (remoteStream) => {
            this.onCallStreamCallback?.(remoteStream);
          });

          call.on('close', () => {
            this.onCallStateCallback?.('ENDED');
          });
        } catch (e) {
          console.warn('Voice auto-answer error:', e);
        }
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS voice notice:', err?.type);
      });
    } catch (e) {
      console.warn('PeerJS init voice skipped:', e);
    }
  }

  async startVoiceCall() {
    if (!this.peer || !this.roomCode) {
      console.warn('Cannot start call: peer not initialized');
      return false;
    }

    const targetPeerId = this.isHost
      ? `between-guest-${this.clientId}`
      : `between-v2-${this.roomCode.toLowerCase()}`;

    try {
      this.onCallStateCallback?.('CALLING');
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      const call = this.peer.call(targetPeerId, this.localStream);
      this.mediaCall = call;

      call.on('stream', (remoteStream) => {
        this.onCallStateCallback?.('CONNECTED');
        this.onCallStreamCallback?.(remoteStream);
      });

      call.on('close', () => {
        this.endVoiceCall();
      });

      return true;
    } catch (e) {
      console.warn('Could not start voice call:', e);
      this.onCallStateCallback?.('FAILED');
      return false;
    }
  }

  endVoiceCall() {
    if (this.mediaCall) {
      try { this.mediaCall.close(); } catch (e) {}
      this.mediaCall = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.onCallStateCallback?.('ENDED');
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
    this.stopGuestHelloPing();
    this.stopHostWaitingBeacon();
    this.stopMicroPolling();
    this.endVoiceCall();

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      if (this.peer) {
        this.peer.destroy();
        this.peer = null;
      }
      if (this.broadcastChannel) {
        this.broadcastChannel.close();
        this.broadcastChannel = null;
      }
    } catch (e) {}

    this.isConnected = false;
    this.roomCode = null;
  }
}

export const multiplayerSync = new MultiplayerSync();
export { MultiplayerSync };

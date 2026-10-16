import { Peer } from 'peerjs';

export function generateRandomCode(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

class MultiplayerSync {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.myName = 'Partner 1';
    this.peerName = 'Partner 2';
    this.onStateChangeCallback = null;
    this.onReactionCallback = null;
    this.onStatusChangeCallback = null;
    this.onTouchRippleCallback = null;
    this.isConnected = false;

    // WebRTC Voice Call
    this.mediaCall = null;
    this.localStream = null;
    this.onCallStreamCallback = null;
    this.onCallStateCallback = null;
    this.isMuted = false;
    this.remotePeerId = null;
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

    this.roomCode = (opts.roomCode || this.generateRoomCode()).toUpperCase().trim();
    const peerId = `between-v1-${this.roomCode.toLowerCase()}`;

    this.setupBroadcastChannel(this.roomCode);

    try {
      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        this.onStatusChangeCallback?.({
          status: 'WAITING_FOR_GUEST',
          roomCode: this.roomCode,
          isHost: true
        });
      });

      this.peer.on('connection', (conn) => {
        this.remotePeerId = conn.peer;
        this.setupConnection(conn);
      });

      // Handle incoming voice call
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
          console.warn('Voice call auto-answer error:', e);
        }
      });

      this.peer.on('error', (err) => {
        console.warn('Host Peer error:', err);
        this.onStatusChangeCallback?.({
          status: this.isConnected ? 'CONNECTED' : 'WAITING_FOR_GUEST',
          roomCode: this.roomCode,
          isHost: true
        });
      });
    } catch (e) {
      console.warn('PeerJS init failed, using BroadcastChannel fallback:', e);
    }

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
    this.roomCode = (code || '').toUpperCase().trim();
    this.onStatusChangeCallback = onStatusChange;
    this.onStateChangeCallback = onStateChange;
    this.onReactionCallback = onReaction;
    this.onTouchRippleCallback = onTouchRipple;
    this.onCallStreamCallback = onCallStream;
    this.onCallStateCallback = onCallState;

    this.setupBroadcastChannel(this.roomCode);

    const targetPeerId = `between-v1-${this.roomCode.toLowerCase()}`;
    this.remotePeerId = targetPeerId;
    const guestPeerId = `between-guest-${Math.random().toString(36).substring(2, 7)}`;

    try {
      this.peer = new Peer(guestPeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      this.peer.on('open', () => {
        const conn = this.peer.connect(targetPeerId, { reliable: true });
        this.setupConnection(conn);
      });

      // Handle incoming voice call on guest
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
          console.warn('Guest voice answer error:', e);
        }
      });

      this.peer.on('error', (err) => {
        console.warn('Guest Peer error:', err);
      });
    } catch (e) {
      console.warn('Guest PeerJS error, using local channel:', e);
    }

    this.sendBroadcast({ type: 'GUEST_HELLO', name: this.myName });
  }

  setupBroadcastChannel(roomCode) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(`between_room_${roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingData(event.data);
        };
      } catch (e) {}
    }
  }

  setupConnection(conn) {
    this.connection = conn;
    this.remotePeerId = conn.peer;

    conn.on('open', () => {
      this.isConnected = true;
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost,
        myName: this.myName,
        peerName: this.peerName
      });

      if (this.isHost) {
        this.broadcastMessage({ type: 'HOST_CONNECTED', name: this.myName });
      } else {
        this.broadcastMessage({ type: 'GUEST_HELLO', name: this.myName });
      }
    });

    conn.on('data', (data) => {
      this.handleIncomingData(data);
    });

    conn.on('close', () => {
      this.isConnected = false;
      this.onStatusChangeCallback?.({
        status: 'DISCONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost,
        myName: this.myName,
        peerName: this.peerName
      });
    });

    conn.on('error', (err) => {
      console.warn('Connection error:', err);
    });
  }

  handleIncomingData(data) {
    if (!data || typeof data !== 'object') return;

    if (data.type === 'GUEST_HELLO') {
      this.isConnected = true;
      if (data.name) this.peerName = data.name;
      if (this.isHost) {
        this.broadcastMessage({ type: 'HOST_CONNECTED', name: this.myName });
      }
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost,
        peerName: this.peerName,
        myName: this.myName
      });
      return;
    }

    if (data.type === 'HOST_CONNECTED') {
      this.isConnected = true;
      if (data.name) this.peerName = data.name;
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: false,
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
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(message);
      } catch (e) {
        console.warn('Failed to send over WebRTC:', e);
      }
    }
    this.sendBroadcast(message);
  }

  sendBroadcast(message) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
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

  // Voice Call
  async startVoiceCall() {
    if (!this.peer || !this.remotePeerId) {
      console.warn('Cannot start call: peer not connected');
      return false;
    }
    try {
      this.onCallStateCallback?.('CALLING');
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      const call = this.peer.call(this.remotePeerId, this.localStream);
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

  cleanup() {
    this.endVoiceCall();
    try {
      if (this.connection) {
        this.connection.close();
        this.connection = null;
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

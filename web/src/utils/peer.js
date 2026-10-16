import PeerPkg from 'peerjs';
const Peer = PeerPkg?.Peer || PeerPkg;
import mqtt from 'mqtt';

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

const MQTT_BROKERS = [
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://broker.emqx.io:8084/mqtt'
];

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' }
];

class MultiplayerSync {
  constructor() {
    this.clientId = 'u_' + Math.random().toString(36).substring(2, 9);
    this.mqttClient = null;
    this.mqttConnected = false;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.myName = 'Partner 1';
    this.peerName = 'Partner 2';
    this.isConnected = false;
    this.joinTimeout = null;
    this.guestHelloTimer = null;
    this.heartbeatTimer = null;

    // Callbacks
    this.onStateChangeCallback = null;
    this.onReactionCallback = null;
    this.onStatusChangeCallback = null;
    this.onTouchRippleCallback = null;
    this.onCallStreamCallback = null;
    this.onCallStateCallback = null;

    // Optional PeerJS Voice Call
    this.peer = null;
    this.mediaCall = null;
    this.localStream = null;
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
    this.onRequestStateCallback = opts.onRequestState || null;

    this.roomCode = sanitizeCode(opts.roomCode || this.generateRoomCode());

    // 1. Setup local BroadcastChannel
    this.setupBroadcastChannel(this.roomCode);

    // 2. Connect to MQTT cluster
    this.connectMqtt(0);

    // 3. Inform host state
    this.onStatusChangeCallback?.({
      status: 'WAITING_FOR_GUEST',
      roomCode: this.roomCode,
      isHost: true,
      myName: this.myName
    });

    // 4. Initialize PeerJS in background for optional voice calling
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

    // 2. Connect to MQTT cluster
    this.connectMqtt(0);

    // 3. Timeout for connection (24 seconds)
    this.joinTimeout = setTimeout(() => {
      if (!this.isConnected) {
        this.stopGuestHelloPing();
        this.onStatusChangeCallback?.({
          status: 'ERROR',
          error: `Could not connect to room "${this.roomCode}". Please ensure the host has the room open and check the code.`,
          roomCode: this.roomCode,
          isHost: false
        });
      }
    }, 24000);

    // 4. Start guest hello ping
    this.startGuestHelloPing();

    // 5. Initialize PeerJS in background for optional voice calling
    this.initPeerVoice();
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
        console.warn('BroadcastChannel not supported or error:', e);
      }
    }
  }

  connectMqtt(brokerIndex = 0) {
    if (this.mqttClient) {
      try { this.mqttClient.end(true); } catch (e) {}
      this.mqttClient = null;
    }

    const brokerUrl = MQTT_BROKERS[brokerIndex % MQTT_BROKERS.length];
    const topic = `between/v2/room/${this.roomCode}`;

    try {
      const client = mqtt.connect(brokerUrl, {
        clientId: `${this.isHost ? 'host' : 'guest'}_${this.clientId}`,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 2000
      });

      client.on('connect', () => {
        this.mqttConnected = true;
        client.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            console.warn('[MQTT] Sub error:', err);
            return;
          }
          if (!this.isHost && !this.isConnected) {
            this.sendHello();
          }
        });
      });

      client.on('message', (_t, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          if (data && data.senderId !== this.clientId) {
            this.handleIncomingData(data);
          }
        } catch (e) {
          console.warn('[MQTT] parse error:', e);
        }
      });

      client.on('error', (err) => {
        console.warn(`[MQTT] error on ${brokerUrl}:`, err);
        if (!this.isConnected && brokerIndex < MQTT_BROKERS.length - 1) {
          this.connectMqtt(brokerIndex + 1);
        }
      });

      this.mqttClient = client;
    } catch (e) {
      console.warn('MQTT connect error:', e);
    }
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
    }, 1500);
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

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.broadcastMessage({ type: 'HEARTBEAT' });
      }
    }, 5000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  handleIncomingData(data) {
    if (!data || typeof data !== 'object') return;
    if (data.type === 'HEARTBEAT') return;

    if (data.type === 'GUEST_HELLO') {
      this.isConnected = true;
      if (data.name) this.peerName = data.name;

      if (this.isHost) {
        this.broadcastMessage({
          type: 'HOST_CONNECTED',
          name: this.myName
        });
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
    const payload = {
      ...message,
      senderId: this.clientId,
      roomCode: this.roomCode,
      timestamp: Date.now()
    };

    // 1. Send via MQTT
    if (this.mqttClient && this.mqttConnected) {
      try {
        const topic = `between/v2/room/${this.roomCode}`;
        this.mqttClient.publish(topic, JSON.stringify(payload), { qos: 1 });
      } catch (e) {
        console.warn('MQTT publish error:', e);
      }
    }

    // 2. Send via BroadcastChannel (local tabs on same device)
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
        // Voice is optional, do not break the main room connection
        console.warn('PeerJS voice non-fatal notice:', err?.type);
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
    this.stopHeartbeat();
    this.endVoiceCall();

    try {
      if (this.mqttClient) {
        this.mqttClient.end(true);
        this.mqttClient = null;
      }
      this.mqttConnected = false;
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

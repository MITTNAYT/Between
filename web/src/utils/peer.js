import PeerPkg from 'peerjs';
import PahoPkg from 'paho-mqtt';

const Peer = PeerPkg?.Peer || PeerPkg?.default?.Peer || PeerPkg?.default || PeerPkg;
const Paho = PahoPkg?.default || PahoPkg;

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
  { host: 'broker.emqx.io', port: 8084, path: '/mqtt' },
  { host: 'broker.hivemq.com', port: 8884, path: '/mqtt' }
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
    this.currentBrokerIdx = 0;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.myName = 'Partner 1';
    this.peerName = 'Partner 2';
    this.isConnected = false;
    this.joinTimeout = null;
    this.heartbeatTimer = null;
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
    this.myVoicePeerId = null;
    this.remoteVoicePeerId = null;
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

    // 2. Connect to high-speed global real-time broker
    this.connectBroker(0);

    // 3. Immediately emit waiting state to UI
    this.onStatusChangeCallback?.({
      status: 'WAITING_FOR_GUEST',
      roomCode: this.roomCode,
      isHost: true,
      myName: this.myName
    });

    // 4. Initialize voice call peer in background
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

    // 2. Connect to high-speed global real-time broker
    this.connectBroker(0);

    // 3. Safety timeout if room does not exist
    this.joinTimeout = setTimeout(() => {
      if (!this.isConnected) {
        this.onStatusChangeCallback?.({
          status: 'ERROR',
          error: `Could not find room "${this.roomCode}". Please ensure your partner has the room open and check the code.`,
          roomCode: this.roomCode,
          isHost: false
        });
      }
    }, 15000);

    // 4. Initialize voice call peer in background
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
        console.warn('BroadcastChannel error:', e);
      }
    }
  }

  connectBroker(brokerIdx = 0) {
    this.currentBrokerIdx = brokerIdx % MQTT_BROKERS.length;
    const cfg = MQTT_BROKERS[this.currentBrokerIdx];

    if (this.mqttClient) {
      try {
        if (this.mqttClient.isConnected()) {
          this.mqttClient.disconnect();
        }
      } catch (e) {}
      this.mqttClient = null;
    }

    const clientId = `between_${this.isHost ? 'host' : 'guest'}_${this.clientId}`;
    try {
      this.mqttClient = new Paho.Client(cfg.host, cfg.port, cfg.path, clientId);

      this.mqttClient.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.warn('[Realtime] Connection lost:', responseObject.errorMessage);
          // Try reconnect or failover if still active
          if (this.roomCode) {
            setTimeout(() => {
              if (this.roomCode && (!this.mqttClient || !this.mqttClient.isConnected())) {
                this.connectBroker(this.currentBrokerIdx + 1);
              }
            }, 2000);
          }
        }
      };

      this.mqttClient.onMessageArrived = (message) => {
        try {
          const payload = JSON.parse(message.payloadString);
          this.handleIncomingData(payload);
        } catch (e) {
          console.warn('[Realtime] Parse error:', e);
        }
      };

      this.mqttClient.connect({
        useSSL: true,
        timeout: 4,
        keepAliveInterval: 20,
        cleanSession: true,
        onSuccess: () => {
          this.onBrokerConnected();
        },
        onFailure: (err) => {
          console.warn(`[Realtime] Failed connecting to ${cfg.host}:`, err.errorMessage);
          // Failover to secondary broker
          if (this.roomCode && !this.isConnected && brokerIdx < MQTT_BROKERS.length * 2) {
            setTimeout(() => {
              if (this.roomCode && !this.isConnected) {
                this.connectBroker(brokerIdx + 1);
              }
            }, 600);
          }
        }
      });
    } catch (e) {
      console.warn('[Realtime] Client init error:', e);
    }
  }

  onBrokerConnected() {
    if (!this.roomCode || !this.mqttClient || !this.mqttClient.isConnected()) return;

    const topicBase = `between/v3/room/${this.roomCode}`;
    const subscribeTopic = `${topicBase}/#`;

    this.mqttClient.subscribe(subscribeTopic, {
      qos: 1,
      onSuccess: () => {
        if (this.isHost) {
          // Host announces presence with retained message so guest immediately receives it on connect
          this.publishPresence(true);
        } else {
          // Guest announces presence and requests current session state
          this.sendGuestHello();
        }
      },
      onFailure: (err) => {
        console.warn('[Realtime] Subscribe error:', err.errorMessage);
      }
    });

    this.startHeartbeat();
  }

  publishPresence(isWaiting = true) {
    if (!this.roomCode || !this.mqttClient || !this.mqttClient.isConnected()) return;

    const payload = {
      type: isWaiting ? 'HOST_WAITING' : 'HOST_CONNECTED',
      name: this.myName,
      voicePeerId: this.myVoicePeerId,
      senderId: this.clientId,
      roomCode: this.roomCode,
      timestamp: Date.now()
    };

    const message = new Paho.Message(JSON.stringify(payload));
    message.destinationName = `between/v3/room/${this.roomCode}/presence/host`;
    message.qos = 1;
    message.retained = true; // Retained so guest immediately sees host upon connecting!

    try {
      this.mqttClient.send(message);
    } catch (e) {
      console.warn('[Realtime] Send presence error:', e);
    }
  }

  sendGuestHello() {
    this.broadcastMessage({
      type: 'GUEST_CONNECTED',
      name: this.myName,
      voicePeerId: this.myVoicePeerId
    });
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.roomCode && this.isConnected) {
        this.broadcastMessage({
          type: 'HEARTBEAT'
        });
      }
    }, 8000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  handleIncomingData(data) {
    if (!data || typeof data !== 'object') return;
    if (data.senderId === this.clientId) return;
    if (data.roomCode && data.roomCode !== this.roomCode) return;
    if (data.type === 'HEARTBEAT') return;

    // Deduplication check
    const msgId = data.msgId || `${data.type}_${data.senderId}_${data.timestamp}`;
    if (this.processedMsgIds.has(msgId)) return;
    this.processedMsgIds.add(msgId);
    if (this.processedMsgIds.size > 300) {
      const oldest = this.processedMsgIds.values().next().value;
      this.processedMsgIds.delete(oldest);
    }

    if (data.senderName && data.senderName !== this.peerName) {
      this.peerName = data.senderName;
    }

    // 1. Guest sees Host Waiting Beacon or Host Connected
    if ((data.type === 'HOST_WAITING' || data.type === 'HOST_CONNECTED') && !this.isHost) {
      if (this.joinTimeout) {
        clearTimeout(this.joinTimeout);
        this.joinTimeout = null;
      }
      const wasConnected = this.isConnected;
      this.isConnected = true;
      if (data.name) this.peerName = data.name;
      if (data.voicePeerId) this.remoteVoicePeerId = data.voicePeerId;

      if (!wasConnected) {
        this.onStatusChangeCallback?.({
          status: 'CONNECTED',
          roomCode: this.roomCode,
          isHost: false,
          peerName: this.peerName,
          myName: this.myName
        });

        // Reply immediately so host knows guest is locked in
        this.sendGuestHello();
      }
      return;
    }

    // 2. Host sees Guest Connected
    if (data.type === 'GUEST_CONNECTED' && this.isHost) {
      const wasConnected = this.isConnected;
      this.isConnected = true;
      if (data.name) this.peerName = data.name;
      if (data.voicePeerId) this.remoteVoicePeerId = data.voicePeerId;

      // Update presence to connected
      this.publishPresence(false);

      if (!wasConnected) {
        this.onStatusChangeCallback?.({
          status: 'CONNECTED',
          roomCode: this.roomCode,
          isHost: true,
          peerName: this.peerName,
          myName: this.myName
        });

        // Immediately sync current session state to guest
        this.onRequestStateCallback?.();
      }
      return;
    }

    // 3. Guest requests session state
    if (data.type === 'STATE_REQ' && this.isHost) {
      this.onRequestStateCallback?.();
      return;
    }

    // 4. Partner leaves room
    if (data.type === 'DISCONNECT' || data.type === 'ROOM_CLOSED') {
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

    // 5. Game State Synchronizations
    if (data.type === 'STATE_SYNC') {
      if (!this.isConnected && !this.isHost) {
        if (this.joinTimeout) {
          clearTimeout(this.joinTimeout);
          this.joinTimeout = null;
        }
        this.isConnected = true;
        this.onStatusChangeCallback?.({
          status: 'CONNECTED',
          roomCode: this.roomCode,
          isHost: false,
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

    // Mark as seen so we don't process our own broadcast reflection
    this.processedMsgIds.add(payload.msgId);

    // 1. Send via high-speed global broker
    if (this.mqttClient && this.mqttClient.isConnected()) {
      try {
        const mqttMsg = new Paho.Message(JSON.stringify(payload));
        mqttMsg.destinationName = `between/v3/room/${this.roomCode}/events`;
        mqttMsg.qos = 1;
        this.mqttClient.send(mqttMsg);
      } catch (e) {
        console.warn('[Realtime] Broadcast error:', e);
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

  // --- Voice Call WebRTC Support ---
  initPeerVoice() {
    try {
      if (!this.roomCode) return;
      this.myVoicePeerId = this.isHost
        ? `between-v3-${this.roomCode.toLowerCase()}`
        : `between-v3-guest-${this.clientId}`;

      this.peer = new Peer(this.myVoicePeerId, {
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
      console.warn('Cannot start call: voice peer not initialized');
      return false;
    }

    const targetPeerId = this.remoteVoicePeerId || (
      this.isHost
        ? `between-v3-guest-${this.peerName}`
        : `between-v3-${this.roomCode.toLowerCase()}`
    );

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
    // Clear retained presence if host
    if (this.isHost && this.mqttClient && this.mqttClient.isConnected()) {
      try {
        const clearMsg = new Paho.Message(JSON.stringify({ type: 'ROOM_CLOSED' }));
        clearMsg.destinationName = `between/v3/room/${this.roomCode}/presence/host`;
        clearMsg.retained = true;
        clearMsg.qos = 1;
        this.mqttClient.send(clearMsg);
      } catch (e) {}
    }

    this.broadcastMessage({ type: 'DISCONNECT' });
    this.cleanup();
  }

  cleanup() {
    if (this.joinTimeout) {
      clearTimeout(this.joinTimeout);
      this.joinTimeout = null;
    }
    this.stopHeartbeat();
    this.endVoiceCall();

    try {
      if (this.mqttClient && this.mqttClient.isConnected()) {
        this.mqttClient.disconnect();
      }
      this.mqttClient = null;
    } catch (e) {}

    try {
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
    this.remoteVoicePeerId = null;
  }
}

export const multiplayerSync = new MultiplayerSync();
export { MultiplayerSync };

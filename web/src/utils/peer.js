import { Peer } from 'peerjs';

class MultiplayerSync {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.onStateChangeCallback = null;
    this.onReactionCallback = null;
    this.onStatusChangeCallback = null;
    this.isConnected = false;
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  initHost(onStatusChange, onStateChange, onReaction) {
    this.cleanup();
    this.isHost = true;
    this.onStatusChangeCallback = onStatusChange;
    this.onStateChangeCallback = onStateChange;
    this.onReactionCallback = onReaction;

    this.roomCode = this.generateRoomCode();
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
        this.setupConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.warn('Host Peer error:', err);
        // Fallback to broadcast channel if offline or network issue
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

  joinRoom(code, onStatusChange, onStateChange, onReaction) {
    this.cleanup();
    this.isHost = false;
    this.roomCode = code.toUpperCase().trim();
    this.onStatusChangeCallback = onStatusChange;
    this.onStateChangeCallback = onStateChange;
    this.onReactionCallback = onReaction;

    this.setupBroadcastChannel(this.roomCode);

    const targetPeerId = `between-v1-${this.roomCode.toLowerCase()}`;
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

      this.peer.on('error', (err) => {
        console.warn('Guest Peer error:', err);
      });
    } catch (e) {
      console.warn('Guest PeerJS error, using local channel:', e);
    }

    // Ping host via broadcast channel in case both are in same browser/tabs
    this.sendBroadcast({ type: 'GUEST_HELLO' });
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

    conn.on('open', () => {
      this.isConnected = true;
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: this.isHost
      });

      // If guest connected, host should send initial greeting
      if (this.isHost) {
        this.broadcastMessage({ type: 'HOST_CONNECTED' });
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
        isHost: this.isHost
      });
    });

    conn.on('error', (err) => {
      console.warn('Connection error:', err);
    });
  }

  handleIncomingData(data) {
    if (!data || typeof data !== 'object') return;

    if (data.type === 'GUEST_HELLO' && this.isHost) {
      this.isConnected = true;
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: true
      });
      return;
    }

    if (data.type === 'HOST_CONNECTED') {
      this.isConnected = true;
      this.onStatusChangeCallback?.({
        status: 'CONNECTED',
        roomCode: this.roomCode,
        isHost: false
      });
      return;
    }

    if (data.type === 'STATE_SYNC') {
      this.onStateChangeCallback?.(data.payload);
    } else if (data.type === 'REACTION') {
      this.onReactionCallback?.(data.payload);
    }
  }

  broadcastMessage(message) {
    // Send over PeerJS WebRTC DataChannel
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(message);
      } catch (e) {
        console.warn('Failed to send over WebRTC:', e);
      }
    }

    // Also send over local BroadcastChannel
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

  cleanup() {
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

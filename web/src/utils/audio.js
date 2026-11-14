// Web Audio API Synthesizer for tactile feedback and ambient soundscape
let audioCtx = null;
let soundscapeGain = null;
let soundscapeOscs = [];
let isSoundscapePlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Tactile subtle click on button tap
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Tactile card slide / friction sound when dealing or swiping cards
 */
export function playCardSlideSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Filtered noise burst for paper friction
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.11);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);

    // Subtle low card thump
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
    oscGain.gain.setValueAtTime(0.06, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start();
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

/**
 * Crisp snap/flip sound of cardstock turning over
 */
export function playCardFlipSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Snap transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    // Flutter noise
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start();
    noise.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

/**
 * Rapid multi-card fan flutter when dealing new hands or rolling wildcard
 */
export function playCardShuffleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    [0, 0.045, 0.09, 0.14].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 + idx * 40, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + delay + 0.05);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.06);
    });
  } catch (e) {}
}

/**
 * Resonant singing bowl / soft chime on card advance
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const fundamental = 528; // Solfeggio frequency for healing & warmth
    const harmonics = [1, 1.5, 2.02, 2.75];

    harmonics.forEach((harmonic, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * harmonic, ctx.currentTime);

      const amp = (0.06 / (index + 1));
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2 + (index * 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  } catch (e) {}
}

/**
 * Soft celebration / handshake chime
 */
export function playHandshakeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.12));

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime + (idx * 0.12));
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (idx * 0.12) + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + (idx * 0.12));
      osc.stop(ctx.currentTime + (idx * 0.12) + 0.85);
    });
  } catch (e) {}
}

/**
 * Light pop / reaction chime
 */
export function playReactionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {}
}

/**
 * Ambient background soundscape (Warm Pink/Brown noise & gentle resonance)
 */
export function toggleAmbientSoundscape() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isSoundscapePlaying) {
    stopAmbientSoundscape();
    return false;
  } else {
    startAmbientSoundscape();
    return true;
  }
}

function startAmbientSoundscape() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    soundscapeGain = ctx.createGain();
    soundscapeGain.gain.setValueAtTime(0.001, ctx.currentTime);
    soundscapeGain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 2.0);
    soundscapeGain.connect(ctx.destination);

    // Warm chord drone: 108Hz (A2), 162Hz (E3), 216Hz (A3)
    const freqs = [108, 162, 216];
    soundscapeOscs = freqs.map(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(soundscapeGain);
      osc.start();
      return osc;
    });

    isSoundscapePlaying = true;
  } catch (e) {
    console.error('Ambient audio error:', e);
  }
}

function stopAmbientSoundscape() {
  if (soundscapeGain && audioCtx) {
    try {
      soundscapeGain.gain.setValueAtTime(soundscapeGain.gain.value, audioCtx.currentTime);
      soundscapeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        soundscapeOscs.forEach(osc => {
          try { osc.stop(); } catch (e) {}
        });
        soundscapeOscs = [];
        soundscapeGain = null;
      }, 1300);
    } catch (e) {}
  }
  isSoundscapePlaying = false;
}

export function getIsSoundscapePlaying() {
  return isSoundscapePlaying;
}

/**
 * Organic, warm double-pulse heartbeat sound for Hold-to-Touch sensory presence
 */
export function playHeartbeatPulse() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // First pulse: Lub (75Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(75, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.08);

    gain1.gain.setValueAtTime(0.09, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.1);

    // Second pulse: Dub (65Hz, slightly delayed)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(68, ctx.currentTime + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.22);

    gain2.gain.setValueAtTime(0.001, ctx.currentTime);
    gain2.gain.setValueAtTime(0.07, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.23);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}

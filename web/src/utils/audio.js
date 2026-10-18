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

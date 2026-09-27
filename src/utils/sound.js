// Lightweight Web Audio API synthesizer for subtle cyber click and terminal sounds
// Zero external audio files required. Completely synthesized in-browser.

let audioCtx = null;
let isMuted = true; // Default muted for accessibility

export function initAudio() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('dale_sfx_enabled');
  if (saved !== null) {
    isMuted = saved !== 'true';
  }
}

export function isAudioEnabled() {
  return !isMuted;
}

export function toggleAudio() {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('dale_sfx_enabled', (!isMuted).toString());
  }
  if (!isMuted) {
    playClick(600, 0.04);
  }
  return !isMuted;
}

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Ultra-subtle mechanical keyboard click
 */
export function playClick(freq = 420, vol = 0.03) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, ctx.currentTime);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio playback errors
  }
}

/**
 * Terminal feedback beep / chirp
 */
export function playChirp(freq = 880, vol = 0.04) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.065);
  } catch {
    // Ignore audio playback errors
  }
}

/**
 * Konami Code Overdrive power-up sequence
 */
export function playOverdriveSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      }, idx * 60);
    });
  } catch {
    // Ignore audio errors
  }
}

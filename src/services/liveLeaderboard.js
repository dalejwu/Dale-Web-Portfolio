/**
 * Zero-Config Live Real-Time Leaderboard Service
 * - Persists player scores permanently to localStorage
 * - Broadcasts scores in real-time across browser tabs via BroadcastChannel API
 * - Generates periodic live developer activity pulses so the leaderboard feels alive
 */

const STORAGE_KEY = 'dale_bughunter_leaderboard';
const CHANNEL_NAME = 'dale_leaderboard_sync';

const BASELINE_LEADERBOARD = [
  { id: 1, name: 'DALEJWU', bugs: 32, score: 5800, diff: 'HARD', date: '2026-09-28', region: 'PHL' },
  { id: 2, name: 'SYS_ARCHITECT', bugs: 28, score: 4600, diff: 'HARD', date: '2026-09-28', region: 'SGP' },
  { id: 3, name: 'K8S_NINJA', bugs: 24, score: 3850, diff: 'HARD', date: '2026-09-27', region: 'USA' },
  { id: 4, name: 'PROD_SAVIOR', bugs: 21, score: 3250, diff: 'MED', date: '2026-09-27', region: 'JPN' },
  { id: 5, name: 'DEV_ZERO', bugs: 18, score: 2750, diff: 'MED', date: '2026-09-26', region: 'DEU' },
  { id: 6, name: 'RUST_ACE', bugs: 15, score: 2150, diff: 'MED', date: '2026-09-26', region: 'GBR' },
  { id: 7, name: 'REACTIVE_KID', bugs: 13, score: 1650, diff: 'EASY', date: '2026-09-25', region: 'CAN' }
];

const SIMULATED_CALLSIGNS = [
  { name: 'KERNEL_PANIC', region: 'USA', diff: 'HARD' },
  { name: 'SYNTH_DEV', region: 'NLD', diff: 'MED' },
  { name: 'BYTE_ROVER', region: 'AUS', diff: 'MED' },
  { name: 'ZERO_DAY', region: 'FRA', diff: 'HARD' },
  { name: 'GO_GOPHER', region: 'SWE', diff: 'MED' },
  { name: 'STACK_TRACER', region: 'SGP', diff: 'EASY' },
  { name: 'CACHE_MISS', region: 'KOR', diff: 'MED' }
];

let subscribers = new Set();
let broadcastChannel = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_SCORE') {
        notifySubscribers(event.data.payload);
      }
    };
  } catch {
    // Fallback if BroadcastChannel unavailable
  }
}

function notifySubscribers(entry) {
  subscribers.forEach((cb) => {
    try {
      cb(entry);
    } catch {
      // Ignore subscriber errors
    }
  });
}

/**
 * Load combined baseline + local player scores
 */
export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.sort((a, b) => b.score - a.score || b.bugs - a.bugs).slice(0, 10);
      }
    }
  } catch {
    // Fallback
  }
  return BASELINE_LEADERBOARD;
}

/**
 * Save player score, sync locally, and broadcast in real-time
 */
export function submitPlayerScore({ name, bugs, score, diff }) {
  const current = getLeaderboard();
  const cleanName = (name.trim() || 'ANONYMOUS_DEV').toUpperCase().slice(0, 14);

  const newEntry = {
    id: Date.now(),
    name: cleanName,
    bugs,
    score,
    diff,
    date: new Date().toISOString().split('T')[0],
    region: 'LOCAL'
  };

  const updated = [...current.filter((e) => e.name !== cleanName || e.score < score), newEntry]
    .sort((a, b) => b.score - a.score || b.bugs - a.bugs)
    .slice(0, 10);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('dale_bughunter_player_name', cleanName);
  } catch {
    // Fallback
  }

  // Broadcast cross-tab
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'NEW_SCORE', payload: newEntry });
    } catch {
      // Ignore
    }
  }

  notifySubscribers(newEntry);
  return newEntry;
}

/**
 * Subscribe to real-time incoming score events and background live developer pulses
 */
export function subscribeToLeaderboard(callback) {
  subscribers.add(callback);

  // Background live developer simulation pulse (every 25 - 45s)
  const timer = setInterval(() => {
    if (Math.random() > 0.45) {
      const randomCallsign = SIMULATED_CALLSIGNS[Math.floor(Math.random() * SIMULATED_CALLSIGNS.length)];
      const randomBugs = Math.floor(Math.random() * 14) + 12; // 12 - 25 bugs
      const randomScore = randomBugs * 140 + Math.floor(Math.random() * 500);

      const simEntry = {
        id: Date.now(),
        name: randomCallsign.name,
        bugs: randomBugs,
        score: randomScore,
        diff: randomCallsign.diff,
        date: new Date().toISOString().split('T')[0],
        region: randomCallsign.region
      };

      const current = getLeaderboard();
      const updated = [...current, simEntry]
        .sort((a, b) => b.score - a.score || b.bugs - a.bugs)
        .slice(0, 10);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Fallback
      }

      notifySubscribers(simEntry);
    }
  }, 28000);

  return () => {
    subscribers.delete(callback);
    clearInterval(timer);
  };
}

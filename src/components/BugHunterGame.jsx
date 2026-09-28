import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bug, 
  Coffee, 
  CheckCircle2, 
  Zap, 
  AlertTriangle, 
  RotateCcw, 
  Trophy, 
  Flame, 
  ShieldAlert, 
  X,
  Play,
  User,
  Medal,
  Sliders
} from 'lucide-react';
import { 
  playBugSquashSound, 
  playPenaltySound, 
  playBonusSound, 
  playGameOverSound,
  playClick
} from '../utils/sound';
import {
  fetchRemoteLeaderboard,
  submitRemoteScore,
  subscribeToLeaderboard,
  isSupabaseConfigured
} from '../services/supabase';
import './BugHunterGame.css';

const BUG_LABELS = [
  'NULL_PTR',
  'MEM_LEAK',
  'RACE_COND',
  'ERR_500',
  'CSS_LEAK',
  'OFF_BY_1',
  'Z_INDEX_9999',
  'UNCAUGHT_EXC'
];

const CHECKMARK_LABELS = [
  'LGTM // FALSE',
  'ALL_GREEN (FAILS)',
  'CI_PASSED ⚠️',
  'SKIPPED_TESTS',
  'STRAY_CHECK ⚠️'
];

const COFFEE_LABELS = [
  'ESPRESSO // +5s',
  'COLD_BREW // BOOST',
  'DOUBLE_SHOT // +5s'
];

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'EASY',
    tag: 'STAGING SANDBOX',
    time: 30,
    spawnInterval: 780,
    bugLifetime: 3000,
    coffeeLifetime: 2800,
    checkLifetime: 3000,
    bugPoints: 100,
    penaltyBugs: 1,
    penaltyPoints: 100,
    checkRate: 0.15
  },
  medium: {
    label: 'MEDIUM',
    tag: 'PRODUCTION HOTFIX',
    time: 25,
    spawnInterval: 600,
    bugLifetime: 2200,
    coffeeLifetime: 2400,
    checkLifetime: 2500,
    bugPoints: 150,
    penaltyBugs: 2,
    penaltyPoints: 200,
    checkRate: 0.22
  },
  hard: {
    label: 'HARD',
    tag: '3 AM PAGERDUTY CHAOS',
    time: 20,
    spawnInterval: 460,
    bugLifetime: 1400,
    coffeeLifetime: 1800,
    checkLifetime: 2000,
    bugPoints: 250,
    penaltyBugs: 3,
    penaltyPoints: 300,
    checkRate: 0.32
  }
};

const DEFAULT_LEADERBOARD = [
  { id: 1, name: 'DALEJWU', bugs: 32, score: 5800, diff: 'HARD', date: '2026-09-27' },
  { id: 2, name: 'SYS_ARCHITECT', bugs: 26, score: 4100, diff: 'HARD', date: '2026-09-27' },
  { id: 3, name: 'PROD_SAVIOR', bugs: 21, score: 3250, diff: 'MED', date: '2026-09-26' },
  { id: 4, name: 'DEV_ZERO', bugs: 17, score: 2550, diff: 'MED', date: '2026-09-26' },
  { id: 5, name: 'REACTIVE_KID', bugs: 13, score: 1650, diff: 'EASY', date: '2026-09-25' }
];

export default function BugHunterGame({ onExit }) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [startTab, setStartTab] = useState('rules'); // 'rules' | 'leaderboard'
  const [difficulty, setDifficulty] = useState('medium');
  const [bugsFixed, setBugsFixed] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [streak, setStreak] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [coffees, setCoffees] = useState(0);
  const [entities, setEntities] = useState([]);
  const [floaters, setFloaters] = useState([]);
  const [screenFlash, setScreenFlash] = useState(''); // 'penalty' | 'bonus' | ''
  const [highScore, setHighScore] = useState({ bugs: 0, score: 0 });

  // Leaderboard & Player Name states
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem('dale_bughunter_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_LEADERBOARD;
  });
  const [playerName, setPlayerName] = useState('');
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  const [isLive, setIsLive] = useState(isSupabaseConfigured);

  const arenaRef = useRef(null);
  const nextEntityId = useRef(1);
  const nextFloaterId = useRef(1);

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dale_bughunter_highscore');
      if (saved) {
        setHighScore(JSON.parse(saved));
      }
      const savedName = localStorage.getItem('dale_bughunter_player_name');
      if (savedName) {
        setPlayerName(savedName);
      }
    } catch {
      // LocalStorage access fallback
    }

    // Connect to live Supabase backend if configured
    let unsubscribe = () => {};
    if (isSupabaseConfigured) {
      fetchRemoteLeaderboard().then((remoteData) => {
        if (remoteData && remoteData.length > 0) {
          setLeaderboard(remoteData);
          setIsLive(true);
        }
      });

      unsubscribe = subscribeToLeaderboard((newEntry) => {
        setLeaderboard((prev) => {
          const merged = [...prev.filter((e) => e.id !== newEntry.id), newEntry]
            .sort((a, b) => b.score - a.score || b.bugs - a.bugs)
            .slice(0, 10);
          return merged;
        });
      });
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Spawn floater feedback animation
  const addFloater = useCallback((text, type, x, y) => {
    const id = nextFloaterId.current++;
    setFloaters((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    }, 850);
  }, []);

  // Start game loop
  const startGame = () => {
    playClick(600, 0.05);
    const config = DIFFICULTY_CONFIG[difficulty];
    setBugsFixed(0);
    setScore(0);
    setTimeLeft(config.time);
    setStreak(0);
    setPenalties(0);
    setCoffees(0);
    setEntities([]);
    setFloaters([]);
    setScreenFlash('');
    setHasSubmittedScore(false);
    setGameState('playing');
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Handle Game Over transition when timeLeft hits 0
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover');
      playGameOverSound();

      // Persist all-time High Score
      setHighScore((prev) => {
        const isNewBest = score > prev.score || bugsFixed > prev.bugs;
        const newBest = {
          bugs: Math.max(prev.bugs, bugsFixed),
          score: Math.max(prev.score, score)
        };
        if (isNewBest) {
          try {
            localStorage.setItem('dale_bughunter_highscore', JSON.stringify(newBest));
          } catch {
            // Storage write fallback
          }
        }
        return newBest;
      });
    }
  }, [timeLeft, gameState, score, bugsFixed]);

  // Spawn entity ticker
  useEffect(() => {
    if (gameState !== 'playing') return;

    const config = DIFFICULTY_CONFIG[difficulty];

    const spawner = setInterval(() => {
      setEntities((current) => {
        const now = Date.now();
        const active = current.filter((e) => e.expiresAt > now);

        // Max entities on screen
        const maxActive = difficulty === 'hard' ? 5 : 4;
        if (active.length >= maxActive) return active;

        const roll = Math.random();
        let type = 'bug';
        let label = BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)];
        let lifetime = config.bugLifetime;

        if (roll > 0.85) {
          type = 'coffee';
          label = COFFEE_LABELS[Math.floor(Math.random() * COFFEE_LABELS.length)];
          lifetime = config.coffeeLifetime;
        } else if (roll < config.checkRate) {
          type = 'checkmark';
          label = CHECKMARK_LABELS[Math.floor(Math.random() * CHECKMARK_LABELS.length)];
          lifetime = config.checkLifetime;
        }

        // Bounded coordinate percentages
        const x = Math.floor(Math.random() * 74) + 12; // 12% to 86%
        const y = Math.floor(Math.random() * 64) + 16; // 16% to 80%

        const newEntity = {
          id: nextEntityId.current++,
          type,
          label,
          x,
          y,
          createdAt: now,
          expiresAt: now + lifetime
        };

        return [...active, newEntity];
      });
    }, config.spawnInterval);

    return () => clearInterval(spawner);
  }, [gameState, difficulty]);

  // Handle entity clicks
  const handleEntityClick = (entity, e) => {
    e.stopPropagation();

    const config = DIFFICULTY_CONFIG[difficulty];
    const arenaRect = arenaRef.current?.getBoundingClientRect();
    const clickX = arenaRect ? ((e.clientX - arenaRect.left) / arenaRect.width) * 100 : entity.x;
    const clickY = arenaRect ? ((e.clientY - arenaRect.top) / arenaRect.height) * 100 : entity.y;

    setEntities((prev) => prev.filter((item) => item.id !== entity.id));

    if (entity.type === 'bug') {
      // 🐛 BUG SQUASHED
      playBugSquashSound();
      setStreak((s) => s + 1);
      const mult = Math.min(4, Math.floor(streak / 3) + 1);
      const points = config.bugPoints * mult;

      setBugsFixed((b) => b + 1);
      setScore((s) => s + points);
      addFloater(`+1 FIXED! (+${points})`, 'gain', clickX, clickY);
    } else if (entity.type === 'checkmark') {
      // ⚠️ PENALTY CHECKMARK (FALSE POSITIVE)
      playPenaltySound();
      setStreak(0);
      setPenalties((p) => p + 1);

      setBugsFixed((b) => Math.max(0, b - config.penaltyBugs));
      setScore((s) => Math.max(0, s - config.penaltyPoints));

      setScreenFlash('penalty');
      setTimeout(() => setScreenFlash(''), 350);

      addFloater(`⚠️ REGRESSION! -${config.penaltyBugs} BUGS (-${config.penaltyPoints})`, 'penalty', clickX, clickY);
    } else if (entity.type === 'coffee') {
      // ☕ COFFEE CUP POWERUP
      playBonusSound();
      setCoffees((c) => c + 1);
      setTimeLeft((t) => t + 5);
      setScore((s) => s + 150);

      setScreenFlash('bonus');
      setTimeout(() => setScreenFlash(''), 350);

      addFloater('☕ +5s CAFFEINE BOOST! (+150)', 'bonus', clickX, clickY);
    }
  };

  // Save score to leaderboard
  const handleSaveScore = async (e) => {
    e.preventDefault();
    const cleanName = (playerName.trim() || 'ANONYMOUS_DEV').toUpperCase().slice(0, 14);
    playClick(650, 0.04);

    const newEntry = {
      id: Date.now(),
      name: cleanName,
      bugs: bugsFixed,
      score,
      diff: DIFFICULTY_CONFIG[difficulty].label,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score || b.bugs - a.bugs)
      .slice(0, 10);

    setLeaderboard(updated);
    setHasSubmittedScore(true);

    try {
      localStorage.setItem('dale_bughunter_leaderboard', JSON.stringify(updated));
      localStorage.setItem('dale_bughunter_player_name', cleanName);
    } catch {
      // Fallback
    }

    if (isSupabaseConfigured) {
      await submitRemoteScore({
        name: cleanName,
        bugs: bugsFixed,
        score,
        diff: DIFFICULTY_CONFIG[difficulty].label
      });
    }
  };

  // Compute Rank Title based on Bugs Fixed
  const getRank = () => {
    if (bugsFixed >= 25) {
      return {
        title: '10X KERNEL WIZARD',
        desc: 'Zero Bug Bounce achieved. Production runs at sub-millisecond perfection.',
        color: 'var(--accent-green)'
      };
    }
    if (bugsFixed >= 16) {
      return {
        title: 'LEAD SYSTEMS ARCHITECT',
        desc: 'Sub-50ms incident resolution. Resilient distributed systems champion.',
        color: 'var(--accent-cyan)'
      };
    }
    if (bugsFixed >= 9) {
      return {
        title: 'MID-LEVEL ENGINEER',
        desc: 'Solid PR triage. Successfully prevented a 3 AM PagerDuty cascade.',
        color: 'var(--accent-amber)'
      };
    }
    if (bugsFixed >= 4) {
      return {
        title: 'JUNIOR FIREFIGHTER',
        desc: 'Hotfixes pushed directly to staging. Survived the cluster outage.',
        color: 'var(--text-secondary)'
      };
    }
    return {
      title: 'INTERN ON DAY ONE',
      desc: 'Accidentally dropped the staging database while debugging CSS.',
      color: 'var(--accent-red)'
    };
  };

  return (
    <div className={`bug-hunter-deck font-mono ${screenFlash ? `flash-${screenFlash}` : ''}`}>
      {/* Top Telemetry HUD */}
      <div className="game-telemetry-hud">
        <div className="hud-metric metric-bugs">
          <Bug size={14} className="hud-icon" />
          <span className="hud-label">BUGS FIXED:</span>
          <span className="hud-value hud-value-bugs">{bugsFixed}</span>
        </div>

        <div className="hud-metric metric-score">
          <Zap size={14} className="hud-icon" />
          <span className="hud-label">SCORE:</span>
          <span className="hud-value">{score}</span>
        </div>

        <div className="hud-metric metric-time">
          <span className="hud-label">TIME:</span>
          <span className={`hud-value hud-value-time ${timeLeft <= 5 ? 'time-critical' : ''}`}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>

        <div className="hud-metric metric-diff">
          <span className="hud-label">LVL:</span>
          <span className={`diff-badge diff-${difficulty}`}>{DIFFICULTY_CONFIG[difficulty].label}</span>
        </div>

        {streak >= 3 && (
          <div className="hud-metric metric-streak">
            <Flame size={14} className="hud-icon text-amber" />
            <span className="hud-value text-amber">{streak}x STREAK</span>
          </div>
        )}

        <div className="hud-actions">
          {gameState === 'playing' && (
            <button
              type="button"
              onClick={startGame}
              className="hud-btn hud-btn-restart"
              title="Restart session"
              aria-label="Restart game"
            >
              <RotateCcw size={13} />
            </button>
          )}

          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="hud-btn hud-btn-exit"
              title="Return to terminal"
              aria-label="Exit game to terminal"
            >
              <X size={13} />
              <span>TERMINAL</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Arena Surface */}
      <div 
        ref={arenaRef}
        className="game-arena-surface bracket-container"
        id="bug-hunter-arena"
      >
        <div className="corner-bracket tl" />
        <div className="corner-bracket tr" />
        <div className="corner-bracket bl" />
        <div className="corner-bracket br" />

        {/* Scanlines & Halftone Grid */}
        <div className="arena-grid-overlay" />
        <div className="arena-scanlines" />

        {/* State 1: IDLE / START SCREEN */}
        {gameState === 'idle' && (
          <div className="arena-overlay arena-start-screen">
            <div className="start-screen-card bracket-container">
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              {/* Header with Title and Mode Switcher */}
              <div className="start-card-header">
                <div className="card-badge font-mono">
                  <ShieldAlert size={12} />
                  <span>INCIDENT PROTOCOL // v2.6.4</span>
                </div>
                <div className="start-mode-toggle font-mono">
                  <button
                    type="button"
                    className={`start-tab-btn ${startTab === 'rules' ? 'active' : ''}`}
                    onClick={() => {
                      playClick(500, 0.02);
                      setStartTab('rules');
                    }}
                  >
                    MISSION BRIEF
                  </button>
                  <button
                    type="button"
                    className={`start-tab-btn ${startTab === 'leaderboard' ? 'active' : ''}`}
                    onClick={() => {
                      playClick(500, 0.02);
                      setStartTab('leaderboard');
                    }}
                  >
                    <Trophy size={11} className="tab-trophy-icon" />
                    <span>LEADERBOARD</span>
                  </button>
                </div>
              </div>

              <h3 className="start-title font-display">BUG TRIAGE SIMULATOR</h3>

              {startTab === 'rules' ? (
                <>
                  {/* Compact Mission Rules */}
                  <div className="rules-compact-grid">
                    <div className="compact-rule-chip rule-chip-bug">
                      <Bug size={14} className="text-red" />
                      <span className="chip-name">SQUASH BUGS</span>
                      <span className="chip-val text-green">+1 Fixed // Streak</span>
                    </div>

                    <div className="compact-rule-chip rule-chip-coffee">
                      <Coffee size={14} className="text-amber" />
                      <span className="chip-name">COFFEE SPIKE</span>
                      <span className="chip-val text-amber">+5s Extra Time</span>
                    </div>

                    <div className="compact-rule-chip rule-chip-check">
                      <CheckCircle2 size={14} className="text-green" />
                      <span className="chip-name">STRAY CHECKMARK</span>
                      <span className="chip-val text-red">AVOID! Penalty</span>
                    </div>
                  </div>

                  {/* Level / Difficulty Selector */}
                  <div className="difficulty-box font-mono">
                    <div className="diff-header">
                      <Sliders size={12} className="diff-icon" />
                      <span className="diff-title">CHOOSE INCIDENT SEVERITY:</span>
                      <span className="diff-tag">{DIFFICULTY_CONFIG[difficulty].tag}</span>
                    </div>
                    <div className="diff-buttons">
                      {(['easy', 'medium', 'hard']).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          className={`diff-select-btn diff-${lvl} ${difficulty === lvl ? 'active' : ''}`}
                          onClick={() => {
                            playClick(600, 0.03);
                            setDifficulty(lvl);
                          }}
                        >
                          <span className="btn-diff-label">{DIFFICULTY_CONFIG[lvl].label}</span>
                          <span className="btn-diff-sub">{DIFFICULTY_CONFIG[lvl].time}s</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Leaderboard View on Start Screen */
                <div className="leaderboard-view font-mono">
                  <div className="leaderboard-header">
                    <div className="leaderboard-header-left">
                      <Medal size={12} className="text-amber" />
                      <span>TOP OPERATOR CALLSIGNS</span>
                    </div>
                    <span className={`lb-status-badge ${isLive ? 'live' : 'local'}`}>
                      <span className="lb-status-dot" />
                      <span>{isLive ? 'GLOBAL REALTIME' : 'LOCAL CACHE'}</span>
                    </span>
                  </div>
                  <div className="leaderboard-table">
                    {leaderboard.slice(0, 5).map((entry, idx) => (
                      <div key={entry.id || idx} className={`leaderboard-row ${idx === 0 ? 'rank-gold' : ''}`}>
                        <span className="lb-rank">#{idx + 1}</span>
                        <span className="lb-name">{entry.name}</span>
                        <span className="lb-diff">[{entry.diff}]</span>
                        <span className="lb-bugs">{entry.bugs} BUGS</span>
                        <span className="lb-score">{entry.score} PTS</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Start Button Always Prominent */}
              <button
                type="button"
                onClick={startGame}
                className="btn-start-game font-mono"
                id="btn-start-game"
              >
                <Play size={16} />
                <span>START INCIDENT TRIAGE ({DIFFICULTY_CONFIG[difficulty].label} // {DIFFICULTY_CONFIG[difficulty].time}s)</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: PLAYING ACTIVE ARENA */}
        {gameState === 'playing' && (
          <div className="active-entities-layer">
            {entities.map((entity) => (
              <button
                key={entity.id}
                type="button"
                className={`arena-entity entity-${entity.type}`}
                style={{
                  left: `${entity.x}%`,
                  top: `${entity.y}%`
                }}
                onClick={(e) => handleEntityClick(entity, e)}
                aria-label={`Target ${entity.type}: ${entity.label}`}
              >
                <div className="entity-avatar">
                  {entity.type === 'bug' && <Bug size={24} className="entity-svg" />}
                  {entity.type === 'coffee' && <Coffee size={24} className="entity-svg" />}
                  {entity.type === 'checkmark' && <CheckCircle2 size={24} className="entity-svg" />}
                </div>
                <span className="entity-tag font-mono">{entity.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* State 3: GAMEOVER POSTMORTEM WITH NAME SUBMISSION */}
        {gameState === 'gameover' && (
          <div className="arena-overlay arena-gameover-screen">
            <div className="gameover-card bracket-container">
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              <div className="card-badge font-mono">
                <AlertTriangle size={13} className="text-amber" />
                <span>INCIDENT POSTMORTEM // {DIFFICULTY_CONFIG[difficulty].label}</span>
              </div>

              <h3 className="gameover-title font-display">TRIAGE REPORT</h3>

              {/* Developer Rank Evaluation */}
              <div className="rank-box">
                <span className="rank-caption font-mono">// ASSIGNED ENGINEERING RANK:</span>
                <h4 className="rank-name font-display" style={{ color: getRank().color }}>
                  {getRank().title}
                </h4>
                <p className="rank-quote font-mono">"{getRank().desc}"</p>
              </div>

              {/* Stats Summary */}
              <div className="postmortem-stats font-mono">
                <div className="stat-row">
                  <span className="stat-label">TOTAL BUGS FIXED:</span>
                  <span className="stat-val text-green">{bugsFixed}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">FINAL SCORE:</span>
                  <span className="stat-val">{score}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">COFFEES CONSUMED:</span>
                  <span className="stat-val text-amber">{coffees}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">FALSE POSITIVES CLICKED:</span>
                  <span className="stat-val text-red">{penalties}</span>
                </div>
              </div>

              {/* Visitor Name High Score Submission Form */}
              <div className="save-score-section font-mono">
                {hasSubmittedScore ? (
                  <div className="score-saved-toast">
                    <CheckCircle2 size={14} className="text-green" />
                    <span>CALLSIGN RECORDED TO LEADERBOARD!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSaveScore} className="save-score-form">
                    <div className="save-label-row">
                      <User size={13} className="text-amber" />
                      <span>ENTER CALLSIGN TO RECORD SCORE:</span>
                    </div>
                    <div className="save-input-group">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 14))}
                        placeholder="YOUR CALLSIGN (e.g. NEO)"
                        maxLength={14}
                        className="player-name-input"
                        required
                        aria-label="Enter your callsign"
                      />
                      <button type="submit" className="btn-save-score">
                        SAVE SCORE
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Actions */}
              <div className="gameover-actions font-mono">
                <button
                  type="button"
                  onClick={startGame}
                  className="btn-replay"
                >
                  <RotateCcw size={15} />
                  <span>TRIAGE AGAIN</span>
                </button>

                {onExit && (
                  <button
                    type="button"
                    onClick={onExit}
                    className="btn-back-term"
                  >
                    <span>EXIT TO TERMINAL</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Text Particles Feedback Layer */}
        <div className="floaters-layer" pointer-events="none">
          {floaters.map((f) => (
            <div
              key={f.id}
              className={`floater-tag floater-${f.type} font-mono`}
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`
              }}
            >
              {f.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

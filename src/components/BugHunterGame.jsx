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
  Play
} from 'lucide-react';
import { 
  playBugSquashSound, 
  playPenaltySound, 
  playBonusSound, 
  playGameOverSound,
  playClick
} from '../utils/sound';
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
  'LGTM // DECEPTIVE',
  'ALL_GREEN (FALSE)',
  'CI_PASSED ⚠️',
  'SKIPPED_TESTS',
  'STRAY_CHECK ⚠️'
];

const COFFEE_LABELS = [
  'ESPRESSO // +5s',
  'COLD_BREW // BOOST',
  'DOUBLE_SHOT // +5s'
];

export default function BugHunterGame({ onExit }) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
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
    } catch {
      // LocalStorage access fallback
    }
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
    setBugsFixed(0);
    setScore(0);
    setTimeLeft(25);
    setStreak(0);
    setPenalties(0);
    setCoffees(0);
    setEntities([]);
    setFloaters([]);
    setScreenFlash('');
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

      // Persist High Score
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

    const spawner = setInterval(() => {
      setEntities((current) => {
        // Clean up expired entities first
        const now = Date.now();
        const active = current.filter((e) => e.expiresAt > now);

        if (active.length >= 4) return active;

        // Determine entity type:
        // 65% Bug, 20% Stray Checkmark, 15% Coffee
        const roll = Math.random();
        let type = 'bug';
        let label = BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)];
        let lifetime = 2200;

        if (roll > 0.85) {
          type = 'coffee';
          label = COFFEE_LABELS[Math.floor(Math.random() * COFFEE_LABELS.length)];
          lifetime = 2400;
        } else if (roll > 0.65) {
          type = 'checkmark';
          label = CHECKMARK_LABELS[Math.floor(Math.random() * CHECKMARK_LABELS.length)];
          lifetime = 2600;
        }

        // Bounded coordinate percentages (keep inside padding)
        const x = Math.floor(Math.random() * 74) + 12; // 12% to 86%
        const y = Math.floor(Math.random() * 66) + 14; // 14% to 80%

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
    }, 620);

    return () => clearInterval(spawner);
  }, [gameState]);

  // Handle entity clicks
  const handleEntityClick = (entity, e) => {
    e.stopPropagation();

    // Calculate click coordinates relative to arena for floater positioning
    const arenaRect = arenaRef.current?.getBoundingClientRect();
    const clickX = arenaRect ? ((e.clientX - arenaRect.left) / arenaRect.width) * 100 : entity.x;
    const clickY = arenaRect ? ((e.clientY - arenaRect.top) / arenaRect.height) * 100 : entity.y;

    // Immediately remove clicked entity
    setEntities((prev) => prev.filter((item) => item.id !== entity.id));

    if (entity.type === 'bug') {
      // 🐛 BUG SQUASHED
      playBugSquashSound();
      setStreak((s) => s + 1);
      const mult = Math.min(4, Math.floor(streak / 3) + 1);
      const points = 100 * mult;

      setBugsFixed((b) => b + 1);
      setScore((s) => s + points);
      addFloater(`+1 FIXED! (+${points})`, 'gain', clickX, clickY);
    } else if (entity.type === 'checkmark') {
      // ⚠️ PENALTY CHECKMARK (FALSE POSITIVE)
      playPenaltySound();
      setStreak(0); // break streak
      setPenalties((p) => p + 1);

      setBugsFixed((b) => Math.max(0, b - 2));
      setScore((s) => Math.max(0, s - 200));

      setScreenFlash('penalty');
      setTimeout(() => setScreenFlash(''), 350);

      addFloater('⚠️ REGRESSION! -2 BUGS (-200)', 'penalty', clickX, clickY);
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

      {/* Main Interactive Arena */}
      <div 
        ref={arenaRef}
        className="game-arena-surface bracket-container"
        id="bug-hunter-arena"
      >
        <div className="corner-bracket tl" />
        <div className="corner-bracket tr" />
        <div className="corner-bracket bl" />
        <div className="corner-bracket br" />

        {/* Scanlines & CRT Grid */}
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

              <div className="card-badge font-mono">
                <ShieldAlert size={13} />
                <span>INCIDENT PROTOCOL // v2.6</span>
              </div>

              <h3 className="start-title font-display">BUG TRIAGE SIMULATOR</h3>
              <p className="start-subtitle font-mono">
                // CRITICAL INCIDENT REPORT: PRODUCTION CORRUPTION IN PROGRESS
              </p>

              <div className="rules-grid">
                <div className="rule-item rule-bug">
                  <div className="rule-icon-box bug-box">
                    <Bug size={18} />
                  </div>
                  <div className="rule-desc">
                    <span className="rule-name">SQUASH BUGS</span>
                    <span className="rule-detail">+1 Bug Fixed // +100 Pts // Boosts Streak</span>
                  </div>
                </div>

                <div className="rule-item rule-coffee">
                  <div className="rule-icon-box coffee-box">
                    <Coffee size={18} />
                  </div>
                  <div className="rule-desc">
                    <span className="rule-name">COFFEE SPIKE</span>
                    <span className="rule-detail">+5s Extra Time // +150 Pts</span>
                  </div>
                </div>

                <div className="rule-item rule-checkmark">
                  <div className="rule-icon-box check-box">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="rule-desc">
                    <span className="rule-name">STRAY CHECKMARK</span>
                    <span className="rule-detail text-red">DO NOT CLICK! False Positive Regression (-2 Bugs, -200 Pts)</span>
                  </div>
                </div>
              </div>

              {highScore.bugs > 0 && (
                <div className="high-score-banner font-mono">
                  <Trophy size={14} className="text-amber" />
                  <span>ALL-TIME RECORD: {highScore.bugs} BUGS FIXED // {highScore.score} PTS</span>
                </div>
              )}

              <button
                type="button"
                onClick={startGame}
                className="btn-start-game font-mono"
              >
                <Play size={16} />
                <span>START INCIDENT TRIAGE</span>
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

        {/* State 3: GAMEOVER POSTMORTEM */}
        {gameState === 'gameover' && (
          <div className="arena-overlay arena-gameover-screen">
            <div className="gameover-card bracket-container">
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              <div className="card-badge font-mono">
                <AlertTriangle size={13} className="text-amber" />
                <span>INCIDENT POSTMORTEM COMPLETE</span>
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

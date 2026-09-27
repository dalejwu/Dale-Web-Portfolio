import React, { useState, useEffect } from 'react';
import { playOverdriveSound, playPaletteSound, playClick } from '../utils/sound';
import { Zap, X, Palette, Activity, Flame } from 'lucide-react';
import './KonamiOverdrive.css';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

const PALETTES = [
  { id: 'cyberpunk', name: 'CYBERPUNK', color: '#ff007f', accent: '#00ffcc' },
  { id: 'matrix', name: 'MATRIX 99', color: '#00ff66', accent: '#38bdf8' },
  { id: 'amber', name: 'AMBER 1984', color: '#fbbf24', accent: '#f59e0b' },
  { id: 'crimson', name: 'RED ALERT', color: '#ef4444', accent: '#b91c1c' }
];

export default function KonamiOverdrive() {
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const [activePalette, setActivePalette] = useState('cyberpunk');
  const [keyIndex, setKeyIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      const expectedKey = KONAMI_SEQUENCE[keyIndex].toLowerCase();

      if (key === expectedKey) {
        const nextIndex = keyIndex + 1;
        if (nextIndex === KONAMI_SEQUENCE.length) {
          activateOverdrive();
          setKeyIndex(0);
        } else {
          setKeyIndex(nextIndex);
        }
      } else {
        setKeyIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyIndex]);

  const applyPaletteTokens = (paletteId) => {
    const root = document.documentElement;
    document.body.dataset.overdrivePalette = paletteId;

    if (paletteId === 'cyberpunk') {
      root.style.setProperty('--accent-green', '#00ffcc');
      root.style.setProperty('--accent-cyan', '#ff007f');
      root.style.setProperty('--accent-green-glow', 'rgba(0, 255, 204, 0.5)');
      root.style.setProperty('--border-corner', 'rgba(255, 0, 127, 0.7)');
    } else if (paletteId === 'matrix') {
      root.style.setProperty('--accent-green', '#00ff66');
      root.style.setProperty('--accent-cyan', '#38bdf8');
      root.style.setProperty('--accent-green-glow', 'rgba(0, 255, 102, 0.6)');
      root.style.setProperty('--border-corner', 'rgba(0, 255, 102, 0.8)');
    } else if (paletteId === 'amber') {
      root.style.setProperty('--accent-green', '#fbbf24');
      root.style.setProperty('--accent-cyan', '#f59e0b');
      root.style.setProperty('--accent-green-glow', 'rgba(251, 191, 36, 0.5)');
      root.style.setProperty('--border-corner', 'rgba(251, 191, 36, 0.8)');
    } else if (paletteId === 'crimson') {
      root.style.setProperty('--accent-green', '#ef4444');
      root.style.setProperty('--accent-cyan', '#f87171');
      root.style.setProperty('--accent-green-glow', 'rgba(239, 68, 68, 0.5)');
      root.style.setProperty('--border-corner', 'rgba(239, 68, 68, 0.8)');
    }
  };

  const handlePaletteSelect = (paletteId) => {
    setActivePalette(paletteId);
    applyPaletteTokens(paletteId);
    playPaletteSound();
  };

  const activateOverdrive = () => {
    setIsOverdrive(true);
    setShowToast(true);
    setShockwave(true);
    document.body.classList.add('overdrive-mode');
    applyPaletteTokens('cyberpunk');
    setActivePalette('cyberpunk');
    playOverdriveSound();

    // Trigger terminal event
    window.dispatchEvent(new CustomEvent('overdrive-activated'));

    // Remove shockwave after animation
    setTimeout(() => setShockwave(false), 600);
  };

  const deactivateOverdrive = () => {
    setIsOverdrive(false);
    setShowToast(false);
    document.body.classList.remove('overdrive-mode');
    delete document.body.dataset.overdrivePalette;

    // Reset tokens
    const root = document.documentElement;
    root.style.removeProperty('--accent-green');
    root.style.removeProperty('--accent-cyan');
    root.style.removeProperty('--accent-green-glow');
    root.style.removeProperty('--border-corner');

    playClick(320, 0.04);
  };

  return (
    <>
      {/* Shockwave flash on activation */}
      {shockwave && <div className="overdrive-shockwave" aria-hidden="true" />}

      {/* Main Toast Banner */}
      {showToast && (
        <aside
          className="overdrive-toast glass-panel bracket-container"
          aria-label="Konami Code notification"
          aria-live="polite"
        >
          <div className="corner-bracket tl" />
          <div className="corner-bracket tr" />
          <div className="corner-bracket bl" />
          <div className="corner-bracket br" />

          <div className="overdrive-toast-content font-mono">
            <div className="overdrive-title-row">
              <Zap size={16} className="overdrive-icon pulse-glow" />
              <span className="overdrive-heading">KONAMI OVERDRIVE // HYPERDRIVE KERNEL ACTIVATED</span>
              <span className="overdrive-fps-badge">WARP SPEED 144Hz</span>
            </div>
            <p className="overdrive-desc">
              All visual limiters bypassed. Digital rain velocity 2.5x with cyber glyphs. Select your live aesthetic:
            </p>

            {/* Live Palette Selector Tabs */}
            <div className="overdrive-palette-selector">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePaletteSelect(p.id)}
                  className={`palette-chip-btn ${activePalette === p.id ? 'active' : ''}`}
                  style={{ '--chip-color': p.color }}
                >
                  <span className="chip-dot" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overdrive-actions">
            <button
              onClick={deactivateOverdrive}
              className="btn-cyber-solid overdrive-btn font-mono"
              aria-label="Deactivate Overdrive mode"
            >
              RESTORE NORMAL
            </button>
            <button
              onClick={() => setShowToast(false)}
              className="overdrive-close-btn"
              aria-label="Minimize banner"
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* Persistent Floating HUD Widget */}
      {isOverdrive && !showToast && (
        <div className="overdrive-persistent-hud glass-panel bracket-container font-mono">
          <div className="corner-bracket tl" />
          <div className="corner-bracket tr" />
          <div className="corner-bracket bl" />
          <div className="corner-bracket br" />

          <div className="hud-top-row">
            <div className="hud-title-group">
              <Zap size={13} className="hud-icon pulse-glow" />
              <span className="hud-title">OVERDRIVE [ACTIVE]</span>
            </div>
            <button
              onClick={deactivateOverdrive}
              className="hud-restore-btn"
              title="Return to standard theme"
            >
              RESTORE
            </button>
          </div>

          <div className="hud-palettes-row">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePaletteSelect(p.id)}
                className={`hud-palette-dot ${activePalette === p.id ? 'active' : ''}`}
                style={{ backgroundColor: p.color }}
                title={`Switch to ${p.name}`}
                aria-label={`Switch to ${p.name}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

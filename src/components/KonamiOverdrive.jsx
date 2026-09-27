import React, { useState, useEffect } from 'react';
import { playOverdriveSound, playClick } from '../utils/sound';
import { Zap, X, ShieldAlert } from 'lucide-react';
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

export default function KonamiOverdrive() {
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [keyIndex, setKeyIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      const expectedKey = KONAMI_SEQUENCE[keyIndex].toLowerCase();

      if (key === expectedKey) {
        const nextIndex = keyIndex + 1;
        if (nextIndex === KONAMI_SEQUENCE.length) {
          // Trigger Overdrive
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

  const activateOverdrive = () => {
    setIsOverdrive(true);
    setShowToast(true);
    document.body.classList.add('overdrive-mode');
    playOverdriveSound();
  };

  const deactivateOverdrive = () => {
    setIsOverdrive(false);
    setShowToast(false);
    document.body.classList.remove('overdrive-mode');
    playClick(300, 0.04);
  };

  return (
    <>
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
              <span className="overdrive-heading">KONAMI PROTOCOL UNLOCKED // CYBERPUNK OVERDRIVE</span>
            </div>
            <p className="overdrive-desc">
              All visual limiters bypassed. Neon cyberpunk phosphor palette and 120% engine clock engaged.
            </p>
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
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {isOverdrive && !showToast && (
        <button
          onClick={deactivateOverdrive}
          className="overdrive-floating-pill font-mono status-pill"
          title="Click to restore standard theme"
        >
          <Zap size={12} className="pulse-glow" />
          <span>OVERDRIVE ACTIVE [RESTORE]</span>
        </button>
      )}
    </>
  );
}

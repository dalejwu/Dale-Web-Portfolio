import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, ChevronRight, Zap } from 'lucide-react';
import { playBootSound, playClick } from '../utils/sound';
import './IntroSequence.css';

const BOOT_LOGS = [
  'INITIALIZING KERNEL: Florenz Dale OS v2.6.4 (x86_64-win32)',
  'VERIFYING CORE MODULES: React, TypeScript, Node.js, Distributed APIs',
  'ESTABLISHING TELEMETRY: Sub-50ms Latency // 99.9% Uptime Target',
  'COMPILING BLUEPRINTS: Cyber-Manga Brutalism Engine Ready',
  'AUTHORIZATION GRANTED // WELCOME, ARCHITECT'
];

export default function IntroSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  // Fast, crisp progress ticker (reaches 100% in ~1.8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Swift non-linear acceleration
        const increment = prev < 40 ? 5 : prev < 80 ? 4 : 7;
        const next = Math.min(100, prev + increment);
        
        // Update log line progressively
        const logStep = Math.min(
          BOOT_LOGS.length - 1, 
          Math.floor((next / 100) * BOOT_LOGS.length)
        );
        setCurrentLogIndex(logStep);

        return next;
      });
    }, 55);

    return () => clearInterval(interval);
  }, []);

  const triggerExit = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    playBootSound();
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 700); // Matches smooth CSS exit transition
  };

  // Handle completion when progress hits 100%
  useEffect(() => {
    if (progress === 100 && !isExiting) {
      const timer = setTimeout(() => {
        triggerExit();
      }, 350); // Brief victory hold before curtain lifts
      return () => clearTimeout(timer);
    }
  }, [progress, isExiting]);

  // Support ESC key to skip immediately
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        playClick(600, 0.03);
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={`intro-sequence-overlay ${isExiting ? 'intro-exit' : ''}`}
      onClick={() => {
        playClick(600, 0.03);
        triggerExit();
      }}
      role="dialog"
      aria-label="System Initializing"
    >
      {/* Background Halftone & Scanlines */}
      <div className="intro-halftone" />
      <div className="intro-scanlines" />

      {/* Top Skip Bar */}
      <div className="intro-topbar font-mono">
        <div className="intro-topbar-left">
          <Terminal size={14} className="intro-icon" />
          <span>BIOS_POST // FLORENZ DALE KERNEL</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playClick(600, 0.03);
            triggerExit();
          }}
          className="intro-skip-btn font-mono"
          title="Skip intro animation"
        >
          <span>ESC // SKIP INTRO</span>
          <span className="skip-arrow">→</span>
        </button>
      </div>

      {/* Center Cyber-Manga Boot Card */}
      <div className="intro-center-card bracket-container">
        <div className="corner-bracket tl" />
        <div className="corner-bracket tr" />
        <div className="corner-bracket bl" />
        <div className="corner-bracket br" />

        <div className="intro-badge font-mono">
          <Shield size={12} className="badge-shield" />
          <span>PAÑA.OS // BOOTLOADER v2.6.4</span>
        </div>

        <h1 className="intro-brand-title font-display">
          FLORENZ DALE
        </h1>

        <div className="intro-role-tag font-mono">
          // FULL-STACK ENGINEER &amp; SYSTEMS ARCHITECT
        </div>

        {/* Progress Bar Display */}
        <div className="intro-progress-container font-mono">
          <div className="progress-info-row">
            <span className="progress-status">
              {progress < 100 ? (
                <>
                  <span className="status-blink">▶</span> LOADING ASSETS...
                </>
              ) : (
                <span className="status-ready">✓ SYSTEM READY // LAUNCHING</span>
              )}
            </span>
            <span className="progress-pct">{progress}%</span>
          </div>

          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ transform: `scaleX(${progress / 100})` }} 
            />
          </div>
        </div>

        {/* Live Terminal Readout Line */}
        <div className="intro-terminal-readout font-mono">
          <ChevronRight size={13} className="term-prompt" />
          <span className="term-text">
            {BOOT_LOGS[currentLogIndex]}
          </span>
          <span className="term-cursor" />
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="intro-footer font-mono">
        <span>SECURITY: ROOT_PROTECTED</span>
        <span>LATENCY: 32ms</span>
        <span>CLICK OR PRESS ESC TO LAUNCH</span>
      </div>
    </div>
  );
}

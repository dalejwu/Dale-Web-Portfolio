import React, { useState, useEffect } from 'react';
import { Terminal, Code2, Cpu, Globe, ArrowUpRight, Github, Linkedin, Mail, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import Workstation from './components/Workstation';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Contact from './components/Contact';
import BinaryRain from './components/BinaryRain';
import ClickSpark from './components/ClickSpark';
import KonamiOverdrive from './components/KonamiOverdrive';
import { initAudio, isAudioEnabled, toggleAudio, playClick } from './utils/sound';
import './App.css';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [sfxEnabled, setSfxEnabled] = useState(false);

  useEffect(() => {
    initAudio();
    setSfxEnabled(isAudioEnabled());
  }, []);

  const handleAudioToggle = () => {
    const nextState = toggleAudio();
    setSfxEnabled(nextState);
  };

  return (
    <div className="portfolio-app">
      {/* Subtle Binary Code Rain Canvas */}
      <BinaryRain />

      {/* Background Halftone Overlay */}
      <div className="halftone-layer halftone-bg" />

      {/* Interactive Micro Click Sparks */}
      <ClickSpark />

      {/* Konami Code Secret Cyberpunk Overdrive Protocol */}
      <KonamiOverdrive />

      {/* Top Cyber Navigation */}
      <header className="cyber-header glass-panel">
        <div className="header-inner container">
          <a href="#" className="brand-logo" onClick={() => playClick(550, 0.03)}>
            <span className="logo-bracket">[</span>
            <span className="logo-name">FLORENZ DALE</span>
            <span className="logo-bracket">]</span>
            <span className="logo-sub">// PAÑA.OS</span>
          </a>

          <div className="status-pill status-indicator">
            <span className="status-dot"></span>
            <span>SYS.ONLINE // OPEN TO WORK</span>
          </div>

          <nav className="desktop-nav">
            <a href="#workstation" className="nav-item" onClick={() => playClick(480, 0.025)}><span>01</span> WORKSTATION</a>
            <a href="#timeline" className="nav-item" onClick={() => playClick(480, 0.025)}><span>02</span> TIMELINE</a>
            <a href="#projects" className="nav-item" onClick={() => playClick(480, 0.025)}><span>03</span> PROJECTS</a>
            <a href="#contact" className="nav-item" onClick={() => playClick(480, 0.025)}><span>04</span> CONTACT</a>
          </nav>

          <div className="header-actions-group">
            <button
              type="button"
              onClick={handleAudioToggle}
              className={`audio-toggle-btn font-mono ${sfxEnabled ? 'active' : ''}`}
              title={sfxEnabled ? "Audio SFX: ON (Click to Mute)" : "Audio SFX: MUTED (Click to Enable)"}
              aria-label="Toggle sound effects"
            >
              {sfxEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{sfxEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
            </button>

            <a href="#contact" className="btn-cyber-outline header-cta" onClick={() => playClick(540, 0.03)}>
              INITIATE CONTACT
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section */}
        <section id="hero" className="hero-section">
          <div className="container hero-container">
            <div className="bracket-container hero-card glass-panel">
              {/* Corner Brackets */}
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              <div className="hero-content">
                <div className="hero-badge font-mono">
                  <Terminal size={14} className="badge-icon" />
                  <span>INITIALIZING WORKSPACE // v2.6.4</span>
                </div>

                <h1 className="hero-title font-display">
                  FLORENZ DALE C. PAÑA
                </h1>

                <div className="hero-subtitle-container">
                  <span className="role-tag font-display">FULL-STACK ENGINEER</span>
                  <span className="role-separator">&amp;</span>
                  <span className="role-tag font-display">SYSTEMS ARCHITECT</span>
                </div>

                <p className="hero-description">
                  Crafting resilient distributed backends, ultra-performant web applications,
                  and high-craft interactive user experiences. Designed with brutalist precision and cybernetic speed.
                </p>

                <div className="hero-cta-group">
                  <a href="#projects" className="btn-cyber-solid">
                    EXPLORE PROJECTS
                    <ArrowUpRight size={18} />
                  </a>
                  <a href="#workstation" className="btn-cyber-outline">
                    LAUNCH WORKSTATION
                    <Terminal size={16} />
                  </a>
                </div>

                {/* Metrics Ticker */}
                <div className="hero-metrics-grid font-mono">
                  <div className="metric-box">
                    <span className="metric-num">03+</span>
                    <span className="metric-label">YEARS EXP</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-num">01</span>
                    <span className="metric-label">FEATURED SYSTEM</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-num">99.9%</span>
                    <span className="metric-label">RELIABILITY</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-num">&lt;50ms</span>
                    <span className="metric-label">AVG LATENCY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workstation OS Window Section */}
        <Workstation />

        {/* Career & Institutional Timeline Section */}
        <Timeline />

        {/* Selected Works & Systems Archive Section */}
        <Projects />

        {/* Communication Conduit & Contact Terminal Section */}
        <Contact />
      </main>

      {/* Cyber Footer */}
      <footer className="cyber-footer glass-panel">
        <div className="container footer-inner">
          <div className="footer-left font-mono">
            <span>&copy; {new Date().getFullYear()} FLORENZ DALE C. PAÑA. ALL RIGHTS RESERVED.</span>
            <span className="footer-dim">// CYBER-TERMINAL WORKSTATION</span>
          </div>

          <div className="footer-socials">
            <a href="https://github.com/dalejwu" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/dale-paña-3193a72a4/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:dalepana405@gmail.com" className="social-icon" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

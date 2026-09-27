import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Layers, HardDrive, Shield, CheckCircle2, ChevronRight, Activity, CornerDownLeft, Gamepad2 } from 'lucide-react';
import BugHunterGame from './BugHunterGame';
import { playClick, playChirp } from '../utils/sound';
import './Workstation.css';

export default function Workstation() {
  const [activeStackTab, setActiveStackTab] = useState('all');
  const [terminalInput, setTerminalInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [workstationMode, setWorkstationMode] = useState('terminal'); // 'terminal' | 'game'
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'sys', text: 'INIT_KERNEL: Florenz Dale OS v2.6.4 (x86_64-win32)' },
    { type: 'sys', text: 'WORKSPACE: Ready. Type "help", "game", or click presets. (Easter Egg: ↑ ↑ ↓ ↓ ← → ← → B A)' }
  ]);

  useEffect(() => {
    const handleOverdrive = () => {
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: 'res',
          text: '⚡ KERNEL OVERDRIVE DETECTED // GPU ACCELERATION: 100% // BYPASS PROTOCOLS ENGAGED. 144Hz CLOCKED.'
        }
      ]);
    };
    window.addEventListener('overdrive-activated', handleOverdrive);
    return () => window.removeEventListener('overdrive-activated', handleOverdrive);
  }, []);

  const stackCategories = {
    all: [
      { name: 'TypeScript', cat: 'Language' },
      { name: 'JavaScript (ES6+)', cat: 'Language' },
      { name: 'Python', cat: 'Language' },
      { name: 'Go', cat: 'Language' },
      { name: 'React 18+', cat: 'Frontend' },
      { name: 'Next.js', cat: 'Frontend' },
      { name: 'Vite', cat: 'Frontend' },
      { name: 'Node.js', cat: 'Backend' },
      { name: 'Express / Fastify', cat: 'Backend' },
      { name: 'PostgreSQL', cat: 'Database' },
      { name: 'Redis', cat: 'Database' },
      { name: 'Docker', cat: 'DevOps' },
      { name: 'Playwright', cat: 'Testing' },
      { name: 'Git & CI/CD', cat: 'DevOps' }
    ],
    frontend: [
      { name: 'React 18+', cat: 'UI Library' },
      { name: 'Next.js', cat: 'Framework' },
      { name: 'Vite', cat: 'Bundler' },
      { name: 'TypeScript', cat: 'Type Safety' },
      { name: 'Modern CSS / Grid', cat: 'Styling' },
      { name: 'Playwright', cat: 'Testing' }
    ],
    backend: [
      { name: 'Node.js', cat: 'Runtime' },
      { name: 'Express / Fastify', cat: 'APIs' },
      { name: 'Python (FastAPI)', cat: 'Services' },
      { name: 'Go', cat: 'Microservices' },
      { name: 'PostgreSQL', cat: 'RDBMS' },
      { name: 'Redis', cat: 'Cache & Pub/Sub' }
    ],
    devops: [
      { name: 'Docker', cat: 'Containers' },
      { name: 'GitHub Actions', cat: 'CI/CD' },
      { name: 'Linux / Bash', cat: 'Environments' },
      { name: 'REST & GraphQL', cat: 'Protocols' },
      { name: 'RBAC & OAuth2', cat: 'Security' }
    ]
  };

  const handleCommand = (cmdText) => {
    const raw = (cmdText || terminalInput).trim().toLowerCase();
    if (!raw) return;

    playChirp(840, 0.04);
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const newLogs = [...terminalLogs, { type: 'user', text: `> ${raw}` }];

    switch (raw) {
      case 'help':
        newLogs.push({
          type: 'res',
          text: 'Available commands: "game", "skills", "stack", "specs", "academic", "recruiter", "hack", "arcade", "coffee", "sudo", "philosophy", "clear". Classified: Arcade sequence [↑ ↑ ↓ ↓ ← → ← → B A].'
        });
        break;
      case 'game':
      case 'play':
      case 'arcade':
      case 'bugs':
      case 'triage':
      case 'bughunter':
        newLogs.push({
          type: 'res',
          text: '👾 ENGAGING BUG TRIAGE ARENA // Target: squash production bugs! Beware of stray checkmarks and grab coffee for extra time.'
        });
        setWorkstationMode('game');
        break;
      case 'overdrive':
      case 'konami':
        newLogs.push({
          type: 'res',
          text: '⚡ KERNEL OVERDRIVE DETECTED // GPU ACCELERATION: 100% // BYPASS PROTOCOLS ENGAGED.'
        });
        window.dispatchEvent(new CustomEvent('trigger-overdrive'));
        break;
      case 'recruiter':
        newLogs.push({
          type: 'res',
          text: 'RECRUITER DISPATCH: Florenz Dale C. Paña | Full-Stack Software Engineer & Systems Architect | React, TypeScript, Node.js, PostgreSQL | Builds resilient distributed platforms with sub-50ms latency & 99.9% uptime | Email: dalepana405@gmail.com'
        });
        break;
      case 'hack':
        newLogs.push({
          type: 'res',
          text: '⚡ ACCESSING MAINFRAME... [STATUS: 200 OK] // ROOT KEY BYPASS: "DALE_KERNEL_SEC" // HINT: Try (↑ ↑ ↓ ↓ ← → ← → B A) see what happens..'
        });
        break;
      case 'coffee':
        newLogs.push({
          type: 'res',
          text: '☕ COFFEE PIPELINE: 418 I\'m a teapot (and a systems architect). Current caffeine capacity: 96% optimal.'
        });
        break;
      case 'reboot':
      case 'boot':
      case 'intro':
        newLogs.push({
          type: 'res',
          text: '🔄 REBOOTING SYSTEM // RELOADING KERNEL BOOTLOADER SEQUENCE...'
        });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('replay-intro'));
        }, 400);
        break;
      case 'sudo':
      case 'sudo su':
        newLogs.push({
          type: 'err',
          text: 'dale is not in the sudoers file. This incident will be logged in the incident chronicle.'
        });
        break;
      case 'academic':
      case 'education':
        newLogs.push({
          type: 'res',
          text: 'Academic Foundation: Western Mindanao State University (Undergraduate / College) | Immaculate Conception Archdiocesan School (High School)'
        });
        break;
      case 'skills':
        newLogs.push({
          type: 'res',
          text: 'Core: Full-Stack Architecture, Distributed APIs, Database Modeling, UI Precision, Responsive Performance.'
        });
        break;
      case 'stack':
        newLogs.push({
          type: 'res',
          text: 'Stack: TypeScript, React, Node.js, Python, PostgreSQL, Docker, Vite, Playwright.'
        });
        break;
      case 'specs':
        newLogs.push({
          type: 'res',
          text: 'Node: v24.20.0 | Uptime: 99.98% | Latency: 32ms | Environment: Production'
        });
        break;
      case 'philosophy':
        newLogs.push({
          type: 'res',
          text: '"Code is an engineering asset. Build for clarity, scalability, and compounding long-term value."'
        });
        break;
      case 'clear':
        setTerminalLogs([{ type: 'sys', text: 'Terminal buffer cleared.' }]);
        setTerminalInput('');
        return;
      default:
        newLogs.push({
          type: 'err',
          text: `Command not found: "${raw}". Type "help" for a list of available commands.`
        });
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setTerminalInput(history[nextIdx] || '');
      playClick(700, 0.02);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setTerminalInput('');
      } else {
        setHistoryIndex(nextIdx);
        setTerminalInput(history[nextIdx] || '');
      }
      playClick(600, 0.02);
    }
  };

  return (
    <section id="workstation" className="workstation-section">
      <div className="container workstation-container">
        {/* Section Header */}
        <div className="workstation-heading-row">
          <div className="bracket-container workstation-header-badge font-mono">
            <div className="corner-bracket tl" />
            <div className="corner-bracket tr" />
            <div className="corner-bracket bl" />
            <div className="corner-bracket br" />
            <span className="badge-bullet">// 01</span>
            <span>DEVELOPER WORKSTATION</span>
          </div>

          <div className="workstation-heading-right">
            <button
              type="button"
              onClick={() => {
                playClick(600, 0.03);
                setWorkstationMode((m) => (m === 'terminal' ? 'game' : 'terminal'));
              }}
              className={`workstation-game-pill font-mono ${workstationMode === 'game' ? 'active' : ''}`}
              title="Toggle Bug Squasher mini game"
              aria-label="Toggle Bug Squasher mini game"
            >
              <Gamepad2 size={13} className="pill-game-icon" />
              <span>{workstationMode === 'game' ? 'VIEW TERMINAL' : 'MINI-GAME: BUG SQUASHER'}</span>
              <span className="pill-pulse-dot" />
            </button>

            <span className="status-indicator">
              <span className="status-dot"></span>
              <span>OS TELEMETRY ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Workstation Grid Layout */}
        <div className="workstation-grid">
          {/* Left Column: Interactive OS Window & Floating Telemetry Panels */}
          <div className="workstation-left-panel">
            <div className="os-window-frame bracket-container">
              {/* Corner Brackets */}
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              {/* OS Window Top Titlebar */}
              <div className="os-titlebar font-mono">
                <div className="os-titlebar-left">
                  <div className="os-tabs">
                    <button
                      type="button"
                      className={`os-tab ${workstationMode === 'terminal' ? 'active' : ''}`}
                      onClick={() => {
                        playClick(600, 0.03);
                        setWorkstationMode('terminal');
                      }}
                      aria-label="Switch to Terminal"
                    >
                      <Terminal size={13} className="os-tab-icon" />
                      <span>TERMINAL</span>
                    </button>
                    <button
                      type="button"
                      className={`os-tab os-tab-game ${workstationMode === 'game' ? 'active' : ''}`}
                      onClick={() => {
                        playClick(600, 0.03);
                        setWorkstationMode('game');
                      }}
                      aria-label="Switch to Bug Squasher Mini-Game"
                    >
                      <Gamepad2 size={13} className="os-tab-icon text-amber" />
                      <span>BUG SQUASHER</span>
                      <span className="game-tab-pill">PLAY</span>
                    </button>
                  </div>
                </div>
                <div className="os-window-controls">
                  <button className="win-btn win-min" aria-label="Minimize">_</button>
                  <button className="win-btn win-max" aria-label="Maximize">❑</button>
                  <button
                    className="win-btn win-close"
                    aria-label="Close or Reset"
                    onClick={() => {
                      playClick(600, 0.03);
                      setWorkstationMode('terminal');
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {workstationMode === 'game' ? (
                <BugHunterGame onExit={() => setWorkstationMode('terminal')} />
              ) : (
                /* Central Interactive Terminal Body */
                <div className="os-body font-mono">
                  {/* Scanline line overlay */}
                  <div className="scanline-overlay" />

                  {/* Terminal output log */}
                  <div className="terminal-screen" id="terminal-screen">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className={`term-line term-${log.type}`}>
                        {log.text}
                      </div>
                    ))}
                  </div>

                  {/* Command Input Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommand();
                    }}
                    className="terminal-input-bar"
                  >
                    <span className="input-prompt">&gt;</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => {
                        setTerminalInput(e.target.value);
                        playClick(520 + Math.random() * 160, 0.015);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Type command (e.g. game, skills, recruiter, hack)..."
                      className="terminal-input"
                      aria-label="Terminal command input"
                    />
                    <button type="submit" className="terminal-submit-btn" aria-label="Run command">
                      <CornerDownLeft size={14} />
                    </button>
                  </form>

                  {/* Command Presets */}
                  <div className="terminal-presets font-mono">
                    <span className="presets-label">QUICK EXEC:</span>
                    <button type="button" onClick={() => handleCommand('skills')} className="preset-btn">
                      skills
                    </button>
                    <button type="button" onClick={() => handleCommand('arcade')} className="preset-btn preset-btn-game" title="Play Bug Squasher mini-game">
                      👾 arcade
                    </button>
                    <button type="button" onClick={() => handleCommand('recruiter')} className="preset-btn">
                      recruiter
                    </button>
                    <button type="button" onClick={() => handleCommand('stack')} className="preset-btn">
                      stack
                    </button>
                    <button type="button" onClick={() => handleCommand('hack')} className="preset-btn">
                      hack
                    </button>
                    <button type="button" onClick={() => handleCommand('specs')} className="preset-btn">
                      specs
                    </button>
                    <button type="button" onClick={() => handleCommand('coffee')} className="preset-btn">
                      coffee
                    </button>
                    <button type="button" onClick={() => handleCommand('clear')} className="preset-btn">
                      clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Satellite Data Terminal Cards */}
            <div className="satellite-cards-row">
              {/* Card 1: Core Architecture Skills */}
              <div className="data-terminal-card glass-panel bracket-container">
                <div className="corner-bracket tl" />
                <div className="corner-bracket tr" />
                <div className="corner-bracket bl" />
                <div className="corner-bracket br" />
                <div className="card-top-header">
                  <Shield size={14} className="card-icon" />
                  <h4 className="card-title font-mono">CORE ARCHITECTURE</h4>
                </div>
                <ul className="card-list font-mono">
                  <li><CheckCircle2 size={12} className="list-icon" /> REST &amp; GRAPHQL APIS</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> DATABASE SCHEMA &amp; ORM OPTIMIZATION</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> ROLE-BASED ACCESS CONTROL (RBAC)</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> EVENT-DRIVEN &amp; CACHING PATTERNS</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> ZERO-REGRESSION E2E TESTING</li>
                </ul>
              </div>

              {/* Card 2: Professional Passion & Focus */}
              <div className="data-terminal-card glass-panel bracket-container">
                <div className="corner-bracket tl" />
                <div className="corner-bracket tr" />
                <div className="corner-bracket bl" />
                <div className="corner-bracket br" />
                <div className="card-top-header">
                  <Cpu size={14} className="card-icon" />
                  <h4 className="card-title font-mono">SYSTEM DOMAINS</h4>
                </div>
                <ul className="card-list font-mono">
                  <li><CheckCircle2 size={12} className="list-icon" /> FULL-STACK WEB PLATFORMS</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> CLOUD CONTAINERIZATION (DOCKER)</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> REAL-TIME TELEMETRY &amp; METRICS</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> CYBER-TERMINAL &amp; INTERACTIVE UI</li>
                  <li><CheckCircle2 size={12} className="list-icon" /> RELIABILITY &amp; 99.9% UPTIME</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: System Architect Declaration & Tech Matrix */}
          <div className="workstation-right-panel">
            <div className="manifesto-card glass-panel bracket-container">
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              <h2 className="manifesto-title font-display">
                SYSTEM<br />
                ARCHITECT
              </h2>

              <p className="manifesto-quote font-mono">
                "I approach software engineering as a strategic foundation. My focus is on architecting systems
                that are efficient, resilient under peak load, and structured to adapt cleanly as products expand."
              </p>

              {/* Live Telemetry Matrix */}
              <div className="telemetry-readout font-mono">
                <div className="readout-row">
                  <span className="readout-label">KERNEL VERSION:</span>
                  <span className="readout-value">v2.6.4-STABLE</span>
                </div>
                <div className="readout-row">
                  <span className="readout-label">SYSTEM UPTIME:</span>
                  <span className="readout-value text-green">99.98% SLA</span>
                </div>
                <div className="readout-row">
                  <span className="readout-label">LATENCY FLOOR:</span>
                  <span className="readout-value">&lt; 35ms AVG</span>
                </div>
                <div className="readout-row">
                  <span className="readout-label">PRIMARY PROTOCOL:</span>
                  <span className="readout-value">HTTP/2, WSS, REST</span>
                </div>
              </div>

              {/* Tech Stack Matrix with Filter Tabs */}
              <div className="tech-matrix-box">
                <div className="matrix-tabs-header font-mono">
                  <span className="matrix-header-title">TECH MATRIX:</span>
                  <div className="tab-buttons">
                    <button
                      type="button"
                      className={`tab-btn ${activeStackTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveStackTab('all')}
                    >
                      ALL
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${activeStackTab === 'frontend' ? 'active' : ''}`}
                      onClick={() => setActiveStackTab('frontend')}
                    >
                      FRONTEND
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${activeStackTab === 'backend' ? 'active' : ''}`}
                      onClick={() => setActiveStackTab('backend')}
                    >
                      BACKEND
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${activeStackTab === 'devops' ? 'active' : ''}`}
                      onClick={() => setActiveStackTab('devops')}
                    >
                      INFRA
                    </button>
                  </div>
                </div>

                <div className="tech-pill-grid">
                  {stackCategories[activeStackTab].map((tech, index) => (
                    <div key={index} className="tech-pill-card">
                      <span className="pill-name">{tech.name}</span>
                      <span className="pill-cat font-mono">{tech.cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="manifesto-action">
                <a href="#projects" className="btn-cyber-solid">
                  VIEW DEPLOYED SYSTEMS
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

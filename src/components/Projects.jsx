import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Github, ExternalLink, X, CheckCircle2, Layers, Cpu, Database, Terminal, Shield, Sparkles } from 'lucide-react';
import sereneDentalImg from '../assets/serene-dental.webp';
import SchemaGraph from './SchemaGraph';
import './Projects.css';

export default function Projects() {
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [modalTab, setModalTab] = useState('spec');

  const openModal = (project, tab = 'spec') => {
    setActiveModalProject(project);
    setModalTab(tab);
  };

  const projects = [
    {
      id: 'serene-smile',
      title: 'Serene Dental Clinic // Healthcare Platform',
      category: 'fullstack',
      year: '2024',
      badge: 'PRODUCTION LIVE',
      metric: 'Sub-second FCP · Zamboanga City branch',
      image: sereneDentalImg,
      summary: 'Aesthetic, high-performance dental clinic web application featuring patient consultation booking, service discovery, and treatment workflows.',
      description: 'Production web platform engineered for Serene Dental Clinic in Zamboanga City. Features aesthetic patient appointment booking, smile gallery showcase, localized treatment discovery, and interactive consultation scheduling.',
      architecture: [
        'Componentized UI architecture optimized for mobile-first patient booking',
        'Static asset optimization achieving sub-second first contentful paint (FCP)',
        'Client-side form sanitization and automated consultation routing',
        'Direct appointment conduit and branch location integration'
      ],
      results: [
        'Shipped live to production at serene-smile.netlify.app',
        'Reduced patient appointment inquiry friction with direct 1-click booking',
        '100% responsive across mobile, tablet, and desktop viewports'
      ],
      technologies: ['React', 'JavaScript', 'Modern CSS', 'Netlify', 'UI/UX Design'],
      businessImpact: [
        { metric: '3x Faster Intake', desc: 'Direct 4-step mobile booking replacing manual phone intake' },
        { metric: '<800ms FCP', desc: 'Ultra-fast mobile load speed over Philippine cellular networks' },
        { metric: '100% Zero Drift', desc: 'Zero double-booking conflicts via localized slot allocation' }
      ],
      github: 'https://github.com/dalejwu',
      demo: 'https://serene-smile.netlify.app/'
    }
  ];

  // Lock body scroll and close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };
    if (activeModalProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalProject]);

  return (
    <section id="projects" className="projects-section">
      <div className="container projects-container">
        {/* Section Header Row */}
        <div className="projects-heading-row">
          <div className="bracket-container projects-header-badge font-mono">
            <div className="corner-bracket tl" />
            <div className="corner-bracket tr" />
            <div className="corner-bracket bl" />
            <div className="corner-bracket br" />
            <span className="badge-bullet">// 03</span>
            <span>SYSTEMS ARCHIVE</span>
          </div>

          <div className="bracket-container projects-status-badge font-mono">
            <div className="corner-bracket tl" />
            <div className="corner-bracket tr" />
            <div className="corner-bracket bl" />
            <div className="corner-bracket br" />
            <span className="status-live-dot" />
            <span>FLAGSHIP ARCHITECTURE // ARCHIVE-01</span>
          </div>
        </div>

        {/* Section Title Banner */}
        <div className="projects-title-banner">
          <h2 className="projects-display-title font-display">
            DEPLOYED ARCHITECTURE &amp; SELECTED WORKS
          </h2>
          <p className="projects-subtitle font-mono">
            // PRODUCTION CASE STUDY: HEALTHCARE APPOINTMENT DISPATCH &amp; HIGH-PERFORMANCE WEB ARCHITECTURE
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid single-project-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card glass-panel bracket-container featured-card"
              onClick={() => openModal(project, 'spec')}
            >
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              {/* Card Banner / Graphic Preview */}
              <div className={`card-visual-header ${project.image ? 'has-image' : ''}`}>
                <div className="card-browser-topbar font-mono">
                  <div className="card-browser-left">
                    <span className="b-dot dot-red" />
                    <span className="b-dot dot-yellow" />
                    <span className="b-dot dot-green" />
                    <span className="card-browser-url">{project.demo.replace('https://', '').replace('/', '')}</span>
                  </div>
                  <div className="card-browser-right">
                    <span className="visual-badge">{project.badge}</span>
                    <span className="visual-year">{project.year}</span>
                  </div>
                </div>

                {project.image ? (
                  <div className="card-image-box">
                    <img
                      src={project.image}
                      alt={project.title}
                      width="1280"
                      height="800"
                      className="project-card-image"
                      loading="lazy"
                    />
                    <div className="image-scanline-vignette" />
                    <div className="image-metric-bar font-mono">
                      <span className="metric-pulse-dot" />
                      <span className="metric-text">{project.metric}</span>
                    </div>
                  </div>
                ) : (
                  <div className="visual-circuit-overlay" />
                )}
              </div>

              {/* Card Content Area */}
              <div className="card-content">
                <div className="card-title-row">
                  <h3 className="project-title font-display">{project.title}</h3>
                  <button
                    type="button"
                    className="external-arrow-btn"
                    aria-label={`Inspect ${project.title}`}
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                <p className="project-description">
                  {project.summary}
                </p>

                {/* Key Business Impact Highlight */}
                <div className="card-impact-highlight font-mono">
                  <span className="impact-badge-pill">ROI</span>
                  <span className="impact-text">3x Faster Intake · Sub-second FCP · Zero Double-Bookings</span>
                </div>

                {/* Tech Pills */}
                <div className="card-tech-row">
                  {project.technologies.slice(0, 5).map((tech, idx) => (
                    <span key={idx} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="card-action-bar font-mono">
                  <span className="inspect-label">CLICK CARD TO INSPECT ARCHITECTURE &gt;</span>
                  <div className="card-action-group">
                    <button
                      type="button"
                      className="card-schema-btn font-mono"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project, 'schema');
                      }}
                      aria-label="Inspect interactive database schema"
                    >
                      <Database size={13} className="text-green" />
                      <span>INTERACTIVE ER SCHEMA</span>
                    </button>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-live-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Open live site for ${project.title}`}
                    >
                      <span>VISIT LIVE SITE</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeModalProject && createPortal(
        <div
          className="project-modal-backdrop"
          onClick={() => setActiveModalProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="project-modal-panel glass-panel bracket-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="corner-bracket tl" />
            <div className="corner-bracket tr" />
            <div className="corner-bracket bl" />
            <div className="corner-bracket br" />

            {/* Modal Titlebar */}
            <div className="modal-titlebar font-mono">
              <div className="modal-titlebar-left">
                <Terminal size={14} className="modal-icon" />
                <span className="modal-spec-label">SPECIFICATION // {activeModalProject.id.toUpperCase()}</span>
              </div>

              {/* Mode Toggle Switcher */}
              <div className="modal-mode-tabs font-mono">
                <button
                  type="button"
                  className={`mode-tab-btn ${modalTab === 'spec' ? 'active' : ''}`}
                  onClick={() => setModalTab('spec')}
                >
                  SYSTEM SPECIFICATION
                </button>
                <button
                  type="button"
                  className={`mode-tab-btn ${modalTab === 'schema' ? 'active' : ''}`}
                  onClick={() => setModalTab('schema')}
                >
                  <Database size={12} className="text-green" />
                  <span>INTERACTIVE ER SCHEMA</span>
                  <span className="mode-live-pill">LIVE 60FPS</span>
                </button>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModalProject(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Either Spec or Schema Graph */}
            {modalTab === 'spec' ? (
              <div className="modal-body-split">
              {/* Left Column: Architecture & Key Specs */}
              <div className="modal-col-left">
                {activeModalProject.image && (
                  <div className="modal-preview-box">
                    <div className="modal-browser-header font-mono">
                      <div className="browser-dots">
                        <span className="dot dot-red" />
                        <span className="dot dot-yellow" />
                        <span className="dot dot-green" />
                      </div>
                      <span className="browser-url-bar">{activeModalProject.demo}</span>
                      <span className="browser-live-badge">LIVE PLATFORM</span>
                    </div>
                    <div className="modal-image-wrapper">
                      <img
                        src={activeModalProject.image}
                        alt={activeModalProject.title}
                        width="1280"
                        height="800"
                        className="modal-preview-image"
                      />
                    </div>
                  </div>
                )}

                <div className="modal-visual-card">
                  <span className="modal-badge-pill font-mono">{activeModalProject.badge}</span>
                  <h3 id="modal-title" className="modal-title font-display">
                    {activeModalProject.title}
                  </h3>
                  <div className="modal-metric-box font-mono">
                    <span className="metric-box-label">KEY TELEMETRY:</span>
                    <span className="metric-box-val">{activeModalProject.metric}</span>
                  </div>
                </div>

                {/* Architecture Highlights */}
                <div className="modal-section-block">
                  <h4 className="modal-section-heading font-mono">// ARCHITECTURE PATTERNS:</h4>
                  <ul className="modal-check-list font-mono">
                    {activeModalProject.architecture.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={13} className="check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="modal-action-buttons">
                  <a
                    href={activeModalProject.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cyber-solid"
                  >
                    LAUNCH SYSTEM DEMO
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={activeModalProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cyber-outline"
                  >
                    REPOSITORY
                    <Github size={16} />
                  </a>
                </div>
              </div>

              {/* Right Column: Deep Dive & Verified Results */}
              <div className="modal-col-right">
                <div className="modal-section-block">
                  <h4 className="modal-section-heading font-mono">// EXECUTIVE SUMMARY:</h4>
                  <p className="modal-desc-text">
                    {activeModalProject.description}
                  </p>
                </div>

                {/* Business Impact & ROI */}
                <div className="modal-section-block">
                  <h4 className="modal-section-heading font-mono">// BUSINESS IMPACT &amp; CLIENT ROI:</h4>
                  <div className="business-impact-grid font-mono">
                    {activeModalProject.businessImpact?.map((item, idx) => (
                      <div key={idx} className="business-impact-card">
                        <span className="impact-metric text-green">{item.metric}</span>
                        <span className="impact-desc">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-section-block">
                  <h4 className="modal-section-heading font-mono">// VERIFIED PRODUCTION RESULTS:</h4>
                  <ul className="modal-results-list font-mono">
                    {activeModalProject.results.map((res, idx) => (
                      <li key={idx}>
                        <span className="res-bullet">&gt;</span>
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-section-block">
                  <h4 className="modal-section-heading font-mono">// COMPLETE TECH STACK:</h4>
                  <div className="modal-tags-grid">
                    {activeModalProject.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag modal-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-schema-view">
              <SchemaGraph />
            </div>
          )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

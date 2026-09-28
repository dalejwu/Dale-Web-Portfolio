import React, { useState } from 'react';
import { Calendar, Briefcase, GraduationCap, ChevronDown, ChevronUp, Terminal, CheckCircle2, Award, Zap } from 'lucide-react';
import { playClick } from '../utils/sound';
import './Timeline.css';

export default function Timeline() {
  const [filter, setFilter] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState({
    lead: true,
    'wmsu-undergrad': true,
    'icas-highschool': true
  });

  const toggleNode = (id) => {
    playClick(480, 0.025);
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const milestones = [
    {
      id: 'lead',
      year: '2024 — PRESENT',
      phase: 'PHASE // 04',
      role: 'FULL-STACK SOFTWARE ENGINEER & SYSTEM ARCHITECT',
      organization: 'Enterprise Cloud & Client Platforms',
      category: 'industry',
      isCurrent: true,
      summary: 'Directing core web platform architecture, distributed service integration, and client-facing digital experiences.',
      highlights: [
        'Architected and delivered mission-critical web applications including healthcare clinic management platforms',
        'Spearheaded modern React component architecture, driving sub-second initial load times across client platforms',
        'Enforced strict end-to-end security audits, role-based access control, and automated testing suites'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Vite']
    },
    {
      id: 'fullstack',
      year: '2022 — 2024',
      phase: 'PHASE // 03',
      role: 'FULL-STACK DEVELOPER',
      organization: 'Digital Web Solutions Lab',
      category: 'industry',
      isCurrent: false,
      summary: 'Engineered responsive web applications, backend REST APIs, and database schemas for commercial client platforms.',
      highlights: [
        'Developed interactive full-stack web applications with optimized database queries and clean UI design',
        'Integrated automated deployment pipelines with CI/CD workflows, cutting staging turnaround by 60%',
        'Created modular UI components and responsive layouts adopted across client web platforms'
      ],
      technologies: ['JavaScript', 'React', 'Node.js', 'Express', 'MySQL', 'Modern CSS']
    },
    {
      id: 'wmsu-undergrad',
      year: 'UNDERGRADUATE // COLLEGE',
      phase: 'PHASE // 02',
      role: 'UNDERGRADUATE // B.S. IN COMPUTER SCIENCE',
      organization: 'Western Mindanao State University',
      category: 'academic',
      badge: 'COLLEGE (UNDERGRAD)',
      logo: '/wmsu-seal.jpg',
      isCurrent: false,
      summary: 'Rigorous undergraduate curriculum in computer science, mastering systems design, algorithm analysis, web technologies, and database engineering at Western Mindanao State University.',
      highlights: [
        'Mastered core and advanced computing coursework: algorithms, data structures, systems architecture, and database systems',
        'Engineered comprehensive academic capstone platforms and collaborative software projects with modern component design',
        'Demonstrated strong technical problem solving, academic excellence, and leadership in collegiate computing organizations'
      ],
      technologies: ['Software Architecture', 'Web Technologies', 'Java', 'SQL / Relational DBs', 'Algorithms & Data Structures']
    },
    {
      id: 'icas-highschool',
      year: 'SECONDARY EDUCATION',
      phase: 'PHASE // 01',
      role: 'HIGH SCHOOL DIPLOMA // SECONDARY EDUCATION',
      organization: 'Immaculate Conception Archdiocesan School',
      category: 'academic',
      badge: 'HIGH SCHOOL',
      logo: '/icas-seal.png',
      isCurrent: false,
      summary: 'Formative secondary education foundation emphasizing mathematics, sciences, institutional values, and early computational and technical literacy at Immaculate Conception Archdiocesan School.',
      highlights: [
        'Established foundational excellence in advanced mathematics, analytical reasoning, and scientific methodology',
        'Cultivated early computer logic, technical literacy, and software design principles',
        'Active participant in academic competitions, school councils, and collaborative leadership initiatives'
      ],
      technologies: ['Foundational Computing', 'Advanced Mathematics', 'Analytical Problem Solving', 'Logic & Leadership']
    }
  ];

  const filteredMilestones = filter === 'all'
    ? milestones
    : milestones.filter(m => m.category === filter);

  return (
    <section id="timeline" className="timeline-section">
      <div className="container timeline-container">
        {/* Section Header */}
        <div className="timeline-heading-row">
          <div className="bracket-container timeline-header-badge font-mono">
            <div className="corner-bracket tl" />
            <div className="corner-bracket tr" />
            <div className="corner-bracket bl" />
            <div className="corner-bracket br" />
            <span className="badge-bullet">// 02</span>
            <span>TRAJECTORY &amp; LEVEL-UPS</span>
          </div>

          <div className="timeline-filter-tabs font-mono">
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => {
                playClick(520, 0.03);
                setFilter('all');
              }}
            >
              ALL NODES
            </button>
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'industry' ? 'active' : ''}`}
              onClick={() => {
                playClick(520, 0.03);
                setFilter('industry');
              }}
            >
              ENGINEERING CAREER
            </button>
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'academic' ? 'active' : ''}`}
              onClick={() => {
                playClick(520, 0.03);
                setFilter('academic');
              }}
            >
              ACADEMIC FOUNDATION
            </button>
          </div>
        </div>

        {/* Section Title Banner */}
        <div className="timeline-title-banner">
          <h2 className="timeline-display-title font-display">
            FROM FIRST 'HELLO WORLD' TO PRODUCTION ARCHITECT
          </h2>
          <p className="timeline-subtitle font-mono">
            // ACADEMIC FOUNDATIONS, COMMERCIAL SCALE &amp; SYSTEM ARCHITECTURE
          </p>
        </div>

        {/* Interactive Vertical Timeline */}
        <div className="timeline-track-wrapper">
          {/* Vertical Backbone Line */}
          <div className="timeline-spine-line" />

          {/* Milestone Nodes */}
          <div className="timeline-nodes-list">
            {filteredMilestones.map((milestone) => {
              const isExpanded = !!expandedNodes[milestone.id];

              return (
                <div key={milestone.id} className={`timeline-node-item ${milestone.isCurrent ? 'is-active-node' : ''}`}>
                  {/* Node Connector Point */}
                  <div className="node-marker-wrapper">
                    <div className="node-marker-bullet">
                      {milestone.isCurrent && <span className="node-ping-ring" />}
                    </div>
                  </div>

                  {/* Node Card Container */}
                  <div className="node-content-card glass-panel bracket-container">
                    <div className="corner-bracket tl" />
                    <div className="corner-bracket tr" />
                    <div className="corner-bracket bl" />
                    <div className="corner-bracket br" />

                    {/* Academic Institution Official Seal Stamp */}
                    {milestone.logo && (
                      <div className="node-seal-stamp" title={`${milestone.organization} Official Seal`}>
                        <img
                          src={milestone.logo}
                          alt={`${milestone.organization} Official Seal`}
                          className="node-seal-img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Node Header Row */}
                    <div className={`node-header ${milestone.logo ? 'node-has-logo' : ''}`} onClick={() => toggleNode(milestone.id)}>
                      <div className="node-meta font-mono">
                        <span className="node-phase">{milestone.phase}</span>
                        <span className="node-year">
                          <Calendar size={13} className="meta-icon" />
                          {milestone.year}
                        </span>
                        {milestone.badge && (
                          <span className={`node-badge ${milestone.isCurrent ? 'badge-live' : ''}`}>
                            {milestone.badge}
                          </span>
                        )}
                      </div>

                      <div className="node-titles">
                        <h3 className="node-role font-display">{milestone.role}</h3>
                        <div className="node-org font-mono">
                          {milestone.category === 'academic' ? (
                            <GraduationCap size={14} className="org-icon" />
                          ) : (
                            <Briefcase size={14} className="org-icon" />
                          )}
                          <span>{milestone.organization}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="node-expand-btn font-mono"
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        <span>{isExpanded ? 'COLLAPSE' : 'INSPECT'}</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Node Body / Expandable Highlights */}
                    {isExpanded && (
                      <div className="node-body">
                        <p className="node-summary">{milestone.summary}</p>

                        <div className="node-highlights-block font-mono">
                          <span className="highlights-title">// VERIFIED CONTRIBUTIONS:</span>
                          <ul className="highlights-list">
                            {milestone.highlights.map((item, idx) => (
                              <li key={idx}>
                                <CheckCircle2 size={13} className="check-icon" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Tag Pills */}
                        <div className="node-tags-row">
                          {milestone.technologies.map((tech, idx) => (
                            <span key={idx} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Database, RotateCcw, Sparkles, Layers, ShieldCheck, Activity } from 'lucide-react';
import './SchemaGraph.css';

const INITIAL_NODES = {
  patients: {
    id: 'patients',
    title: 'patients',
    category: 'IDENTITY',
    x: 40,
    y: 30,
    width: 210,
    height: 165,
    fields: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'full_name', type: 'VARCHAR(120)', isReq: true },
      { name: 'phone', type: 'VARCHAR(20)', isReq: true },
      { name: 'email', type: 'VARCHAR(100)' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ]
  },
  appointments: {
    id: 'appointments',
    title: 'appointments',
    category: 'CORE TRANSACTION',
    x: 350,
    y: 110,
    width: 250,
    height: 220,
    fields: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'patient_id', type: 'UUID [FK]', isFk: true, ref: 'patients' },
      { name: 'dentist_id', type: 'UUID [FK]', isFk: true, ref: 'dentists' },
      { name: 'service_id', type: 'UUID [FK]', isFk: true, ref: 'services' },
      { name: 'scheduled_at', type: 'DATETIME', isReq: true },
      { name: 'status', type: 'ENUM', isReq: true },
      { name: 'fcp_latency_ms', type: 'INT' }
    ]
  },
  dentists: {
    id: 'dentists',
    title: 'dentists',
    category: 'RESOURCE',
    x: 690,
    y: 30,
    width: 210,
    height: 165,
    fields: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'name', type: 'VARCHAR(100)', isReq: true },
      { name: 'specialty', type: 'VARCHAR(80)' },
      { name: 'branch_code', type: 'VARCHAR(20)' },
      { name: 'is_active', type: 'BOOLEAN' }
    ]
  },
  services: {
    id: 'services',
    title: 'clinical_services',
    category: 'CATALOG',
    x: 50,
    y: 260,
    width: 220,
    height: 170,
    fields: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'service_name', type: 'VARCHAR(100)', isReq: true },
      { name: 'duration_min', type: 'SMALLINT' },
      { name: 'base_fee_php', type: 'DECIMAL(10,2)' },
      { name: 'category', type: 'VARCHAR(40)' }
    ]
  },
  audit_logs: {
    id: 'audit_logs',
    title: 'booking_audit_logs',
    category: 'INTEGRITY',
    x: 680,
    y: 260,
    width: 230,
    height: 170,
    fields: [
      { name: 'id', type: 'BIGINT AUTO', isPk: true },
      { name: 'appointment_id', type: 'UUID [FK]', isFk: true, ref: 'appointments' },
      { name: 'actor_action', type: 'VARCHAR(60)' },
      { name: 'actor_ip', type: 'VARCHAR(45)' },
      { name: 'dispatched_at', type: 'TIMESTAMP' }
    ]
  }
};

const RELATIONSHIPS = [
  { from: 'patients', to: 'appointments', fromPort: 'id', toPort: 'patient_id', label: '1 : N' },
  { from: 'dentists', to: 'appointments', fromPort: 'id', toPort: 'dentist_id', label: '1 : N' },
  { from: 'services', to: 'appointments', fromPort: 'id', toPort: 'service_id', label: '1 : N' },
  { from: 'appointments', to: 'audit_logs', fromPort: 'id', toPort: 'appointment_id', label: '1 : N' }
];

export default function SchemaGraph() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [activeNode, setActiveNode] = useState('appointments');
  const [draggedNode, setDraggedNode] = useState(null);
  const [telemetryEvent, setTelemetryEvent] = useState('SCHEMA // READY');

  const containerRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Reset table positions
  const resetLayout = useCallback(() => {
    setNodes(INITIAL_NODES);
    setActiveNode('appointments');
    setTelemetryEvent('SCHEMA // CANONICAL POSITIONS');
  }, []);

  // Pointer drag handling
  const handlePointerDown = (nodeId, e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setDraggedNode(nodeId);
    setActiveNode(nodeId);
    setTelemetryEvent(`DRAGGING // ${nodeId.toUpperCase()}`);
  };

  const handlePointerMove = useCallback((e) => {
    if (!draggedNode || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = 960 / containerRect.width;
    const scaleY = 470 / containerRect.height;

    const rawX = (e.clientX - containerRect.left - dragOffsetRef.current.x) * scaleX;
    const rawY = (e.clientY - containerRect.top - dragOffsetRef.current.y) * scaleY;

    // Boundary constraints
    const boundedX = Math.max(10, Math.min(960 - 240, rawX));
    const boundedY = Math.max(10, Math.min(470 - 180, rawY));

    setNodes((prev) => ({
      ...prev,
      [draggedNode]: {
        ...prev[draggedNode],
        x: Math.round(boundedX),
        y: Math.round(boundedY)
      }
    }));
  }, [draggedNode]);

  const handlePointerUp = useCallback(() => {
    if (draggedNode) {
      setTelemetryEvent(`TABLE: ${draggedNode.toUpperCase()} (x:${nodes[draggedNode]?.x}, y:${nodes[draggedNode]?.y})`);
      setDraggedNode(null);
    }
  }, [draggedNode, nodes]);

  useEffect(() => {
    if (draggedNode) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedNode, handlePointerMove, handlePointerUp]);

  // Calculate dynamic cubic bezier curves between nodes
  const calculatePath = (rel) => {
    const fromNode = nodes[rel.from];
    const toNode = nodes[rel.to];
    if (!fromNode || !toNode) return '';

    let startX = fromNode.x + fromNode.width / 2;
    let startY = fromNode.y + fromNode.height / 2;
    let endX = toNode.x + toNode.width / 2;
    let endY = toNode.y + toNode.height / 2;

    if (fromNode.x + fromNode.width < toNode.x) {
      startX = fromNode.x + fromNode.width;
      endX = toNode.x;
    } else if (toNode.x + toNode.width < fromNode.x) {
      startX = fromNode.x;
      endX = toNode.x + toNode.width;
    }

    const deltaX = Math.abs(endX - startX) * 0.55;
    const cp1x = startX < endX ? startX + deltaX : startX - deltaX;
    const cp2x = startX < endX ? endX - deltaX : endX + deltaX;

    return {
      path: `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`,
      midX: (startX + endX) / 2,
      midY: (startY + endY) / 2
    };
  };

  return (
    <div className="schema-graph-container" ref={containerRef}>
      {/* Schema HUD Header */}
      <div className="schema-hud-bar font-mono">
        <div className="hud-left">
          <Database size={13} className="text-green" />
          <span className="hud-label">SERENE DENTAL // MYSQL 8.0 RELATIONAL ENGINE</span>
          <span className="hud-badge">SPRING PHYSICS ACTIVE</span>
        </div>
        <div className="hud-right">
          <span className="hud-telemetry">{telemetryEvent}</span>
          <button
            type="button"
            className="hud-reset-btn"
            onClick={resetLayout}
            title="Reset table positions"
          >
            <RotateCcw size={12} />
            <span>RESET GRAPH</span>
          </button>
        </div>
      </div>

      {/* Interactive Canvas Surface */}
      <div className="schema-interactive-viewport">
        {/* SVG Cable Overlay */}
        <svg
          className="schema-cables-svg"
          viewBox="0 0 960 470"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
            </linearGradient>
            <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {RELATIONSHIPS.map((rel, idx) => {
            const geom = calculatePath(rel);
            if (!geom) return null;
            const isConnected = activeNode === rel.from || activeNode === rel.to;

            return (
              <g key={idx} className={`cable-group ${isConnected ? 'cable-active' : ''}`}>
                {/* Background Shadow Cable */}
                <path
                  d={geom.path}
                  className="cable-shadow"
                />
                {/* Live Data Pulse Cable */}
                <path
                  d={geom.path}
                  className={`cable-line ${isConnected ? 'highlight' : ''}`}
                />
                {/* Cardinality Badge */}
                <g className="cardinality-badge" transform={`translate(${geom.midX}, ${geom.midY})`}>
                  <rect x="-18" y="-9" width="36" height="18" rx="2" className="cardinality-bg" />
                  <text x="0" y="4" textAnchor="middle" className="cardinality-text font-mono">
                    {rel.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Draggable HTML Database Nodes */}
        <div className="schema-nodes-layer">
          {Object.values(nodes).map((node) => {
            const isFocused = activeNode === node.id;
            const isDraggingThis = draggedNode === node.id;

            return (
              <div
                key={node.id}
                className={`schema-table-card glass-panel bracket-container ${isFocused ? 'focused' : ''} ${isDraggingThis ? 'dragging' : ''}`}
                style={{
                  left: `${(node.x / 960) * 100}%`,
                  top: `${(node.y / 470) * 100}%`,
                  width: `${(node.width / 960) * 100}%`
                }}
                onPointerDown={(e) => handlePointerDown(node.id, e)}
              >
                <div className="corner-bracket tl" />
                <div className="corner-bracket tr" />
                <div className="corner-bracket bl" />
                <div className="corner-bracket br" />

                {/* Table Header */}
                <div className="table-card-header font-mono">
                  <div className="table-header-title">
                    <span className="table-type-dot" />
                    <span className="table-name">{node.title}</span>
                  </div>
                  <span className="table-category-tag">{node.category}</span>
                </div>

                {/* Table Schema Attributes */}
                <div className="table-fields-list font-mono">
                  {node.fields.map((field, fIdx) => (
                    <div
                      key={fIdx}
                      className={`table-field-row ${field.isPk ? 'field-pk' : ''} ${field.isFk ? 'field-fk' : ''}`}
                    >
                      <div className="field-name-wrap">
                        {field.isPk && <span className="field-key-badge pk">PK</span>}
                        {field.isFk && <span className="field-key-badge fk">FK</span>}
                        <span className="field-name">{field.name}</span>
                      </div>
                      <span className="field-type">{field.type}</span>
                    </div>
                  ))}
                </div>

                {/* Drag Hint Footer */}
                <div className="table-card-footer font-mono">
                  <span>DRAG TO RE-TENSION</span>
                  <span className="table-card-coords">({node.x},{node.y})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schema Live Telemetry Footer */}
      <div className="schema-telemetry-footer font-mono">
        <div className="telemetry-pill">
          <Activity size={12} className="text-green" />
          <span>FOREIGN KEY CONSTRAINT: INNODB CASCADE ON UPDATE</span>
        </div>
        <div className="telemetry-pill">
          <ShieldCheck size={12} className="text-green" />
          <span>ATOMIC 4-STEP TRANSACTION GUARANTEE</span>
        </div>
        <div className="telemetry-pill hint-pill">
          <span>TIP: CLICK &amp; DRAG ANY TABLE TO EXPLORE DYNAMIC HARMONIC FORCES</span>
        </div>
      </div>
    </div>
  );
}

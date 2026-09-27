import React, { useState, useEffect } from 'react';
import './ClickSpark.css';

const GLYPHS = ['0', '1', '{', '}', '<', '>', '//', '*', '+', 'SYS'];

export default function ClickSpark() {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleClick = (e) => {
      // Don't fire if clicking interactive inputs to keep typing snappy
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const count = 6;
      const newSparks = [];
      const timestamp = Date.now();

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const distance = 25 + Math.random() * 35;
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const color = Math.random() > 0.4 ? 'var(--accent-green)' : 'var(--accent-cyan)';

        newSparks.push({
          id: `${timestamp}-${i}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          glyph,
          color
        });
      }

      setSparks((prev) => [...prev.slice(-18), ...newSparks]);
    };

    window.addEventListener('pointerdown', handleClick, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleClick);
    };
  }, []);

  // Self-cleaning ticker
  useEffect(() => {
    if (sparks.length === 0) return;
    const timer = setTimeout(() => {
      setSparks((prev) => prev.slice(6));
    }, 550);
    return () => clearTimeout(timer);
  }, [sparks]);

  return (
    <div className="click-sparks-container" aria-hidden="true">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="click-spark-particle font-mono"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            '--dx': `${spark.dx}px`,
            '--dy': `${spark.dy}px`,
            color: spark.color
          }}
        >
          {spark.glyph}
        </span>
      ))}
    </div>
  );
}

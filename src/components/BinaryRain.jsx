import React, { useEffect, useRef } from 'react';
import './BinaryRain.css';

export default function BinaryRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastTime = 0;
    const fpsInterval = 1000 / 24; // 24 FPS for classic cinematic terminal rain
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      // Respect accessibility preference
      return;
    }

    const fontSize = 15;
    const columnSpacing = 20; // Spacious columns matching the visual reference
    let columns = 0;
    let drops = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      columns = Math.floor(window.innerWidth / columnSpacing);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Randomize initial position and stagger start
        drops[i] = Math.floor(Math.random() * -50);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      // Throttle to target FPS (runs at full speed in overdrive)
      const isOverdrive = document.body.classList.contains('overdrive-mode');
      const activeFpsInterval = isOverdrive ? 1000 / 48 : fpsInterval;

      const elapsed = currentTime - lastTime;
      if (elapsed < activeFpsInterval) return;
      lastTime = currentTime - (elapsed % activeFpsInterval);

      // Trailing fade wash
      ctx.fillStyle = isOverdrive ? 'rgba(8, 4, 14, 0.08)' : 'rgba(5, 5, 8, 0.08)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const palette = document.body.dataset.overdrivePalette || 'cyberpunk';
      const cyberGlyphs = ['0', '1', 'Ξ', 'Ψ', 'Ω', '7', 'X', 'Ø', '⚡', '0', '1'];

      for (let i = 0; i < drops.length; i++) {
        const x = i * columnSpacing;
        const y = drops[i] * fontSize;

        if (drops[i] >= 0 && y <= window.innerHeight + fontSize) {
          const text = isOverdrive
            ? cyberGlyphs[Math.floor(Math.random() * cyberGlyphs.length)]
            : (Math.random() > 0.5 ? '1' : '0');

          const isLead = Math.random() > (isOverdrive ? 0.78 : 0.85);

          if (isOverdrive) {
            if (palette === 'cyberpunk') {
              if (isLead) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ff007f';
                ctx.shadowBlur = 8;
              } else {
                ctx.fillStyle = Math.random() > 0.4 ? 'rgba(0, 255, 204, 0.85)' : 'rgba(255, 0, 127, 0.75)';
                ctx.shadowBlur = 2;
                ctx.shadowColor = '#00ffcc';
              }
            } else if (palette === 'matrix') {
              if (isLead) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00ff66';
                ctx.shadowBlur = 10;
              } else {
                ctx.fillStyle = 'rgba(0, 255, 102, 0.85)';
                ctx.shadowBlur = 3;
                ctx.shadowColor = '#00ff66';
              }
            } else if (palette === 'amber') {
              if (isLead) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 8;
              } else {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
                ctx.shadowBlur = 2;
                ctx.shadowColor = '#f59e0b';
              }
            } else {
              // crimson
              if (isLead) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 8;
              } else {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                ctx.shadowBlur = 2;
                ctx.shadowColor = '#b91c1c';
              }
            }
          } else {
            // Standard subtle cyber green
            if (isLead) {
              ctx.fillStyle = 'rgba(187, 247, 208, 0.95)';
              ctx.shadowColor = 'rgba(74, 222, 128, 0.7)';
              ctx.shadowBlur = 6;
            } else {
              ctx.fillStyle = 'rgba(74, 222, 128, 0.55)';
              ctx.shadowBlur = 0;
            }
          }

          ctx.fillText(text, x, y);
        }

        // Reset column when it reaches the bottom
        if (y > window.innerHeight && Math.random() > (isOverdrive ? 0.95 : 0.975)) {
          drops[i] = 0;
        }

        drops[i] += isOverdrive ? 2 : 1;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    // Pause when tab is not visible to conserve battery & GPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="binary-rain-container" aria-hidden="true">
      <canvas ref={canvasRef} className="binary-rain-canvas" />
      <div className="binary-rain-vignette" />
    </div>
  );
}

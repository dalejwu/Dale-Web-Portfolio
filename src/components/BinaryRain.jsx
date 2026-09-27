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

      // Throttle to target FPS
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // Trailing fade wash
      ctx.fillStyle = 'rgba(5, 5, 8, 0.08)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < drops.length; i++) {
        const x = i * columnSpacing;
        const y = drops[i] * fontSize;

        if (drops[i] >= 0 && y <= window.innerHeight + fontSize) {
          // Pure binary characters matching user's reference
          const text = Math.random() > 0.5 ? '1' : '0';

          // Randomized brightness for leading vs trailing code
          const isLead = Math.random() > 0.85;
          if (isLead) {
            ctx.fillStyle = 'rgba(187, 247, 208, 0.95)'; // Bright phosphor lead (#bbf7d0)
            ctx.shadowColor = 'rgba(74, 222, 128, 0.7)';
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.55)'; // Subtle glowing stream (#4ade80)
            ctx.shadowBlur = 0;
          }

          ctx.fillText(text, x, y);
        }

        // Reset column when it reaches the bottom with organic offset
        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
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

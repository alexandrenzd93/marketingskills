'use client';

import { useEffect, useRef } from 'react';

interface Props {
  count?: number;
  className?: string;
}

/** Slow-drifting golden dust motes — pure canvas, no dependencies. */
export default function GoldParticles({ count = 60, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.25 + 0.05),
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.03;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;

        const flicker = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${flicker})`;
        ctx.shadowColor = 'rgba(201, 169, 110, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
    />
  );
}

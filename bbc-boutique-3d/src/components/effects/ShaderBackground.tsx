'use client';

import { motion } from 'framer-motion';

interface Props {
  className?: string;
}

/**
 * Dreamy pastel gradient backdrop with slowly drifting "cloud" blobs — used
 * behind the entry overlay. CSS/Framer only, so it works without WebGL.
 */
export default function ShaderBackground({ className = '' }: Props) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #f6e6ef 0%, #efe2f3 35%, #e8e0f4 65%, #faf3e6 100%)',
      }}
    >
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size,
            borderRadius: '50%',
            background: c.color,
            filter: `blur(${c.blur}px)`,
            mixBlendMode: 'screen',
          }}
          animate={{
            x: [0, c.drift, 0],
            y: [0, -c.drift * 0.5, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Warm gold haze at the bottom (toward the golden gate) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 60% at 50% 110%, rgba(201,169,110,0.45), transparent 60%)',
        }}
      />
    </div>
  );
}

const CLOUDS = [
  { top: '8%', left: '12%', size: 360, color: 'rgba(255,225,240,0.7)', blur: 60, drift: 50, duration: 22 },
  { top: '22%', left: '58%', size: 440, color: 'rgba(228,214,247,0.65)', blur: 80, drift: 70, duration: 28 },
  { top: '48%', left: '30%', size: 520, color: 'rgba(246,230,239,0.6)', blur: 90, drift: 60, duration: 25 },
  { top: '60%', left: '70%', size: 380, color: 'rgba(250,243,230,0.6)', blur: 70, drift: 40, duration: 20 },
];

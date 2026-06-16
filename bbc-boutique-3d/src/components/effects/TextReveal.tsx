'use client';

import { motion } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  /** seconds between each letter */
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Luxury letter-by-letter reveal. Letters slide up and fade in one by one.
 * Gold, uppercase, wide tracking — Bodoni Moda via the `font-display` family.
 */
export default function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as = 'span',
}: Props) {
  const letters = Array.from(text);
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
      }}
      initial="hidden"
      animate="visible"
      aria-label={text}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        hidden: {},
      }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={{
            hidden: { y: '110%', opacity: 0 },
            visible: {
              y: '0%',
              opacity: 1,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
}

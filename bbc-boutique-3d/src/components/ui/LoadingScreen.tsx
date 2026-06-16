'use client';

import { motion, AnimatePresence } from 'framer-motion';
import GoldParticles from '@/components/effects/GoldParticles';

interface Props {
  visible: boolean;
  progress?: number; // 0..100
}

/** Cream loading screen with gold BBC initials and a thin progress bar. */
export default function LoadingScreen({ visible, progress = 0 }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
            <GoldParticles count={40} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: 'var(--font-bodoni), serif',
              color: '#C9A96E',
              fontSize: 72,
              letterSpacing: '0.25em',
              paddingLeft: '0.25em',
            }}
          >
            BBC
          </motion.div>

          <div
            style={{
              fontFamily: 'var(--font-raleway), sans-serif',
              color: '#0a0806',
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              marginTop: 8,
              opacity: 0.6,
            }}
          >
            Bleu Blanc Couture
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginTop: 36,
              width: 220,
              height: 1,
              background: 'rgba(10,8,6,0.12)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{ height: '100%', background: '#C9A96E' }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

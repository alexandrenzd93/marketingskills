'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ShaderBackground from '@/components/effects/ShaderBackground';
import GoldParticles from '@/components/effects/GoldParticles';
import TextReveal from '@/components/effects/TextReveal';

interface Props {
  visible: boolean;
  onEnter: () => void;
}

/** Full-screen entry: dreamy sky, golden gate doors, "Entrer" CTA. */
export default function EntryOverlay({ visible, onEnter }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <ShaderBackground />
          <div style={{ position: 'absolute', inset: 0 }}>
            <GoldParticles count={70} />
          </div>

          {/* Golden gate doors sliding apart slightly on mount */}
          {[-1, 1].map((side) => (
            <motion.div
              key={side}
              initial={{ x: 0 }}
              animate={{ x: side * 60 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 130,
                height: 360,
                transform: 'translate(-50%, -50%)',
                marginLeft: side * 70,
                border: '2px solid rgba(201,169,110,0.7)',
                background:
                  'linear-gradient(180deg, rgba(201,169,110,0.18), rgba(201,169,110,0.04))',
                boxShadow: '0 0 40px rgba(201,169,110,0.4)',
                borderRadius: side < 0 ? '0 0 0 120px' : '0 0 120px 0',
                opacity: 0.5,
              }}
            />
          ))}

          {/* Title + CTA */}
          <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
            <TextReveal
              as="h1"
              text="BLEU BLANC COUTURE"
              delay={0.4}
              className="font-display"
              // inline styles to guarantee look without Tailwind purge surprises
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.9 }}
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                color: '#5a4a38',
                fontSize: 12,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginTop: 18,
              }}
            >
              La Boutique Virtuelle · 4 Créatrices
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              whileHover={{ scale: 1.04, backgroundColor: '#C9A96E', color: '#FAF8F5' }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnter}
              style={{
                marginTop: 42,
                padding: '14px 46px',
                background: 'transparent',
                color: '#0a0806',
                border: '1px solid #C9A96E',
                fontFamily: 'var(--font-raleway), sans-serif',
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Entrer
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2.4, duration: 1 }}
            style={{
              position: 'absolute',
              bottom: 28,
              fontFamily: 'var(--font-raleway), sans-serif',
              color: '#5a4a38',
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Déplacez-vous avec ZQSD / WASD · Cliquez-glissez pour regarder
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

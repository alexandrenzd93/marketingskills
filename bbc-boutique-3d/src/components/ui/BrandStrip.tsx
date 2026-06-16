'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { getBrand, type BrandId } from '@/lib/brands';

interface Props {
  activeBrand: BrandId | null;
}

/** Bottom strip showing the name + description of the wall being viewed. */
export default function BrandStrip({ activeBrand }: Props) {
  const brand = activeBrand ? getBrand(activeBrand) : undefined;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        paddingBottom: 34,
        background: 'linear-gradient(180deg, transparent, rgba(10,8,6,0.55))',
        paddingTop: 60,
      }}
    >
      <AnimatePresence mode="wait">
        {brand && (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-bodoni), serif',
                color: '#C9A96E',
                fontSize: 30,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {brand.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                color: '#FAF8F5',
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: 8,
                opacity: 0.8,
              }}
            >
              {brand.desc}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

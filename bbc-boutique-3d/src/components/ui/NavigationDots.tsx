'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BRANDS, type BrandId } from '@/lib/brands';

interface Props {
  activeBrand: BrandId | null;
  onSelect: (id: BrandId) => void;
}

/** Vertical dots on the right; gold for the active wall, label on hover. */
export default function NavigationDots({ activeBrand, onSelect }: Props) {
  const [hover, setHover] = useState<BrandId | null>(null);

  return (
    <div
      style={{
        position: 'fixed',
        right: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        alignItems: 'flex-end',
      }}
    >
      {BRANDS.map((brand) => {
        const active = brand.id === activeBrand;
        const showLabel = hover === brand.id || active;
        return (
          <div
            key={brand.id}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onMouseEnter={() => setHover(brand.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect(brand.id)}
          >
            <motion.span
              animate={{ opacity: showLabel ? 1 : 0, x: showLabel ? 0 : 8 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                color: active ? '#C9A96E' : '#FAF8F5',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              {brand.name}
            </motion.span>
            <motion.span
              animate={{ scale: active ? 1.4 : 1 }}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: active ? '#C9A96E' : 'transparent',
                border: '1px solid #C9A96E',
                display: 'block',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

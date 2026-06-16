'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Brand } from '@/lib/brands';
import {
  productImage,
  productPrice,
  productUrl,
  type ShopifyProduct,
} from '@/types/boutique';

interface Props {
  product: ShopifyProduct | null;
  brand: Brand | null;
  onClose: () => void;
}

/** Product detail card that slides in on garment click. */
export default function ProductPopup({ product, brand, onClose }: Props) {
  const open = Boolean(product && brand);
  const img = product ? productImage(product) : null;
  const variant = product?.variants?.edges?.[0]?.node;
  const available = variant?.availableForSale ?? true;

  return (
    <AnimatePresence>
      {open && product && brand && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 30,
              background: 'rgba(10,8,6,0.45)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <motion.aside
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              width: 'min(440px, 92vw)',
              background: '#FAF8F5',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              padding: 36,
              overflowY: 'auto',
            }}
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              style={{
                alignSelf: 'flex-end',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 22,
                color: '#0a0806',
                lineHeight: 1,
              }}
            >
              ×
            </button>

            <div
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                color: brand.accentColor,
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {brand.name}
            </div>

            <div
              style={{
                width: '100%',
                aspectRatio: '3 / 4',
                background: '#EDE5D0',
                marginBottom: 24,
                overflow: 'hidden',
              }}
            >
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={img.altText ?? product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-bodoni), serif',
                fontSize: 28,
                color: '#0a0806',
                letterSpacing: '0.04em',
                marginBottom: 10,
              }}
            >
              {product.title}
            </h2>

            <div
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                fontSize: 18,
                color: '#C9A96E',
                marginBottom: 6,
              }}
            >
              {productPrice(product)}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: available ? '#3a7a4a' : '#a14a4a',
                marginBottom: 28,
              }}
            >
              {available ? 'Disponible' : 'Épuisé'}
            </div>

            <a
              href={productUrl(product.handle)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '15px 0',
                background: '#0a0806',
                color: '#FAF8F5',
                fontFamily: 'var(--font-raleway), sans-serif',
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginTop: 'auto',
              }}
            >
              Voir la pièce
            </a>
            <a
              href={brand.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px 0',
                color: '#0a0806',
                fontFamily: 'var(--font-raleway), sans-serif',
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginTop: 10,
                opacity: 0.7,
              }}
            >
              Toute la collection
            </a>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

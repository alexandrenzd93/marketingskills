'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera, AdaptiveDpr, Preload } from '@react-three/drei';
import * as THREE from 'three';
import Room from './Room';
import BrandWall from './BrandWall';
import Lighting from './Lighting';
import CameraControls from './CameraControls';
import { BRANDS, type Brand, type BrandId } from '@/lib/brands';
import { useBrandDetection } from '@/hooks/useBrandDetection';
import type { ProductsByBrand, ShopifyProduct } from '@/types/boutique';

interface Props {
  products: ProductsByBrand;
  onProductClick: (product: ShopifyProduct, brand: Brand) => void;
  onBrandChange?: (id: BrandId) => void;
}

function BrandDetector({ onChange }: { onChange: (id: BrandId) => void }) {
  useBrandDetection(onChange);
  return null;
}

export default function BoutiqueScene({ products, onProductClick, onBrandChange }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#0a0806']} />
      <fog attach="fog" args={['#15100a', 18, 40]} />

      <PerspectiveCamera makeDefault fov={65} position={[0, 1.8, 10]} />
      <CameraControls />
      {onBrandChange && <BrandDetector onChange={onBrandChange} />}

      <Suspense fallback={null}>
        <Lighting />
        <Room />
        {BRANDS.map((brand) => (
          <BrandWall
            key={brand.id}
            brand={brand}
            products={products[brand.id] ?? []}
            onProductClick={onProductClick}
          />
        ))}
        <Preload all />
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

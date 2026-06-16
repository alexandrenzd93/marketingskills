import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { ShopifyProduct } from '@/types/boutique';
import { productImage, productPrice } from '@/types/boutique';

interface Props {
  product: ShopifyProduct | null;
  accentColor: string;
  position: [number, number, number];
  onSelect?: () => void;
}

const GARMENT_W = 1.5;
const GARMENT_H = 2.2;

/** A single piece on a golden rack: hanger, garment, hover lift + price tag. */
export default function ClothingItem({ product, accentColor, position, onSelect }: Props) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const img = product ? productImage(product) : null;

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetY = hovered ? position[1] + 0.12 : position[1];
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 6, delta);
    const targetScale = hovered ? 1.05 : 1;
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, delta);
    group.current.scale.setScalar(s);
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect?.();
  };

  return (
    <group ref={group} position={position}>
      {/* Hanger hook */}
      <mesh position={[0, GARMENT_H / 2 + 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, GARMENT_H / 2 + 0.05, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.03]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Garment */}
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick} castShadow>
        <planeGeometry args={[GARMENT_W, GARMENT_H]} />
        {img ? (
          <Suspense fallback={<meshStandardMaterial color={accentColor} />}>
            <GarmentMaterial url={img.url} highlight={hovered} />
          </Suspense>
        ) : (
          <meshStandardMaterial
            color={accentColor}
            roughness={0.85}
            emissive={accentColor}
            emissiveIntensity={hovered ? 0.25 : 0.05}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Gold frame reveal on hover */}
      <mesh position={[0, 0, -0.01]} visible={hovered}>
        <planeGeometry args={[GARMENT_W + 0.12, GARMENT_H + 0.12]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Price / title tag */}
      {product && (
        <Html position={[0, -GARMENT_H / 2 - 0.25, 0.05]} center distanceFactor={9} occlude>
          <div
            style={{
              opacity: hovered ? 1 : 0.75,
              transform: `translateY(${hovered ? '0' : '4px'})`,
              transition: 'all 0.3s ease',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              fontFamily: 'var(--font-raleway), sans-serif',
              color: '#FAF8F5',
              textShadow: '0 1px 6px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {product.title}
            </div>
            <div style={{ fontSize: 13, color: '#C9A96E', marginTop: 2 }}>
              {productPrice(product)}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GarmentMaterial({ url, highlight }: { url: string; highlight: boolean }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <meshStandardMaterial
      map={texture}
      roughness={0.7}
      emissive="#ffffff"
      emissiveMap={texture}
      emissiveIntensity={highlight ? 0.18 : 0.04}
      side={THREE.DoubleSide}
    />
  );
}

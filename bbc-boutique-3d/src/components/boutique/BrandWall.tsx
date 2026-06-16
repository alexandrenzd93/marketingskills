import { Html } from '@react-three/drei';
import ClothingItem from './ClothingItem';
import type { Brand } from '@/lib/brands';
import type { ShopifyProduct } from '@/types/boutique';

interface Props {
  brand: Brand;
  products: ShopifyProduct[];
  onProductClick: (product: ShopifyProduct, brand: Brand) => void;
}

/** Places the group flush against one of the four room walls, facing inward. */
function wallTransform(wall: Brand['wall']): {
  position: [number, number, number];
  rotationY: number;
} {
  switch (wall) {
    case 'N':
      return { position: [0, 0, -13.7], rotationY: 0 };
    case 'S':
      return { position: [0, 0, 13.7], rotationY: Math.PI };
    case 'E':
      return { position: [13.7, 0, 0], rotationY: -Math.PI / 2 };
    case 'W':
      return { position: [-13.7, 0, 0], rotationY: Math.PI / 2 };
  }
}

const SLOTS = 4;

export default function BrandWall({ brand, products, onProductClick }: Props) {
  const { position, rotationY } = wallTransform(brand.wall);

  // Always show SLOTS pieces — fill gaps with placeholders so the wall is never bare.
  const items: (ShopifyProduct | null)[] = Array.from(
    { length: SLOTS },
    (_, i) => products[i] ?? null,
  );

  const spread = 9; // total width used along the wall
  const step = spread / (SLOTS - 1);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Tinted backdrop panel */}
      <mesh position={[0, 4.2, 0.05]}>
        <planeGeometry args={[10.5, 7.2]} />
        <meshStandardMaterial color={brand.wallColor} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Gold frame around the backdrop */}
      <mesh position={[0, 4.2, 0.04]}>
        <planeGeometry args={[10.9, 7.6]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Golden rack (portant) */}
      <mesh position={[0, 3.1, 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, spread + 1, 16]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.95} roughness={0.2} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * (spread + 1)) / 2, 4.0, 0.55]}>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 12]} />
          <meshStandardMaterial color="#C9A96E" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* Garments */}
      {items.map((product, i) => (
        <ClothingItem
          key={product?.id ?? `placeholder-${i}`}
          product={product}
          accentColor={brand.accentColor}
          position={[-spread / 2 + i * step, 1.95, 0.55]}
          onSelect={product ? () => onProductClick(product, brand) : undefined}
        />
      ))}

      {/* Brand plaque */}
      <Html position={[0, 7.4, 0.1]} center distanceFactor={11} occlude>
        <div
          style={{
            textAlign: 'center',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-bodoni), serif',
              color: '#C9A96E',
              fontSize: 26,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {brand.name}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-raleway), sans-serif',
              color: '#FAF8F5',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginTop: 6,
              opacity: 0.85,
            }}
          >
            {brand.desc}
          </div>
        </div>
      </Html>
    </group>
  );
}

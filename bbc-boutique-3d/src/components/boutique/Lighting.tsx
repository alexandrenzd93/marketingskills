import { BRANDS } from '@/lib/brands';

/** Warm gallery lighting: soft fill + a colored wash per brand wall. */
export default function Lighting() {
  return (
    <group>
      <ambientLight intensity={0.55} color="#fff6e8" />
      <hemisphereLight args={['#fff4e0', '#3a2a18', 0.5]} />

      {/* Central warm chandelier glow */}
      <pointLight position={[0, 8, 0]} intensity={0.9} color="#ffe9c4" distance={40} decay={1.5} />

      {/* Accent spotlight per brand wall */}
      {BRANDS.map((brand) => {
        const pos: [number, number, number] =
          brand.wall === 'N'
            ? [0, 8, -11]
            : brand.wall === 'S'
              ? [0, 8, 11]
              : brand.wall === 'E'
                ? [11, 8, 0]
                : [-11, 8, 0];
        const target: [number, number, number] =
          brand.wall === 'N'
            ? [0, 3, -14]
            : brand.wall === 'S'
              ? [0, 3, 14]
              : brand.wall === 'E'
                ? [14, 3, 0]
                : [-14, 3, 0];
        return <WallSpot key={brand.id} position={pos} target={target} color={brand.accentColor} />;
      })}
    </group>
  );
}

function WallSpot({
  position,
  target,
  color,
}: {
  position: [number, number, number];
  target: [number, number, number];
  color: string;
}) {
  return (
    <>
      <spotLight
        position={position}
        angle={0.7}
        penumbra={0.9}
        intensity={1.4}
        color="#fff2d8"
        distance={28}
        decay={1.2}
        castShadow
      />
      {/* Subtle colored bounce matching the brand accent */}
      <pointLight
        position={[position[0] * 0.8, 4, position[2] * 0.8]}
        intensity={0.35}
        color={color}
        distance={16}
        decay={2}
      />
    </>
  );
}

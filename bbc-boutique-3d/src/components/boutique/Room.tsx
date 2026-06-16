import { useMemo } from 'react';
import { RepeatWrapping } from 'three';
import * as THREE from 'three';

// Procedural marble via canvas texture (runs client-side inside the Canvas).
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#EDE5D0';
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    ctx.moveTo(x, 0);
    for (let y = 0; y < 1024; y += 25) {
      x += (Math.random() - 0.48) * 50;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(200,188,165,${Math.random() * 0.3 + 0.06})`;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(201,169,110,0.18)';
  ctx.lineWidth = 1;
  [256, 512, 768].forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(v, 0);
    ctx.lineTo(v, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, v);
    ctx.lineTo(1024, v);
    ctx.stroke();
  });

  return new THREE.CanvasTexture(canvas);
}

export default function Room() {
  const marbleTex = useMemo(() => {
    const tex = createMarbleTexture();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(5, 5);
    return tex;
  }, []);

  return (
    <group>
      {/* Sol marbre */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshLambertMaterial map={marbleTex} />
      </mesh>

      {/* Plafond */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshLambertMaterial color="#FAFAF6" />
      </mesh>

      {/* Boîte salle (murs intérieurs) */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[28, 10, 28]} />
        <meshLambertMaterial color="#F2ECE0" side={THREE.BackSide} />
      </mesh>

      {/* Parquet central */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.003, (i - 10) * 0.6]}
        >
          <planeGeometry args={[28, 0.55]} />
          <meshLambertMaterial color={i % 2 === 0 ? '#3A2010' : '#2A1608'} />
        </mesh>
      ))}

      <GoldMoldings />

      {[
        [-13.5, -13.5],
        [13.5, -13.5],
        [-13.5, 13.5],
        [13.5, 13.5],
        [-13.5, 0],
        [13.5, 0],
        [0, -13.5],
        [0, 13.5],
      ].map(([x, z], i) => (
        <Column key={i} x={x} z={z} />
      ))}

      <CenterTable />
    </group>
  );
}

function GoldMoldings() {
  return (
    <group>
      {/* Plinthe */}
      {(
        [
          [0, 0.07, -14, 0],
          [0, 0.07, 14, 0],
          [14, 0.07, 0, 1],
          [-14, 0.07, 0, 1],
        ] as const
      ).map(([x, y, z, rot], i) => (
        <mesh key={`p${i}`} position={[x, y, z]} rotation={[0, rot ? Math.PI / 2 : 0, 0]}>
          <boxGeometry args={[28, 0.14, 0.06]} />
          <meshLambertMaterial color="#C9A96E" />
        </mesh>
      ))}

      {/* Corniche haute */}
      {(
        [
          [0, 9.92, -13.92, 0],
          [0, 9.92, 13.92, 0],
          [13.92, 9.92, 0, 1],
          [-13.92, 9.92, 0, 1],
        ] as const
      ).map(([x, y, z, rot], i) => (
        <mesh key={`c${i}`} position={[x, y, z]} rotation={[0, rot ? Math.PI / 2 : 0, 0]}>
          <boxGeometry args={[28, 0.12, 0.08]} />
          <meshLambertMaterial color="#C9A96E" />
        </mesh>
      ))}
    </group>
  );
}

function Column({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.125, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.25, 10]} />
        <meshLambertMaterial color="#F0EAD8" />
      </mesh>
      <mesh position={[0, 4.95, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 9.4, 12]} />
        <meshLambertMaterial color="#F8F2E8" />
      </mesh>
      {[0.28, 9.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.025, 8, 20]} />
          <meshLambertMaterial color="#C9A96E" />
        </mesh>
      ))}
    </group>
  );
}

function CenterTable() {
  return (
    <group>
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[1.0, 0.92, 0.08, 24]} />
        <meshLambertMaterial color="#D8C8A0" />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.76, 8]} />
        <meshLambertMaterial color="#C8B890" />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshLambertMaterial color="#C9A96E" />
      </mesh>
    </group>
  );
}

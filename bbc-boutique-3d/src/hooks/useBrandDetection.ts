import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BRANDS, type BrandId } from '@/lib/brands';

/**
 * Maps a wall side to the outward direction the visitor must be facing to be
 * "in front of" that wall. N = -z, S = +z, E = +x, W = -x.
 */
const WALL_NORMALS: Record<string, THREE.Vector3> = {
  N: new THREE.Vector3(0, 0, -1),
  S: new THREE.Vector3(0, 0, 1),
  E: new THREE.Vector3(1, 0, 0),
  W: new THREE.Vector3(-1, 0, 0),
};

/**
 * Reports which brand wall the visitor is currently facing, based on view
 * direction blended with proximity. Calls `onChange` only when it changes.
 */
export function useBrandDetection(onChange: (id: BrandId) => void) {
  const { camera } = useThree();
  const current = useRef<BrandId | null>(null);
  const dir = new THREE.Vector3();

  useFrame(() => {
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    let best: BrandId = BRANDS[0].id;
    let bestScore = -Infinity;

    for (const brand of BRANDS) {
      const normal = WALL_NORMALS[brand.wall];
      // Facing alignment (dominant signal).
      const facing = dir.dot(normal);
      // Slight proximity bonus toward that wall.
      const toWall = normal.clone().multiplyScalar(14).sub(camera.position);
      const proximity = 1 - Math.min(1, toWall.length() / 28);
      const score = facing * 1.0 + proximity * 0.25;

      if (score > bestScore) {
        bestScore = score;
        best = brand.id;
      }
    }

    if (best !== current.current) {
      current.current = best;
      onChange(best);
    }
  });
}

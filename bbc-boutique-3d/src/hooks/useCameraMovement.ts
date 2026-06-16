import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBrand } from '@/lib/brands';

/**
 * First-person navigation: WASD / arrows to move, click-drag to look.
 * The camera is locked to eye height and clamped inside the room.
 * Also listens for `bbc:flyto` to glide toward a brand wall.
 */
export function useCameraMovement() {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const azimuth = useRef(-Math.PI / 2);
  const elevation = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Fly-to tween state (driven by NavigationDots).
  const flying = useRef(false);
  const flyPos = useRef(new THREE.Vector3());
  const flyAzimuth = useRef(0);

  const SPEED = 0.06;
  const BOUND = 12;

  useEffect(() => {
    const canvas = gl.domElement;

    const onFlyTo = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const brand = getBrand(id);
      if (!brand) return;
      const [x, , z] = brand.cameraPosition;
      flyPos.current.set(x, 1.8, z);
      flyAzimuth.current = brand.startAngle;
      flying.current = true;
    };
    window.addEventListener('bbc:flyto', onFlyTo as EventListener);

    const onKey = (e: KeyboardEvent) => {
      keys.current[e.code] = e.type === 'keydown';
    };
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      azimuth.current -= (e.clientX - lastMouse.current.x) * 0.004;
      elevation.current = Math.max(
        -0.38,
        Math.min(0.38, elevation.current - (e.clientY - lastMouse.current.y) * 0.003),
      );
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };

    // Touch support for mobile look-around.
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const t = e.touches[0];
      azimuth.current -= (t.clientX - lastMouse.current.x) * 0.005;
      elevation.current = Math.max(
        -0.38,
        Math.min(0.38, elevation.current - (t.clientY - lastMouse.current.y) * 0.004),
      );
      lastMouse.current = { x: t.clientX, y: t.clientY };
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      window.removeEventListener('bbc:flyto', onFlyTo as EventListener);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onMouseUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const anyKey =
      keys.current['KeyW'] ||
      keys.current['KeyA'] ||
      keys.current['KeyS'] ||
      keys.current['KeyD'] ||
      keys.current['ArrowUp'] ||
      keys.current['ArrowDown'] ||
      keys.current['ArrowLeft'] ||
      keys.current['ArrowRight'];

    // Manual input or look-drag cancels an in-progress fly.
    if (anyKey || isDragging.current) flying.current = false;

    if (flying.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, flyPos.current.x, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, flyPos.current.z, 4, delta);
      // Shortest-path azimuth interpolation toward the wall's facing angle.
      let diff = flyAzimuth.current - azimuth.current;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      azimuth.current += diff * Math.min(1, delta * 4);
      elevation.current = THREE.MathUtils.damp(elevation.current, 0, 4, delta);
      if (camera.position.distanceTo(flyPos.current) < 0.15 && Math.abs(diff) < 0.02) {
        flying.current = false;
      }
    }

    const fwd = new THREE.Vector3(Math.cos(azimuth.current), 0, Math.sin(azimuth.current));
    const right = new THREE.Vector3(-Math.sin(azimuth.current), 0, Math.cos(azimuth.current));

    if (keys.current['KeyW'] || keys.current['ArrowUp'])
      camera.position.addScaledVector(fwd, SPEED);
    if (keys.current['KeyS'] || keys.current['ArrowDown'])
      camera.position.addScaledVector(fwd, -SPEED);
    if (keys.current['KeyA'] || keys.current['ArrowLeft'])
      camera.position.addScaledVector(right, SPEED);
    if (keys.current['KeyD'] || keys.current['ArrowRight'])
      camera.position.addScaledVector(right, -SPEED);

    camera.position.x = Math.max(-BOUND, Math.min(BOUND, camera.position.x));
    camera.position.z = Math.max(-BOUND, Math.min(BOUND, camera.position.z));
    camera.position.y = 1.8;

    const lookDir = new THREE.Vector3(
      Math.cos(elevation.current) * Math.cos(azimuth.current),
      Math.sin(elevation.current),
      Math.cos(elevation.current) * Math.sin(azimuth.current),
    );
    camera.lookAt(camera.position.clone().add(lookDir.multiplyScalar(10)));
  });

  return { azimuth, elevation };
}

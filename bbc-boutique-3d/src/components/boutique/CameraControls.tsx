import { useCameraMovement } from '@/hooks/useCameraMovement';

/** Drives first-person camera movement; renders nothing. */
export default function CameraControls() {
  useCameraMovement();
  return null;
}

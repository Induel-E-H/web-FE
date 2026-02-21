import { PerspectiveCamera } from 'three';

export function createCamera() {
  const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 10, 0);
  camera.lookAt(0, 0, 0);
  return camera;
}

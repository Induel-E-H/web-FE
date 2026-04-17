import type { PerspectiveCamera, WebGLRenderer } from 'three';

const DEBOUNCE_MS = 100;

export function attachResizeHandler(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  function onResize() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, DEBOUNCE_MS);
  }

  window.addEventListener('resize', onResize);

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', onResize);
  };
}

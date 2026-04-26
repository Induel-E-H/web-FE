import type { PerspectiveCamera, WebGLRenderer } from 'three';

import { RENDER_SCALE } from '../core/createRenderer';

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
      renderer.setSize(
        Math.round(window.innerWidth * RENDER_SCALE),
        Math.round(window.innerHeight * RENDER_SCALE),
        false,
      );
    }, DEBOUNCE_MS);
  }

  window.addEventListener('resize', onResize);

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', onResize);
  };
}

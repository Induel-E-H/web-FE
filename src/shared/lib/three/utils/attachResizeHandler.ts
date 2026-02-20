import * as Three from 'three';

export function attachResizeHandler(
  camera: Three.PerspectiveCamera,
  renderer: Three.WebGLRenderer,
) {
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);

  return () => window.removeEventListener('resize', onResize);
}

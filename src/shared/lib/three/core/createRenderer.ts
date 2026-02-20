import * as Three from 'three';

export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new Three.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}

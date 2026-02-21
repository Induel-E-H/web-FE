import { WebGLRenderer } from 'three';

export function createRenderer(canvas: HTMLCanvasElement) {
  const isMobile = window.innerWidth < 768;
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: !isMobile && pixelRatio <= 1,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
    depth: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(pixelRatio);

  return renderer;
}

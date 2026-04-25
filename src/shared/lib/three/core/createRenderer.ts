import { BREAKPOINT_MOBILE_MAX } from '@shared/lib/breakpoint/useBreakpoint';
import { WebGLRenderer } from 'three';

const RENDER_SCALE = 0.5;

export function createRenderer(canvas: HTMLCanvasElement) {
  const isMobile = window.innerWidth <= BREAKPOINT_MOBILE_MAX;
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: !isMobile && pixelRatio <= 1,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
    depth: true,
  });

  renderer.setSize(
    Math.round(window.innerWidth * RENDER_SCALE),
    Math.round(window.innerHeight * RENDER_SCALE),
    false,
  );
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));

  return renderer;
}

export { RENDER_SCALE };

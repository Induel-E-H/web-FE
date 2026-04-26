import { useEffect, useRef } from 'react';

import {
  attachResizeHandler,
  createCamera,
  createLights,
  createRenderer,
  createScene,
  createWaveTubes,
  startWaveAnimation,
} from '@shared/lib/three';

export function useWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelAnimation: (() => void) | undefined;
    let removeResizeListener: (() => void) | undefined;
    let renderer: ReturnType<typeof createRenderer> | undefined;

    try {
      const scene = createScene();
      const camera = createCamera();
      renderer = createRenderer(canvas);

      createLights(scene);

      const { group, tubes } = createWaveTubes();
      scene.add(group);

      cancelAnimation = startWaveAnimation(renderer, scene, camera, tubes);
      removeResizeListener = attachResizeHandler(camera, renderer);
    } catch {
      return;
    }

    return () => {
      cancelAnimation?.();
      removeResizeListener?.();
      renderer?.dispose();
    };
  }, []);

  return canvasRef;
}

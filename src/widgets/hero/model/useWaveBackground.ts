import { useEffect, useRef, useState } from 'react';

import {
  attachResizeHandler,
  createCamera,
  createLights,
  createRenderer,
  createScene,
  createWaveTubes,
  isWebGL2Supported,
  startWaveAnimation,
} from '@shared/lib/three';

export function useWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported] = useState(isWebGL2Supported);

  useEffect(() => {
    if (!webglSupported) return;

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
  }, [webglSupported]);

  return { canvasRef, webglSupported };
}

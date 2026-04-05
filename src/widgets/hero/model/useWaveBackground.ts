import { useEffect, useRef } from 'react';

import { startWaveAnimation } from '@shared/lib/three/animation/waveAnimation';
import { createCamera } from '@shared/lib/three/core/createCamera';
import { createLights } from '@shared/lib/three/core/createLights';
import { createRenderer } from '@shared/lib/three/core/createRenderer';
import { createScene } from '@shared/lib/three/core/createScene';
import { createWaveTubes } from '@shared/lib/three/objects/createWaveTubes';
import { attachResizeHandler } from '@shared/lib/three/utils/attachResizeHandler';

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

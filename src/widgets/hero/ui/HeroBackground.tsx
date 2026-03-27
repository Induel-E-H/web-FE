import { useEffect, useRef } from 'react';

import { startWaveAnimation } from '@shared/lib/three/animation/waveAnimation';
import { createCamera } from '@shared/lib/three/core/createCamera';
import { createLights } from '@shared/lib/three/core/createLights';
import { createRenderer } from '@shared/lib/three/core/createRenderer';
import { createScene } from '@shared/lib/three/core/createScene';
import { createWaveTubes } from '@shared/lib/three/objects/createWaveTubes';
import { attachResizeHandler } from '@shared/lib/three/utils/attachResizeHandler';

function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stopAnimation: (() => void) | undefined;
    let detachResize: (() => void) | undefined;
    let renderer: ReturnType<typeof createRenderer> | undefined;

    try {
      const scene = createScene();
      const camera = createCamera();
      renderer = createRenderer(canvas);

      createLights(scene);

      const { group, tubes } = createWaveTubes(scene);
      scene.add(group);

      stopAnimation = startWaveAnimation(renderer, scene, camera, tubes);
      detachResize = attachResizeHandler(camera, renderer);
    } catch {
      return;
    }

    return () => {
      stopAnimation?.();
      detachResize?.();
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='hero__background' aria-hidden='true' />
  );
}

export default HeroBackground;

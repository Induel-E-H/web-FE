import { Camera, Clock, Scene, WebGLRenderer } from 'three';

import type { TubeData } from '../objects/type';

export function startWaveAnimation(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  tubes: TubeData[],
) {
  const WAVE_AMP = 0.6;
  const WAVE_FREQ = 0.4;
  const WAVE_SPEED = 0.3;

  const isMobile = window.innerWidth < 768;
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

  const clock = new Clock();
  let rafId: number;
  let lastFrameTime = 0;

  function animate(currentTime: number) {
    rafId = requestAnimationFrame(animate);

    const deltaTime = currentTime - lastFrameTime;
    if (deltaTime < frameInterval) return;

    lastFrameTime = currentTime - (deltaTime % frameInterval);

    const time = clock.getElapsedTime();

    for (const { posAttr, baseY, geo } of tubes) {
      const count = posAttr.count;
      for (let i = 0; i < count; i++) {
        const z = posAttr.getZ(i);
        posAttr.setY(
          i,
          baseY[i] + Math.sin(z * WAVE_FREQ + time * WAVE_SPEED) * WAVE_AMP,
        );
      }
      posAttr.needsUpdate = true;

      geo.computeVertexNormals();
    }

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(rafId);
}

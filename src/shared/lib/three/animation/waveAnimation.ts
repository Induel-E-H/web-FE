import * as Three from 'three';

import type { TubeData } from '../objects/type';

export function startWaveAnimation(
  renderer: Three.WebGLRenderer,
  scene: Three.Scene,
  camera: Three.Camera,
  tubes: TubeData[],
) {
  const WAVE_AMP = 0.6;
  const WAVE_FREQ = 0.4;
  const WAVE_SPEED = 0.3;

  const clock = new Three.Clock();
  let rafId: number;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    for (const { posAttr, baseY, geo } of tubes) {
      for (let i = 0; i < posAttr.count; i++) {
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

  animate();

  return () => cancelAnimationFrame(rafId);
}

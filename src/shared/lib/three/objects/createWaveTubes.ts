import * as Three from 'three';

import type { TubeData } from './type';

export function createWaveTubes(scene: Three.Scene): {
  group: Three.Group;
  tubes: TubeData[];
} {
  const TUBE_COUNT = 30;
  const TUBE_RADIUS = 1;
  const TUBE_LENGTH = 24;
  const TUBE_RAD_SEGS = 16;
  const TUBE_HEIGHT_SEGS = 120;
  const TUBE_SPACING = 0.7;

  const group = new Three.Group();
  group.rotation.y = -Math.PI / 4;
  scene.add(group);

  const tubes: TubeData[] = [];
  for (let i = 0; i < TUBE_COUNT; i++) {
    const color = new Three.Color(0x000000);
    const geometry = new Three.CylinderGeometry(
      TUBE_RADIUS,
      TUBE_RADIUS,
      TUBE_LENGTH,
      TUBE_RAD_SEGS,
      TUBE_HEIGHT_SEGS,
      true,
    );
    geometry.rotateX(Math.PI / 2);
    const posAttr = geometry.attributes.position as Three.BufferAttribute;
    const baseY = new Float32Array(posAttr.count);
    for (let j = 0; j < posAttr.count; j++) {
      baseY[j] = posAttr.getY(j);
    }
    const material = new Three.MeshStandardMaterial({
      color,
      roughness: 0.35,
      metalness: 0.05,
      // wireframe: true,
    });
    const mesh = new Three.Mesh(geometry, material);
    mesh.position.set((i - (TUBE_COUNT - 1) / 2) * TUBE_SPACING, 0, -i * 0.18);
    group.add(mesh);
    tubes.push({ posAttr, baseY, geo: geometry });
  }

  return { group, tubes };
}

import {
  BufferAttribute,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Scene,
} from 'three';

import type { TubeData } from './type';

export function createWaveTubes(scene: Scene): {
  group: Group;
  tubes: TubeData[];
} {
  const isMobile = window.innerWidth < 768;

  const TUBE_COUNT = isMobile ? 20 : 30;
  const TUBE_RADIUS = 2;
  const TUBE_LENGTH = 24;
  const TUBE_RAD_SEGS = isMobile ? 8 : 12;
  const TUBE_HEIGHT_SEGS = isMobile ? 60 : 80;
  const TUBE_SPACING = isMobile ? 1.05 : 0.7;

  const group = new Group();
  group.rotation.y = -Math.PI / 4;
  scene.add(group);

  const color = new Color(0x000000);
  const sharedMaterial = new MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.05,
  });

  const tubes: TubeData[] = [];
  for (let i = 0; i < TUBE_COUNT; i++) {
    const geometry = new CylinderGeometry(
      TUBE_RADIUS,
      TUBE_RADIUS,
      TUBE_LENGTH,
      TUBE_RAD_SEGS,
      TUBE_HEIGHT_SEGS,
      true,
    );
    geometry.rotateX(Math.PI / 2);

    const posAttr = geometry.attributes.position as BufferAttribute;
    const baseY = new Float32Array(posAttr.count);
    for (let j = 0; j < posAttr.count; j++) {
      baseY[j] = posAttr.getY(j);
    }

    const mesh = new Mesh(geometry, sharedMaterial);
    mesh.position.set((i - (TUBE_COUNT - 1) / 2) * TUBE_SPACING, 0, -i * 0.18);
    mesh.frustumCulled = false;
    group.add(mesh);
    tubes.push({ posAttr, baseY, geo: geometry });
  }

  return { group, tubes };
}

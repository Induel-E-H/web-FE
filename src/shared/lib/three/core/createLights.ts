import * as Three from 'three';

export function createLights(scene: Three.Scene) {
  scene.add(new Three.AmbientLight(0xffffff, 0.08));

  const light1 = new Three.DirectionalLight(0xffffff, 3.0);
  light1.position.set(3, 10, 5);
  scene.add(light1);

  const light2 = new Three.DirectionalLight(0xffffff, 0.4);
  light2.position.set(-5, 3, -5);
  scene.add(light2);
}

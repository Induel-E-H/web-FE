import { AmbientLight, DirectionalLight, Scene } from 'three';

export function createLights(scene: Scene) {
  scene.add(new AmbientLight(0xffffff, 0.08));

  const light1 = new DirectionalLight(0xffffff, 1.5);
  light1.position.set(3, 10, 5);
  scene.add(light1);

  const light2 = new DirectionalLight(0xffffff, 0.1);
  light2.position.set(-5, 3, -5);
  scene.add(light2);
}

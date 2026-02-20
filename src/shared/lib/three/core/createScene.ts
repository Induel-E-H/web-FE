import * as Three from 'three';

export function createScene() {
  const scene = new Three.Scene();
  scene.background = new Three.Color(0x000000);
  return scene;
}

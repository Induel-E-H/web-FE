import type { BufferAttribute, BufferGeometry } from 'three';

export type TubeData = {
  posAttr: BufferAttribute;
  baseY: Float32Array;
  geo: BufferGeometry;
};

import { describe, expect, it } from 'vitest';

import { getAllContentImages, getThumbnailImage } from './contentImages';

// Vitest는 실제 파일 시스템의 .webp 파일을 import.meta.glob으로 수집한다.

describe('getThumbnailImage', () => {
  it('유효한 인덱스에 대해 string 경로를 반환한다', () => {
    const result = getThumbnailImage(0);
    expect(typeof result).toBe('string');
    expect(result).toMatch(/\.webp$/);
  });

  it('유효한 인덱스 경로에 해당 인덱스가 포함된다', () => {
    const result = getThumbnailImage(0);
    expect(result).toContain('/0/0.webp');
  });

  it('존재하지 않는 인덱스는 undefined를 반환한다', () => {
    expect(getThumbnailImage(999)).toBeUndefined();
  });

  it('음수 인덱스는 undefined를 반환한다', () => {
    expect(getThumbnailImage(-1)).toBeUndefined();
  });
});

describe('getAllContentImages', () => {
  it('Promise<string[]>를 반환한다', async () => {
    await expect(getAllContentImages(0)).resolves.toBeInstanceOf(Array);
  });

  it('유효한 인덱스에서 하나 이상의 이미지를 반환한다', async () => {
    const result = await getAllContentImages(0);
    expect(result.length).toBeGreaterThan(0);
  });

  it('반환된 모든 항목이 string이다', async () => {
    const result = await getAllContentImages(0);
    result.forEach((item) => expect(typeof item).toBe('string'));
  });

  it('존재하지 않는 인덱스는 빈 배열을 반환한다', async () => {
    await expect(getAllContentImages(999)).resolves.toEqual([]);
  });

  it('음수 인덱스는 빈 배열을 반환한다', async () => {
    await expect(getAllContentImages(-1)).resolves.toEqual([]);
  });
});

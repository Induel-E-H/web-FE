import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { getPatentImage } from './patentImages';

describe('getPatentImage', () => {
  let warnSpy: MockInstance;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('유효한 id(0~4)에 대해 string을 반환한다', () => {
    for (let i = 0; i < 5; i++) {
      expect(typeof getPatentImage(i)).toBe('string');
    }
  });

  it('범위 밖 id에 대해 빈 문자열을 반환하고 console.warn을 호출한다', () => {
    expect(getPatentImage(99)).toBe('');
    expect(warnSpy).toHaveBeenCalledWith('[patent] image not found for id: 99');
  });
});

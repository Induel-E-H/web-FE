import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAwardImage } from './image';

describe('getAwardImage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('유효한 id(0~9)에 대해 비어있지 않은 문자열을 반환한다', () => {
    for (let id = 0; id <= 9; id++) {
      const result = getAwardImage(id);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('존재하지 않는 id에 대해 빈 문자열을 반환한다', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = getAwardImage(999);

    expect(result).toBe('');
    warnSpy.mockRestore();
  });

  it('존재하지 않는 id에 대해 console.warn이 호출된다', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    getAwardImage(999);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('999'));
    warnSpy.mockRestore();
  });
});

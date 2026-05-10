import { preloadImages } from '@shared/lib/preload/preloadImages';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getArtworkIndex, preloadContentImages } from './helpers';

vi.mock('@entities/history', () => ({
  artworks: Array.from({ length: 10 }),
  getThumbnailImage: (idx: number) => `thumb-${idx}.webp`,
}));

vi.mock('@shared/lib/preload/preloadImages', () => ({
  preloadImages: vi.fn(),
}));

describe('getArtworkIndex', () => {
  it('pageIndex n, left 사이드 → n*2를 반환한다', () => {
    for (let n = 0; n <= 10; n++) {
      expect(getArtworkIndex(n, 'left')).toBe(n * 2);
    }
  });

  it('pageIndex n, right 사이드 → n*2+1을 반환한다', () => {
    for (let n = 0; n <= 10; n++) {
      expect(getArtworkIndex(n, 'right')).toBe(n * 2 + 1);
    }
  });

  it('left 사이드 인덱스는 항상 짝수이다', () => {
    for (let n = 0; n <= 5; n++) {
      expect(getArtworkIndex(n, 'left') % 2).toBe(0);
    }
  });

  it('right 사이드 인덱스는 항상 홀수이다', () => {
    for (let n = 0; n <= 5; n++) {
      expect(getArtworkIndex(n, 'right') % 2).toBe(1);
    }
  });

  it('같은 pageIndex에서 right 인덱스는 left 인덱스보다 1 크다', () => {
    for (let n = 0; n <= 5; n++) {
      expect(getArtworkIndex(n, 'right') - getArtworkIndex(n, 'left')).toBe(1);
    }
  });
});

describe('preloadContentImages', () => {
  beforeEach(() => {
    vi.mocked(preloadImages).mockClear();
  });

  it('pageIndex=2이면 인접 페이지(1, 3)의 4개 이미지 URL을 preload한다', () => {
    preloadContentImages(2);
    expect(vi.mocked(preloadImages)).toHaveBeenCalledOnce();
    const arg = vi.mocked(preloadImages).mock.calls[0][0];
    // adjacent: pageIndex 3 → idx 6, 7 / pageIndex 1 → idx 2, 3
    expect(arg).toHaveLength(4);
    expect(arg).toContain('thumb-6.webp');
    expect(arg).toContain('thumb-7.webp');
    expect(arg).toContain('thumb-2.webp');
    expect(arg).toContain('thumb-3.webp');
  });

  it('pageIndex=0이면 음수 인덱스가 필터링되어 2개만 preload한다', () => {
    preloadContentImages(0);
    const arg = vi.mocked(preloadImages).mock.calls[0][0];
    // pageIndex 1 → idx 2, 3 (kept) / pageIndex -1 → idx -2, -1 (filtered)
    expect(arg).toHaveLength(2);
    expect(arg).toContain('thumb-2.webp');
    expect(arg).toContain('thumb-3.webp');
  });

  it('artworks 범위를 초과하는 인덱스는 필터링된다 (artworks.length=10)', () => {
    preloadContentImages(4);
    const arg = vi.mocked(preloadImages).mock.calls[0][0];
    // pageIndex 5 → idx 10, 11 (filtered, >= 10) / pageIndex 3 → idx 6, 7 (kept)
    expect(arg).toHaveLength(2);
    expect(arg).toContain('thumb-6.webp');
    expect(arg).toContain('thumb-7.webp');
  });

  it('모든 인접 인덱스가 범위를 벗어나면 빈 배열로 preload한다', () => {
    // pageIndex such that all adjacents are out of [0, 10)
    // pageIndex 100: adj = 202, 203, 198, 199 → all >= 10, filtered
    preloadContentImages(100);
    const arg = vi.mocked(preloadImages).mock.calls[0][0];
    expect(arg).toHaveLength(0);
  });
});

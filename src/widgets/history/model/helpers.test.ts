import { describe, expect, it } from 'vitest';

import { getArtworkIndex } from './helpers';

// import.meta.glob 의존성을 가진 함수들(getThumbnailImage, getAllContentImages, preloadContentImages)은
// Vite 런타임 기능에 의존하므로 getArtworkIndex 순수 함수만 단위 테스트한다.

describe('getArtworkIndex', () => {
  it('pageIndex 0, left 사이드 → 0을 반환한다', () => {
    expect(getArtworkIndex(0, 'left')).toBe(0);
  });

  it('pageIndex 0, right 사이드 → 1을 반환한다', () => {
    expect(getArtworkIndex(0, 'right')).toBe(1);
  });

  it('pageIndex 1, left 사이드 → 2를 반환한다', () => {
    expect(getArtworkIndex(1, 'left')).toBe(2);
  });

  it('pageIndex 1, right 사이드 → 3을 반환한다', () => {
    expect(getArtworkIndex(1, 'right')).toBe(3);
  });

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

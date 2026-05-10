import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { preloadImages } from './preloadImages';

describe('preloadImages', () => {
  const createdImages: { src: string }[] = [];

  beforeEach(() => {
    createdImages.length = 0;
    vi.stubGlobal(
      'Image',
      class {
        src = '';
        constructor() {
          createdImages.push(this);
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('유효한 URL 처리', () => {
    it('유효한 URL에 대해 Image가 생성되고 src가 설정된다', () => {
      // 모듈 레벨 Set 누수를 피하기 위해 고유 URL 사용
      const url = `https://example.com/image-${Date.now()}-a.webp`;
      preloadImages([url]);

      expect(createdImages).toHaveLength(1);
      expect(createdImages[0].src).toBe(url);
    });

    it('여러 유효한 URL이 모두 로드된다', () => {
      const ts = Date.now();
      const urls = [
        `https://example.com/img-${ts}-b1.webp`,
        `https://example.com/img-${ts}-b2.webp`,
        `https://example.com/img-${ts}-b3.webp`,
      ];
      preloadImages(urls);

      expect(createdImages).toHaveLength(3);
    });
  });

  describe('undefined URL 처리', () => {
    it('undefined URL은 건너뛰고 Image를 생성하지 않는다', () => {
      preloadImages([undefined, undefined]);
      expect(createdImages).toHaveLength(0);
    });

    it('유효한 URL과 undefined가 혼재할 때 유효한 URL만 처리된다', () => {
      const url = `https://example.com/image-${Date.now()}-c.webp`;
      preloadImages([undefined, url, undefined]);

      expect(createdImages).toHaveLength(1);
      expect(createdImages[0].src).toBe(url);
    });
  });

  describe('중복 URL 처리', () => {
    it('동일한 URL을 두 번 호출해도 Image가 한 번만 생성된다', () => {
      const url = `https://example.com/image-${Date.now()}-d.webp`;
      preloadImages([url]);
      preloadImages([url]);

      expect(createdImages).toHaveLength(1);
    });

    it('같은 배열 내 중복 URL도 한 번만 처리된다', () => {
      const url = `https://example.com/image-${Date.now()}-e.webp`;
      preloadImages([url, url]);

      expect(createdImages).toHaveLength(1);
    });
  });

  describe('빈 배열', () => {
    it('빈 배열을 전달하면 Image가 생성되지 않는다', () => {
      preloadImages([]);
      expect(createdImages).toHaveLength(0);
    });
  });
});

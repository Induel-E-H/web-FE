import { describe, expect, it } from 'vitest';

import { VISION_DATA } from './VisionData';

describe('VISION_DATA', () => {
  describe('구조', () => {
    it('각 항목은 title, description, keyword, image 필드를 가진다', () => {
      VISION_DATA.forEach((item) => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('keyword');
        expect(item).toHaveProperty('image');
      });
    });

    it('모든 항목의 description이 빈 문자열이 아니다', () => {
      VISION_DATA.forEach((item) => {
        expect(item.description.trim()).not.toBe('');
      });
    });
  });
});

import { describe, expect, it } from 'vitest';

import { VISION_DATA } from './VisionData';

describe('VISION_DATA', () => {
  describe('구조', () => {
    it('3개의 항목을 포함한다', () => {
      expect(VISION_DATA).toHaveLength(3);
    });

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

  describe('항목 값', () => {
    it('첫 번째 항목은 Parametric Design이다', () => {
      expect(VISION_DATA[0].title).toBe('Parametric Design');
      expect(VISION_DATA[0].keyword).toBe('Param');
      expect(VISION_DATA[0].image).toBe('vision_param.webp');
    });

    it('두 번째 항목은 Urban Sculpting이다', () => {
      expect(VISION_DATA[1].title).toBe('Urban Sculpting');
      expect(VISION_DATA[1].keyword).toBe('Sculpt');
      expect(VISION_DATA[1].image).toBe('vision_sculpt.webp');
    });

    it('세 번째 항목은 Engineering Investment이다', () => {
      expect(VISION_DATA[2].title).toBe('Engineering Investment');
      expect(VISION_DATA[2].keyword).toBe('Invest');
      expect(VISION_DATA[2].image).toBe('vision_invest.webp');
    });
  });
});

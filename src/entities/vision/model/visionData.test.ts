import { describe, expect, it } from 'vitest';

import { VISION_DATA } from './visionData';

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

    it('데이터 항목이 3개다', () => {
      expect(VISION_DATA).toHaveLength(3);
    });

    it('keyword 값이 Param, Sculpt, Invest 순서로 존재한다', () => {
      expect(VISION_DATA.map((item) => item.keyword)).toEqual([
        'Param',
        'Sculpt',
        'Invest',
      ]);
    });

    it('모든 항목의 image 파일명이 .webp 확장자를 가진다', () => {
      VISION_DATA.forEach((item) => {
        expect(item.image).toMatch(/\.webp$/);
      });
    });
  });
});

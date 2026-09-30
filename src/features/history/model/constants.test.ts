import { describe, expect, it } from 'vitest';

import {
  FLIP_DURATION,
  INDEX_LIST,
  PAGE_SIDE,
  RAPID_FLIP_DURATION,
} from './constants';

describe('constants', () => {
  describe('INDEX_LIST', () => {
    it('4개 항목을 포함한다', () => {
      expect(INDEX_LIST).toHaveLength(4);
    });

    it('순서가 [List, Content, Timeline, Milestones]이다', () => {
      expect(INDEX_LIST[0]).toBe('List');
      expect(INDEX_LIST[1]).toBe('Content');
      expect(INDEX_LIST[2]).toBe('Timeline');
      expect(INDEX_LIST[3]).toBe('Milestones');
    });
  });

  describe('PAGE_SIDE', () => {
    it('LEFT는 "left"이다', () => {
      expect(PAGE_SIDE.LEFT).toBe('left');
    });

    it('RIGHT는 "right"이다', () => {
      expect(PAGE_SIDE.RIGHT).toBe('right');
    });
  });

  describe('타이밍 상수', () => {
    it('FLIP_DURATION은 800이다', () => {
      expect(FLIP_DURATION).toBe(800);
    });

    it('RAPID_FLIP_DURATION은 300이다', () => {
      expect(RAPID_FLIP_DURATION).toBe(300);
    });

    it('RAPID_FLIP_DURATION이 FLIP_DURATION보다 작다', () => {
      expect(RAPID_FLIP_DURATION).toBeLessThan(FLIP_DURATION);
    });
  });
});

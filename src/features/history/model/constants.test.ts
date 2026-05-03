import { describe, expect, it } from 'vitest';

import {
  BOOK_STATE,
  FLIP_DURATION,
  INDEX_LIST,
  MAX_SOURCE_PAGE_FLIPS,
  PAGE_SIDE,
  PASS_THROUGH_FLIP_DURATION,
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

    it('PASS_THROUGH_FLIP_DURATION은 150이다', () => {
      expect(PASS_THROUGH_FLIP_DURATION).toBe(150);
    });

    it('MAX_SOURCE_PAGE_FLIPS는 3이다', () => {
      expect(MAX_SOURCE_PAGE_FLIPS).toBe(3);
    });

    it('RAPID_FLIP_DURATION이 FLIP_DURATION보다 작다', () => {
      expect(RAPID_FLIP_DURATION).toBeLessThan(FLIP_DURATION);
    });

    it('PASS_THROUGH_FLIP_DURATION이 RAPID_FLIP_DURATION보다 작다', () => {
      expect(PASS_THROUGH_FLIP_DURATION).toBeLessThan(RAPID_FLIP_DURATION);
    });
  });

  describe('BOOK_STATE', () => {
    it('7개의 키를 가진다', () => {
      expect(Object.keys(BOOK_STATE)).toHaveLength(7);
    });

    it('모든 값이 문자열이다', () => {
      Object.values(BOOK_STATE).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('모든 값이 유일하다', () => {
      const values = Object.values(BOOK_STATE);
      expect(new Set(values).size).toBe(values.length);
    });

    it('각 상태 값이 올바르다', () => {
      expect(BOOK_STATE.COVER_FRONT).toBe('cover-front');
      expect(BOOK_STATE.OPENING_FRONT).toBe('opening-front');
      expect(BOOK_STATE.OPEN).toBe('open');
      expect(BOOK_STATE.CLOSING_FRONT).toBe('closing-front');
      expect(BOOK_STATE.COVER_BACK).toBe('cover-back');
      expect(BOOK_STATE.OPENING_BACK).toBe('opening-back');
      expect(BOOK_STATE.CLOSING_BACK).toBe('closing-back');
    });
  });
});

import { describe, expect, it } from 'vitest';

import { AWARD_HISTORY_LIST } from './awardHistoryData';

describe('AWARD_HISTORY_LIST', () => {
  it('하나 이상의 항목이 존재한다', () => {
    expect(AWARD_HISTORY_LIST.length).toBeGreaterThan(0);
  });

  it('year는 회사 창립(2000년) 이후 값이다', () => {
    AWARD_HISTORY_LIST.forEach((item) => {
      expect(item.year).toBeGreaterThanOrEqual(2000);
    });
  });

  it('year가 오름차순으로 정렬되어 있다', () => {
    for (let i = 1; i < AWARD_HISTORY_LIST.length; i++) {
      expect(AWARD_HISTORY_LIST[i].year).toBeGreaterThanOrEqual(
        AWARD_HISTORY_LIST[i - 1].year,
      );
    }
  });

  it('각 항목의 contents에 하나 이상의 내용이 있다', () => {
    AWARD_HISTORY_LIST.forEach((item) => {
      expect(item.contents.length).toBeGreaterThan(0);
      item.contents.forEach((c) => {
        expect(typeof c).toBe('string');
        expect(c.length).toBeGreaterThan(0);
      });
    });
  });

  it('year 값이 중복되지 않는다', () => {
    const years = AWARD_HISTORY_LIST.map((a) => a.year);
    expect(new Set(years).size).toBe(AWARD_HISTORY_LIST.length);
  });
});

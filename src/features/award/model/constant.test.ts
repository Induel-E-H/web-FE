import { AWARD_LIST } from '@entities/award';
import { describe, expect, it } from 'vitest';

import { YEAR_LIST } from './constant';

describe('YEAR_LIST', () => {
  it('첫 번째 항목이 "전체"이다', () => {
    expect(YEAR_LIST[0]).toBe('전체');
  });

  it('AWARD_LIST의 모든 연도를 포함한다', () => {
    const expectedYears = [
      ...new Set(AWARD_LIST.map((a) => Number(a.date.slice(0, 4)))),
    ];
    expectedYears.forEach((year) => {
      expect(YEAR_LIST).toContain(year);
    });
  });

  it('연도가 내림차순으로 정렬되어 있다', () => {
    const years = YEAR_LIST.slice(1) as number[];
    for (let i = 0; i < years.length - 1; i++) {
      expect(years[i]).toBeGreaterThanOrEqual(years[i + 1]);
    }
  });

  it('중복 연도가 없다', () => {
    const years = YEAR_LIST.slice(1);
    expect(new Set(years).size).toBe(years.length);
  });
});

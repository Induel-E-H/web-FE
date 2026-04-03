import { describe, expect, it } from 'vitest';

import { TIMELINE_LIST } from './timelineData';

describe('TIMELINE_LIST', () => {
  it('하나 이상의 항목이 존재한다', () => {
    expect(TIMELINE_LIST.length).toBeGreaterThan(0);
  });

  it('모든 항목에 date와 name이 비어있지 않은 문자열로 존재한다', () => {
    TIMELINE_LIST.forEach((item) => {
      expect(typeof item.date).toBe('string');
      expect(item.date.length).toBeGreaterThan(0);
      expect(typeof item.name).toBe('string');
      expect(item.name.length).toBeGreaterThan(0);
    });
  });

  it('date는 YYYY.MM.DD 형식이다', () => {
    const datePattern = /^\d{4}\.\d{2}\.\d{2}$/;
    TIMELINE_LIST.forEach((item) => {
      expect(item.date).toMatch(datePattern);
    });
  });

  it('date가 오름차순으로 정렬되어 있다', () => {
    for (let i = 1; i < TIMELINE_LIST.length; i++) {
      expect(TIMELINE_LIST[i].date >= TIMELINE_LIST[i - 1].date).toBe(true);
    }
  });

  it('회사 창립일(2000.04.27)이 첫 번째 항목이다', () => {
    expect(TIMELINE_LIST[0].date).toBe('2000.04.27');
  });
});

import { describe, expect, it } from 'vitest';

import { TRANSPORT_ITEMS } from './transportInfo';

describe('TRANSPORT_ITEMS', () => {
  it('각 항목에 고유한 id가 있다', () => {
    const ids = TRANSPORT_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('모든 항목에 Icon 컴포넌트가 함수로 존재한다', () => {
    TRANSPORT_ITEMS.forEach((item) => {
      expect(typeof item.Icon).toBe('function');
    });
  });

  it('배열 길이가 3이다', () => {
    expect(TRANSPORT_ITEMS).toHaveLength(3);
  });

  it('각 항목에 label 문자열이 있다', () => {
    TRANSPORT_ITEMS.forEach((item) => {
      expect(typeof item.label).toBe('string');
      expect(item.label.length).toBeGreaterThan(0);
    });
  });

  it('각 항목의 lines 배열이 비어있지 않다', () => {
    TRANSPORT_ITEMS.forEach((item) => {
      expect(item.lines.length).toBeGreaterThan(0);
    });
  });

  it("'map__walk', 'map__bus', 'map__subway' id가 포함된다", () => {
    const ids = TRANSPORT_ITEMS.map((item) => item.id);
    expect(ids).toContain('map__walk');
    expect(ids).toContain('map__bus');
    expect(ids).toContain('map__subway');
  });
});

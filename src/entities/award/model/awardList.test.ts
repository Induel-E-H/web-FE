import { describe, expect, it } from 'vitest';

import { AWARD_LIST } from './awardList';

describe('AWARD_LIST', () => {
  it('8개의 항목을 포함한다', () => {
    expect(AWARD_LIST).toHaveLength(8);
  });

  it('각 항목에 고유한 id가 있다', () => {
    const ids = AWARD_LIST.map((a) => a.id);
    expect(new Set(ids).size).toBe(8);
  });

  it('모든 항목에 필수 필드(id, title, category, date, issuer)가 있다', () => {
    AWARD_LIST.forEach((item) => {
      expect(typeof item.id).toBe('number');
      expect(typeof item.title).toBe('string');
      expect(item.title.length).toBeGreaterThan(0);
      expect(typeof item.category).toBe('string');
      expect(typeof item.date).toBe('string');
      expect(typeof item.issuer).toBe('string');
    });
  });

  it('serialNumber는 일부 항목에만 존재한다(optional)', () => {
    const withSerial = AWARD_LIST.filter((a) => a.serialNumber !== undefined);
    const withoutSerial = AWARD_LIST.filter(
      (a) => a.serialNumber === undefined,
    );
    expect(withSerial.length).toBeGreaterThan(0);
    expect(withoutSerial.length).toBeGreaterThan(0);
  });

  it('id가 0부터 7까지 순서대로 할당되어 있다', () => {
    AWARD_LIST.forEach((item, index) => {
      expect(item.id).toBe(index);
    });
  });
});

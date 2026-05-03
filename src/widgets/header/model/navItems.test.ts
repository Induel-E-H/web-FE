import { describe, expect, it } from 'vitest';

import { NAV_ITEMS } from './navItems';

describe('NAV_ITEMS', () => {
  it('5개의 네비게이션 항목을 가진다', () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });

  it('각 항목은 label과 selector를 가진다', () => {
    NAV_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('selector');
      expect(typeof item.label).toBe('string');
      expect(typeof item.selector).toBe('string');
    });
  });

  it('정의된 순서대로 label/selector가 매핑된다', () => {
    expect(NAV_ITEMS).toEqual([
      { label: 'VISION', selector: '.vision' },
      { label: 'HISTORY', selector: '.history' },
      { label: 'AWARDS', selector: '.award' },
      { label: 'PATENTS', selector: '.patent' },
      { label: 'LOCATION', selector: '.map' },
    ]);
  });

  it('selector는 모두 "."로 시작한다', () => {
    NAV_ITEMS.forEach(({ selector }) => {
      expect(selector.startsWith('.')).toBe(true);
    });
  });

  it('label은 중복되지 않는다', () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('selector는 중복되지 않는다', () => {
    const selectors = NAV_ITEMS.map((item) => item.selector);
    expect(new Set(selectors).size).toBe(selectors.length);
  });
});

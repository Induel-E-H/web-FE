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
});

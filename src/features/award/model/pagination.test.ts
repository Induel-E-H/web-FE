import { describe, expect, it } from 'vitest';

import { wrapPage } from './pagination';

describe('wrapPage', () => {
  it('정상 범위 인덱스는 그대로 반환한다', () => {
    expect(wrapPage(0, 3)).toBe(0);
    expect(wrapPage(1, 3)).toBe(1);
    expect(wrapPage(2, 3)).toBe(2);
  });

  it('마지막 페이지 초과 시 첫 페이지(0)로 순환한다', () => {
    expect(wrapPage(3, 3)).toBe(0);
    expect(wrapPage(6, 3)).toBe(0);
  });

  it('음수 인덱스는 마지막 페이지로 순환한다', () => {
    expect(wrapPage(-1, 3)).toBe(2);
    expect(wrapPage(-3, 3)).toBe(0);
  });

  it('totalPages가 1일 때 항상 0을 반환한다', () => {
    expect(wrapPage(0, 1)).toBe(0);
    expect(wrapPage(1, 1)).toBe(0);
    expect(wrapPage(-1, 1)).toBe(0);
  });
});

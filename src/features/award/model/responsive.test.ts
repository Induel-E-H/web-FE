import { describe, expect, it } from 'vitest';

import { getItemsPerPage } from './responsive';

describe('getItemsPerPage', () => {
  it('mobile 브레이크포인트에서 4를 반환한다', () => {
    expect(getItemsPerPage('mobile')).toBe(4);
  });

  it('tablet 브레이크포인트에서 6을 반환한다', () => {
    expect(getItemsPerPage('tablet')).toBe(6);
  });

  it('desktop 브레이크포인트에서 10을 반환한다', () => {
    expect(getItemsPerPage('desktop')).toBe(10);
  });
});

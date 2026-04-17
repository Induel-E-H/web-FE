import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getItemsPerPage } from './responsive';

describe('getItemsPerPage', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1920);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('모바일(≤767)에서 4를 반환한다', () => {
    vi.stubGlobal('innerWidth', 767);
    expect(getItemsPerPage()).toBe(4);
  });

  it('태블릿(768~1024)에서 6을 반환한다', () => {
    vi.stubGlobal('innerWidth', 768);
    expect(getItemsPerPage()).toBe(6);

    vi.stubGlobal('innerWidth', 1024);
    expect(getItemsPerPage()).toBe(6);
  });

  it('데스크탑(>1024)에서 10을 반환한다', () => {
    vi.stubGlobal('innerWidth', 1025);
    expect(getItemsPerPage()).toBe(10);

    vi.stubGlobal('innerWidth', 1920);
    expect(getItemsPerPage()).toBe(10);
  });
});

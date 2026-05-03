import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  BREAKPOINT_MOBILE_MAX,
  BREAKPOINT_TABLET_MAX,
  useBreakpoint,
} from './useBreakpoint';

describe('useBreakpoint', () => {
  describe('상수 값', () => {
    it('BREAKPOINT_MOBILE_MAX가 767이다', () => {
      expect(BREAKPOINT_MOBILE_MAX).toBe(767);
    });

    it('BREAKPOINT_TABLET_MAX가 1024이다', () => {
      expect(BREAKPOINT_TABLET_MAX).toBe(1024);
    });
  });

  describe('기본 환경 (matchMedia가 모두 false 반환)', () => {
    it('setup.ts의 matchMedia stub이 matches:false이므로 "desktop"을 반환한다', () => {
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('desktop');
    });
  });
});

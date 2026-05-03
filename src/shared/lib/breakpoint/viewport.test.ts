import { afterEach, describe, expect, it, vi } from 'vitest';

import { BREAKPOINT_MOBILE_MAX, BREAKPOINT_TABLET_MAX } from './useBreakpoint';
import { isMobileViewport, isTabletViewport } from './viewport';

describe('viewport 유틸리티', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('isMobileViewport', () => {
    it('innerWidth가 BREAKPOINT_MOBILE_MAX 이하이면 true를 반환한다', () => {
      vi.stubGlobal('innerWidth', BREAKPOINT_MOBILE_MAX);
      expect(isMobileViewport()).toBe(true);
    });

    it('innerWidth가 BREAKPOINT_MOBILE_MAX보다 1 작으면 true를 반환한다', () => {
      vi.stubGlobal('innerWidth', BREAKPOINT_MOBILE_MAX - 1);
      expect(isMobileViewport()).toBe(true);
    });

    it('innerWidth가 BREAKPOINT_MOBILE_MAX보다 크면 false를 반환한다', () => {
      vi.stubGlobal('innerWidth', BREAKPOINT_MOBILE_MAX + 1);
      expect(isMobileViewport()).toBe(false);
    });

    it('innerWidth가 0이면 true를 반환한다', () => {
      vi.stubGlobal('innerWidth', 0);
      expect(isMobileViewport()).toBe(true);
    });
  });

  describe('isTabletViewport', () => {
    it('innerWidth가 BREAKPOINT_TABLET_MAX 이하이면 true를 반환한다', () => {
      vi.stubGlobal('innerWidth', BREAKPOINT_TABLET_MAX);
      expect(isTabletViewport()).toBe(true);
    });

    it('innerWidth가 BREAKPOINT_TABLET_MAX보다 1 작으면 true를 반환한다', () => {
      vi.stubGlobal('innerWidth', BREAKPOINT_TABLET_MAX - 1);
      expect(isTabletViewport()).toBe(true);
    });

    it('innerWidth가 BREAKPOINT_TABLET_MAX보다 크면 false를 반환한다', () => {
      vi.stubGlobal('innerWidth', BREAKPOINT_TABLET_MAX + 1);
      expect(isTabletViewport()).toBe(false);
    });
  });
});

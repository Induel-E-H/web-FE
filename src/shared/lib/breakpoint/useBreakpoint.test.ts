import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

  describe('모바일/태블릿 breakpoint (resetModules)', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    it('모바일 matchMedia가 matches=true이면 "mobile"을 반환한다', async () => {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query.includes('767'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { useBreakpoint: freshHook } = await import('./useBreakpoint');
      const { result } = renderHook(() => freshHook());
      expect(result.current).toBe('mobile');
    });

    it('태블릿 matchMedia가 matches=true이면 "tablet"을 반환한다', async () => {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query.includes('1024') && !query.includes('767'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { useBreakpoint: freshHook } = await import('./useBreakpoint');
      const { result } = renderHook(() => freshHook());
      expect(result.current).toBe('tablet');
    });

    it('change 이벤트 발생 시 cached가 갱신되고 리렌더링된다', async () => {
      const listeners: Array<() => void> = [];
      let mobileMatches = false;

      vi.stubGlobal('matchMedia', (query: string) => ({
        get matches() {
          return mobileMatches && query.includes('767');
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (_: string, handler: () => void) => {
          listeners.push(handler);
        },
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { useBreakpoint: freshHook } = await import('./useBreakpoint');
      const { result } = renderHook(() => freshHook());
      expect(result.current).toBe('desktop');

      mobileMatches = true;
      act(() => {
        listeners.forEach((l) => l());
      });

      expect(result.current).toBe('mobile');
    });
  });
});

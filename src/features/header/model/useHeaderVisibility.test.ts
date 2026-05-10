import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useHeaderVisibility } from './useHeaderVisibility';

describe('useHeaderVisibility', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  describe('스크롤 동작', () => {
    it('초기값은 hidden: false이다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      expect(result.current.hidden).toBe(false);
    });

    it('5px 초과 스크롤 다운 시 hidden: true가 된다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 10,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.hidden).toBe(true);
    });

    it('5px 미만 스크롤은 상태를 바꾸지 않는다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 3,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.hidden).toBe(false);
    });

    it('스크롤 다운 후 업 시 hidden: false가 된다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 100,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 80,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.hidden).toBe(false);
    });

    it('scrollY가 0이면 항상 hidden: false이다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 50,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 0,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.hidden).toBe(false);
    });
  });

  describe('nav 스크롤 동작', () => {
    it('onNavScrollStart 호출 시 hidden: true가 된다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        result.current.onNavScrollStart();
      });
      expect(result.current.hidden).toBe(true);
    });

    it('onNavScrollStart 이후 스크롤 업 이벤트가 와도 hidden이 유지된다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 100,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        result.current.onNavScrollStart();
      });
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 50,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.hidden).toBe(true);
    });

    it('onNavScrollEnd 이후 스크롤 업 이벤트 시 hidden: false가 된다', () => {
      const { result } = renderHook(() => useHeaderVisibility());
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 100,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        result.current.onNavScrollStart();
      });
      act(() => {
        result.current.onNavScrollEnd();
      });
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 80,
          configurable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.hidden).toBe(false);
    });
  });
});

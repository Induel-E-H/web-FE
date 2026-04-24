import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSliderNavigation } from './useSliderNavigation';

describe('useSliderNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('초기 상태', () => {
    it('currentIndex는 0으로 시작한다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      expect(result.current.currentIndex).toBe(0);
    });
  });

  describe('goToPrevSlide', () => {
    it('currentIndex가 0보다 크면 1 감소한다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      act(() => {
        result.current.goToNextSlide();
      });
      act(() => {
        result.current.goToPrevSlide();
      });
      expect(result.current.currentIndex).toBe(0);
    });

    it('currentIndex가 0이면 마지막 슬라이드로 순환한다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      act(() => {
        result.current.goToPrevSlide();
      });
      expect(result.current.currentIndex).toBe(2);
    });
  });

  describe('goToNextSlide', () => {
    it('currentIndex가 마지막보다 작으면 1 증가한다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      act(() => {
        result.current.goToNextSlide();
      });
      expect(result.current.currentIndex).toBe(1);
    });

    it('currentIndex가 마지막이면 0으로 순환한다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      act(() => {
        result.current.goToNextSlide();
        result.current.goToNextSlide();
        result.current.goToNextSlide();
      });
      expect(result.current.currentIndex).toBe(0);
    });
  });

  describe('startContinuousSlide', () => {
    it('호출 즉시 fn이 한 번 실행된다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      const fn = vi.fn();
      act(() => {
        result.current.startContinuousSlide(fn);
      });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('400ms 경과마다 fn이 반복 호출된다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      const fn = vi.fn();
      act(() => {
        result.current.startContinuousSlide(fn);
      });
      act(() => {
        vi.advanceTimersByTime(800);
      });
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('stopContinuousSlide', () => {
    it('stop 후에는 fn이 더 이상 호출되지 않는다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      const fn = vi.fn();
      act(() => {
        result.current.startContinuousSlide(fn);
      });
      act(() => {
        result.current.stopContinuousSlide();
      });
      fn.mockClear();
      act(() => {
        vi.advanceTimersByTime(800);
      });
      expect(fn).not.toHaveBeenCalled();
    });

    it('타이머가 없는 상태에서 stopContinuousSlide를 호출해도 에러가 없다', () => {
      const { result } = renderHook(() => useSliderNavigation(3));
      expect(() => {
        act(() => {
          result.current.stopContinuousSlide();
        });
      }).not.toThrow();
    });
  });
});

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FLIP_DURATION } from './constants';
import { useBookNavigation } from './useBookNavigation';

describe('useBookNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기 activeItem은 List이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.activeItem).toBe('List');
  });

  it('초기 currentPageIndex는 0이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.currentPageIndex).toBe(0);
  });

  it('초기 canGoLeft는 false이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.canGoLeft).toBe(false);
  });

  it('초기 canGoRight는 true이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.canGoRight).toBe(true);
  });

  it('초기 isFlipping은 false이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.isFlipping).toBe(false);
  });

  it('초기 flipDirection은 null이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.flipDirection).toBe(null);
  });

  it('초기 tabActiveItem은 List이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.tabActiveItem).toBe('List');
  });

  describe('startFlipAnimation', () => {
    it('forward 방향으로 flip 시작 시 isFlipping=true가 된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.startFlipAnimation('forward', () => {});
      });
      expect(result.current.isFlipping).toBe(true);
      expect(result.current.flipDirection).toBe('forward');
    });

    it('FLIP_DURATION 후 isFlipping이 false로 리셋된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.startFlipAnimation('forward', () => {});
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.isFlipping).toBe(false);
    });
  });

  describe('navigateToCategory', () => {
    it('현재 위치와 동일한 카테고리/페이지로 이동 시 무시된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('List', 0);
      });
      expect(result.current.isFlipping).toBe(false);
    });

    it('다른 카테고리로 이동 시 flip이 시작된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      expect(result.current.isFlipping).toBe(true);
    });

    it('앞 카테고리로 이동하면 forward 방향으로 flip된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('Timeline', 0);
      });
      expect(result.current.flipDirection).toBe('forward');
    });

    it('애니메이션 완료 후 activeItem이 변경된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('Timeline', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.activeItem).toBe('Timeline');
    });
  });

  describe('shadow count', () => {
    it('초기 leftShadowCount는 0이다 (List, page 0)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      expect(result.current.leftShadowCount).toBe(0);
    });

    it('초기 rightShadowCount는 0이 아니다 (남은 페이지가 충분히 많음)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      expect(result.current.rightShadowCount).toBeGreaterThan(0);
    });
  });

  describe('breakpoint 변경', () => {
    it('tablet breakpoint에서도 초기 상태가 올바르다', () => {
      const { result } = renderHook(() => useBookNavigation('tablet'));
      expect(result.current.activeItem).toBe('List');
      expect(result.current.canGoLeft).toBe(false);
    });

    it('mobile breakpoint에서도 초기 상태가 올바르다', () => {
      const { result } = renderHook(() => useBookNavigation('mobile'));
      expect(result.current.activeItem).toBe('List');
      expect(result.current.canGoLeft).toBe(false);
    });
  });
});

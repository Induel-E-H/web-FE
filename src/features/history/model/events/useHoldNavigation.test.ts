import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FLIP_DURATION, RAPID_FLIP_DURATION } from '../constants';
import { useHoldNavigation } from './useHoldNavigation';

describe('useHoldNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기 상태: isHoldChaining=false', () => {
    const { result } = renderHook(() => useHoldNavigation());
    expect(result.current.isHoldChaining).toBe(false);
  });

  it('beginContinuousFlip("left")는 등록된 navigateLeft를 호출한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    const navigateLeft = vi.fn();
    const navigateRight = vi.fn();
    act(() => {
      result.current.syncCallbacks(navigateLeft, navigateRight, vi.fn());
      result.current.beginContinuousFlip('left');
    });
    expect(navigateLeft).toHaveBeenCalledTimes(1);
    expect(navigateRight).not.toHaveBeenCalled();
  });

  it('beginContinuousFlip("right")는 등록된 navigateRight를 호출한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    const navigateLeft = vi.fn();
    const navigateRight = vi.fn();
    act(() => {
      result.current.syncCallbacks(navigateLeft, navigateRight, vi.fn());
      result.current.beginContinuousFlip('right');
    });
    expect(navigateRight).toHaveBeenCalledTimes(1);
    expect(navigateLeft).not.toHaveBeenCalled();
  });

  it('ArrowLeft keydown은 등록된 navigateLeft를 호출한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    const navigateLeft = vi.fn();
    act(() => {
      result.current.syncCallbacks(navigateLeft, vi.fn(), vi.fn());
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    expect(navigateLeft).toHaveBeenCalledTimes(1);
  });

  it('ArrowRight keydown은 등록된 navigateRight를 호출한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    const navigateRight = vi.fn();
    act(() => {
      result.current.syncCallbacks(vi.fn(), navigateRight, vi.fn());
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
    expect(navigateRight).toHaveBeenCalledTimes(1);
  });

  it('repeat 키 이벤트는 무시된다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    const navigateLeft = vi.fn();
    act(() => {
      result.current.syncCallbacks(navigateLeft, vi.fn(), vi.fn());
    });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', repeat: true }),
      );
    });
    expect(navigateLeft).not.toHaveBeenCalled();
  });

  it('mouseup 이벤트는 endContinuousFlip을 트리거한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    act(() => {
      result.current.syncCallbacks(vi.fn(), vi.fn());
      result.current.beginContinuousFlip('left');
      result.current.chainHoldFlip();
    });
    expect(result.current.isHoldChaining).toBe(true);
    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(result.current.isHoldChaining).toBe(false);
  });

  it('endContinuousFlip은 isHoldChaining을 false로 설정한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    act(() => {
      result.current.endContinuousFlip();
    });
    expect(result.current.isHoldChaining).toBe(false);
  });

  it('chainHoldFlip은 holdDirection이 없으면 false를 반환한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    let returnValue = true;
    act(() => {
      returnValue = result.current.chainHoldFlip();
    });
    expect(returnValue).toBe(false);
  });

  it('clearHoldDirection 호출 후 chainHoldFlip은 false를 반환한다', () => {
    const { result } = renderHook(() => useHoldNavigation());
    act(() => {
      result.current.syncCallbacks(vi.fn(), vi.fn(), vi.fn());
      result.current.beginContinuousFlip('left');
      result.current.clearHoldDirection();
    });
    let returnValue = true;
    act(() => {
      returnValue = result.current.chainHoldFlip();
    });
    expect(returnValue).toBe(false);
  });

  describe('syncBoundaryCallbacks', () => {
    it('ArrowLeft keydown에서 navigate가 holdDirection을 클리어하면 leftBoundary 콜백이 FLIP_DURATION으로 호출된다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const leftBoundary = vi.fn();
      act(() => {
        result.current.syncBoundaryCallbacks(leftBoundary, vi.fn());
        result.current.syncCallbacks(
          () => result.current.clearHoldDirection(),
          vi.fn(),
        );
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(leftBoundary).toHaveBeenCalledWith(FLIP_DURATION);
    });

    it('ArrowRight keydown에서 navigate가 holdDirection을 클리어하면 rightBoundary 콜백이 FLIP_DURATION으로 호출된다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const rightBoundary = vi.fn();
      act(() => {
        result.current.syncBoundaryCallbacks(vi.fn(), rightBoundary);
        result.current.syncCallbacks(vi.fn(), () =>
          result.current.clearHoldDirection(),
        );
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(rightBoundary).toHaveBeenCalledWith(FLIP_DURATION);
    });

    it('navigate가 holdDirection을 클리어하지 않으면 boundary 콜백이 호출되지 않는다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const leftBoundary = vi.fn();
      act(() => {
        result.current.syncBoundaryCallbacks(leftBoundary, vi.fn());
        result.current.syncCallbacks(vi.fn(), vi.fn());
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(leftBoundary).not.toHaveBeenCalled();
    });

    it('chainHoldFlip에서 navigateRapid가 holdDirection을 클리어하면 rightBoundary 콜백이 RAPID_FLIP_DURATION으로 호출된다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const rightBoundary = vi.fn();
      act(() => {
        result.current.syncBoundaryCallbacks(vi.fn(), rightBoundary);
        result.current.syncCallbacks(vi.fn(), vi.fn(), vi.fn(), () =>
          result.current.clearHoldDirection(),
        );
        result.current.beginContinuousFlip('right');
        result.current.chainHoldFlip();
      });
      act(() => {
        vi.runAllTimers();
      });
      expect(rightBoundary).toHaveBeenCalledWith(RAPID_FLIP_DURATION);
    });

    it('chainHoldFlip에서 boundary hit 시 isHoldChaining이 false로 리셋된다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      act(() => {
        result.current.syncBoundaryCallbacks(vi.fn(), vi.fn());
        result.current.syncCallbacks(
          vi.fn(),
          vi.fn(),
          () => result.current.clearHoldDirection(),
          vi.fn(),
        );
        result.current.beginContinuousFlip('left');
        result.current.chainHoldFlip();
      });
      act(() => {
        vi.runAllTimers();
      });
      expect(result.current.isHoldChaining).toBe(false);
    });
  });

  describe('syncCoverCallbacks', () => {
    it('cover-front 상태에서 ArrowRight keydown은 openFront를 FLIP_DURATION으로 호출한다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const openFront = vi.fn();
      const openBack = vi.fn();
      act(() => {
        result.current.syncCoverCallbacks(true, false, openFront, openBack);
        result.current.syncCallbacks(vi.fn(), vi.fn());
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(openFront).toHaveBeenCalledWith(FLIP_DURATION);
      expect(openBack).not.toHaveBeenCalled();
    });

    it('cover-back 상태에서 ArrowLeft keydown은 openBack을 FLIP_DURATION으로 호출한다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const openFront = vi.fn();
      const openBack = vi.fn();
      act(() => {
        result.current.syncCoverCallbacks(false, true, openFront, openBack);
        result.current.syncCallbacks(vi.fn(), vi.fn());
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(openBack).toHaveBeenCalledWith(FLIP_DURATION);
      expect(openFront).not.toHaveBeenCalled();
    });

    it('cover-front 상태에서 ArrowLeft keydown은 openFront를 호출하지 않고 navigateLeft를 호출한다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const openFront = vi.fn();
      const navigateLeft = vi.fn();
      act(() => {
        result.current.syncCoverCallbacks(true, false, openFront, vi.fn());
        result.current.syncCallbacks(navigateLeft, vi.fn());
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(openFront).not.toHaveBeenCalled();
      expect(navigateLeft).toHaveBeenCalledTimes(1);
    });

    it('cover-back 상태에서 ArrowRight keydown은 openBack을 호출하지 않고 navigateRight를 호출한다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      const openBack = vi.fn();
      const navigateRight = vi.fn();
      act(() => {
        result.current.syncCoverCallbacks(false, true, vi.fn(), openBack);
        result.current.syncCallbacks(vi.fn(), navigateRight);
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(openBack).not.toHaveBeenCalled();
      expect(navigateRight).toHaveBeenCalledTimes(1);
    });

    it('cover-front에서 ArrowRight 후 keyup 전까지 holdDirection이 유지된다 (chaining 가능)', () => {
      const { result } = renderHook(() => useHoldNavigation());
      act(() => {
        result.current.syncCoverCallbacks(true, false, vi.fn(), vi.fn());
        result.current.syncCallbacks(vi.fn(), vi.fn());
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      let chainResult = false;
      act(() => {
        chainResult = result.current.chainHoldFlip();
      });
      expect(chainResult).toBe(true);
    });

    it('cover-front에서 ArrowRight 후 keyup 시 holdDirection이 클리어된다', () => {
      const { result } = renderHook(() => useHoldNavigation());
      act(() => {
        result.current.syncCoverCallbacks(true, false, vi.fn(), vi.fn());
        result.current.syncCallbacks(vi.fn(), vi.fn());
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
      });
      let chainResult = true;
      act(() => {
        chainResult = result.current.chainHoldFlip();
      });
      expect(chainResult).toBe(false);
    });
  });
});

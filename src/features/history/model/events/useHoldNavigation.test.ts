import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
});

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FLIP_DURATION } from '../constants';
import { useHistoryStore } from '../useHistoryStore';
import { useFlipAnimation } from './useFlipAnimation';

describe('useFlipAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useHistoryStore.getState().reset();
  });

  afterEach(() => {
    vi.useRealTimers();
    useHistoryStore.getState().reset();
  });

  it('초기 상태: isFlipping=false, flipDirection=null', () => {
    const { result } = renderHook(() => useFlipAnimation());
    expect(result.current.isFlipping).toBe(false);
    expect(result.current.flipDirection).toBe(null);
  });

  it('startFlipAnimation 호출 시 isFlipping=true, flipDirection이 설정된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    act(() => {
      result.current.startFlipAnimation('forward', () => {});
    });
    expect(result.current.isFlipping).toBe(true);
    expect(result.current.flipDirection).toBe('forward');
  });

  it('backward 방향으로도 올바르게 설정된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    act(() => {
      result.current.startFlipAnimation('backward', () => {});
    });
    expect(result.current.flipDirection).toBe('backward');
  });

  it('FLIP_DURATION 후 isFlipping이 false로 리셋된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    act(() => {
      result.current.startFlipAnimation('forward', () => {});
    });
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION);
    });
    expect(result.current.isFlipping).toBe(false);
    expect(result.current.flipDirection).toBe(null);
  });

  it('애니메이션 완료 시 onComplete 콜백이 호출된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    const onComplete = vi.fn();
    act(() => {
      result.current.startFlipAnimation('forward', onComplete);
    });
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('setOnAnimationComplete로 등록한 콜백이 완료 후 호출된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    const afterComplete = vi.fn();
    act(() => {
      result.current.setOnAnimationComplete(afterComplete);
      result.current.startFlipAnimation('forward', () => {});
    });
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION);
    });
    expect(afterComplete).toHaveBeenCalledTimes(1);
  });

  it('애니메이션 중에 startFlipAnimation을 다시 호출하면 무시된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    const first = vi.fn();
    const second = vi.fn();
    act(() => {
      result.current.startFlipAnimation('forward', first);
    });
    act(() => {
      result.current.startFlipAnimation('backward', second);
    });
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION);
    });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it('isAnimatingRef는 애니메이션 중에 true이다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    act(() => {
      result.current.startFlipAnimation('forward', () => {});
    });
    expect(result.current.isAnimatingRef.current).toBe(true);
  });

  it('isAnimatingRef는 애니메이션 완료 후 false이다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    act(() => {
      result.current.startFlipAnimation('forward', () => {});
    });
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION);
    });
    expect(result.current.isAnimatingRef.current).toBe(false);
  });

  it('커스텀 duration이 지정되면 해당 시간 후에 완료된다', () => {
    const { result } = renderHook(() => useFlipAnimation());
    const onComplete = vi.fn();
    act(() => {
      result.current.startFlipAnimation('forward', onComplete, 100);
    });
    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(onComplete).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

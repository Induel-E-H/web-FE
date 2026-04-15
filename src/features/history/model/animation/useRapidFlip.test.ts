import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RAPID_FLIP_DURATION } from '../constants';
import { useRapidFlip } from './useRapidFlip';

describe('useRapidFlip', () => {
  let mockStartFlipAnimation: (
    direction: import('../types').FlipDirection,
    onComplete: () => void,
    duration?: number,
  ) => void;

  beforeEach(() => {
    vi.useFakeTimers();
    mockStartFlipAnimation = vi.fn() as unknown as (
      direction: import('../types').FlipDirection,
      onComplete: () => void,
      duration?: number,
    ) => void;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기 상태: isRapidFlipping=false, tabActiveItem="List"', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    expect(result.current.isRapidFlipping).toBe(false);
    expect(result.current.tabActiveItem).toBe('List');
  });

  it('startRapidSequence 호출 시 isRapidFlipping=true, tabActiveItem이 targetItem으로 변경된다', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    const steps = [
      { item: 'Content' as const, pageIndex: 0 },
      { item: 'Content' as const, pageIndex: 1 },
    ];
    act(() => {
      result.current.startRapidSequence(
        [...steps],
        'forward',
        'Content',
        vi.fn(),
      );
    });
    expect(result.current.isRapidFlipping).toBe(true);
    expect(result.current.tabActiveItem).toBe('Content');
  });

  it('startRapidSequence 호출 시 startFlipAnimation이 RAPID_FLIP_DURATION으로 호출된다', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    act(() => {
      result.current.startRapidSequence(
        [{ item: 'Timeline' as const, pageIndex: 0 }],
        'forward',
        'Timeline',
        vi.fn(),
      );
    });
    expect(mockStartFlipAnimation).toHaveBeenCalledWith(
      'forward',
      expect.any(Function),
      RAPID_FLIP_DURATION,
    );
  });

  it('스텝이 1개이면 startFlipAnimation 완료 후 isRapidFlipping=false가 된다', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    let onCompleteCallback: (() => void) | undefined;

    (mockStartFlipAnimation as ReturnType<typeof vi.fn>).mockImplementation(
      (_dir: string, onComplete: () => void) => {
        onCompleteCallback = onComplete;
      },
    );

    act(() => {
      result.current.startRapidSequence(
        [{ item: 'Content' as const, pageIndex: 0 }],
        'forward',
        'Content',
        vi.fn(),
      );
    });

    act(() => {
      onCompleteCallback?.();
    });

    expect(result.current.isRapidFlipping).toBe(false);
  });

  it('updateTabActiveItem은 tabActiveItem을 변경한다', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    act(() => {
      result.current.updateTabActiveItem('Timeline');
    });
    expect(result.current.tabActiveItem).toBe('Timeline');
  });

  it('chainNextStep은 stepsRef가 비어있으면 false를 반환한다', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    let returnValue = true;
    act(() => {
      returnValue = result.current.chainNextStep(vi.fn());
    });
    expect(returnValue).toBe(false);
  });

  it('chainNextStep은 남은 스텝이 있으면 true를 반환한다', () => {
    const { result } = renderHook(() => useRapidFlip(mockStartFlipAnimation));
    // 2개 스텝으로 시작 → 첫 번째는 startRapidSequence에서 소비 → 1개 남음
    act(() => {
      result.current.startRapidSequence(
        [
          { item: 'Content' as const, pageIndex: 0 },
          { item: 'Timeline' as const, pageIndex: 0 },
        ],
        'forward',
        'Timeline',
        vi.fn(),
      );
    });
    let returnValue = false;
    act(() => {
      returnValue = result.current.chainNextStep(vi.fn());
    });
    expect(returnValue).toBe(true);
  });
});

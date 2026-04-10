import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useBookCoverState } from './useBookCoverState';

describe('useBookCoverState', () => {
  it('초기 상태는 cover-front이다', () => {
    const { result } = renderHook(() => useBookCoverState());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('openFromFront: cover-front → opening-front', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    expect(result.current.bookState).toBe('opening-front');
  });

  it('openFromFront: cover-front가 아닐 때 무시된다', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.openFromFront());
    expect(result.current.bookState).toBe('opening-front');
  });

  it('onFrontOpened: opening-front → open', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    expect(result.current.bookState).toBe('open');
  });

  it('closeFront: open → closing-front', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    act(() => result.current.closeFront());
    expect(result.current.bookState).toBe('closing-front');
  });

  it('closeFront: open이 아닐 때 무시된다', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.closeFront());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('onFrontClosed: closing-front → cover-front', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    act(() => result.current.closeFront());
    act(() => result.current.onFrontClosed());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('closeBack: open → closing-back', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    act(() => result.current.closeBack());
    expect(result.current.bookState).toBe('closing-back');
  });

  it('onBackClosed: closing-back → cover-back', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    act(() => result.current.closeBack());
    act(() => result.current.onBackClosed());
    expect(result.current.bookState).toBe('cover-back');
  });

  it('openFromBack: cover-back → opening-back', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    act(() => result.current.closeBack());
    act(() => result.current.onBackClosed());
    act(() => result.current.openFromBack());
    expect(result.current.bookState).toBe('opening-back');
  });

  it('onBackOpened: opening-back → open', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openFromFront());
    act(() => result.current.onFrontOpened());
    act(() => result.current.closeBack());
    act(() => result.current.onBackClosed());
    act(() => result.current.openFromBack());
    act(() => result.current.onBackOpened());
    expect(result.current.bookState).toBe('open');
  });
});

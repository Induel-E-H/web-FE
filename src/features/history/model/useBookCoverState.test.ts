import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useBookCoverState } from './useBookCoverState';
import { useHistoryStore } from './useHistoryStore';

describe('useBookCoverState', () => {
  beforeEach(() => {
    useHistoryStore.getState().reset();
  });

  afterEach(() => {
    useHistoryStore.getState().reset();
  });

  it('초기 상태는 cover-front이다', () => {
    const { result } = renderHook(() => useBookCoverState());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('openFromFront: cover-front → opening-front', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    expect(result.current.bookState).toBe('opening-front');
  });

  it('openFromFront: cover-front가 아닐 때 무시된다', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.openingFront());
    expect(result.current.bookState).toBe('opening-front');
  });

  it('onOpened: opening-front → open', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    expect(result.current.bookState).toBe('open');
  });

  it('closingFront: open → closing-front', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    act(() => result.current.closingFront());
    expect(result.current.bookState).toBe('closing-front');
  });

  it('closingFront: open이 아닐 때 무시된다', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.closingFront());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('onFrontClosed: closing-front → cover-front', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    act(() => result.current.closingFront());
    act(() => result.current.onFrontClosed());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('closingBack: open → closing-back', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    act(() => result.current.closingBack());
    expect(result.current.bookState).toBe('closing-back');
  });

  it('onBackClosed: closing-back → cover-back', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    act(() => result.current.closingBack());
    act(() => result.current.onBackClosed());
    expect(result.current.bookState).toBe('cover-back');
  });

  it('openingBack: cover-back → opening-back', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    act(() => result.current.closingBack());
    act(() => result.current.onBackClosed());
    act(() => result.current.openingBack());
    expect(result.current.bookState).toBe('opening-back');
  });

  it('onOpened: opening-back → open', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingFront());
    act(() => result.current.onOpened());
    act(() => result.current.closingBack());
    act(() => result.current.onBackClosed());
    act(() => result.current.openingBack());
    act(() => result.current.onOpened());
    expect(result.current.bookState).toBe('open');
  });

  it('closingBack: open이 아닐 때 무시된다', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.closingBack());
    expect(result.current.bookState).toBe('cover-front');
  });

  it('openingBack: cover-back가 아닐 때 무시된다', () => {
    const { result } = renderHook(() => useBookCoverState());
    act(() => result.current.openingBack());
    expect(result.current.bookState).toBe('cover-front');
  });
});

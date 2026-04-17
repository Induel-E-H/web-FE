import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useScrollDirection } from './useScrollDirection';

describe('useScrollDirection', () => {
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

  it('초기값은 up이다', () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe('up');
  });

  it('5px 초과 스크롤 다운 시 down을 반환한다', () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 10,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('down');
  });

  it('5px 미만 스크롤은 방향을 바꾸지 않는다', () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 3,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('up');
  });

  it('정확히 5px 스크롤은 방향을 바꾼다', () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 5,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('down');
  });

  it('스크롤 다운 후 업 시 up을 반환한다', () => {
    const { result } = renderHook(() => useScrollDirection());
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
    expect(result.current).toBe('up');
  });

  it('scrollY가 0이면 항상 up이다', () => {
    const { result } = renderHook(() => useScrollDirection());
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
    expect(result.current).toBe('up');
  });
});

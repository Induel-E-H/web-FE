import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { YEAR_ALL } from './constant';
import { useAwardStore } from './useAwardStore';
import { useYearFilter } from './useYearFilter';

describe('useYearFilter', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  it('초기 activeYear는 "전체"이다', () => {
    const { result } = renderHook(() => useYearFilter());
    expect(result.current.activeYear).toBe(YEAR_ALL);
  });

  it('handleYearChange 호출 시 activeYear가 변경된다', () => {
    const { result } = renderHook(() => useYearFilter());

    act(() => {
      result.current.handleYearChange(2008);
    });

    expect(result.current.activeYear).toBe(2008);
  });

  it('handleYearChange로 문자열 연도로 변경할 수 있다', () => {
    const { result } = renderHook(() => useYearFilter());

    act(() => {
      result.current.handleYearChange(YEAR_ALL);
    });

    expect(result.current.activeYear).toBe(YEAR_ALL);
  });
});

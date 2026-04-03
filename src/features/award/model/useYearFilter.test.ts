import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { YEAR_LIST } from './constant';
import { useYearFilter } from './useYearFilter';

describe('useYearFilter', () => {
  it('초기 activeYear는 "전체"이다', () => {
    const { result } = renderHook(() => useYearFilter());
    expect(result.current.activeYear).toBe('전체');
  });

  it('yearList는 YEAR_LIST와 동일하다', () => {
    const { result } = renderHook(() => useYearFilter());
    expect(result.current.yearList).toEqual(YEAR_LIST);
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
      result.current.handleYearChange('전체');
    });

    expect(result.current.activeYear).toBe('전체');
  });
});

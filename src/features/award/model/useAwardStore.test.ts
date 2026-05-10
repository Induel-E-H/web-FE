import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { YEAR_ALL } from './constant';
import { useAwardStore } from './useAwardStore';

describe('useAwardStore', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  it('초기 activeYear는 "전체"이다', () => {
    expect(useAwardStore.getState().activeYear).toBe(YEAR_ALL);
  });

  it('초기 currentPage는 0이다', () => {
    expect(useAwardStore.getState().currentPage).toBe(0);
  });

  it('초기 selectedId는 null이다', () => {
    expect(useAwardStore.getState().selectedId).toBe(null);
  });

  it('handleYearChange는 activeYear를 변경하고 currentPage를 0으로 리셋한다', () => {
    useAwardStore.getState().setCurrentPage(3);
    useAwardStore.getState().handleYearChange(2020);
    expect(useAwardStore.getState().activeYear).toBe(2020);
    expect(useAwardStore.getState().currentPage).toBe(0);
  });

  it('setCurrentPage는 currentPage를 변경한다', () => {
    useAwardStore.getState().setCurrentPage(2);
    expect(useAwardStore.getState().currentPage).toBe(2);
  });

  it('setSelectedId는 selectedId를 변경한다', () => {
    useAwardStore.getState().setSelectedId(5);
    expect(useAwardStore.getState().selectedId).toBe(5);
  });

  it('setSelectedId(null)은 팝업을 닫는다', () => {
    useAwardStore.getState().setSelectedId(1);
    useAwardStore.getState().setSelectedId(null);
    expect(useAwardStore.getState().selectedId).toBe(null);
  });

  it('reset은 모든 상태를 초기화한다', () => {
    useAwardStore.getState().handleYearChange(2022);
    useAwardStore.getState().setCurrentPage(4);
    useAwardStore.getState().setSelectedId(10);
    useAwardStore.getState().reset();
    expect(useAwardStore.getState().activeYear).toBe(YEAR_ALL);
    expect(useAwardStore.getState().currentPage).toBe(0);
    expect(useAwardStore.getState().selectedId).toBe(null);
  });
});

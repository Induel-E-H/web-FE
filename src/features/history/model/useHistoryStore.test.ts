import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BOOK_STATE, FLIP_DURATION } from './constants';
import { useHistoryStore } from './useHistoryStore';

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.getState().reset();
  });

  afterEach(() => {
    useHistoryStore.getState().reset();
  });

  it('초기 bookState는 cover-front이다', () => {
    expect(useHistoryStore.getState().bookState).toBe(BOOK_STATE.COVER_FRONT);
  });

  it('초기 isFlipping은 false이다', () => {
    expect(useHistoryStore.getState().isFlipping).toBe(false);
  });

  it('초기 flipDirection은 null이다', () => {
    expect(useHistoryStore.getState().flipDirection).toBe(null);
  });

  it('초기 currentFlipDuration은 FLIP_DURATION이다', () => {
    expect(useHistoryStore.getState().currentFlipDuration).toBe(FLIP_DURATION);
  });

  it('초기 isRapidFlipping은 false이다', () => {
    expect(useHistoryStore.getState().isRapidFlipping).toBe(false);
  });

  it('초기 tabActiveItem은 List이다', () => {
    expect(useHistoryStore.getState().tabActiveItem).toBe('List');
  });

  it('초기 isHoldChaining은 false이다', () => {
    expect(useHistoryStore.getState().isHoldChaining).toBe(false);
  });

  it('초기 activeItem은 List이다', () => {
    expect(useHistoryStore.getState().activeItem).toBe('List');
  });

  it('초기 pageIndices는 모두 0이다', () => {
    const { pageIndices } = useHistoryStore.getState();
    expect(pageIndices['List']).toBe(0);
    expect(pageIndices['Content']).toBe(0);
    expect(pageIndices['Timeline']).toBe(0);
    expect(pageIndices['Milestones']).toBe(0);
  });

  it('setBookState는 bookState를 변경한다', () => {
    useHistoryStore.getState().setBookState('open');
    expect(useHistoryStore.getState().bookState).toBe('open');
  });

  it('setActiveItem은 activeItem을 변경한다', () => {
    useHistoryStore.getState().setActiveItem('Content');
    expect(useHistoryStore.getState().activeItem).toBe('Content');
  });

  it('setPageIndices는 함수형 업데이트를 지원한다', () => {
    useHistoryStore
      .getState()
      .setPageIndices((prev) => ({ ...prev, Content: 2 }));
    expect(useHistoryStore.getState().pageIndices['Content']).toBe(2);
    expect(useHistoryStore.getState().pageIndices['List']).toBe(0);
  });

  it('reset은 모든 상태를 초기화한다', () => {
    useHistoryStore.getState().setBookState('open');
    useHistoryStore.getState().setIsFlipping(true);
    useHistoryStore.getState().setActiveItem('Timeline');
    useHistoryStore.getState().reset();
    expect(useHistoryStore.getState().bookState).toBe(BOOK_STATE.COVER_FRONT);
    expect(useHistoryStore.getState().isFlipping).toBe(false);
    expect(useHistoryStore.getState().activeItem).toBe('List');
  });
});

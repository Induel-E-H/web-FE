import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FLIP_DURATION } from './constants';
import { useBookNavigation } from './useBookNavigation';
import { useHistoryStore } from './useHistoryStore';

describe('useBookNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useHistoryStore.getState().reset();
  });

  afterEach(() => {
    vi.useRealTimers();
    useHistoryStore.getState().reset();
  });

  it('초기 activeItem은 List이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.activeItem).toBe('List');
  });

  it('초기 currentPageIndex는 0이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.currentPageIndex).toBe(0);
  });

  it('초기 canGoLeft는 false이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.canGoLeft).toBe(false);
  });

  it('초기 canGoRight는 true이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.canGoRight).toBe(true);
  });

  it('초기 isFlipping은 false이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.isFlipping).toBe(false);
  });

  it('초기 flipDirection은 null이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.flipDirection).toBe(null);
  });

  it('초기 tabActiveItem은 List이다', () => {
    const { result } = renderHook(() => useBookNavigation('desktop'));
    expect(result.current.tabActiveItem).toBe('List');
  });

  describe('startFlipAnimation', () => {
    it('forward 방향으로 flip 시작 시 isFlipping=true가 된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.startFlipAnimation('forward', () => {});
      });
      expect(result.current.isFlipping).toBe(true);
      expect(result.current.flipDirection).toBe('forward');
    });

    it('FLIP_DURATION 후 isFlipping이 false로 리셋된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.startFlipAnimation('forward', () => {});
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.isFlipping).toBe(false);
    });
  });

  describe('navigateToCategory', () => {
    it('현재 위치와 동일한 카테고리/페이지로 이동 시 무시된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('List', 0);
      });
      expect(result.current.isFlipping).toBe(false);
    });

    it('다른 카테고리로 이동 시 flip이 시작된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      expect(result.current.isFlipping).toBe(true);
    });

    it('앞 카테고리로 이동하면 forward 방향으로 flip된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('Timeline', 0);
      });
      expect(result.current.flipDirection).toBe('forward');
    });

    it('애니메이션 완료 후 activeItem이 변경된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      act(() => {
        result.current.navigateToCategory('Timeline', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.activeItem).toBe('Timeline');
    });
  });

  describe('shadow count', () => {
    it('초기 leftShadowCount는 0이다 (List, page 0)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      expect(result.current.leftShadowCount).toBe(0);
    });

    it('초기 rightShadowCount는 0이 아니다 (남은 페이지가 충분히 많음)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      expect(result.current.rightShadowCount).toBeGreaterThan(0);
    });
  });

  describe('노출 API', () => {
    it('syncBoundaryCallbacks가 반환값에 포함된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      expect(typeof result.current.syncBoundaryCallbacks).toBe('function');
    });

    it('syncCoverCallbacks가 반환값에 포함된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));
      expect(typeof result.current.syncCoverCallbacks).toBe('function');
    });
  });

  describe('breakpoint 변경', () => {
    it('tablet breakpoint에서도 초기 상태가 올바르다', () => {
      const { result } = renderHook(() => useBookNavigation('tablet'));
      expect(result.current.activeItem).toBe('List');
      expect(result.current.canGoLeft).toBe(false);
    });

    it('mobile breakpoint에서도 초기 상태가 올바르다', () => {
      const { result } = renderHook(() => useBookNavigation('mobile'));
      expect(result.current.activeItem).toBe('List');
      expect(result.current.canGoLeft).toBe(false);
    });
  });

  describe('navigateRight (beginContinuousFlip right)', () => {
    it('Content 내에서 오른쪽으로 이동 시 pageIndex가 1 증가한다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.activeItem).toBe('Content');

      act(() => {
        result.current.beginContinuousFlip('right');
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.currentPageIndex).toBe(1);
    });

    it('List 마지막 페이지에서 오른쪽으로 이동 시 Content로 넘어간다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.beginContinuousFlip('right');
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.activeItem).toBe('Content');
    });

    it('isFlipping이 true이면 flipDirection이 설정된다 (shadow backward branch)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      act(() => {
        result.current.beginContinuousFlip('right');
      });
      expect(result.current.isFlipping).toBe(true);
      expect(result.current.flipDirection).toBe('forward');
    });
  });

  describe('navigateLeft (beginContinuousFlip left)', () => {
    it('Content 페이지 1에서 왼쪽으로 이동 시 pageIndex가 0이 된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 1);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.currentPageIndex).toBe(1);

      act(() => {
        result.current.beginContinuousFlip('left');
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.currentPageIndex).toBe(0);
    });

    it('Content 페이지 0에서 왼쪽으로 이동 시 List로 넘어간다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      act(() => {
        result.current.beginContinuousFlip('left');
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.activeItem).toBe('List');
    });

    it('왼쪽 이동 중 flipDirection이 backward이다 (shadow backward branch)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      act(() => {
        result.current.beginContinuousFlip('left');
      });
      expect(result.current.flipDirection).toBe('backward');
    });
  });

  describe('navigateToCategory with useRapidFlip=true', () => {
    it('여러 단계 rapid flip 시 startRapidSequence가 호출된다 (Timeline으로 이동)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Timeline', 0, true);
      });
      expect(result.current.isFlipping).toBe(true);
      expect(result.current.isRapidFlipping).toBe(true);
    });

    it('단일 단계 rapid flip은 일반 flip으로 처리된다 (Content→List)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0, true);
      });
      expect(result.current.isFlipping).toBe(true);
      expect(result.current.isRapidFlipping).toBe(false);
    });

    it('단일 단계 rapid flip 완료 후 activeItem이 변경된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0, true);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });
      expect(result.current.activeItem).toBe('Content');
    });

    it('역방향 navigateToCategory - backward direction', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Milestones', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      act(() => {
        result.current.navigateToCategory('List', 0, true);
      });
      expect(result.current.isFlipping).toBe(true);
    });

    it('같은 카테고리 내 다른 페이지로 rapid flip 이동 (Content 페이지 5로)', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Content', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      act(() => {
        result.current.navigateToCategory('Content', 5, true);
      });
      expect(result.current.isFlipping).toBe(true);
    });
  });

  describe('shadow count 계산 (flipDirection 분기)', () => {
    it('backward 방향 flip 중 leftShadowCount/rightShadowCount가 계산된다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Milestones', 0);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      act(() => {
        result.current.beginContinuousFlip('left');
      });

      expect(result.current.flipDirection).toBe('backward');
      expect(result.current.leftShadowCount).toBeGreaterThanOrEqual(0);
      expect(result.current.rightShadowCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('canGoRight=false 경계 처리', () => {
    it('Milestones 마지막 페이지로 이동하면 canGoRight=false이다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Milestones', 2);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      expect(result.current.activeItem).toBe('Milestones');
      expect(result.current.canGoRight).toBe(false);
    });

    it('canGoRight=false 상태에서 beginContinuousFlip(right)는 flip을 시작하지 않는다', () => {
      const { result } = renderHook(() => useBookNavigation('desktop'));

      act(() => {
        result.current.navigateToCategory('Milestones', 2);
      });
      act(() => {
        vi.advanceTimersByTime(FLIP_DURATION);
      });

      expect(result.current.canGoRight).toBe(false);

      act(() => {
        result.current.beginContinuousFlip('right');
      });
      expect(result.current.isFlipping).toBe(false);
    });
  });
});

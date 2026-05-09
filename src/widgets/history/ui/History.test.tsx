import { useHistoryStore } from '@features/history';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { History } from './History';

// useBreakpoint가 모듈 로드 시 window.matchMedia를 호출하므로 모듈 자체를 mock
vi.mock('@shared/lib/breakpoint/useBreakpoint', () => ({
  useBreakpoint: () => 'desktop' as const,
}));

describe('History', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    useHistoryStore.getState().reset();
  });

  it('history 섹션이 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history')).toBeInTheDocument();
  });

  it('HistoryTitle이 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__title')).toBeInTheDocument();
  });

  it('HistoryCategory가 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__category')).toBeInTheDocument();
  });

  it('history__book 영역이 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__book')).toBeInTheDocument();
  });

  it('초기 상태에서 앞표지(BookFrontCover)가 렌더링된다', () => {
    const { container } = render(<History />);
    expect(
      container.querySelector('.history__front-cover'),
    ).toBeInTheDocument();
  });

  it('초기 상태에서 HistoryCategory의 List 탭이 active이다', () => {
    render(<History />);
    const listTab = screen.getByRole('button', { name: 'List' });
    expect(listTab).toHaveClass('active');
  });

  describe('앞표지 클릭 — handleFrontCoverClick', () => {
    it('앞표지 클릭 후 400ms 경과 시 bookState가 opening-front로 변경된다', () => {
      // BookFrontCover는 requestAnimationFrame으로 centered=true가 된 후에만 클릭을 허용한다.
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      vi.stubGlobal('cancelAnimationFrame', () => {});

      const { container } = render(<History />);
      const frontCover = container.querySelector('.history__front-cover');
      act(() => {
        fireEvent.click(frontCover!);
      });
      act(() => {
        vi.advanceTimersByTime(400); // COVER_MOVE_DURATION
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-front');
    });
  });

  describe('왼쪽 페이지 mousedown — handleLeftMouseDown', () => {
    it('책이 open이고 canGoLeft=false(pageIndex=0)이면 closing-front로 변경된다', () => {
      useHistoryStore.setState({ bookState: 'open' });
      const { container } = render(<History />);
      const leftPage = container.querySelector('.history__book-page-left');
      fireEvent.mouseDown(leftPage!);
      expect(useHistoryStore.getState().bookState).toBe('closing-front');
    });
  });

  describe('카테고리 클릭 — handleNavigateToCategory', () => {
    it('책이 open 상태에서 Content 탭 클릭 시 플립 애니메이션이 시작된다', () => {
      useHistoryStore.setState({ bookState: 'open' });
      render(<History />);
      const contentBtn = screen.getByRole('button', { name: 'Content' });
      fireEvent.click(contentBtn);
      // navigateToCategory → startFlipAnimation → isFlipping=true (동기 변경)
      expect(useHistoryStore.getState().isFlipping).toBe(true);
      expect(useHistoryStore.getState().flipDirection).toBe('forward');
    });

    it('앞표지 상태에서 카테고리 클릭 시 bookState가 opening-front로 변경된다', () => {
      render(<History />);
      const timelineBtn = screen.getByRole('button', { name: 'Timeline' });
      fireEvent.click(timelineBtn);
      // handleNavigateToCategory → openingFront() 동기 호출
      expect(useHistoryStore.getState().bookState).toBe('opening-front');
    });
  });
});

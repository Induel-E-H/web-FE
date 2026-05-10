import { RAPID_FLIP_DURATION, useHistoryStore } from '@features/history';
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

    it('책이 open이고 canGoLeft=true이면 backward flip이 시작된다', () => {
      useHistoryStore.setState({
        bookState: 'open',
        activeItem: 'Content',
        pageIndices: { List: 0, Content: 1, Timeline: 0, Milestones: 0 },
      });
      const { container } = render(<History />);
      const leftPage = container.querySelector('.history__book-page-left');
      fireEvent.mouseDown(leftPage!);
      expect(useHistoryStore.getState().isFlipping).toBe(true);
      expect(useHistoryStore.getState().flipDirection).toBe('backward');
    });
  });

  describe('키보드 경계 내비게이션', () => {
    it('open 상태에서 ArrowLeft 키 입력 시 왼쪽 경계 콜백이 호출되어 closing-front로 변경된다', () => {
      useHistoryStore.setState({ bookState: 'open' }); // List page 0 → canGoLeft=false
      render(<History />);
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('closing-front');
    });

    it('open 상태 마지막 페이지에서 ArrowRight 키 입력 시 오른쪽 경계 콜백이 호출되어 closing-back으로 변경된다', () => {
      useHistoryStore.setState({
        bookState: 'open',
        activeItem: 'Milestones',
        pageIndices: { List: 0, Content: 0, Timeline: 0, Milestones: 2 },
      });
      render(<History />);
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('closing-back');
    });

    it('앞표지 상태에서 ArrowRight 키 입력 시 opening-front로 변경된다', () => {
      render(<History />); // bookState='cover-front' (기본값)
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-front');
    });

    it('뒤표지 상태에서 ArrowLeft 키 입력 시 opening-back으로 변경된다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      render(<History />);
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-back');
    });
  });

  describe('표지 클릭 — 애니메이션 중 재클릭 무시', () => {
    it('앞표지 클릭 중 isAnimating=true이면 두 번째 클릭이 무시된다', () => {
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      vi.stubGlobal('cancelAnimationFrame', () => {});
      const { container } = render(<History />);

      const firstFrontCover = container.querySelector('.history__front-cover');
      act(() => {
        fireEvent.click(firstFrontCover!);
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-front');

      // bookState 리셋 → BookFrontCover 재마운트 (centered=true via RAF stub)
      act(() => {
        useHistoryStore.setState({ bookState: 'cover-front' });
      });
      // 재마운트된 DOM 요소를 새로 쿼리
      const secondFrontCover = container.querySelector('.history__front-cover');
      act(() => {
        fireEvent.click(secondFrontCover!);
      });
      // 400ms 진행: handleFrontCoverClick 호출되지만 isAnimatingRef=true → 즉시 반환
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-front');
    });

    it('뒤표지 클릭 중 isAnimating=true이면 두 번째 클릭이 무시된다', () => {
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      vi.stubGlobal('cancelAnimationFrame', () => {});
      useHistoryStore.setState({ bookState: 'cover-back' });
      const { container } = render(<History />);

      const firstBackCover = container.querySelector('.history__back-cover');
      act(() => {
        fireEvent.click(firstBackCover!);
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-back');

      act(() => {
        useHistoryStore.setState({ bookState: 'cover-back' });
      });
      const secondBackCover = container.querySelector('.history__back-cover');
      act(() => {
        fireEvent.click(secondBackCover!);
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-back');
    });
  });

  describe('키보드 경계 콜백 — non-open 상태에서 무시', () => {
    it('cover-front 상태에서 ArrowLeft 키 입력 시 경계 콜백이 아무것도 하지 않는다', () => {
      render(<History />); // bookState='cover-front'
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-front');
    });

    it('cover-back 상태에서 ArrowRight 키 입력 시 경계 콜백이 아무것도 하지 않는다', () => {
      useHistoryStore.setState({
        bookState: 'cover-back',
        activeItem: 'Milestones',
        pageIndices: { List: 0, Content: 0, Timeline: 0, Milestones: 2 },
      });
      render(<History />);
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-back');
    });

    it('cover-front에서 ArrowRight 키를 두 번 누르면 두 번째 커버 열기가 무시된다', () => {
      render(<History />);
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-front');

      act(() => {
        useHistoryStore.setState({ bookState: 'cover-front' });
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-front');
    });

    it('cover-back에서 ArrowLeft 키를 두 번 누르면 두 번째 커버 열기가 무시된다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      render(<History />);
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-back');

      act(() => {
        useHistoryStore.setState({ bookState: 'cover-back' });
      });
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-back');
    });
  });

  describe('애니메이션 진행 중 이벤트 보호', () => {
    it('open 상태에서 isAnimating=true이면 leftMouseDown이 closingFront를 재호출하지 않는다', () => {
      useHistoryStore.setState({ bookState: 'open' });
      const { container } = render(<History />);
      const leftPage = container.querySelector('.history__book-page-left');

      fireEvent.mouseDown(leftPage!);
      expect(useHistoryStore.getState().bookState).toBe('closing-front');

      act(() => {
        useHistoryStore.setState({ bookState: 'open' });
      });
      fireEvent.mouseDown(leftPage!);
      expect(useHistoryStore.getState().bookState).toBe('open');
    });

    it('open 상태에서 isAnimating=true이면 rightMouseDown이 closingBack을 재호출하지 않는다', () => {
      useHistoryStore.setState({
        bookState: 'open',
        activeItem: 'Milestones',
        pageIndices: { List: 0, Content: 0, Timeline: 0, Milestones: 2 },
      });
      const { container } = render(<History />);
      const rightPage = container.querySelector('.history__book-page-right');

      fireEvent.mouseDown(rightPage!);
      expect(useHistoryStore.getState().bookState).toBe('closing-back');

      act(() => {
        useHistoryStore.setState({ bookState: 'open' });
      });
      fireEvent.mouseDown(rightPage!);
      expect(useHistoryStore.getState().bookState).toBe('open');
    });

    it('cover-front 상태에서 isAnimating=true이면 카테고리 클릭이 무시된다', () => {
      render(<History />);
      const timelineBtn = screen.getByRole('button', { name: 'Timeline' });

      act(() => {
        fireEvent.click(timelineBtn);
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-front');

      act(() => {
        useHistoryStore.setState({ bookState: 'cover-front' });
      });
      act(() => {
        fireEvent.click(timelineBtn);
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-front');
    });

    it('cover-back 상태에서 isAnimating=true이면 카테고리 클릭이 무시된다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      render(<History />);
      const contentBtn = screen.getByRole('button', { name: 'Content' });

      act(() => {
        fireEvent.click(contentBtn);
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-back');

      act(() => {
        useHistoryStore.setState({ bookState: 'cover-back' });
      });
      act(() => {
        fireEvent.click(contentBtn);
      });
      expect(useHistoryStore.getState().bookState).toBe('cover-back');
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

    it('뒤표지 상태에서 카테고리 클릭 시 bookState가 opening-back으로 변경된다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      render(<History />);
      const contentBtn = screen.getByRole('button', { name: 'Content' });
      fireEvent.click(contentBtn);
      expect(useHistoryStore.getState().bookState).toBe('opening-back');
    });
  });

  describe('오른쪽 페이지 mousedown — handleRightMouseDown', () => {
    it('책이 open이고 canGoRight=true이면 forward flip이 시작된다', () => {
      useHistoryStore.setState({ bookState: 'open' });
      const { container } = render(<History />);
      const rightPage = container.querySelector('.history__book-page-right');
      fireEvent.mouseDown(rightPage!);
      expect(useHistoryStore.getState().isFlipping).toBe(true);
      expect(useHistoryStore.getState().flipDirection).toBe('forward');
    });

    it('책이 open이고 canGoRight=false(마지막 페이지)이면 closing-back으로 변경된다', () => {
      useHistoryStore.setState({
        bookState: 'open',
        activeItem: 'Milestones',
        pageIndices: { List: 0, Content: 0, Timeline: 0, Milestones: 2 },
      });
      const { container } = render(<History />);
      const rightPage = container.querySelector('.history__book-page-right');
      fireEvent.mouseDown(rightPage!);
      expect(useHistoryStore.getState().bookState).toBe('closing-back');
    });
  });

  describe('뒤표지 클릭 — handleBackCoverClick', () => {
    it('뒤표지 클릭 후 400ms 경과 시 bookState가 opening-back으로 변경된다', () => {
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      vi.stubGlobal('cancelAnimationFrame', () => {});
      useHistoryStore.setState({ bookState: 'cover-back' });
      const { container } = render(<History />);
      const backCover = container.querySelector('.history__back-cover');
      act(() => {
        fireEvent.click(backCover!);
      });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-back');
    });
  });

  describe('flipDirection 분기 렌더링', () => {
    it('bookState=opening-front이면 isCoverFlip=true 경로로 정상 렌더링된다', () => {
      useHistoryStore.setState({ bookState: 'opening-front' });
      const { container } = render(<History />);
      expect(container.querySelector('.history__book')).toBeInTheDocument();
    });

    it('flipDirection=forward이면 forward 경로로 정상 렌더링된다', () => {
      useHistoryStore.setState({
        bookState: 'open',
        isFlipping: true,
        flipDirection: 'forward',
      });
      const { container } = render(<History />);
      expect(container.querySelector('.history__book')).toBeInTheDocument();
    });

    it('flipDirection=backward이면 backward 경로로 정상 렌더링된다', () => {
      useHistoryStore.setState({
        bookState: 'open',
        activeItem: 'Content',
        isFlipping: true,
        flipDirection: 'backward',
      });
      const { container } = render(<History />);
      expect(container.querySelector('.history__book')).toBeInTheDocument();
    });
  });

  describe('리스트 항목 클릭 — handleListItemClick', () => {
    it('List 페이지 항목 클릭 시 Content로 flip이 시작된다', () => {
      useHistoryStore.setState({ bookState: 'open' });
      const { container } = render(<History />);
      const listButtons = container.querySelectorAll('.list__ul button');
      fireEvent.click(listButtons[0]);
      expect(useHistoryStore.getState().isFlipping).toBe(true);
    });
  });

  describe('pendingCategory useEffect', () => {
    it('앞표지에서 카테고리 클릭 후 flip 완료 시 해당 카테고리 탐색이 시작된다', () => {
      render(<History />);
      const timelineBtn = screen.getByRole('button', { name: 'Timeline' });
      act(() => {
        fireEvent.click(timelineBtn);
      });
      expect(useHistoryStore.getState().bookState).toBe('opening-front');

      act(() => {
        vi.advanceTimersByTime(RAPID_FLIP_DURATION);
      });
      expect(useHistoryStore.getState().bookState).toBe('open');

      act(() => {
        vi.runAllTimers();
      });
      expect(useHistoryStore.getState().activeItem).toBe('Timeline');
    });
  });

  describe('페이지 flip 완료 후 aria-live 안내', () => {
    it('flip 완료 후 aria-live 영역에 페이지 정보가 표시된다', () => {
      useHistoryStore.setState({ bookState: 'open' });
      const { container } = render(<History />);
      const rightPage = container.querySelector('.history__book-page-right');

      act(() => {
        fireEvent.mouseDown(rightPage!);
        window.dispatchEvent(new MouseEvent('mouseup'));
      });

      act(() => {
        vi.runAllTimers();
      });

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent).not.toBe('');
    });
  });
});

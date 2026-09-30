import type { ComponentProps } from 'react';

import { buildLeaves, findLeafIndex } from '@features/history';
import {
  trackHistoryCategoryChange,
  trackHistoryCoverOpen,
  trackHistoryPageTurn,
} from '@shared/lib/analytics';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Book } from './book/Book';
import { History } from './History';

// useBreakpoint가 모듈 로드 시 window.matchMedia를 호출하므로 모듈 자체를 mock
vi.mock('@shared/lib/breakpoint/useBreakpoint', () => ({
  useBreakpoint: () => 'desktop' as const,
}));

vi.mock('@shared/lib/analytics', () => ({
  trackHistoryCategoryChange: vi.fn(),
  trackHistoryCoverOpen: vi.fn(),
  trackHistoryPageTurn: vi.fn(),
  trackHistoryArtworkGalleryOpen: vi.fn(),
}));

const engine = vi.hoisted(() => ({
  visible: [0] as number[],
  handle: {
    flipNext: vi.fn(() => true),
    flipPrev: vi.fn(() => true),
    turnToPage: vi.fn(() => true),
    pageFlip: () => ({
      getVisiblePages: () => engine.visible,
      isAnimating: () => false,
      updateSettings: vi.fn(),
    }),
  },
  props: null as ComponentProps<typeof Book> | null,
}));

vi.mock('./book/Book', () => ({
  Book: (props: ComponentProps<typeof Book>) => {
    engine.props = props;
    (props.bookRef as { current: unknown }).current = engine.handle;
    return <div data-testid='book' />;
  },
}));

const leaves = buildLeaves('desktop');

function turnTo(page: number) {
  engine.visible = [page];
  act(() =>
    engine.props?.onPageChange({
      page,
      pageCount: leaves.length,
      orientation: 'landscape',
      visiblePages: [page],
    }),
  );
}

describe('History', () => {
  beforeEach(() => {
    engine.visible = [0];
    vi.clearAllMocks();
  });

  it('타이틀, 카테고리, 책을 렌더링한다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__title')).toBeInTheDocument();
    expect(container.querySelector('.history__category')).toBeInTheDocument();
    expect(screen.getByTestId('book')).toBeInTheDocument();
  });

  it('책에 앞표지부터 뒤표지까지의 장 목록을 가로 모드로 전달한다', () => {
    render(<History />);
    expect(engine.props?.leaves).toEqual(leaves);
    expect(engine.props?.landscape).toBe(true);
  });

  describe('활성 카테고리', () => {
    it('처음에는 List 가 활성이다', () => {
      render(<History />);
      expect(screen.getByRole('button', { name: 'List' })).toHaveClass(
        'active',
      );
    });

    it('펼친 페이지의 카테고리가 활성화된다', () => {
      render(<History />);
      turnTo(findLeafIndex(leaves, 'Timeline'));
      expect(screen.getByRole('button', { name: 'Timeline' })).toHaveClass(
        'active',
      );
    });
  });

  describe('카테고리 이동', () => {
    it('카테고리를 누르면 이벤트를 기록하고 해당 방향으로 넘기기 시작한다', () => {
      render(<History />);
      fireEvent.click(screen.getByRole('button', { name: 'Milestones' }));
      expect(trackHistoryCategoryChange).toHaveBeenCalledWith('Milestones');
      expect(engine.handle.flipNext).toHaveBeenCalledTimes(1);
    });

    it('앞쪽 카테고리는 뒤로 넘긴다', () => {
      render(<History />);
      turnTo(findLeafIndex(leaves, 'Timeline'));
      fireEvent.click(screen.getByRole('button', { name: 'List' }));
      expect(engine.handle.flipPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe('분석 이벤트', () => {
    it('앞표지에서 넘기면 cover open(front)을 기록한다', () => {
      render(<History />);
      turnTo(1);
      expect(trackHistoryCoverOpen).toHaveBeenCalledWith('front');
    });

    it('뒤표지에서 넘기면 cover open(back)을 기록한다', () => {
      render(<History />);
      turnTo(leaves.length - 1);
      turnTo(leaves.length - 3);
      expect(trackHistoryCoverOpen).toHaveBeenCalledWith('back');
    });

    it('페이지를 넘긴 방향을 기록한다', () => {
      render(<History />);
      turnTo(1);
      turnTo(3);
      expect(trackHistoryPageTurn).toHaveBeenLastCalledWith('forward');
      turnTo(1);
      expect(trackHistoryPageTurn).toHaveBeenLastCalledWith('backward');
    });

    it('여러 장 연속 이동 중에는 페이지 넘김을 기록하지 않는다', () => {
      render(<History />);
      turnTo(1);
      fireEvent.click(screen.getByRole('button', { name: 'Milestones' }));
      vi.mocked(trackHistoryPageTurn).mockClear();
      turnTo(3);
      expect(trackHistoryPageTurn).not.toHaveBeenCalled();
    });
  });
});

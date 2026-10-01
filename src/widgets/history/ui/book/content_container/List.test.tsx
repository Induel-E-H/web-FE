import { artworks } from '@entities/history';
import { LIST_ITEMS_PER_PAGE } from '@features/history';
import { useBreakpoint } from '@shared/lib/breakpoint';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListPage } from './List';

vi.mock('@shared/lib/breakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('desktop'),
}));

describe('ListPage', () => {
  describe('렌더링', () => {
    it('"작품 목록" 레이블의 nav가 렌더링된다', () => {
      render(<ListPage side='left' />);
      expect(
        screen.getByRole('navigation', { name: '작품 목록' }),
      ).toBeInTheDocument();
    });

    it('첫 쪽은 앞에서부터 LIST_ITEMS_PER_PAGE 개의 작품 버튼을 렌더링한다', () => {
      render(<ListPage side='left' />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(LIST_ITEMS_PER_PAGE);
      expect(buttons[0]).toHaveTextContent(artworks[0].title);
    });

    it('첫 쪽에서 타이틀 h3이 보인다', () => {
      render(<ListPage side='left' />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('List');
      expect(heading.closest('.book-page-title')).not.toHaveClass(
        'book-page-title--hidden',
      );
    });

    it.each([
      ['right', 0],
      ['left', 1],
    ] as const)(
      '첫 쪽이 아니면(side=%s, pageIndex=%i) 타이틀이 hidden 상태이다',
      (side, pageIndex) => {
        render(<ListPage side={side} pageIndex={pageIndex} />);
        expect(
          screen.getByRole('heading', { level: 3 }).closest('.book-page-title'),
        ).toHaveClass('book-page-title--hidden');
      },
    );

    it('다음 쪽은 앞쪽에 이어지는 작품부터 렌더링한다', () => {
      render(<ListPage side='right' />);
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent(artworks[LIST_ITEMS_PER_PAGE].title);
    });
  });

  describe('클릭 이벤트', () => {
    it('left side 첫 번째 버튼 클릭 시 index=0으로 onItemClick이 호출된다', () => {
      const onItemClick = vi.fn();
      render(<ListPage side='left' onItemClick={onItemClick} />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(onItemClick).toHaveBeenCalledWith(0);
    });

    it('다음 쪽 첫 번째 버튼 클릭 시 이어지는 작품 인덱스로 호출된다', () => {
      const onItemClick = vi.fn();
      render(<ListPage side='right' onItemClick={onItemClick} />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(onItemClick).toHaveBeenCalledWith(LIST_ITEMS_PER_PAGE);
    });

    it('onItemClick이 없어도 클릭 시 오류가 발생하지 않는다', () => {
      render(<ListPage side='left' />);
      expect(() =>
        fireEvent.click(screen.getAllByRole('button')[0]),
      ).not.toThrow();
    });

    it('버튼 mousedown 시 이벤트 전파가 차단된다', () => {
      const { container } = render(<ListPage side='left' />);
      const button = screen.getAllByRole('button')[0];
      const parentHandler = vi.fn();
      container.addEventListener('mousedown', parentHandler);
      fireEvent.mouseDown(button);
      container.removeEventListener('mousedown', parentHandler);
    });

    it('버튼 keydown 시 React 이벤트 전파가 차단된다', () => {
      const parentKeyDown = vi.fn();
      render(
        <div onKeyDown={parentKeyDown}>
          <ListPage side='left' />
        </div>,
      );
      fireEvent.keyDown(screen.getAllByRole('button')[0], { key: 'Enter' });
      expect(parentKeyDown).not.toHaveBeenCalled();
    });
  });

  describe('모바일 breakpoint', () => {
    afterEach(() => {
      vi.mocked(useBreakpoint).mockReturnValue('desktop');
    });

    it('mobile breakpoint에서 버튼 mousedown 시 이벤트 전파가 차단되지 않는다', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile');
      const parentMouseDown = vi.fn();
      render(
        <div onMouseDown={parentMouseDown}>
          <ListPage side='left' />
        </div>,
      );
      fireEvent.mouseDown(screen.getAllByRole('button')[0]);
      expect(parentMouseDown).toHaveBeenCalled();
    });
  });
});

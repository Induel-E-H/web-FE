import { artworks } from '@entities/history';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ListPage } from './List';

const midpoint = Math.ceil(artworks.length / 2);

describe('ListPage', () => {
  describe('렌더링', () => {
    it('"작품 목록" 레이블의 nav가 렌더링된다', () => {
      render(<ListPage side='left' />);
      expect(
        screen.getByRole('navigation', { name: '작품 목록' }),
      ).toBeInTheDocument();
    });

    it('left side는 앞쪽 절반의 작품 버튼을 렌더링한다', () => {
      render(<ListPage side='left' />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(midpoint);
      expect(buttons[0]).toHaveTextContent(artworks[0].title);
    });

    it('right side는 뒷쪽 절반의 작품 버튼을 렌더링한다', () => {
      render(<ListPage side='right' />);
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent(artworks[midpoint].title);
    });

    it('left side에서 타이틀 h3이 보인다', () => {
      render(<ListPage side='left' />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'List',
      );
    });

    it('right side에서 타이틀은 hidden 상태이다', () => {
      render(<ListPage side='right' />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.closest('.book-page-title')).toHaveClass(
        'book-page-title--hidden',
      );
    });
  });

  describe('클릭 이벤트', () => {
    it('left side 첫 번째 버튼 클릭 시 index=0으로 onItemClick이 호출된다', () => {
      const onItemClick = vi.fn();
      render(<ListPage side='left' onItemClick={onItemClick} />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(onItemClick).toHaveBeenCalledWith(0);
    });

    it('right side 첫 번째 버튼 클릭 시 midpoint 인덱스로 호출된다', () => {
      const onItemClick = vi.fn();
      render(<ListPage side='right' onItemClick={onItemClick} />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(onItemClick).toHaveBeenCalledWith(midpoint);
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
  });
});

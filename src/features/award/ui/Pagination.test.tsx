import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  describe('렌더링', () => {
    it('이전/다음 버튼이 렌더링된다', () => {
      render(
        <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole('button', { name: '이전 페이지' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '다음 페이지' }),
      ).toBeInTheDocument();
    });

    it('totalPages 수만큼 dot 버튼이 렌더링된다', () => {
      render(
        <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole('button', { name: '1페이지' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '2페이지' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '3페이지' }),
      ).toBeInTheDocument();
    });

    it('페이지 정보(currentPage+1/totalPages)가 표시된다', () => {
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });
  });

  describe('활성 dot', () => {
    it('currentPage에 해당하는 dot에 aria-current="page"가 설정된다', () => {
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: '2페이지' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('비활성 dot에는 aria-current가 없다', () => {
      render(
        <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole('button', { name: '1페이지' }),
      ).not.toHaveAttribute('aria-current');
    });

    it('활성 dot에 --active 클래스가 적용된다', () => {
      render(
        <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: '1페이지' })).toHaveClass(
        'award__pagination_dot--active',
      );
    });

    it('비활성 dot에는 --active 클래스가 없다', () => {
      render(
        <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: '2페이지' })).not.toHaveClass(
        'award__pagination_dot--active',
      );
    });
  });

  describe('클릭 이벤트', () => {
    it('dot 클릭 시 해당 페이지 인덱스로 onPageChange가 호출된다', () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={0}
          totalPages={3}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: '2페이지' }));

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('이전 버튼 클릭 시 wrapPage(currentPage-1, totalPages)로 호출된다', () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={0}
          totalPages={3}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: '이전 페이지' }));

      // wrapPage(-1, 3) = 2
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('다음 버튼 클릭 시 wrapPage(currentPage+1, totalPages)로 호출된다', () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: '다음 페이지' }));

      // wrapPage(3, 3) = 0
      expect(onPageChange).toHaveBeenCalledWith(0);
    });
  });
});

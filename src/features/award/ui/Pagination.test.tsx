import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAwardStore } from '../model/useAwardStore';
import { Pagination } from './Pagination';

vi.mock('@shared/lib/breakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('desktop'),
}));

// desktop → itemsPerPage=10. 30개 항목 → totalPages=3
vi.mock('@entities/award', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/award')>();
  const mockList = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    title: `수상 ${i}`,
    category: '당선작',
    date: `2020-01-${String(i + 1).padStart(2, '0')}`,
    issuer: '기관',
  }));
  return { ...actual, AWARD_LIST: mockList };
});

describe('Pagination', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  describe('렌더링', () => {
    it('이전/다음 버튼이 렌더링된다', () => {
      render(<Pagination />);
      expect(
        screen.getByRole('button', { name: '이전 페이지' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '다음 페이지' }),
      ).toBeInTheDocument();
    });

    it('totalPages 수만큼 dot 버튼이 렌더링된다', () => {
      render(<Pagination />);
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

    it('페이지 정보(safePage+1/totalPages)가 표시된다', () => {
      useAwardStore.setState({ currentPage: 1 });
      render(<Pagination />);
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });
  });

  describe('활성 dot', () => {
    it('currentPage에 해당하는 dot에 aria-current="page"가 설정된다', () => {
      useAwardStore.setState({ currentPage: 1 });
      render(<Pagination />);
      expect(screen.getByRole('button', { name: '2페이지' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('비활성 dot에는 aria-current가 없다', () => {
      useAwardStore.setState({ currentPage: 1 });
      render(<Pagination />);
      expect(
        screen.getByRole('button', { name: '1페이지' }),
      ).not.toHaveAttribute('aria-current');
    });

    it('활성 dot에 --active 클래스가 적용된다', () => {
      render(<Pagination />);
      expect(screen.getByRole('button', { name: '1페이지' })).toHaveClass(
        'award__pagination_dot--active',
      );
    });
  });

  describe('클릭 이벤트', () => {
    it('dot 클릭 시 스토어의 currentPage가 변경된다', () => {
      render(<Pagination />);
      fireEvent.click(screen.getByRole('button', { name: '2페이지' }));
      expect(useAwardStore.getState().currentPage).toBe(1);
    });

    it('이전 버튼 클릭 시 wrapPage(currentPage-1)로 이동한다', () => {
      useAwardStore.setState({ currentPage: 0 });
      render(<Pagination />);
      fireEvent.click(screen.getByRole('button', { name: '이전 페이지' }));
      // wrapPage(-1, 3) = 2
      expect(useAwardStore.getState().currentPage).toBe(2);
    });

    it('다음 버튼 클릭 시 wrapPage(currentPage+1)로 이동한다', () => {
      useAwardStore.setState({ currentPage: 2 });
      render(<Pagination />);
      fireEvent.click(screen.getByRole('button', { name: '다음 페이지' }));
      // wrapPage(3, 3) = 0
      expect(useAwardStore.getState().currentPage).toBe(0);
    });
  });
});

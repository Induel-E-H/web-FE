import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { YEAR_ALL } from '../model/constant';
import { useAwardStore } from '../model/useAwardStore';
import { YearCategory } from './YearCategory';

describe('YearCategory', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  describe('렌더링', () => {
    it('navigation 역할로 렌더링된다', () => {
      render(<YearCategory />);
      expect(
        screen.getByRole('navigation', { name: '연도 필터' }),
      ).toBeInTheDocument();
    });

    it('YEAR_LIST 항목 수만큼 버튼이 렌더링된다', () => {
      render(<YearCategory />);
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('"전체" 버튼이 렌더링된다', () => {
      render(<YearCategory />);
      expect(screen.getByText(YEAR_ALL)).toBeInTheDocument();
    });
  });

  describe('활성 상태', () => {
    it('초기 activeYear("전체") 버튼은 aria-current=true이다', () => {
      render(<YearCategory />);
      expect(screen.getByText(YEAR_ALL)).toHaveAttribute(
        'aria-current',
        'true',
      );
    });

    it('스토어에서 activeYear 변경 시 해당 버튼이 활성화된다', () => {
      useAwardStore.setState({ activeYear: 2008 });
      render(<YearCategory />);
      expect(screen.getByText('2008')).toHaveAttribute('aria-current', 'true');
      expect(screen.getByText(YEAR_ALL)).not.toHaveAttribute('aria-current');
    });

    it('활성 버튼에 active 클래스가 적용된다', () => {
      useAwardStore.setState({ activeYear: 2008 });
      render(<YearCategory />);
      expect(screen.getByText('2008')).toHaveClass(
        'award__year_category--active',
      );
    });

    it('비활성 버튼에는 active 클래스가 없다', () => {
      render(<YearCategory />);
      const buttons = screen.getAllByRole('button');
      const nonActiveButtons = buttons.filter(
        (btn) => !btn.classList.contains('award__year_category--active'),
      );
      expect(nonActiveButtons.length).toBeGreaterThan(0);
    });
  });

  describe('클릭 이벤트', () => {
    it('버튼 클릭 시 스토어의 activeYear가 변경된다', () => {
      render(<YearCategory />);
      fireEvent.click(screen.getByText(YEAR_ALL));
      expect(useAwardStore.getState().activeYear).toBe(YEAR_ALL);
    });

    it('연도 버튼 클릭 시 currentPage가 0으로 리셋된다', () => {
      useAwardStore.setState({ currentPage: 3 });
      render(<YearCategory />);
      const yearButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.textContent !== YEAR_ALL);
      if (yearButtons.length > 0) {
        fireEvent.click(yearButtons[0]);
        expect(useAwardStore.getState().currentPage).toBe(0);
      }
    });
  });
});

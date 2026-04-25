import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { YearCategory } from './YearCategory';

const yearList: (string | number)[] = ['전체', 2008, 2006, 2005];

describe('YearCategory', () => {
  describe('렌더링', () => {
    it('navigation 역할로 렌더링된다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear='전체'
          onYearChange={vi.fn()}
        />,
      );
      expect(
        screen.getByRole('navigation', { name: '연도 필터' }),
      ).toBeInTheDocument();
    });

    it('yearList 항목 수만큼 버튼이 렌더링된다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear='전체'
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getAllByRole('button')).toHaveLength(yearList.length);
    });

    it('각 연도 텍스트가 렌더링된다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear='전체'
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('전체')).toBeInTheDocument();
      expect(screen.getByText('2008')).toBeInTheDocument();
    });
  });

  describe('활성 상태', () => {
    it('activeYear 버튼은 aria-current=true이다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('2008')).toHaveAttribute('aria-current', 'true');
    });

    it('비활성 버튼은 aria-current가 없다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('전체')).not.toHaveAttribute('aria-current');
    });

    it('활성 버튼은 tabIndex=0이다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('2008')).toHaveAttribute('tabindex', '0');
    });

    it('비활성 버튼은 tabIndex=-1이다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('전체')).toHaveAttribute('tabindex', '-1');
    });

    it('활성 버튼에 active 클래스가 적용된다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('2008')).toHaveClass(
        'award__year_category--active',
      );
    });

    it('비활성 버튼에는 active 클래스가 없다', () => {
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={vi.fn()}
        />,
      );
      expect(screen.getByText('전체')).not.toHaveClass(
        'award__year_category--active',
      );
    });
  });

  describe('클릭 이벤트', () => {
    it('버튼 클릭 시 onYearChange가 해당 연도로 호출된다', () => {
      const onYearChange = vi.fn();
      render(
        <YearCategory
          yearList={yearList}
          activeYear='전체'
          onYearChange={onYearChange}
        />,
      );

      fireEvent.click(screen.getByText('2008'));

      expect(onYearChange).toHaveBeenCalledWith(2008);
    });

    it('전체 버튼 클릭 시 "전체" 문자열로 호출된다', () => {
      const onYearChange = vi.fn();
      render(
        <YearCategory
          yearList={yearList}
          activeYear={2008}
          onYearChange={onYearChange}
        />,
      );

      fireEvent.click(screen.getByText('전체'));

      expect(onYearChange).toHaveBeenCalledWith('전체');
    });
  });
});

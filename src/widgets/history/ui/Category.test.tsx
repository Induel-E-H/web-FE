import { INDEX_LIST } from '@features/history';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HistoryCategory } from './Category';

const defaultProps = {
  activeItem: 'List' as const,
  navigateToCategory: vi.fn(),
};

describe('HistoryCategory', () => {
  describe('렌더링', () => {
    it('navigation 역할로 렌더링된다', () => {
      render(<HistoryCategory {...defaultProps} />);
      expect(
        screen.getByRole('navigation', { name: '역사 카테고리' }),
      ).toBeInTheDocument();
    });

    it('INDEX_LIST 항목 수만큼 버튼이 렌더링된다', () => {
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.getAllByRole('button')).toHaveLength(INDEX_LIST.length);
    });

    it('각 카테고리 텍스트가 렌더링된다', () => {
      render(<HistoryCategory {...defaultProps} />);
      ['목차', '본문', '연혁', '주요 성과'].forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('항목 사이에 텍스트 구분자가 없다', () => {
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.queryByText('|')).not.toBeInTheDocument();
    });
  });

  describe('활성 상태', () => {
    it('activeItem 버튼은 aria-current=true이다', () => {
      render(<HistoryCategory {...defaultProps} activeItem='Timeline' />);
      expect(screen.getByText('연혁')).toHaveAttribute('aria-current', 'true');
    });

    it('비활성 버튼은 aria-current가 없다', () => {
      render(<HistoryCategory {...defaultProps} activeItem='Timeline' />);
      expect(screen.getByText('목차')).not.toHaveAttribute('aria-current');
    });

    it('활성 버튼에 active 클래스가 적용된다', () => {
      render(<HistoryCategory {...defaultProps} activeItem='Content' />);
      expect(screen.getByText('본문')).toHaveClass('active');
    });

    it('비활성 버튼에는 active 클래스가 없다', () => {
      render(<HistoryCategory {...defaultProps} activeItem='Content' />);
      expect(screen.getByText('목차')).not.toHaveClass('active');
    });
  });

  describe('클릭 이벤트', () => {
    it('버튼 클릭 시 navigateToCategory가 해당 항목으로 호출된다', () => {
      const navigateToCategory = vi.fn();
      render(
        <HistoryCategory
          {...defaultProps}
          navigateToCategory={navigateToCategory}
        />,
      );

      fireEvent.click(screen.getByText('연혁'));

      expect(navigateToCategory).toHaveBeenCalledWith('Timeline');
    });

    it('다른 항목 클릭 시 해당 항목으로 호출된다', () => {
      const navigateToCategory = vi.fn();
      render(
        <HistoryCategory
          {...defaultProps}
          navigateToCategory={navigateToCategory}
        />,
      );

      fireEvent.click(screen.getByText('주요 성과'));

      expect(navigateToCategory).toHaveBeenCalledWith('Milestones');
    });
  });
});

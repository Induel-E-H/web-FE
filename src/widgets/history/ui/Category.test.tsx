import { INDEX_LIST, useHistoryStore } from '@features/history';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HistoryCategory } from './Category';

const defaultProps = {
  navigateToCategory: vi.fn(),
};

describe('HistoryCategory', () => {
  beforeEach(() => {
    useHistoryStore.getState().reset();
  });

  afterEach(() => {
    useHistoryStore.getState().reset();
  });

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
      INDEX_LIST.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('항목 사이에 구분자가 렌더링된다', () => {
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.getAllByText('|')).toHaveLength(INDEX_LIST.length - 1);
    });
  });

  describe('활성 상태', () => {
    it('스토어의 tabActiveItem 버튼은 aria-current=true이다', () => {
      useHistoryStore.setState({ tabActiveItem: 'Timeline' });
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.getByText('Timeline')).toHaveAttribute(
        'aria-current',
        'true',
      );
    });

    it('비활성 버튼은 aria-current가 없다', () => {
      useHistoryStore.setState({ tabActiveItem: 'Timeline' });
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.getByText('List')).not.toHaveAttribute('aria-current');
    });

    it('활성 버튼에 active 클래스가 적용된다', () => {
      useHistoryStore.setState({ tabActiveItem: 'Content' });
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.getByText('Content')).toHaveClass('active');
    });

    it('비활성 버튼에는 active 클래스가 없다', () => {
      useHistoryStore.setState({ tabActiveItem: 'Content' });
      render(<HistoryCategory {...defaultProps} />);
      expect(screen.getByText('List')).not.toHaveClass('active');
    });
  });

  describe('클릭 이벤트', () => {
    it('버튼 클릭 시 navigateToCategory가 해당 항목으로 호출된다', () => {
      const navigateToCategory = vi.fn();
      render(<HistoryCategory navigateToCategory={navigateToCategory} />);

      fireEvent.click(screen.getByText('Timeline'));

      expect(navigateToCategory).toHaveBeenCalledWith('Timeline', 0, true);
    });

    it('버튼 클릭 시 pageIndex=0, useRapidFlip=true로 호출된다', () => {
      const navigateToCategory = vi.fn();
      render(<HistoryCategory navigateToCategory={navigateToCategory} />);

      fireEvent.click(screen.getByText('Milestones'));

      expect(navigateToCategory).toHaveBeenCalledWith('Milestones', 0, true);
    });
  });
});

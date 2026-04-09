import { timelineData } from '@entities/history';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimelinePage } from './Timeline';

const maxPerPage = Math.ceil(timelineData.length / 2);
const leftItems = timelineData.slice(0, maxPerPage);
const rightItems = timelineData.slice(maxPerPage);

describe('TimelinePage', () => {
  describe('렌더링', () => {
    it('left side에서 타이틀 h3이 보인다', () => {
      render(<TimelinePage side='left' />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Timeline',
      );
    });

    it('right side에서 타이틀은 hidden 상태이다', () => {
      render(<TimelinePage side='right' />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.closest('.book-page-title')).toHaveClass(
        'book-page-title--hidden',
      );
    });

    it('left side는 앞쪽 절반의 타임라인 항목을 렌더링한다', () => {
      render(<TimelinePage side='left' />);
      expect(screen.getByText(leftItems[0].name)).toBeInTheDocument();
      expect(screen.getByText(leftItems[0].date)).toBeInTheDocument();
    });

    it('right side는 뒷쪽 절반의 타임라인 항목을 렌더링한다', () => {
      render(<TimelinePage side='right' />);
      if (rightItems.length > 0) {
        expect(screen.getByText(rightItems[0].name)).toBeInTheDocument();
      }
    });

    it('각 side는 maxPerPage 수만큼 li를 렌더링한다', () => {
      const { container } = render(<TimelinePage side='left' />);
      expect(container.querySelectorAll('li')).toHaveLength(maxPerPage);
    });

    it('left side의 마지막 항목이 렌더링된다', () => {
      render(<TimelinePage side='left' />);
      const lastLeft = leftItems[leftItems.length - 1];
      expect(screen.getByText(lastLeft.name)).toBeInTheDocument();
    });
  });
});

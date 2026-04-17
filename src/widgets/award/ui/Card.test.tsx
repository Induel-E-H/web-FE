import type { AwardItem } from '@entities/award';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Card } from './Card';

const mockAward: AwardItem = {
  id: 1,
  title: '테스트 공모전',
  category: '당선작',
  date: '2008. 03. 05',
  issuer: '테스트 기관',
};

describe('Card', () => {
  describe('렌더링', () => {
    it('button.award__card로 렌더링된다', () => {
      const { container } = render(
        <Card award={mockAward} onClick={vi.fn()} />,
      );
      expect(container.querySelector('button.award__card')).toBeInTheDocument();
    });

    it('연도(date 앞 4자리)가 표시된다', () => {
      render(<Card award={mockAward} onClick={vi.fn()} />);
      expect(screen.getByText('2008')).toBeInTheDocument();
    });

    it('제목이 표시된다', () => {
      render(<Card award={mockAward} onClick={vi.fn()} />);
      expect(screen.getByText('테스트 공모전')).toBeInTheDocument();
    });

    it('발행자가 표시된다', () => {
      render(<Card award={mockAward} onClick={vi.fn()} />);
      expect(screen.getByText('테스트 기관')).toBeInTheDocument();
    });
  });

  describe('클릭 이벤트', () => {
    it('클릭 시 onClick이 award.id로 호출된다', () => {
      const onClick = vi.fn();
      render(<Card award={mockAward} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledWith(1);
    });
  });
});

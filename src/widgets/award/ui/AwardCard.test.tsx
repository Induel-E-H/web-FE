import type { AwardItem } from '@entities/award';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AwardCard } from './AwardCard';

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
        <AwardCard award={mockAward} onClick={vi.fn()} />,
      );
      expect(container.querySelector('button.award__card')).toBeInTheDocument();
    });

    it('aria-label에 제목, 연도(date 앞 4자리), 발행자가 포함된다', () => {
      render(<AwardCard award={mockAward} onClick={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveAccessibleName(
        '테스트 공모전 - 2008, 테스트 기관',
      );
    });

    it('제목이 표시된다', () => {
      render(<AwardCard award={mockAward} onClick={vi.fn()} />);
      expect(screen.getByText('테스트 공모전')).toBeInTheDocument();
    });

    it('발행자가 표시된다', () => {
      render(<AwardCard award={mockAward} onClick={vi.fn()} />);
      expect(screen.getByText('테스트 기관')).toBeInTheDocument();
    });
  });

  describe('클릭 이벤트', () => {
    it('클릭 시 onClick이 award.id로 호출된다', () => {
      const onClick = vi.fn();
      render(<AwardCard award={mockAward} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});

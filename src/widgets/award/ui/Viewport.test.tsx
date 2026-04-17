import type { AwardItem } from '@entities/award';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Viewport } from './Viewport';

vi.mock('@shared/lib/useSlideGesture/useSlideGesture', () => ({
  useSlideGesture: vi.fn().mockReturnValue({
    ref: { current: null },
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
  }),
}));

vi.mock('../model/image', () => ({
  getAwardImage: vi.fn().mockReturnValue('mock.webp'),
}));

const mockList: AwardItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  title: `수상 ${i}`,
  category: '당선작',
  date: `200${i}. 01. 01`,
  issuer: '기관',
}));

const defaultProps = {
  safePage: 0,
  totalPages: 1,
  filteredList: mockList,
  itemsPerPage: 4,
  onCardClick: vi.fn(),
  setCurrentPage: vi.fn(),
};

describe('Viewport', () => {
  describe('렌더링', () => {
    it('div.award__card_viewport로 렌더링된다', () => {
      const { container } = render(<Viewport {...defaultProps} />);
      expect(
        container.querySelector('div.award__card_viewport'),
      ).toBeInTheDocument();
    });

    it('totalPages 수만큼 award__card_page가 렌더링된다', () => {
      const { container } = render(
        <Viewport {...defaultProps} totalPages={2} />,
      );
      expect(container.querySelectorAll('.award__card_page')).toHaveLength(2);
    });

    it('페이지당 itemsPerPage 수만큼 카드가 렌더링된다', () => {
      const { container } = render(<Viewport {...defaultProps} />);
      expect(container.querySelectorAll('button.award__card')).toHaveLength(4);
    });
  });

  describe('슬라이더 transform', () => {
    it('safePage=0이면 transform이 0 기반이다', () => {
      const { container } = render(<Viewport {...defaultProps} safePage={0} />);
      const slider = container.querySelector(
        '.award__card_slider',
      ) as HTMLElement;
      expect(slider.style.transform).toContain('0');
    });

    it('safePage가 변경되면 transform이 달라진다', () => {
      const { container: c0 } = render(
        <Viewport {...defaultProps} safePage={0} totalPages={2} />,
      );
      const { container: c1 } = render(
        <Viewport {...defaultProps} safePage={1} totalPages={2} />,
      );
      const t0 = (c0.querySelector('.award__card_slider') as HTMLElement).style
        .transform;
      const t1 = (c1.querySelector('.award__card_slider') as HTMLElement).style
        .transform;
      expect(t0).not.toBe(t1);
    });
  });
});

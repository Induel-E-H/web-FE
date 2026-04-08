import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Award from './Award';

const mockGetItemsPerPage = vi.hoisted(() => vi.fn().mockReturnValue(8));
vi.mock('../model/responsive', () => ({
  getItemsPerPage: mockGetItemsPerPage,
}));

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

describe('Award', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItemsPerPage.mockReturnValue(8);
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('시맨틱 구조', () => {
    it('section.award가 렌더링된다', () => {
      const { container } = render(<Award />);
      expect(container.querySelector('section.award')).toBeInTheDocument();
    });

    it('AwardTitle(h2 "수상 기록")가 렌더링된다', () => {
      render(<Award />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        '수상 기록',
      );
    });

    it('연도 필터(tablist)가 렌더링된다', () => {
      render(<Award />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('카드 렌더링', () => {
    it('데스크탑(10 items/page)에서 10개의 카드가 렌더링된다', () => {
      render(<Award />);
      expect(document.querySelectorAll('button.award__card')).toHaveLength(10);
    });
  });

  describe('handleCardClick', () => {
    it('카드 클릭 시 팝업이 표시된다', () => {
      render(<Award />);

      fireEvent.click(document.querySelectorAll('button.award__card')[0]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('카드 클릭 시 body overflow가 hidden으로 설정된다', () => {
      render(<Award />);

      fireEvent.click(document.querySelectorAll('button.award__card')[0]);

      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('handlePopupClose', () => {
    it('팝업 닫기 버튼 클릭 시 팝업이 사라진다', () => {
      render(<Award />);

      fireEvent.click(document.querySelectorAll('button.award__card')[0]);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('팝업 닫기 시 body overflow가 초기화된다', () => {
      render(<Award />);

      fireEvent.click(document.querySelectorAll('button.award__card')[0]);
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('연도 필터링', () => {
    it('"전체" 필터에서는 10개 항목이 모두 표시된다', () => {
      render(<Award />);
      expect(document.querySelectorAll('button.award__card')).toHaveLength(10);
    });

    it('2008년 클릭 시 해당 연도(2개) 항목만 표시된다', () => {
      render(<Award />);

      fireEvent.click(screen.getByRole('tab', { name: '2008' }));

      expect(document.querySelectorAll('button.award__card')).toHaveLength(2);
    });

    it('연도 변경 시 currentPage가 0으로 초기화된다', () => {
      render(<Award />);

      fireEvent.click(screen.getByRole('tab', { name: '2008' }));

      const slider = document.querySelector(
        '.award__card_slider',
      ) as HTMLElement;
      expect(slider.style.transform).toContain('0');
    });
  });

  describe('모바일 Pagination', () => {
    it('itemsPerPage < 10(모바일)이면 Pagination이 표시된다', () => {
      mockGetItemsPerPage.mockReturnValue(4);
      render(<Award />);

      expect(
        screen.getByRole('button', { name: 'Previous page' }),
      ).toBeInTheDocument();
    });

    it('itemsPerPage >= 10(데스크탑)이면 Pagination이 표시되지 않는다', () => {
      render(<Award />);

      expect(
        screen.queryByRole('button', { name: 'Previous page' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('resize 이벤트', () => {
    it('resize 시 getItemsPerPage가 다시 호출된다', () => {
      render(<Award />);
      const callsBefore = mockGetItemsPerPage.mock.calls.length;

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(mockGetItemsPerPage.mock.calls.length).toBeGreaterThan(
        callsBefore,
      );
    });

    it('언마운트 시 resize 리스너가 제거된다', () => {
      const { unmount } = render(<Award />);
      const callsBefore = mockGetItemsPerPage.mock.calls.length;

      unmount();

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(mockGetItemsPerPage.mock.calls.length).toBe(callsBefore);
    });
  });

  describe('safePage 슬라이더 transform', () => {
    it('모바일에서 Next page 클릭 시 슬라이더 transform이 업데이트된다 (safePage > 0 분기 커버)', () => {
      mockGetItemsPerPage.mockReturnValue(4); // 4 items/page → 2 pages
      render(<Award />);

      const sliderBefore = (
        document.querySelector('.award__card_slider') as HTMLElement
      ).style.transform;

      fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

      const sliderAfter = (
        document.querySelector('.award__card_slider') as HTMLElement
      ).style.transform;

      expect(sliderAfter).not.toBe(sliderBefore);
    });
  });
});

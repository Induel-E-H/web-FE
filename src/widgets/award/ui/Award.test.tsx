import type { ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Award } from './Award';

vi.mock('framer-motion', async () => {
  const { createElement } = await import('react');
  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
    motion: new Proxy({} as Record<string, unknown>, {
      get:
        (_, tag: string) =>
        ({ animate, style, children, ...rest }: Record<string, unknown>) =>
          createElement(
            tag,
            {
              ...rest,
              style:
                (animate as { x?: string } | undefined)?.x !== undefined
                  ? {
                      ...(style as object),
                      transform: `translateX(${(animate as { x: string }).x})`,
                    }
                  : style,
            },
            children as ReactNode,
          ),
    }),
  };
});

const mockUseBreakpoint = vi.hoisted(() => vi.fn().mockReturnValue('desktop'));
vi.mock('@shared/lib/breakpoint/useBreakpoint', () => ({
  useBreakpoint: mockUseBreakpoint,
}));

vi.mock('@shared/lib/useSlideGesture/useSlideGesture', () => ({
  useSlideGesture: vi.fn().mockReturnValue({
    ref: { current: null },
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
  }),
}));

vi.mock('@entities/award', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/award')>();
  return { ...actual, getAwardImage: vi.fn().mockReturnValue('mock.webp') };
});

describe('Award', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBreakpoint.mockReturnValue('desktop');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
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

    it('연도 필터(navigation)가 렌더링된다', () => {
      render(<Award />);
      expect(
        screen.getByRole('navigation', { name: '연도 필터' }),
      ).toBeInTheDocument();
    });
  });

  describe('handleCardClick', () => {
    it('카드 클릭 시 팝업이 표시된다', () => {
      render(<Award />);

      fireEvent.click(document.querySelectorAll('button.award__card')[0]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
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

      fireEvent.click(screen.getByRole('button', { name: '2008' }));

      expect(document.querySelectorAll('button.award__card')).toHaveLength(2);
    });

    it('연도 변경 시 currentPage가 0으로 초기화된다', () => {
      render(<Award />);

      fireEvent.click(screen.getByRole('button', { name: '2008' }));

      const slider = document.querySelector(
        '.award__card_slider',
      ) as HTMLElement;
      expect(slider.style.transform).toContain('0');
    });
  });

  describe('모바일/태블릿 Pagination', () => {
    it('모바일 breakpoint이면 Pagination이 표시된다', () => {
      mockUseBreakpoint.mockReturnValue('mobile');
      render(<Award />);

      expect(
        screen.getByRole('button', { name: '이전 페이지' }),
      ).toBeInTheDocument();
    });

    it('태블릿 breakpoint이면 Pagination이 표시된다', () => {
      mockUseBreakpoint.mockReturnValue('tablet');
      render(<Award />);

      expect(
        screen.getByRole('button', { name: '이전 페이지' }),
      ).toBeInTheDocument();
    });

    it('데스크탑 breakpoint이면 Pagination이 표시되지 않는다', () => {
      render(<Award />);

      expect(
        screen.queryByRole('button', { name: '이전 페이지' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('breakpoint별 카드 수', () => {
    it('데스크탑에서 10개 카드가 렌더링된다', () => {
      render(<Award />);
      expect(document.querySelectorAll('button.award__card')).toHaveLength(10);
    });

    it('태블릿에서 6개씩 페이지가 구성된다', () => {
      mockUseBreakpoint.mockReturnValue('tablet');
      render(<Award />);
      const firstPage = document.querySelector('.award__card_page');
      expect(firstPage?.querySelectorAll('button.award__card')).toHaveLength(6);
    });

    it('모바일에서 4개씩 페이지가 구성된다', () => {
      mockUseBreakpoint.mockReturnValue('mobile');
      render(<Award />);
      const firstPage = document.querySelector('.award__card_page');
      expect(firstPage?.querySelectorAll('button.award__card')).toHaveLength(4);
    });
  });

  describe('safePage 슬라이더 transform', () => {
    it('모바일에서 Next page 클릭 시 슬라이더 transform이 업데이트된다 (safePage > 0 분기 커버)', () => {
      mockUseBreakpoint.mockReturnValue('mobile'); // 4 items/page → 3 pages
      render(<Award />);

      const sliderBefore = (
        document.querySelector('.award__card_slider') as HTMLElement
      ).style.transform;

      fireEvent.click(screen.getByRole('button', { name: '다음 페이지' }));

      const sliderAfter = (
        document.querySelector('.award__card_slider') as HTMLElement
      ).style.transform;

      expect(sliderAfter).not.toBe(sliderBefore);
    });
  });
});

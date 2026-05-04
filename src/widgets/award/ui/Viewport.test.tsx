import type { ReactNode } from 'react';

import { useAwardStore } from '@features/award';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Viewport } from './Viewport';

vi.mock('framer-motion', async () => {
  const { createElement } = await import('react');
  return {
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

vi.mock('@shared/lib/useSlideGesture/useSlideGesture', () => ({
  useSlideGesture: vi.fn().mockReturnValue({
    ref: { current: null },
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
  }),
}));

vi.mock('@shared/lib/breakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('mobile'),
}));

vi.mock('@entities/award', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/award')>();
  // mobile itemsPerPage=4, 8개이면 totalPages=2 (transform 변경 테스트 가능)
  const mockList = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    title: `수상 ${i}`,
    category: '당선작',
    date: `${2020 - i}-01-01`,
    issuer: '기관',
  }));
  return {
    ...actual,
    getAwardImage: vi.fn().mockReturnValue('mock.webp'),
    AWARD_LIST: mockList,
  };
});

describe('Viewport', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  describe('렌더링', () => {
    it('div.award__card_viewport로 렌더링된다', () => {
      const { container } = render(<Viewport />);
      expect(
        container.querySelector('div.award__card_viewport'),
      ).toBeInTheDocument();
    });

    it('totalPages 수만큼 award__card_page가 렌더링된다', () => {
      const { container } = render(<Viewport />);
      // 8 items / 4 per page = 2 pages
      expect(container.querySelectorAll('.award__card_page')).toHaveLength(2);
    });

    it('페이지당 itemsPerPage 수만큼 카드가 렌더링된다', () => {
      const { container } = render(<Viewport />);
      const firstPage = container.querySelector('.award__card_page');
      expect(firstPage?.querySelectorAll('button.award__card')).toHaveLength(4);
    });
  });

  describe('슬라이더 transform', () => {
    it('currentPage=0이면 transform에 translateX가 적용된다', () => {
      render(<Viewport />);
    });

    it('currentPage 변경 시 transform이 달라진다', () => {
      const { container: c0, unmount: u0 } = render(<Viewport />);
      const t0 = (c0.querySelector('.award__card_slider') as HTMLElement).style
        .transform;
      u0();

      useAwardStore.setState({ currentPage: 1 });
      const { container: c1 } = render(<Viewport />);
      const t1 = (c1.querySelector('.award__card_slider') as HTMLElement).style
        .transform;

      expect(t0).not.toBe(t1);
    });
  });
});

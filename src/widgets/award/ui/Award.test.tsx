import type { ReactNode } from 'react';

import { useAwardStore } from '@features/award';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Award } from './Award';

vi.mock('framer-motion', async () => {
  const { createElement } = await import('react');
  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
    motion: new Proxy(
      {},
      {
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
      },
    ),
  };
});

vi.mock('@entities/award', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/award')>();
  return { ...actual, getAwardImage: vi.fn().mockReturnValue('mock.webp') };
});

describe('Award', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAwardStore.getState().reset();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    useAwardStore.getState().reset();
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

    it('"전체" 필터에서는 연도별 그룹으로 묶여 최신 연도가 먼저 표시된다', () => {
      render(<Award />);
      const years = [...document.querySelectorAll('.award__year')].map(
        (el) => el.textContent,
      );
      expect(years).toEqual(['2014', '2008', '2006', '2005', '2004', '2003']);
    });

    it('연도 선택 시 해당 연도 그룹 하나만 표시된다', () => {
      render(<Award />);

      fireEvent.click(screen.getByRole('button', { name: '2008' }));

      expect(document.querySelectorAll('.award__year_group')).toHaveLength(1);
    });
  });
});

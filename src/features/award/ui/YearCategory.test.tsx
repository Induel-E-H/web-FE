import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { YEAR_ALL } from '../model/constant';
import { useAwardStore } from '../model/useAwardStore';
import { YearCategory } from './YearCategory';

describe('YearCategory', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  describe('렌더링', () => {
    it('navigation 역할로 렌더링된다', () => {
      render(<YearCategory />);
      expect(
        screen.getByRole('navigation', { name: '연도 필터' }),
      ).toBeInTheDocument();
    });

    it('YEAR_LIST 항목 수만큼 버튼이 렌더링된다', () => {
      render(<YearCategory />);
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('"전체" 버튼이 렌더링된다', () => {
      render(<YearCategory />);
      expect(screen.getByText(YEAR_ALL)).toBeInTheDocument();
    });
  });

  describe('활성 상태', () => {
    it('초기 activeYear("전체") 버튼은 aria-current=true이다', () => {
      render(<YearCategory />);
      expect(screen.getByText(YEAR_ALL)).toHaveAttribute(
        'aria-current',
        'true',
      );
    });

    it('스토어에서 activeYear 변경 시 해당 버튼이 활성화된다', () => {
      useAwardStore.setState({ activeYear: 2008 });
      render(<YearCategory />);
      expect(screen.getByText('2008')).toHaveAttribute('aria-current', 'true');
      expect(screen.getByText(YEAR_ALL)).not.toHaveAttribute('aria-current');
    });

    it('활성 버튼에 active 클래스가 적용된다', () => {
      useAwardStore.setState({ activeYear: 2008 });
      render(<YearCategory />);
      expect(screen.getByText('2008')).toHaveClass(
        'award__year_category--active',
      );
    });

    it('비활성 버튼에는 active 클래스가 없다', () => {
      render(<YearCategory />);
      const buttons = screen.getAllByRole('button');
      const nonActiveButtons = buttons.filter(
        (btn) => !btn.classList.contains('award__year_category--active'),
      );
      expect(nonActiveButtons.length).toBeGreaterThan(0);
    });
  });

  describe('클릭 이벤트', () => {
    it('버튼 클릭 시 스토어의 activeYear가 변경된다', () => {
      render(<YearCategory />);
      fireEvent.click(screen.getByText(YEAR_ALL));
      expect(useAwardStore.getState().activeYear).toBe(YEAR_ALL);
    });
  });

  describe('오른쪽 끝 흐림', () => {
    function scrollTo(nav: HTMLElement, scrollLeft: number) {
      Object.defineProperties(nav, {
        clientWidth: { configurable: true, value: 300 },
        scrollWidth: { configurable: true, value: 500 },
        scrollLeft: { configurable: true, value: scrollLeft },
      });
      fireEvent.scroll(nav);
    }

    it('오른쪽에 더 볼 연도가 있으면 흐림 클래스를 붙인다', () => {
      render(<YearCategory />);
      const nav = screen.getByRole('navigation', { name: '연도 필터' });
      scrollTo(nav, 0);
      expect(nav).toHaveClass('award__year_category--more');
    });

    it('처음 크기를 잴 때 넘치는 연도가 있으면 흐림 클래스를 붙인다', () => {
      const OriginalResizeObserver = globalThis.ResizeObserver;
      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
        500,
      );
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
        300,
      );
      vi.stubGlobal(
        'ResizeObserver',
        class {
          callback: () => void;
          constructor(callback: () => void) {
            this.callback = callback;
          }
          observe() {
            this.callback();
          }
          disconnect() {}
        },
      );
      try {
        render(<YearCategory />);
        expect(
          screen.getByRole('navigation', { name: '연도 필터' }),
        ).toHaveClass('award__year_category--more');
      } finally {
        vi.restoreAllMocks();
        vi.stubGlobal('ResizeObserver', OriginalResizeObserver);
      }
    });

    it('끝까지 스크롤하면 흐림 클래스를 뗀다', () => {
      render(<YearCategory />);
      const nav = screen.getByRole('navigation', { name: '연도 필터' });
      scrollTo(nav, 200);
      expect(nav).not.toHaveClass('award__year_category--more');
    });
  });
});

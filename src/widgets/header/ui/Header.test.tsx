import { MemoryRouter } from 'react-router-dom';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@widgets/header';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSmoothScrollTo = vi.hoisted(() => vi.fn());
const mockUseIsHero = vi.hoisted(() => vi.fn(() => true));
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-icons/rx', () => ({
  RxHamburgerMenu: () => <svg data-testid='hamburger-icon' />,
}));

vi.mock('@shared/assets', () => ({ induelIcon: 'induel-icon.svg' }));

vi.mock('@shared/lib/scroll/smoothScrollTo', () => ({
  smoothScrollTo: mockSmoothScrollTo,
}));

vi.mock('../model/useIsHero', () => ({
  useIsHero: mockUseIsHero,
}));

const mockOnNavScrollStart = vi.hoisted(() => vi.fn());
const mockOnNavScrollEnd = vi.hoisted(() => vi.fn());
const mockUseHeaderVisibility = vi.hoisted(() =>
  vi.fn(() => ({
    hidden: false,
    onNavScrollStart: mockOnNavScrollStart,
    onNavScrollEnd: mockOnNavScrollEnd,
  })),
);

vi.mock('../model/useHeaderVisibility', () => ({
  useHeaderVisibility: mockUseHeaderVisibility,
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderHeader(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIsHero.mockReturnValue(true);
    mockUseHeaderVisibility.mockReturnValue({
      hidden: false,
      onNavScrollStart: mockOnNavScrollStart,
      onNavScrollEnd: mockOnNavScrollEnd,
    });
  });

  describe('렌더링', () => {
    it('header 엘리먼트가 렌더링된다', () => {
      const { container } = renderHeader();
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('로고 이미지가 렌더링된다', () => {
      renderHeader();
      expect(screen.getByAltText('인들이앤에이치 로고')).toBeInTheDocument();
    });

    it('회사명 텍스트가 표시된다', () => {
      renderHeader();
      expect(screen.getByText('인들이앤에이치')).toBeInTheDocument();
    });

    it('NAV_ITEMS의 모든 버튼이 nav 안에 렌더링된다', () => {
      const { container } = renderHeader();
      const nav = container.querySelector('nav.header__nav');
      expect(nav).toBeInTheDocument();
      ['VISION', 'HISTORY', 'AWARDS', 'PATENTS', 'LOCATION'].forEach(
        (label) => {
          expect(nav).toContainElement(screen.getAllByText(label)[0]);
        },
      );
    });

    it('햄버거 버튼이 렌더링된다', () => {
      renderHeader();
      expect(
        screen.getByRole('button', { name: '메뉴 열기' }),
      ).toBeInTheDocument();
    });

    it('초기에 모바일 메뉴는 표시되지 않는다', () => {
      const { container } = renderHeader();
      expect(
        container.querySelector('.header__mobile-menu'),
      ).not.toBeInTheDocument();
    });
  });

  describe('CSS 클래스', () => {
    beforeEach(() => {
      mockUseHeaderVisibility.mockReturnValue({
        hidden: false,
        onNavScrollStart: mockOnNavScrollStart,
        onNavScrollEnd: mockOnNavScrollEnd,
      });
      mockUseIsHero.mockReturnValue(false);
    });

    it('isHero가 true이면 header--hero 클래스가 적용된다', () => {
      mockUseIsHero.mockReturnValue(true);
      const { container } = renderHeader();
      expect(container.querySelector('header')).toHaveClass('header--hero');
    });

    it('isHero가 false이면 header--hero 클래스가 없다', () => {
      const { container } = renderHeader();
      expect(container.querySelector('header')).not.toHaveClass('header--hero');
    });

    it('hidden이 true이면 header--hidden 클래스가 적용된다', () => {
      mockUseHeaderVisibility.mockReturnValue({
        hidden: true,
        onNavScrollStart: mockOnNavScrollStart,
        onNavScrollEnd: mockOnNavScrollEnd,
      });
      const { container } = renderHeader();
      expect(container.querySelector('header')).toHaveClass('header--hidden');
    });

    it('hidden이 false이면 header--hidden 클래스가 없다', () => {
      const { container } = renderHeader();
      expect(container.querySelector('header')).not.toHaveClass(
        'header--hidden',
      );
    });

    it('모바일 메뉴가 열려있으면 hidden이 true여도 header--hidden 클래스가 적용되지 않는다', async () => {
      mockUseIsHero.mockReturnValue(true);
      mockUseHeaderVisibility.mockReturnValue({
        hidden: true,
        onNavScrollStart: mockOnNavScrollStart,
        onNavScrollEnd: mockOnNavScrollEnd,
      });
      const { container } = renderHeader();
      await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
      expect(container.querySelector('header')).not.toHaveClass(
        'header--hidden',
      );
    });
  });

  describe('햄버거 메뉴', () => {
    it('햄버거 버튼 클릭 시 모바일 메뉴가 열린다', async () => {
      const { container } = renderHeader();
      await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
      expect(
        container.querySelector('.header__mobile-menu'),
      ).toBeInTheDocument();
    });

    it('햄버거 버튼 클릭 시 aria-expanded가 true가 된다', async () => {
      renderHeader();
      const btn = screen.getByRole('button', { name: '메뉴 열기' });
      await userEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    it('열린 상태에서 다시 클릭하면 메뉴가 닫힌다', async () => {
      const { container } = renderHeader();
      const btn = screen.getByRole('button', { name: '메뉴 열기' });
      await userEvent.click(btn);
      await userEvent.click(btn);
      expect(
        container.querySelector('.header__mobile-menu'),
      ).not.toBeInTheDocument();
    });

    it('모바일 메뉴에 NAV_ITEMS 버튼들이 렌더링된다', async () => {
      const { container } = renderHeader();
      await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
      const mobileMenu = container.querySelector('.header__mobile-menu');
      ['VISION', 'HISTORY', 'AWARDS', 'PATENTS', 'LOCATION'].forEach(
        (label) => {
          expect(mobileMenu).toContainElement(screen.getAllByText(label)[1]);
        },
      );
    });

    it('isHero가 true이고 메뉴가 열리면 header--menu-open 클래스가 적용된다', async () => {
      mockUseIsHero.mockReturnValue(true);
      const { container } = renderHeader();
      await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
      expect(container.querySelector('header')).toHaveClass(
        'header--menu-open',
      );
    });
  });

  describe('nav 클릭 후 헤더 숨김', () => {
    beforeEach(() => {
      mockOnNavScrollStart.mockClear();
      mockOnNavScrollEnd.mockClear();
      mockUseHeaderVisibility.mockReturnValue({
        hidden: false,
        onNavScrollStart: mockOnNavScrollStart,
        onNavScrollEnd: mockOnNavScrollEnd,
      });
      mockUseIsHero.mockReturnValue(false);
    });

    it('nav 버튼 클릭 시 onNavScrollStart가 호출된다', async () => {
      renderHeader('/');
      await userEvent.click(screen.getAllByText('VISION')[0]);
      expect(mockOnNavScrollStart).toHaveBeenCalledTimes(1);
    });

    it('로고 버튼 클릭 시 onNavScrollStart가 호출된다', async () => {
      renderHeader('/');
      await userEvent.click(
        screen.getByRole('button', { name: /인들이앤에이치 로고/ }),
      );
      expect(mockOnNavScrollStart).toHaveBeenCalledTimes(1);
    });

    it('smoothScrollTo onDone 콜백에서 onNavScrollEnd가 호출된다', async () => {
      renderHeader('/');
      await userEvent.click(screen.getAllByText('VISION')[0]);

      const [, onDone] = mockSmoothScrollTo.mock.calls.at(-1) as [
        string,
        () => void,
      ];
      act(() => {
        onDone();
      });

      expect(mockOnNavScrollEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('스크롤 이동 — 홈 화면', () => {
    it('로고 클릭 시 smoothScrollTo(".hero")가 호출된다', async () => {
      renderHeader('/');
      await userEvent.click(
        screen.getByRole('button', { name: /인들이앤에이치 로고/ }),
      );
      expect(mockSmoothScrollTo).toHaveBeenCalledWith(
        '.hero',
        expect.any(Function),
      );
    });

    it('nav 버튼 클릭 시 해당 selector로 smoothScrollTo가 호출된다', async () => {
      renderHeader('/');
      await userEvent.click(screen.getAllByText('VISION')[0]);
      expect(mockSmoothScrollTo).toHaveBeenCalledWith(
        '.vision',
        expect.any(Function),
      );
    });

    it('모바일 메뉴 버튼 클릭 후 콜백 실행 시 메뉴가 닫힌다', async () => {
      const { container } = renderHeader('/');
      await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));

      expect(
        container.querySelector('.header__mobile-menu'),
      ).toBeInTheDocument();

      await userEvent.click(screen.getAllByText('HISTORY')[1]);

      const [, onDone] = mockSmoothScrollTo.mock.calls.at(-1) as [
        string,
        () => void,
      ];
      act(() => {
        onDone();
      });

      expect(
        container.querySelector('.header__mobile-menu'),
      ).not.toBeInTheDocument();
    });
  });

  describe('스크롤 이동 — 다른 페이지에서', () => {
    beforeEach(() => {
      mockUseIsHero.mockReturnValue(false);
      mockUseHeaderVisibility.mockReturnValue({
        hidden: false,
        onNavScrollStart: mockOnNavScrollStart,
        onNavScrollEnd: mockOnNavScrollEnd,
      });
    });

    it('홈이 아닐 때 nav 버튼 클릭 시 "/" 로 navigate한다', async () => {
      renderHeader('/privacy_policy');
      await userEvent.click(screen.getAllByText('VISION')[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/', {
        state: { scrollTo: '.vision' },
      });
      expect(mockSmoothScrollTo).not.toHaveBeenCalled();
    });

    it('홈이 아닐 때 로고 클릭 시 "/" 로 navigate한다', async () => {
      renderHeader('/privacy_policy');
      await userEvent.click(
        screen.getByRole('button', { name: /인들이앤에이치 로고/ }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockSmoothScrollTo).not.toHaveBeenCalled();
    });
  });
});

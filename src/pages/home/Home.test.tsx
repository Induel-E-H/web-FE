import { MemoryRouter } from 'react-router-dom';

import { smoothScrollTo } from '@shared/lib/scroll';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Home } from './Home';

// widget 및 util mock
vi.mock('@shared/lib/scroll', () => ({
  smoothScrollTo: vi.fn(),
}));

vi.mock('@widgets/header', () => ({
  Header: () => <header data-testid='header' />,
}));

vi.mock('@widgets/hero', () => ({
  Hero: ({ showScrollArrow }: { showScrollArrow: boolean }) => (
    <section
      data-testid='hero'
      data-show-scroll-arrow={String(showScrollArrow)}
    />
  ),
}));

vi.mock('@widgets/vision', () => ({
  Vision: () => <section data-testid='vision' />,
}));

vi.mock('@widgets/history', () => ({
  History: () => <section data-testid='history' />,
}));

vi.mock('@widgets/award', () => ({
  Award: () => <section data-testid='award' />,
}));

vi.mock('@widgets/patent', () => ({
  Patent: () => <section data-testid='patent' />,
}));

vi.mock('@widgets/map', () => ({
  Map: () => <section data-testid='map' />,
}));

vi.mock('@widgets/footer', () => ({
  Footer: () => <footer data-testid='footer' />,
}));

function renderHome(initialState?: { scrollTo?: string }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: initialState }]}>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('일반 렌더링 (DEV_WIDGET=undefined, MODE=test)', () => {
    it('skip-link가 렌더링된다', () => {
      renderHome();
      expect(screen.getByText('본문으로 바로 가기')).toBeInTheDocument();
    });

    it('skip-link의 href가 "#main-content"이다', () => {
      renderHome();
      const link = screen.getByText('본문으로 바로 가기');
      expect(link).toHaveAttribute('href', '#main-content');
    });

    it('Header가 렌더링된다', () => {
      renderHome();
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('main 요소가 id="main-content"로 렌더링된다', () => {
      renderHome();
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    });

    it('Hero가 렌더링된다', () => {
      renderHome();
      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });
  });

  describe('location.state.scrollTo 처리', () => {
    it('scrollTo가 있으면 setTimeout 후 smoothScrollTo가 호출된다', () => {
      renderHome({ scrollTo: '#vision' });
      expect(smoothScrollTo).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(smoothScrollTo).toHaveBeenCalledWith('#vision');
    });

    it('scrollTo가 없으면 smoothScrollTo가 호출되지 않는다', () => {
      renderHome();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(smoothScrollTo).not.toHaveBeenCalled();
    });

    it('scrollTo가 있을 때 타이머가 100ms 전에는 호출되지 않는다', () => {
      renderHome({ scrollTo: '#history' });

      act(() => {
        vi.advanceTimersByTime(99);
      });

      expect(smoothScrollTo).not.toHaveBeenCalled();
    });
  });
});

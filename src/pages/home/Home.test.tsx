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

  describe('DevWidgetView (VITE_DEV_WIDGET 설정 시)', () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      vi.resetModules();
    });

    it('유효한 위젯(hero)이면 Header와 해당 위젯이 렌더링된다', async () => {
      vi.stubEnv('VITE_DEV_WIDGET', 'hero');
      const { Home: DynamicHome } = await import('./Home');
      await act(async () => {
        render(
          <MemoryRouter>
            <DynamicHome />
          </MemoryRouter>,
        );
        await Promise.resolve();
      });
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    it('footer 위젯이면 Header 없이 footer만 렌더링된다', async () => {
      vi.stubEnv('VITE_DEV_WIDGET', 'footer');
      const { Home: DynamicHome } = await import('./Home');
      await act(async () => {
        render(
          <MemoryRouter>
            <DynamicHome />
          </MemoryRouter>,
        );
        await Promise.resolve();
      });
      expect(screen.queryByTestId('header')).not.toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('유효하지 않은 위젯이면 에러 메시지가 렌더링된다', async () => {
      vi.stubEnv('VITE_DEV_WIDGET', 'nonexistent');
      const { Home: DynamicHome } = await import('./Home');
      await act(async () => {
        render(
          <MemoryRouter>
            <DynamicHome />
          </MemoryRouter>,
        );
        await Promise.resolve();
      });
      expect(
        screen.getByText(/위젯 "nonexistent"을 찾을 수 없습니다\./),
      ).toBeInTheDocument();
    });
  });
});

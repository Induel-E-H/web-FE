/**
 * Hero 컴포넌트 — Suspense fallback 경로 테스트
 *
 * React.lazy 캐시가 모듈 스코프에 고정되므로, vi.resetModules + vi.doMock으로
 * 모듈을 매 테스트마다 새로 로드하여 lazy 로딩 중 상태를 재현합니다.
 */
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Hero — Suspense fallback', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('HeroBackground 로딩 중에는 배경 fallback 이미지가 렌더링된다', async () => {
    let resolveHeroBackground!: (mod: { default: React.ComponentType }) => void;
    const deferredModule = new Promise<{ default: React.ComponentType }>(
      (resolve) => {
        resolveHeroBackground = resolve;
      },
    );

    vi.doMock('./HeroBackground', () => deferredModule);

    const { default: Hero } = await import('./Hero');

    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<Hero showScrollArrow={false} />));
    });

    const fallbackImg = container.querySelector('.hero__background--fallback');
    expect(fallbackImg).toBeInTheDocument();
    expect(fallbackImg?.tagName).toBe('IMG');
    expect(fallbackImg).toHaveAttribute('aria-hidden', 'true');

    resolveHeroBackground({ default: () => <canvas aria-hidden='true' /> });
  });
});

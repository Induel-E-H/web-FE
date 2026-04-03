/**
 * Hero 컴포넌트 — production 환경 분기 테스트
 *
 * isProd는 모듈 레벨 상수이므로 모듈이 최초 로드될 때 값이 결정됩니다.
 * vi.resetModules() + dynamic import로 모듈을 재로드하여
 * import.meta.env.MODE === 'production' 조건에서의 렌더링을 검증합니다.
 *
 * istanbul coverage provider를 사용하여 dynamic import된 모듈도
 * 원본 파일의 커버리지에 정확히 합산됩니다.
 */
import type { ComponentType } from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// HeroBackground mock (Three.js 의존성 격리)
vi.mock('./HeroBackground', () => ({
  default: () => <canvas aria-hidden='true' />,
}));

// react-icons mock
vi.mock('react-icons/io', () => ({
  IoIosArrowDown: (props: Record<string, unknown>) => (
    <svg data-testid='arrow-down-icon' {...props} />
  ),
}));

afterEach(() => {
  import.meta.env.MODE = 'test';
});

describe('Hero — production 환경', () => {
  async function loadHeroProd(): Promise<ComponentType> {
    import.meta.env.MODE = 'production';
    vi.resetModules();

    vi.doMock('./HeroBackground', () => ({
      default: () => <canvas aria-hidden='true' />,
    }));
    vi.doMock('react-icons/io', () => ({
      IoIosArrowDown: (props: Record<string, unknown>) => (
        <svg data-testid='arrow-down-icon' {...props} />
      ),
    }));

    const mod: { default: ComponentType } = await import('./Hero');
    return mod.default;
  }

  it('하단 화살표 아이콘이 렌더링되고 개발 문구는 표시되지 않는다', async () => {
    const HeroProd = await loadHeroProd();

    render(<HeroProd />);

    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
    expect(screen.queryByText('현재 개발중입니다!')).not.toBeInTheDocument();
  });

  it('화살표 아이콘에 hero__down-icon 클래스가 적용된다', async () => {
    const HeroProd = await loadHeroProd();

    render(<HeroProd />);

    expect(screen.getByTestId('arrow-down-icon')).toHaveClass(
      'hero__down-icon',
    );
  });

  it('화살표 아이콘은 스크린 리더에서 숨겨진다', async () => {
    const HeroProd = await loadHeroProd();

    render(<HeroProd />);

    expect(screen.getByTestId('arrow-down-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});

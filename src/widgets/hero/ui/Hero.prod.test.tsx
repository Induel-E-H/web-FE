import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Hero from './Hero';

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
  it('하단 화살표 아이콘이 렌더링되고 개발 문구는 표시되지 않는다', () => {
    render(<Hero showScrollArrow={true} />);

    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
    expect(screen.queryByText('현재 개발중입니다!')).not.toBeInTheDocument();
  });

  it('화살표 아이콘에 hero__down-icon 클래스가 적용된다', () => {
    render(<Hero showScrollArrow={true} />);

    expect(screen.getByTestId('arrow-down-icon')).toHaveClass(
      'hero__down-icon',
    );
  });

  it('화살표 아이콘은 스크린 리더에서 숨겨진다', () => {
    render(<Hero showScrollArrow={true} />);

    expect(screen.getByTestId('arrow-down-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});

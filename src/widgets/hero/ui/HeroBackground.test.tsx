import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HeroBackground from './HeroBackground';

vi.mock('../model/useWaveBackground', () => ({
  useWaveBackground: vi.fn(() => ({ current: null })),
}));

describe('HeroBackground', () => {
  it('canvas 엘리먼트가 렌더링된다', () => {
    const { container } = render(<HeroBackground />);

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('canvas에 hero__background 클래스가 적용된다', () => {
    const { container } = render(<HeroBackground />);

    expect(container.querySelector('canvas')).toHaveClass('hero__background');
  });

  it('canvas는 스크린 리더에서 숨겨진다', () => {
    const { container } = render(<HeroBackground />);

    expect(container.querySelector('canvas')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});

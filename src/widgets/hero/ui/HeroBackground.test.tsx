import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWaveBackground } from '../model/useWaveBackground';
import HeroBackground from './HeroBackground';

vi.mock('../model/useWaveBackground', () => ({
  useWaveBackground: vi.fn(() => ({
    canvasRef: { current: null },
    webglSupported: true,
  })),
}));

vi.mock('../assets/background-fallback.webp', () => ({
  default: 'background-fallback.webp',
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

  describe('WebGL2 미지원 시', () => {
    beforeEach(() => {
      vi.mocked(useWaveBackground).mockReturnValue({
        canvasRef: { current: null },
        webglSupported: false,
      });
    });

    it('canvas 대신 img 엘리먼트가 렌더링된다', () => {
      const { container } = render(<HeroBackground />);

      expect(container.querySelector('canvas')).not.toBeInTheDocument();
      expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('img에 hero__background--fallback 클래스가 적용된다', () => {
      const { container } = render(<HeroBackground />);

      expect(container.querySelector('img')).toHaveClass(
        'hero__background--fallback',
      );
    });

    it('img는 스크린 리더에서 숨겨진다', () => {
      const { container } = render(<HeroBackground />);

      expect(container.querySelector('img')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });
});

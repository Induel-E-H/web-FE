import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { VisionTitle } from './VisionTitle';

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
});

describe('VisionTitle', () => {
  describe('vision__title 콘텐츠', () => {
    it('"CONCEPT" 텍스트가 렌더링된다', () => {
      render(<VisionTitle />);
      expect(screen.getByText('CONCEPT')).toBeInTheDocument();
    });

    it('"미래를 향한" h2가 렌더링된다', () => {
      render(<VisionTitle />);
      expect(screen.getByText('미래를 향한')).toBeInTheDocument();
    });
  });

  describe('시맨틱 구조', () => {
    it('vision__title 클래스가 존재한다', () => {
      const { container } = render(<VisionTitle />);
      expect(container.querySelector('.vision__title')).toBeInTheDocument();
    });

    it('hr 구분선이 렌더링된다', () => {
      const { container } = render(<VisionTitle />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });
  });
});

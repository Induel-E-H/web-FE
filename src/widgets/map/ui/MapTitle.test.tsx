import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MapTitle } from './MapTitle';

describe('MapTitle', () => {
  describe('텍스트 렌더링', () => {
    it('"LOCATION" 텍스트가 p 요소로 표시된다', () => {
      const { container } = render(<MapTitle />);
      const p = container.querySelector('p');
      expect(p).toHaveTextContent('LOCATION');
    });

    it('"찾아오시는 길" 텍스트가 표시된다', () => {
      render(<MapTitle />);
      expect(screen.getByText('찾아오시는 길')).toBeInTheDocument();
    });
  });

  describe('시맨틱 구조', () => {
    it('h2 요소가 존재한다', () => {
      render(<MapTitle />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('찾아오시는 길');
    });

    it('hgroup이 존재한다', () => {
      const { container } = render(<MapTitle />);
      const hgroup = container.querySelector('hgroup');

      expect(hgroup).toBeInTheDocument();
    });

    it('hr 요소가 렌더링된다', () => {
      const { container } = render(<MapTitle />);
      const hr = container.querySelector('hr');

      expect(hr).toBeInTheDocument();
    });
  });
});

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MapMarker } from './MapMarker';

vi.mock('@shared/assets', () => ({ induelIcon: 'induel-icon.svg' }));

describe('MapMarker', () => {
  it('SVG 루트 요소가 map__marker 클래스로 렌더링된다', () => {
    const { container } = render(<MapMarker />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('map__marker');
  });

  it('viewBox가 "0 0 44 56"으로 설정된다', () => {
    const { container } = render(<MapMarker />);
    expect(container.querySelector('svg')).toHaveAttribute(
      'viewBox',
      '0 0 44 56',
    );
  });

  it('핀 그라디언트(pinGrad) defs가 포함된다', () => {
    const { container } = render(<MapMarker />);
    expect(container.querySelector('#pinGrad')).toBeInTheDocument();
  });

  it('map__marker__body path가 렌더링된다', () => {
    const { container } = render(<MapMarker />);
    expect(container.querySelector('.map__marker__body')).toBeInTheDocument();
  });

  it('map__marker__shadow ellipse가 렌더링된다', () => {
    const { container } = render(<MapMarker />);
    expect(container.querySelector('.map__marker__shadow')).toBeInTheDocument();
  });

  it('map__marker__circle이 렌더링된다', () => {
    const { container } = render(<MapMarker />);
    expect(container.querySelector('.map__marker__circle')).toBeInTheDocument();
  });

  it('map__marker__highlight path가 렌더링된다', () => {
    const { container } = render(<MapMarker />);
    expect(
      container.querySelector('.map__marker__highlight'),
    ).toBeInTheDocument();
  });

  it('SVG image 요소에 href 속성이 설정된다', () => {
    const { container } = render(<MapMarker />);
    const image = container.querySelector('image');
    expect(image).toBeInTheDocument();
    expect(image?.getAttribute('href')).toBe('induel-icon.svg');
  });
});

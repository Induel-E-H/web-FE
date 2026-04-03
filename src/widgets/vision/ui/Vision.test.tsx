import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Vision } from './Vision';

vi.mock('./ScrollFadeIn', () => ({
  useScrollFadeIn: vi.fn(),
}));

vi.mock('@entities/vision/assets/vision_param.webp', () => ({
  default: 'vision_param.webp',
}));
vi.mock('@entities/vision/assets/vision_sculpt.webp', () => ({
  default: 'vision_sculpt.webp',
}));
vi.mock('@entities/vision/assets/vision_invest.webp', () => ({
  default: 'vision_invest.webp',
}));

describe('Vision', () => {
  describe('시맨틱 구조', () => {
    it('VISION_DATA 수(3)만큼 section.vision이 렌더링된다', () => {
      const { container } = render(<Vision />);
      expect(container.querySelectorAll('section.vision')).toHaveLength(3);
    });
  });

  describe('콘텐츠 렌더링', () => {
    it('모든 비전 타이틀이 렌더링된다', () => {
      render(<Vision />);
      expect(screen.getByText('Parametric Design')).toBeInTheDocument();
      expect(screen.getByText('Urban Sculpting')).toBeInTheDocument();
      expect(screen.getByText('Engineering Investment')).toBeInTheDocument();
    });

    it('모든 키워드가 렌더링된다', () => {
      render(<Vision />);
      expect(screen.getByText('Param')).toBeInTheDocument();
      expect(screen.getByText('Sculpt')).toBeInTheDocument();
      expect(screen.getByText('Invest')).toBeInTheDocument();
    });

    it('각 이미지가 title을 alt로 렌더링된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('Parametric Design')).toBeInTheDocument();
      expect(screen.getByAltText('Urban Sculpting')).toBeInTheDocument();
      expect(screen.getByAltText('Engineering Investment')).toBeInTheDocument();
    });
  });

  describe('이미지 매핑', () => {
    it('Parametric Design 이미지가 vision_param.webp에 매핑된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('Parametric Design')).toHaveAttribute(
        'src',
        'vision_param.webp',
      );
    });

    it('Urban Sculpting 이미지가 vision_sculpt.webp에 매핑된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('Urban Sculpting')).toHaveAttribute(
        'src',
        'vision_sculpt.webp',
      );
    });

    it('Engineering Investment 이미지가 vision_invest.webp에 매핑된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('Engineering Investment')).toHaveAttribute(
        'src',
        'vision_invest.webp',
      );
    });
  });

  describe('reverse 레이아웃', () => {
    it('홀수 인덱스(index=1, Urban Sculpting)는 vision__section-reverse 클래스를 가진다', () => {
      const { container } = render(<Vision />);
      const innerSections = container.querySelectorAll(
        'section.vision__section',
      );
      expect(innerSections[1]).toHaveClass('vision__section-reverse');
    });

    it('짝수 인덱스(index=0, Parametric Design)는 reverse 클래스가 없다', () => {
      const { container } = render(<Vision />);
      const innerSections = container.querySelectorAll(
        'section.vision__section',
      );
      expect(innerSections[0]).not.toHaveClass('vision__section-reverse');
    });

    it('짝수 인덱스(index=2, Engineering Investment)는 reverse 클래스가 없다', () => {
      const { container } = render(<Vision />);
      const innerSections = container.querySelectorAll(
        'section.vision__section',
      );
      expect(innerSections[2]).not.toHaveClass('vision__section-reverse');
    });
  });
});

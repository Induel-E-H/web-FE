import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VisionItem } from './VisionItem';

const defaultProps = {
  title: 'Parametric Design',
  description:
    '수치 기반 설계와 알고리즘 모델링을 통해 최적화된 익스테리어 솔루션을 제공합니다.',
  keyword: 'Param',
  image: 'vision_param.webp',
};

describe('VisionItem', () => {
  describe('렌더링', () => {
    it('title이 h2 요소로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Parametric Design',
      );
    });

    it('h2에 vision__title 클래스가 있다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      expect(container.querySelector('h2.vision__title')).toBeInTheDocument();
    });

    it('description이 vision__description span으로 렌더링된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      const span = container.querySelector('.vision__description');
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent(defaultProps.description);
    });

    it('keyword가 h1 요소로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Param',
      );
    });

    it('h1에 vision__keyword 클래스가 있다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      expect(container.querySelector('h1.vision__keyword')).toBeInTheDocument();
    });

    it('이미지가 title을 alt로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('Parametric Design')).toBeInTheDocument();
    });

    it('이미지 src에 image prop이 반영된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('Parametric Design')).toHaveAttribute(
        'src',
        'vision_param.webp',
      );
    });
  });

  describe('reverse prop', () => {
    it('reverse 기본값은 false로 vision__section-reverse 클래스가 없다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      expect(
        container.querySelector('.vision__section-reverse'),
      ).not.toBeInTheDocument();
    });

    it('reverse=true이면 vision__section-reverse 클래스가 적용된다', () => {
      const { container } = render(
        <VisionItem {...defaultProps} reverse={true} />,
      );
      expect(
        container.querySelector('.vision__section-reverse'),
      ).toBeInTheDocument();
    });
  });

  describe('React Compiler 메모이제이션 캐시 히트', () => {
    it('재렌더링 시에도 동일한 UI가 유지된다 (캐시 히트 분기 커버)', () => {
      const { rerender } = render(<VisionItem {...defaultProps} />);

      rerender(<VisionItem {...defaultProps} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Parametric Design',
      );
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Param',
      );
    });
  });
});

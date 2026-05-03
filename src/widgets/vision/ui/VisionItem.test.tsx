import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { VisionItem } from './VisionItem';

const defaultProps = {
  title: '정밀한 설계',
  description:
    '모든 프로젝트는 치밀한 계획과 정밀한 엔지니어링에서 시작됩니다. 인들이앤에이치는 데이터 기반의 분석과 전문 기술력으로 최적의 솔루션을 제시합니다.',
  keyword: 'Param',
  image: 'vision_param.webp',
  index: 0,
};

const elementCallbackMap = new Map<Element, IntersectionObserverCallback>();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  elementCallbackMap.clear();
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      private cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe = (el: Element) => {
        elementCallbackMap.set(el, this.cb);
        mockObserve(el);
      };
      unobserve = vi.fn();
      disconnect = mockDisconnect;
    },
  );
});

describe('VisionItem', () => {
  describe('렌더링', () => {
    it('keyword가 h3 요소로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Param',
      );
    });

    it('title이 h4 요소로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        '정밀한 설계',
      );
    });

    it('description이 vision__content__description으로 렌더링된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      const el = container.querySelector('.vision__content__description');
      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent(defaultProps.description);
    });

    it('index 라벨이 "VISION {index+1}" 형식으로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} index={0} />);
      expect(screen.getByText('VISION 1')).toBeInTheDocument();
    });

    it('이미지가 title을 alt로 렌더링된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('정밀한 설계')).toBeInTheDocument();
    });

    it('이미지 src에 image prop이 반영된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('정밀한 설계')).toHaveAttribute(
        'src',
        'vision_param.webp',
      );
    });

    it('sizes 속성이 반응형 뷰포트에 따라 설정된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('정밀한 설계')).toHaveAttribute(
        'sizes',
        '(max-width: 767px) 100vw, (max-width: 1024px) 67vw, 710px',
      );
    });

    it('이미지에 loading="lazy" 속성이 설정된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('정밀한 설계')).toHaveAttribute(
        'loading',
        'lazy',
      );
    });

    it('이미지에 width="710" 속성이 설정된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('정밀한 설계')).toHaveAttribute(
        'width',
        '710',
      );
    });

    it('이미지에 height="473" 속성이 설정된다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(screen.getByAltText('정밀한 설계')).toHaveAttribute(
        'height',
        '473',
      );
    });

    it('hr 구분선이 렌더링된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('hr 구분선에 aria-hidden="true" 속성이 설정된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      expect(container.querySelector('hr')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });

  describe('reverse 레이아웃', () => {
    it('짝수 index(0)는 vision__content--reverse 클래스가 없다', () => {
      const { container } = render(<VisionItem {...defaultProps} index={0} />);
      expect(
        container.querySelector('.vision__content--reverse'),
      ).not.toBeInTheDocument();
    });

    it('홀수 index(1)는 vision__content--reverse 클래스가 적용된다', () => {
      const { container } = render(<VisionItem {...defaultProps} index={1} />);
      expect(
        container.querySelector('.vision__content--reverse'),
      ).toBeInTheDocument();
    });

    it('짝수 index(2)는 vision__content--reverse 클래스가 없다', () => {
      const { container } = render(<VisionItem {...defaultProps} index={2} />);
      expect(
        container.querySelector('.vision__content--reverse'),
      ).not.toBeInTheDocument();
    });
  });
});

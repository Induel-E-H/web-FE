import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Vision } from './Vision';

vi.mock('@entities/vision/assets/vision_param.webp', () => ({
  default: 'vision_param.webp',
}));
vi.mock('@entities/vision/assets/vision_sculpt.webp', () => ({
  default: 'vision_sculpt.webp',
}));
vi.mock('@entities/vision/assets/vision_invest.webp', () => ({
  default: 'vision_invest.webp',
}));

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

describe('Vision', () => {
  describe('시맨틱 구조', () => {
    it('section.vision이 하나 렌더링된다', () => {
      const { container } = render(<Vision />);
      expect(container.querySelectorAll('section.vision')).toHaveLength(1);
    });

    it('VISION_DATA 수(3)만큼 vision__content가 렌더링된다', () => {
      const { container } = render(<Vision />);
      expect(container.querySelectorAll('.vision__content')).toHaveLength(3);
    });

    it('section에 id="vision" 속성이 설정된다', () => {
      const { container } = render(<Vision />);
      expect(container.querySelector('section.vision')).toHaveAttribute(
        'id',
        'vision',
      );
    });

    it('section에 aria-label="미래 비전" 속성이 설정된다', () => {
      const { container } = render(<Vision />);
      expect(container.querySelector('section.vision')).toHaveAttribute(
        'aria-label',
        '미래 비전',
      );
    });

    it('vision__main 컨테이너가 렌더링된다', () => {
      const { container } = render(<Vision />);
      expect(container.querySelector('.vision__main')).toBeInTheDocument();
    });
  });

  describe('콘텐츠 렌더링', () => {
    it('모든 비전 타이틀(h4)이 렌더링된다', () => {
      render(<Vision />);
      expect(screen.getByText('정밀한 설계')).toBeInTheDocument();
      expect(screen.getByText('공간을 조각하다')).toBeInTheDocument();
      expect(screen.getByText('미래에 투자하다')).toBeInTheDocument();
    });

    it('모든 키워드(h3)가 렌더링된다', () => {
      render(<Vision />);
      expect(screen.getByText('Param')).toBeInTheDocument();
      expect(screen.getByText('Sculpt')).toBeInTheDocument();
      expect(screen.getByText('Invest')).toBeInTheDocument();
    });

    it('각 이미지가 title을 alt로 렌더링된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('정밀한 설계')).toBeInTheDocument();
      expect(screen.getByAltText('공간을 조각하다')).toBeInTheDocument();
      expect(screen.getByAltText('미래에 투자하다')).toBeInTheDocument();
    });
  });

  describe('이미지 매핑', () => {
    it('정밀한 설계 이미지가 vision_param.webp에 매핑된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('정밀한 설계')).toHaveAttribute(
        'src',
        'vision_param.webp',
      );
    });

    it('공간을 조각하다 이미지가 vision_sculpt.webp에 매핑된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('공간을 조각하다')).toHaveAttribute(
        'src',
        'vision_sculpt.webp',
      );
    });

    it('미래에 투자하다 이미지가 vision_invest.webp에 매핑된다', () => {
      render(<Vision />);
      expect(screen.getByAltText('미래에 투자하다')).toHaveAttribute(
        'src',
        'vision_invest.webp',
      );
    });
  });

  describe('reverse 레이아웃', () => {
    it('홀수 index(1, 공간을 조각하다)는 vision__content--reverse 클래스를 가진다', () => {
      const { container } = render(<Vision />);
      const items = container.querySelectorAll('.vision__content');
      expect(items[1]).toHaveClass('vision__content--reverse');
    });

    it('짝수 index(0, 정밀한 설계)는 reverse 클래스가 없다', () => {
      const { container } = render(<Vision />);
      const items = container.querySelectorAll('.vision__content');
      expect(items[0]).not.toHaveClass('vision__content--reverse');
    });

    it('짝수 index(2, 미래에 투자하다)는 reverse 클래스가 없다', () => {
      const { container } = render(<Vision />);
      const items = container.querySelectorAll('.vision__content');
      expect(items[2]).not.toHaveClass('vision__content--reverse');
    });
  });
});

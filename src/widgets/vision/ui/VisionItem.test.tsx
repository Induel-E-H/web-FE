import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { VisionItem } from './VisionItem';

const defaultProps = {
  title: 'Parametric Design',
  description:
    '수치 기반 설계와 알고리즘 모델링을 통해 최적화된 익스테리어 솔루션을 제공합니다.',
  keyword: 'Param',
  image: 'vision_param.webp',
  index: 0,
};

let observerCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = mockObserve;
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
        'Parametric Design',
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

  describe('스크롤 페이드인 애니메이션', () => {
    it('마운트 시 IntersectionObserver를 등록한다', () => {
      render(<VisionItem {...defaultProps} />);
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });

    it('언마운트 시 IntersectionObserver를 해제한다', () => {
      const { unmount } = render(<VisionItem {...defaultProps} />);
      unmount();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('뷰포트에 진입하면 is-visible 클래스가 추가된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      const el = container.querySelector('.vision__content')!;

      observerCallback(
        [
          {
            isIntersecting: true,
            boundingClientRect: { top: 100 },
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );

      expect(el).toHaveClass('is-visible');
    });

    it('뷰포트 아래로 벗어나면 is-visible 클래스가 제거된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      const el = container.querySelector('.vision__content')!;

      observerCallback(
        [
          {
            isIntersecting: true,
            boundingClientRect: { top: 100 },
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
      expect(el).toHaveClass('is-visible');

      observerCallback(
        [
          {
            isIntersecting: false,
            boundingClientRect: { top: 200 },
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
      expect(el).not.toHaveClass('is-visible');
    });

    it('뷰포트 위로 벗어나면 is-visible 클래스가 유지된다', () => {
      const { container } = render(<VisionItem {...defaultProps} />);
      const el = container.querySelector('.vision__content')!;

      observerCallback(
        [
          {
            isIntersecting: true,
            boundingClientRect: { top: 100 },
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
      expect(el).toHaveClass('is-visible');

      observerCallback(
        [
          {
            isIntersecting: false,
            boundingClientRect: { top: -100 },
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
      expect(el).toHaveClass('is-visible');
    });
  });
});

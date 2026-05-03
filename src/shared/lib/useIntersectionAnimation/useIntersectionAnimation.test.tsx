import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { useIntersectionAnimation } from './useIntersectionAnimation';

type IOCallback = IntersectionObserverCallback;

let capturedCallback: IOCallback | null = null;
let mockObserve: MockInstance;
let mockDisconnect: MockInstance;

function TestComponent({ threshold }: { threshold?: number }) {
  const ref = useIntersectionAnimation<HTMLDivElement>(threshold);
  return <div ref={ref} data-testid='target' />;
}

describe('useIntersectionAnimation', () => {
  beforeEach(() => {
    capturedCallback = null;
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IOCallback) {
          capturedCallback = cb;
        }
        observe = mockObserve;
        disconnect = mockDisconnect;
        unobserve = vi.fn();
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('마운트 동작', () => {
    it('ref를 반환한다 (target 요소가 DOM에 연결된다)', () => {
      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('target')).toBeInTheDocument();
    });

    it('마운트 시 IntersectionObserver.observe가 호출된다', () => {
      render(<TestComponent />);
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
  });

  describe('언마운트 동작', () => {
    it('언마운트 시 IntersectionObserver.disconnect가 호출된다', () => {
      const { unmount } = render(<TestComponent />);
      unmount();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('IntersectionObserver 콜백 동작', () => {
    it('isIntersecting=true이면 "is-visible" 클래스가 추가된다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');

      capturedCallback!(
        [
          {
            isIntersecting: true,
            boundingClientRect: { top: 0 } as DOMRectReadOnly,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );

      expect(el.classList.contains('is-visible')).toBe(true);
    });

    it('isIntersecting=false이고 boundingClientRect.top > 0이면 "is-visible" 클래스가 제거된다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');
      el.classList.add('is-visible');

      capturedCallback!(
        [
          {
            isIntersecting: false,
            boundingClientRect: { top: 100 } as DOMRectReadOnly,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );

      expect(el.classList.contains('is-visible')).toBe(false);
    });

    it('isIntersecting=false이고 boundingClientRect.top <= 0이면 "is-visible" 클래스가 유지된다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');
      el.classList.add('is-visible');

      capturedCallback!(
        [
          {
            isIntersecting: false,
            boundingClientRect: { top: 0 } as DOMRectReadOnly,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );

      expect(el.classList.contains('is-visible')).toBe(true);
    });
  });
});

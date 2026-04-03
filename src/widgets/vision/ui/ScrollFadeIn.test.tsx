import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollFadeIn } from './ScrollFadeIn';

function TestComponent() {
  useScrollFadeIn();
  return (
    <>
      <div className='fade-section'>section 1</div>
      <div className='fade-section'>section 2</div>
    </>
  );
}

describe('useScrollFadeIn', () => {
  let capturedCallback: IntersectionObserverCallback;
  let observedElements: Element[];
  const mockDisconnect = vi.fn();
  const constructorSpy = vi.fn();

  beforeEach(() => {
    observedElements = [];
    mockDisconnect.mockClear();
    constructorSpy.mockClear();

    const disconnect = mockDisconnect;
    const spy = constructorSpy;
    const captured = (cb: IntersectionObserverCallback) => {
      capturedCallback = cb;
    };
    const observed = observedElements;

    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        spy(callback, options);
        captured(callback);
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect = disconnect;
      unobserve = vi.fn();
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('초기화', () => {
    it('모든 .fade-section 요소를 observe한다', () => {
      render(<TestComponent />);
      expect(observedElements).toHaveLength(2);
    });

    it('threshold 0.3으로 IntersectionObserver를 생성한다', () => {
      render(<TestComponent />);
      expect(constructorSpy).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.3,
      });
    });
  });

  describe('교차 감지', () => {
    it('isIntersecting=true일 때 해당 요소에 show 클래스를 추가한다', () => {
      const { container } = render(<TestComponent />);
      const fadeSections = container.querySelectorAll('.fade-section');

      act(() => {
        capturedCallback(
          [
            {
              isIntersecting: true,
              target: fadeSections[0],
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });

      expect(fadeSections[0]).toHaveClass('show');
    });

    it('isIntersecting=false일 때 show 클래스를 추가하지 않는다', () => {
      const { container } = render(<TestComponent />);
      const fadeSections = container.querySelectorAll('.fade-section');

      act(() => {
        capturedCallback(
          [
            {
              isIntersecting: false,
              target: fadeSections[0],
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });

      expect(fadeSections[0]).not.toHaveClass('show');
    });

    it('여러 entry 중 isIntersecting=true인 요소만 show 클래스를 가진다', () => {
      const { container } = render(<TestComponent />);
      const fadeSections = container.querySelectorAll('.fade-section');

      act(() => {
        capturedCallback(
          [
            {
              isIntersecting: true,
              target: fadeSections[0],
            } as IntersectionObserverEntry,
            {
              isIntersecting: false,
              target: fadeSections[1],
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });

      expect(fadeSections[0]).toHaveClass('show');
      expect(fadeSections[1]).not.toHaveClass('show');
    });
  });

  describe('클린업', () => {
    it('언마운트 시 observer.disconnect가 호출된다', () => {
      const { unmount } = render(<TestComponent />);

      unmount();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});

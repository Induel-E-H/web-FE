import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollAnimation } from './useScrollAnimation';

function TestComponent({ threshold }: { threshold?: number }) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(threshold);
  return (
    <div ref={ref} data-testid='target' data-visible={String(isVisible)} />
  );
}

const elementCallbackMap = new Map<Element, IntersectionObserverCallback>();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let capturedOptions: IntersectionObserverInit = {};

function triggerObserver(el: Element, isIntersecting: boolean, top: number) {
  const cb = elementCallbackMap.get(el);
  if (!cb) return;
  act(() => {
    cb(
      [
        {
          isIntersecting,
          boundingClientRect: { top } as DOMRectReadOnly,
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: el,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });
}

beforeEach(() => {
  elementCallbackMap.clear();
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  capturedOptions = {};
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      private cb: IntersectionObserverCallback;
      constructor(
        cb: IntersectionObserverCallback,
        options: IntersectionObserverInit = {},
      ) {
        this.cb = cb;
        capturedOptions = options;
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

describe('useScrollAnimation', () => {
  describe('초기 상태', () => {
    it('isVisible 초기값은 false이다', () => {
      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('target')).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('IntersectionObserver 동작', () => {
    it('요소가 뷰포트에 진입하면 isVisible이 true가 된다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');
      triggerObserver(el, true, -100);
      expect(el).toHaveAttribute('data-visible', 'true');
    });

    it('요소가 뷰포트 아래로 나가면(top > 0) isVisible이 false로 리셋된다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');
      triggerObserver(el, true, -100);
      triggerObserver(el, false, 100);
      expect(el).toHaveAttribute('data-visible', 'false');
    });

    it('요소가 뷰포트 위로 나가면(top < 0) isVisible이 true를 유지한다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');
      triggerObserver(el, true, -100);
      triggerObserver(el, false, -50);
      expect(el).toHaveAttribute('data-visible', 'true');
    });

    it('top이 정확히 0이면 isVisible이 true를 유지한다', () => {
      const { getByTestId } = render(<TestComponent />);
      const el = getByTestId('target');
      triggerObserver(el, true, 0);
      triggerObserver(el, false, 0);
      expect(el).toHaveAttribute('data-visible', 'true');
    });
  });

  describe('threshold 옵션', () => {
    it('기본 threshold는 0.15이다', () => {
      render(<TestComponent />);
      expect(capturedOptions.threshold).toBe(0.15);
    });

    it('커스텀 threshold가 IntersectionObserver에 전달된다', () => {
      render(<TestComponent threshold={0.5} />);
      expect(capturedOptions.threshold).toBe(0.5);
    });
  });

  describe('생명주기', () => {
    it('마운트 시 observe가 호출된다', () => {
      const { getByTestId } = render(<TestComponent />);
      expect(mockObserve).toHaveBeenCalledWith(getByTestId('target'));
    });

    it('언마운트 시 disconnect가 호출된다', () => {
      const { unmount } = render(<TestComponent />);
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});

import { useRef } from 'react';

import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { preloadImages } from './preloadImages';
import { usePreloadOnVisible } from './usePreloadOnVisible';

vi.mock('./preloadImages', () => ({
  preloadImages: vi.fn(),
}));

type IOCallback = IntersectionObserverCallback;

let capturedCallback: IOCallback | null = null;
let mockObserve: MockInstance;
let mockDisconnect: MockInstance;

function TestComponent({ urls, hasRef }: { urls: string[]; hasRef: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePreloadOnVisible(hasRef ? ref : { current: null }, urls);
  return hasRef ? <div ref={ref} data-testid='target' /> : null;
}

describe('usePreloadOnVisible', () => {
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
    vi.mocked(preloadImages).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('observe 조건', () => {
    it('urls가 비어있으면 observe가 호출되지 않는다', () => {
      render(<TestComponent urls={[]} hasRef={true} />);
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('ref.current가 null이면 observe가 호출되지 않는다', () => {
      render(
        <TestComponent
          urls={['https://example.com/img.webp']}
          hasRef={false}
        />,
      );
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('el과 urls가 모두 있으면 observe가 호출된다', () => {
      render(
        <TestComponent urls={['https://example.com/img.webp']} hasRef={true} />,
      );
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
  });

  describe('언마운트 동작', () => {
    it('언마운트 시 disconnect가 호출된다', () => {
      const { unmount } = render(
        <TestComponent urls={['https://example.com/img.webp']} hasRef={true} />,
      );
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('IntersectionObserver 콜백 동작', () => {
    it('isIntersecting=true이면 preloadImages가 호출되고 disconnect된다', () => {
      const urls = ['https://example.com/img.webp'];
      render(<TestComponent urls={urls} hasRef={true} />);

      capturedCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );

      expect(preloadImages).toHaveBeenCalledWith(urls);
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('isIntersecting=false이면 preloadImages가 호출되지 않는다', () => {
      const urls = ['https://example.com/img.webp'];
      render(<TestComponent urls={urls} hasRef={true} />);

      capturedCallback!(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );

      expect(preloadImages).not.toHaveBeenCalled();
    });
  });
});

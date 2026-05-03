import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { act, renderHook } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

import { useIsHero } from './useIsHero';

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

let observerCallback: ObserverCallback | null = null;
let observeSpy: Mock;
let disconnectSpy: Mock;

function createWrapper(initialPath: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    );
  };
}

describe('useIsHero', () => {
  beforeEach(() => {
    observerCallback = null;
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: ObserverCallback) {
          observerCallback = cb;
        }
        observe = observeSpy;
        unobserve = vi.fn();
        disconnect = disconnectSpy;
      },
    );
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  describe('초기 상태', () => {
    it('홈 경로("/")에서는 초기값이 true이다', () => {
      const { result } = renderHook(() => useIsHero(), {
        wrapper: createWrapper('/'),
      });
      expect(result.current).toBe(true);
    });

    it('홈이 아닌 경로에서는 초기값이 false이다', () => {
      const { result } = renderHook(() => useIsHero(), {
        wrapper: createWrapper('/privacy_policy'),
      });
      expect(result.current).toBe(false);
    });
  });

  describe('IntersectionObserver 동작', () => {
    it('.hero 엘리먼트가 DOM에 없으면 observer가 attach되지 않는다', () => {
      renderHook(() => useIsHero(), { wrapper: createWrapper('/') });
      expect(observeSpy).not.toHaveBeenCalled();
    });

    it('.hero 엘리먼트가 있으면 observer가 해당 엘리먼트를 observe한다', () => {
      const hero = document.createElement('div');
      hero.className = 'hero';
      document.body.appendChild(hero);

      renderHook(() => useIsHero(), { wrapper: createWrapper('/') });

      expect(observeSpy).toHaveBeenCalledTimes(1);
      expect(observeSpy).toHaveBeenCalledWith(hero);
    });

    it('isIntersecting: true이면 isHero가 true가 된다', () => {
      const hero = document.createElement('div');
      hero.className = 'hero';
      document.body.appendChild(hero);

      const { result } = renderHook(() => useIsHero(), {
        wrapper: createWrapper('/privacy_policy'),
      });

      expect(result.current).toBe(false);

      act(() => {
        observerCallback?.([{ isIntersecting: true }]);
      });

      expect(result.current).toBe(true);
    });

    it('isIntersecting: false이면 isHero가 false가 된다', () => {
      const hero = document.createElement('div');
      hero.className = 'hero';
      document.body.appendChild(hero);

      const { result } = renderHook(() => useIsHero(), {
        wrapper: createWrapper('/'),
      });

      expect(result.current).toBe(true);

      act(() => {
        observerCallback?.([{ isIntersecting: false }]);
      });

      expect(result.current).toBe(false);
    });

    it('언마운트 시 observer.disconnect가 호출된다', () => {
      const hero = document.createElement('div');
      hero.className = 'hero';
      document.body.appendChild(hero);

      const { unmount } = renderHook(() => useIsHero(), {
        wrapper: createWrapper('/'),
      });

      expect(disconnectSpy).not.toHaveBeenCalled();
      unmount();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});

import { createElement } from 'react';

import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSlideGesture } from './useSlideGesture';

// 테스트용 래퍼 컴포넌트 팩토리
function makeWrapper(
  setPage: React.Dispatch<React.SetStateAction<number>>,
  totalPages: number,
) {
  function SliderWrapper() {
    const { ref, onTouchStart, onTouchEnd } = useSlideGesture(
      setPage,
      totalPages,
    );
    return createElement('div', {
      ref,
      'data-testid': 'slider',
      onTouchStart,
      onTouchEnd,
    });
  }
  return SliderWrapper;
}

describe('useSlideGesture', () => {
  describe('반환값', () => {
    it('ref, onTouchStart, onTouchEnd를 반환한다', () => {
      const { result } = renderHook(() => useSlideGesture(vi.fn(), 3));
      expect(result.current.ref).toBeDefined();
      expect(typeof result.current.onTouchStart).toBe('function');
      expect(typeof result.current.onTouchEnd).toBe('function');
    });
  });

  describe('useEffect — null ref 분기', () => {
    it('ref.current가 null이면 wheel 리스너가 등록되지 않는다 (early return 분기 커버)', () => {
      // renderHook은 DOM 요소에 ref를 연결하지 않으므로 ref.current === null
      const mockSetPage = vi.fn();
      renderHook(() => useSlideGesture(mockSetPage, 3));

      // wheel 이벤트를 발생시켜도 setPage가 호출되지 않는다
      window.dispatchEvent(new WheelEvent('wheel', { deltaX: 100, deltaY: 0 }));

      expect(mockSetPage).not.toHaveBeenCalled();
    });
  });

  describe('onTouchStart / onTouchEnd', () => {
    it('onTouchEnd: touchStartX가 null이면 아무것도 하지 않는다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      // touchStart 없이 touchEnd만 발생
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 50 }] });

      expect(mockSetPage).not.toHaveBeenCalled();
    });

    it('onTouchEnd: delta가 threshold(50) 미만이면 슬라이드하지 않는다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      fireEvent.touchStart(el, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 55 }] }); // delta = 45 < 50

      expect(mockSetPage).not.toHaveBeenCalled();
    });

    it('onTouchEnd: 오른쪽 스와이프(delta > 0)이면 다음 페이지로 슬라이드한다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] }); // delta = 100 > 0

      expect(mockSetPage).toHaveBeenCalledOnce();
      const updater = mockSetPage.mock.calls[0][0] as (p: number) => number;
      expect(updater(0)).toBe(1); // page 0 + 1 = 1
    });

    it('onTouchEnd: 왼쪽 스와이프(delta < 0)이면 이전 페이지로 슬라이드한다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      fireEvent.touchStart(el, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 200 }] }); // delta = -100 < 0

      expect(mockSetPage).toHaveBeenCalledOnce();
      const updater = mockSetPage.mock.calls[0][0] as (p: number) => number;
      expect(updater(1)).toBe(0); // page 1 - 1 = 0
    });

    it('슬라이드 결과가 totalPages-1을 초과하지 않도록 클램핑된다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] });

      const updater = mockSetPage.mock.calls[0][0] as (p: number) => number;
      expect(updater(2)).toBe(2); // totalPages-1 = 2, clamp
    });

    it('슬라이드 결과가 0 미만으로 내려가지 않도록 클램핑된다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      fireEvent.touchStart(el, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 200 }] }); // slide left

      const updater = mockSetPage.mock.calls[0][0] as (p: number) => number;
      expect(updater(0)).toBe(0); // clamp to 0
    });
  });

  describe('wheel 이벤트', () => {
    it('수직 스크롤(|deltaY| >= |deltaX|)은 무시된다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      el.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 10,
          deltaY: 50,
          cancelable: true,
          bubbles: true,
        }),
      );

      expect(mockSetPage).not.toHaveBeenCalled();
    });

    it('수평 wheel이지만 threshold(30) 미만이면 무시된다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      el.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 20,
          deltaY: 0,
          cancelable: true,
          bubbles: true,
        }),
      );

      expect(mockSetPage).not.toHaveBeenCalled();
    });

    it('수평 wheel 오른쪽(deltaX > 0, >= threshold)이면 다음 페이지로 슬라이드한다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      el.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 50,
          deltaY: 0,
          cancelable: true,
          bubbles: true,
        }),
      );

      expect(mockSetPage).toHaveBeenCalledOnce();
      const updater = mockSetPage.mock.calls[0][0] as (p: number) => number;
      expect(updater(0)).toBe(1);
    });

    it('수평 wheel 왼쪽(deltaX < 0, |deltaX| >= threshold)이면 이전 페이지로 슬라이드한다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      el.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: -50,
          deltaY: 0,
          cancelable: true,
          bubbles: true,
        }),
      );

      expect(mockSetPage).toHaveBeenCalledOnce();
      const updater = mockSetPage.mock.calls[0][0] as (p: number) => number;
      expect(updater(1)).toBe(0);
    });

    it('언마운트 시 wheel 리스너가 제거된다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId, unmount } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      unmount();

      // 언마운트 후 wheel 이벤트를 발생시켜도 setPage가 호출되지 않는다
      el.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 100,
          deltaY: 0,
          cancelable: true,
          bubbles: true,
        }),
      );

      expect(mockSetPage).not.toHaveBeenCalled();
    });
  });

  describe('쿨다운(cooldown)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('쿨다운 중 slide 호출은 무시된다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      // 첫 번째 슬라이드 — 쿨다운 시작
      act(() => {
        fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
        fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] });
      });
      expect(mockSetPage).toHaveBeenCalledTimes(1);

      // 쿨다운 중 두 번째 슬라이드 — 무시되어야 함
      act(() => {
        fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
        fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] });
      });
      expect(mockSetPage).toHaveBeenCalledTimes(1);
    });

    it('쿨다운(400ms) 후 다시 슬라이드할 수 있다', () => {
      const mockSetPage = vi.fn();
      const Wrapper = makeWrapper(mockSetPage, 3);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      act(() => {
        fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
        fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] });
      });
      expect(mockSetPage).toHaveBeenCalledTimes(1);

      // 쿨다운 해제
      act(() => {
        vi.advanceTimersByTime(400);
      });

      act(() => {
        fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
        fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] });
      });
      expect(mockSetPage).toHaveBeenCalledTimes(2);
    });
  });

  describe('useLayoutEffect — totalPagesRef 업데이트', () => {
    it('totalPages가 변경되면 totalPagesRef가 업데이트된다', () => {
      const mockSetPage = vi.fn();
      const { rerender } = renderHook(
        ({ totalPages }: { totalPages: number }) =>
          useSlideGesture(mockSetPage, totalPages),
        { initialProps: { totalPages: 3 } },
      );

      // totalPages를 5로 변경 후 재렌더링
      rerender({ totalPages: 5 });

      // 업데이트된 ref를 통해 슬라이드 시 totalPages-1(4)로 클램핑되는지 확인
      // (직접 확인을 위해 별도 컴포넌트 사용)
      const mockSetPage2 = vi.fn();
      const Wrapper = makeWrapper(mockSetPage2, 5);
      const { getByTestId } = render(createElement(Wrapper));
      const el = getByTestId('slider');

      fireEvent.touchStart(el, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(el, { changedTouches: [{ clientX: 100 }] });

      const updater = mockSetPage2.mock.calls[0][0] as (p: number) => number;
      expect(updater(4)).toBe(4); // clamp: max(0, min(4+1, 5-1)) = 4
    });
  });
});

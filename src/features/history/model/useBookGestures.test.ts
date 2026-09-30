import type { MouseEvent, PointerEvent } from 'react';

import type { FlipBookHandle } from '@gullabs/react-flipbook';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  HOLD_DELAY,
  HOLD_MOVE_TOLERANCE,
  SWIPE_DISTANCE,
  useBookGestures,
} from './useBookGestures';

const STAGE_WIDTH = 1000;

function createStage() {
  const stage = document.createElement('div');
  stage.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: STAGE_WIDTH, height: 600 }) as DOMRect;
  document.body.appendChild(stage);
  return stage;
}

function pointer(
  stage: HTMLElement,
  type: string,
  x: number,
  y = 300,
  target: Node = stage,
) {
  return {
    type,
    button: 0,
    clientX: x,
    clientY: y,
    currentTarget: stage,
    target,
    stopPropagation: vi.fn(),
  } as unknown as PointerEvent<HTMLElement>;
}

function setup(swipe: boolean) {
  const book = {
    flipNext: vi.fn(),
    flipPrev: vi.fn(),
    cancelTurn: vi.fn(),
  };
  const onHoldStart = vi.fn();
  const onHoldEnd = vi.fn();
  const { result } = renderHook(() =>
    useBookGestures({
      bookRef: { current: book as unknown as FlipBookHandle },
      swipe,
      onHoldStart,
      onHoldEnd,
    }),
  );
  const stage = createStage();
  return { g: result.current, stage, book, onHoldStart, onHoldEnd };
}

describe('useBookGestures', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('꾹 누르기', () => {
    it('오른쪽을 누르고 있으면 next, 왼쪽이면 prev 로 시작한다', () => {
      const { g, stage, book, onHoldStart } = setup(false);
      g.onPointerDown(pointer(stage, 'pointerdown', 800));
      act(() => {
        vi.advanceTimersByTime(HOLD_DELAY);
      });
      expect(book.cancelTurn).toHaveBeenCalled();
      expect(onHoldStart).toHaveBeenLastCalledWith('next');

      g.onPointerEnd(pointer(stage, 'pointerup', 800));
      g.onPointerDown(pointer(stage, 'pointerdown', 100));
      act(() => {
        vi.advanceTimersByTime(HOLD_DELAY);
      });
      expect(onHoldStart).toHaveBeenLastCalledWith('prev');
    });

    it('움직이면 꾹 누르기가 취소된다', () => {
      const { g, stage, onHoldStart } = setup(false);
      g.onPointerDown(pointer(stage, 'pointerdown', 800));
      g.onPointerMove(
        pointer(stage, 'pointermove', 800 - HOLD_MOVE_TOLERANCE - 1),
      );
      act(() => {
        vi.advanceTimersByTime(HOLD_DELAY);
      });
      expect(onHoldStart).not.toHaveBeenCalled();
    });

    it('떼면 onHoldEnd 를 부르고 뒤따르는 click 을 막는다', () => {
      const { g, stage, onHoldEnd } = setup(false);
      g.onPointerDown(pointer(stage, 'pointerdown', 800));
      act(() => {
        vi.advanceTimersByTime(HOLD_DELAY);
      });
      const stopPropagation = vi.fn();
      g.onPointerEnd({
        ...pointer(stage, 'pointerup', 800),
        stopPropagation,
      });
      expect(onHoldEnd).toHaveBeenCalledTimes(1);
      expect(stopPropagation).toHaveBeenCalled();

      const preventDefault = vi.fn();
      g.onClickCapture({
        stopPropagation: vi.fn(),
        preventDefault,
      } as unknown as MouseEvent<HTMLElement>);
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('스와이프', () => {
    it('오른쪽 → 왼쪽이면 다음 장, 반대면 이전 장으로 넘긴다', () => {
      const { g, stage, book } = setup(true);
      g.onPointerDown(pointer(stage, 'pointerdown', 800));
      g.onPointerEnd(pointer(stage, 'pointerup', 800 - SWIPE_DISTANCE - 10));
      expect(book.flipNext).toHaveBeenCalledTimes(1);

      g.onPointerDown(pointer(stage, 'pointerdown', 200));
      g.onPointerEnd(pointer(stage, 'pointerup', 200 + SWIPE_DISTANCE + 10));
      expect(book.flipPrev).toHaveBeenCalledTimes(1);
    });

    it('짧거나 세로로 더 많이 민 것, pointercancel 은 넘기지 않는다', () => {
      const { g, stage, book } = setup(true);
      g.onPointerDown(pointer(stage, 'pointerdown', 500));
      g.onPointerEnd(pointer(stage, 'pointerup', 500 - SWIPE_DISTANCE + 5));
      g.onPointerDown(pointer(stage, 'pointerdown', 500));
      g.onPointerEnd(pointer(stage, 'pointerup', 440, 600));
      g.onPointerDown(pointer(stage, 'pointerdown', 800));
      g.onPointerEnd(pointer(stage, 'pointercancel', 600));
      expect(book.flipNext).not.toHaveBeenCalled();
      expect(book.flipPrev).not.toHaveBeenCalled();
    });

    it('swipe 가 꺼져 있으면(가로 보기) 넘기지 않는다', () => {
      const { g, stage, book } = setup(false);
      g.onPointerDown(pointer(stage, 'pointerdown', 800));
      g.onPointerEnd(pointer(stage, 'pointerup', 600));
      expect(book.flipNext).not.toHaveBeenCalled();
    });

    it('무대 DOM 밖(포털)에서 시작한 입력은 무시한다', () => {
      const { g, stage, book, onHoldStart } = setup(true);
      const popup = document.createElement('div');
      document.body.appendChild(popup);
      g.onPointerDown(pointer(stage, 'pointerdown', 800, 300, popup));
      act(() => {
        vi.advanceTimersByTime(HOLD_DELAY);
      });
      g.onPointerEnd(pointer(stage, 'pointerup', 600, 300, popup));
      expect(book.flipNext).not.toHaveBeenCalled();
      expect(onHoldStart).not.toHaveBeenCalled();
    });
  });
});

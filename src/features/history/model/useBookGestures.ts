import {
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  useRef,
} from 'react';

import type { FlipBookHandle } from '@gullabs/react-flipbook';

import type { ChainDirection } from './useFlipChain';

export const HOLD_DELAY = 400;
export const HOLD_MOVE_TOLERANCE = 8;
export const SWIPE_DISTANCE = 40;

type Point = { x: number; y: number };
type Hold = Point & { timer: number; active: boolean };

interface Options {
  bookRef: RefObject<FlipBookHandle | null>;
  /** 반쪽 보기(태블릿/모바일): 엔진 포인터 넘김 대신 스와이프를 직접 판정한다. */
  swipe: boolean;
  onHoldStart: (direction: ChainDirection) => void;
  onHoldEnd: () => void;
}

/**
 * 책 무대에 거는 입력 처리.
 * - 꾹 누르기: 누른 쪽(왼쪽 prev / 오른쪽 next)으로 연속 넘김을 시작하고, 떼면 멈춘다.
 * - 스와이프(swipe 일 때): 오른쪽 → 왼쪽이면 다음 장, 반대면 이전 장.
 * - 반쪽 보기의 이전/다음 버튼도 holdButton 으로 같은 꾹 누르기를 쓴다.
 * - 꾹 누르기·스와이프 뒤에 따라오는 click 은 엔진과 페이지 콘텐츠에 전달하지 않는다.
 * - 이미지 팝업처럼 포털로 띄운 요소의 이벤트도 React 트리를 따라 올라오므로,
 *   실제 무대 DOM 안에서 시작한 입력만 다룬다.
 */
export function useBookGestures({
  bookRef,
  swipe,
  onHoldStart,
  onHoldEnd,
}: Options) {
  const holdRef = useRef<Hold | null>(null);
  const swipeStartRef = useRef<Point | null>(null);
  const suppressClickRef = useRef(false);

  function clearHold() {
    const hold = holdRef.current;
    holdRef.current = null;
    if (hold) window.clearTimeout(hold.timer);
    return hold;
  }

  function startHold(e: PointerEvent<HTMLElement>, direction: ChainDirection) {
    const hold: Hold = { x: e.clientX, y: e.clientY, timer: 0, active: false };
    hold.timer = window.setTimeout(() => {
      hold.active = true;
      bookRef.current?.cancelTurn();
      onHoldStart(direction);
    }, HOLD_DELAY);
    clearHold();
    holdRef.current = hold;
  }

  // 꾹 누르기였다면 멈추고 true 를 돌려준다. 뒤따르는 click 은 막는다.
  function endHold(e: PointerEvent<HTMLElement>) {
    const hold = clearHold();
    if (!hold?.active) return false;
    e.stopPropagation();
    suppressClickRef.current = true;
    onHoldEnd();
    return true;
  }

  function onPointerDown(e: PointerEvent<HTMLElement>) {
    suppressClickRef.current = false;
    if (e.button !== 0) return;
    if (!e.currentTarget.contains(e.target as Node)) return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
    const rect = e.currentTarget.getBoundingClientRect();
    startHold(e, e.clientX < rect.left + rect.width / 2 ? 'prev' : 'next');
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const hold = holdRef.current;
    if (!hold || hold.active) return;
    const moved = Math.hypot(e.clientX - hold.x, e.clientY - hold.y);
    if (moved > HOLD_MOVE_TOLERANCE) clearHold();
  }

  function onPointerEnd(e: PointerEvent<HTMLElement>) {
    const swipeStart = swipeStartRef.current;
    swipeStartRef.current = null;
    if (endHold(e)) return;
    if (!swipe || !swipeStart || e.type !== 'pointerup') return;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy)) return;
    suppressClickRef.current = true;
    if (dx < 0) bookRef.current?.flipNext();
    else bookRef.current?.flipPrev();
  }

  function onClickCapture(e: MouseEvent<HTMLElement>) {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.stopPropagation();
    e.preventDefault();
  }

  // 누르고 있으면 그 방향으로 연속 넘김, 짧게 누르면 버튼 자신의 onClick 이 한 장 넘긴다.
  function holdButton(direction: ChainDirection) {
    return {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        suppressClickRef.current = false;
        if (e.button === 0) startHold(e, direction);
      },
      onPointerMove,
      onPointerUp: endHold,
      onPointerCancel: endHold,
      onPointerLeave: endHold,
      onClickCapture,
      // 길게 누를 때 뜨는 모바일 메뉴를 막는다
      onContextMenu: (e: MouseEvent<HTMLElement>) => e.preventDefault(),
    };
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onClickCapture,
    holdButton,
  };
}

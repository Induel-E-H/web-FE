import { type RefObject, useRef } from 'react';

import type { FlipBookHandle } from '@gullabs/react-flipbook';

import {
  CHAIN_EDGE_FLIPS,
  FLIP_DURATION,
  RAPID_FLIP_DURATION,
} from './constants';

export type ChainDirection = 'next' | 'prev';

// target === null: 멈출 때까지(hold) 계속 넘긴다.
type Chain = {
  direction: ChainDirection;
  target: number | null;
  flips: number;
};

/**
 * 라이브러리의 flipToPage 는 한 번의 폴드로 목적지를 보여주므로,
 * 여러 장이 넘어가는 연출을 위해 flipNext/flipPrev 를 빠른 속도로 연쇄 호출한다.
 * 먼 이동은 처음과 끝 CHAIN_EDGE_FLIPS 장만 넘기고, 가운데는 즉시 건너뛴다.
 */
export function useFlipChain(bookRef: RefObject<FlipBookHandle | null>) {
  const chainRef = useRef<Chain | null>(null);

  function setFlippingTime(flippingTime: number) {
    bookRef.current?.pageFlip()?.updateSettings({ flippingTime });
  }

  function step() {
    const chain = chainRef.current;
    const book = bookRef.current;
    if (!chain || !book) return;
    const started =
      chain.direction === 'next' ? book.flipNext() : book.flipPrev();
    // 이전 폴드가 아직 끝나지 않아 거절된 경우는 다음 read 에서 이어간다.
    if (!started && !book.pageFlip()?.isAnimating()) stop();
  }

  function skipMiddle(chain: Chain & { target: number }) {
    const visible = visiblePages();
    const span = CHAIN_EDGE_FLIPS * Math.max(visible.length, 1);
    const skipTo =
      chain.direction === 'next' ? chain.target - span : chain.target + span;
    const isAhead =
      chain.direction === 'next'
        ? skipTo > visible[visible.length - 1]
        : skipTo < visible[0];
    if (isAhead) bookRef.current?.turnToPage(skipTo);
  }

  function start(chain: Chain) {
    chainRef.current = chain;
    setFlippingTime(RAPID_FLIP_DURATION);
    step();
  }

  function stop() {
    chainRef.current = null;
    setFlippingTime(FLIP_DURATION);
  }

  function visiblePages() {
    return bookRef.current?.pageFlip()?.getVisiblePages() ?? [];
  }

  function flipTo(target: number) {
    const visible = visiblePages();
    if (visible.length === 0 || visible.includes(target)) return;
    start({
      direction: target > visible[0] ? 'next' : 'prev',
      target,
      flips: 0,
    });
  }

  function startHold(direction: ChainDirection) {
    start({ direction, target: null, flips: 0 });
  }

  // 진행 중인 한 장은 끝까지 넘어가고, 다음 장부터 멈춘다.
  function stopHold() {
    if (chainRef.current?.target === null) stop();
  }

  // 한 장이 다 넘어가 read 상태가 되었을 때 호출.
  function onSettled() {
    const chain = chainRef.current;
    if (!chain) return;
    if (chain.target !== null) {
      if (visiblePages().includes(chain.target)) {
        stop();
        return;
      }
      chain.flips += 1;
      if (chain.flips === CHAIN_EDGE_FLIPS) {
        skipMiddle({ ...chain, target: chain.target });
      }
    }
    step();
  }

  return {
    flipTo,
    startHold,
    stopHold,
    onSettled,
    isChaining: () => chainRef.current !== null,
  };
}

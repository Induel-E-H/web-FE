import type { FlipBookHandle } from '@gullabs/react-flipbook';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  CHAIN_EDGE_FLIPS,
  FLIP_DURATION,
  RAPID_FLIP_DURATION,
} from './constants';
import { useFlipChain } from './useFlipChain';

// 하드커버 가로(landscape) 책: [0], [1,2], [3,4], ..., [last]
function createFakeBook(pageCount: number) {
  const last = pageCount - 1;
  let head = 0;
  const spreadOf = (page: number) =>
    page === 0 || page === last ? page : page % 2 === 1 ? page : page - 1;
  const visible = () =>
    head === 0 || head === last ? [head] : [head, head + 1];

  const updateSettings = vi.fn();
  const engine = {
    getVisiblePages: visible,
    isAnimating: () => false,
    updateSettings,
  };
  const handle = {
    pageFlip: () => engine,
    flipNext: vi.fn(() => {
      if (head === last) return false;
      head = head === 0 ? 1 : Math.min(head + 2, last);
      return true;
    }),
    flipPrev: vi.fn(() => {
      if (head === 0) return false;
      head = head === 1 ? 0 : head === last ? last - 2 : head - 2;
      return true;
    }),
    turnToPage: vi.fn((page: number) => {
      head = spreadOf(page);
      return true;
    }),
    cancelTurn: vi.fn(),
  } as unknown as FlipBookHandle;

  return { handle, updateSettings, visible, getHead: () => head };
}

function setup(pageCount = 40) {
  const book = createFakeBook(pageCount);
  const ref = { current: book.handle };
  const { result } = renderHook(() => useFlipChain(ref));
  // 체인이 끝날 때까지 read 이벤트를 흉내 낸다.
  const settleAll = () => {
    for (let i = 0; i < 100 && result.current.isChaining(); i++) {
      result.current.onSettled();
    }
  };
  return { ...book, chain: result.current, settleAll };
}

describe('useFlipChain', () => {
  describe('flipTo', () => {
    it('가까운 목적지는 한 장씩 넘겨 도착한다', () => {
      const { chain, settleAll, visible, handle } = setup();
      chain.flipTo(5);
      settleAll();
      expect(visible()).toContain(5);
      expect(handle.flipNext).toHaveBeenCalledTimes(3);
      expect(handle.turnToPage).not.toHaveBeenCalled();
    });

    it('먼 목적지는 가운데를 즉시 건너뛰고 앞뒤만 넘긴다', () => {
      const { chain, settleAll, visible, handle } = setup();
      chain.flipTo(37);
      settleAll();
      expect(visible()).toContain(37);
      expect(handle.turnToPage).toHaveBeenCalledTimes(1);
      expect(handle.flipNext).toHaveBeenCalledTimes(CHAIN_EDGE_FLIPS * 2);
    });

    it('뒤쪽 목적지는 flipPrev 로 넘긴다', () => {
      const { chain, settleAll, visible, handle } = setup();
      chain.flipTo(9);
      settleAll();
      chain.flipTo(1);
      settleAll();
      expect(visible()).toContain(1);
      expect(handle.flipPrev).toHaveBeenCalled();
    });

    it('먼 뒤쪽 목적지도 가운데를 즉시 건너뛰고 앞뒤만 넘긴다', () => {
      const { chain, settleAll, visible, handle } = setup();
      chain.flipTo(37);
      settleAll();
      vi.mocked(handle.turnToPage).mockClear();
      chain.flipTo(1);
      settleAll();
      expect(visible()).toContain(1);
      expect(handle.turnToPage).toHaveBeenCalledTimes(1);
      expect(handle.flipPrev).toHaveBeenCalledTimes(CHAIN_EDGE_FLIPS * 2);
    });

    it('넘김이 거절돼도 이전 폴드가 진행 중이면 체인을 유지한다', () => {
      const { chain, handle } = setup();
      vi.mocked(handle.flipNext).mockReturnValueOnce(false);
      vi.spyOn(handle.pageFlip()!, 'isAnimating').mockReturnValue(true);
      chain.flipTo(9);
      expect(chain.isChaining()).toBe(true);
    });

    it('넘김이 거절되고 진행 중인 폴드도 없으면 체인을 멈춘다', () => {
      const { chain, handle } = setup();
      vi.mocked(handle.flipNext).mockReturnValueOnce(false);
      chain.flipTo(9);
      expect(chain.isChaining()).toBe(false);
    });

    it('이미 보이는 페이지면 아무것도 하지 않는다', () => {
      const { chain, handle } = setup();
      chain.flipTo(0);
      expect(handle.flipNext).not.toHaveBeenCalled();
      expect(chain.isChaining()).toBe(false);
    });

    it('체인 동안 빠른 속도로 넘기고 끝나면 원래 속도로 되돌린다', () => {
      const { chain, settleAll, updateSettings } = setup();
      chain.flipTo(5);
      expect(updateSettings).toHaveBeenLastCalledWith({
        flippingTime: RAPID_FLIP_DURATION,
      });
      settleAll();
      expect(updateSettings).toHaveBeenLastCalledWith({
        flippingTime: FLIP_DURATION,
      });
    });
  });

  describe('hold', () => {
    it('stopHold 전까지 계속 넘긴다', () => {
      const { chain, getHead } = setup();
      chain.startHold('next');
      chain.onSettled();
      chain.onSettled();
      expect(getHead()).toBe(5);
      chain.stopHold();
      chain.onSettled();
      expect(getHead()).toBe(5);
      expect(chain.isChaining()).toBe(false);
    });

    it('끝에 닿으면 스스로 멈춘다', () => {
      const { chain, settleAll, getHead } = setup(6);
      chain.startHold('next');
      settleAll();
      expect(getHead()).toBe(5);
      expect(chain.isChaining()).toBe(false);
    });

    it('stopHold 는 목적지 이동 체인을 멈추지 않는다', () => {
      const { chain } = setup();
      chain.flipTo(9);
      chain.stopHold();
      expect(chain.isChaining()).toBe(true);
    });
  });
});

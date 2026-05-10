import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { smoothScrollTo } from './smoothScrollTo';

describe('smoothScrollTo', () => {
  // rAF는 재귀 호출되므로 항상 최신 callback을 저장하도록 배열로 관리
  const rafCallbacks: ((timestamp: number) => void)[] = [];

  function driveRaf(timestamp: number) {
    const cb = rafCallbacks.shift();
    if (cb) cb(timestamp);
  }

  beforeEach(() => {
    rafCallbacks.length = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('대상 요소가 없는 경우', () => {
    it('존재하지 않는 selector이면 requestAnimationFrame이 호출되지 않는다', () => {
      smoothScrollTo('#non-existent-element');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('대상 요소가 있는 경우', () => {
    let target: HTMLElement;

    beforeEach(() => {
      target = document.createElement('div');
      target.id = 'scroll-target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    it('요소가 있으면 requestAnimationFrame이 호출된다', () => {
      smoothScrollTo('#scroll-target');
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    });

    it('애니메이션이 완료(progress=1)되면 onDone이 호출된다', () => {
      const onDone = vi.fn();
      smoothScrollTo('#scroll-target', onDone);

      // 주의: startTime은 !startTime 조건으로 설정되므로 0은 falsy → timestamp=1로 시작
      // 첫 번째 rAF 콜백: timestamp=1 → startTime=1, elapsed=0, progress=0 → 재귀 rAF 등록
      driveRaf(1);
      // 두 번째 rAF 콜백: timestamp=481 → elapsed=481-1=480, progress=1 → 완료
      driveRaf(481);

      expect(onDone).toHaveBeenCalledTimes(1);
    });

    it('애니메이션 도중(progress<1)에는 onDone이 호출되지 않는다', () => {
      const onDone = vi.fn();
      smoothScrollTo('#scroll-target', onDone);

      driveRaf(1);
      // elapsed=240 → progress=0.5 → 아직 진행 중
      driveRaf(241);

      expect(onDone).not.toHaveBeenCalled();
    });

    it('onDone 없이 호출해도 애니메이션 완료 시 오류가 발생하지 않는다', () => {
      smoothScrollTo('#scroll-target');
      driveRaf(1);
      expect(() => driveRaf(481)).not.toThrow();
    });

    it('애니메이션 진행 중 window.scrollTo가 호출된다', () => {
      smoothScrollTo('#scroll-target');
      driveRaf(1);
      driveRaf(241);
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});

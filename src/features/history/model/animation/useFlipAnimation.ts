import { useRef } from 'react';
import { flushSync } from 'react-dom';

import { FLIP_DURATION } from '../constants';
import type { FlipDirection } from '../types';
import { useHistoryStore } from '../useHistoryStore';

export function useFlipAnimation() {
  const isAnimatingRef = useRef(false);
  const pendingCompleteRef = useRef<(() => void) | null>(null);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onAnimationCompleteRef = useRef<(() => void) | null>(null);

  const isFlipping = useHistoryStore((s) => s.isFlipping);
  const flipDirection = useHistoryStore((s) => s.flipDirection);
  const currentFlipDuration = useHistoryStore((s) => s.currentFlipDuration);

  function finishFlipAnimation() {
    if (!isAnimatingRef.current) return;

    const onComplete = pendingCompleteRef.current;
    pendingCompleteRef.current = null;

    // eslint-disable-next-line react-dom/no-flush-sync -- 애니메이션 완료 시 동기 배치 갱신에 필요
    flushSync(() => {
      if (onComplete) onComplete();
      useHistoryStore.setState({ flipDirection: null, isFlipping: false });
    });

    isAnimatingRef.current = false;

    if (onAnimationCompleteRef.current) {
      onAnimationCompleteRef.current();
    }
  }

  function setOnAnimationComplete(cb: (() => void) | null) {
    onAnimationCompleteRef.current = cb;
  }

  function startFlipAnimation(
    direction: FlipDirection,
    onComplete: () => void,
    duration = FLIP_DURATION,
  ) {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    pendingCompleteRef.current = onComplete;
    useHistoryStore.setState({
      currentFlipDuration: duration,
      flipDirection: direction,
      isFlipping: true,
    });

    flipTimerRef.current = setTimeout(finishFlipAnimation, duration);
  }

  function cleanup() {
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
  }

  return {
    isFlipping,
    flipDirection,
    currentFlipDuration,
    isAnimatingRef,
    setOnAnimationComplete,
    startFlipAnimation,
    cleanup,
  };
}

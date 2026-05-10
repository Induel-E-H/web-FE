import { useRef } from 'react';

import { RAPID_FLIP_DURATION } from '../constants';
import type { FlipDirection, IndexItem, NavigationStep } from '../types';
import { useHistoryStore } from '../useHistoryStore';

export function useRapidFlip(
  startFlipAnimation: (
    direction: FlipDirection,
    onComplete: () => void,
    duration?: number,
  ) => void,
) {
  const isRapidFlipping = useHistoryStore((s) => s.isRapidFlipping);
  const tabActiveItem = useHistoryStore((s) => s.tabActiveItem);

  const stepsRef = useRef<NavigationStep[]>([]);
  const directionRef = useRef<FlipDirection>('forward');
  const chainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startRapidSequence(
    steps: NavigationStep[],
    direction: FlipDirection,
    targetItem: IndexItem,
    applyStep: (step: NavigationStep) => void,
  ) {
    const firstStep = steps.shift()!;
    stepsRef.current = steps;
    directionRef.current = direction;

    useHistoryStore.setState({
      isRapidFlipping: true,
      tabActiveItem: targetItem,
    });

    const isLast = steps.length === 0;
    startFlipAnimation(
      direction,
      () => {
        applyStep(firstStep);
        if (isLast) useHistoryStore.setState({ isRapidFlipping: false });
      },
      firstStep.duration ?? RAPID_FLIP_DURATION,
    );
  }

  function chainNextStep(applyStep: (step: NavigationStep) => void): boolean {
    if (stepsRef.current.length === 0) return false;

    const step = stepsRef.current.shift()!;
    const isLast = stepsRef.current.length === 0;

    chainTimerRef.current = setTimeout(() => {
      startFlipAnimation(
        directionRef.current,
        () => {
          applyStep(step);
          if (isLast) useHistoryStore.setState({ isRapidFlipping: false });
        },
        step.duration ?? RAPID_FLIP_DURATION,
      );
    }, 0);

    return true;
  }

  function updateTabActiveItem(item: IndexItem) {
    useHistoryStore.setState({ tabActiveItem: item });
  }

  function cleanup() {
    if (chainTimerRef.current) clearTimeout(chainTimerRef.current);
  }

  return {
    isRapidFlipping,
    tabActiveItem,
    startRapidSequence,
    chainNextStep,
    updateTabActiveItem,
    cleanup,
  };
}

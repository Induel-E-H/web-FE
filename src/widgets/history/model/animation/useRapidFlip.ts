import { useRef, useState } from 'react';

import { RAPID_FLIP_DURATION } from '../constants';
import type { FlipDirection, IndexItem, NavigationStep } from '../types';

export function useRapidFlip(
  startFlipAnimation: (
    direction: FlipDirection,
    onComplete: () => void,
    duration?: number,
  ) => void,
) {
  const [isRapidFlipping, setIsRapidFlipping] = useState(false);
  const [tabActiveItem, setTabActiveItem] = useState<IndexItem>('List');

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

    setIsRapidFlipping(true);
    setTabActiveItem(targetItem);

    const isLast = steps.length === 0;
    startFlipAnimation(
      direction,
      () => {
        applyStep(firstStep);
        if (isLast) setIsRapidFlipping(false);
      },
      RAPID_FLIP_DURATION,
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
          if (isLast) setIsRapidFlipping(false);
        },
        RAPID_FLIP_DURATION,
      );
    }, 0);

    return true;
  }

  function updateTabActiveItem(item: IndexItem) {
    setTabActiveItem(item);
  }

  function cleanup() {
    if (chainTimerRef.current) clearTimeout(chainTimerRef.current);
  }

  return {
    isRapidFlipping,
    tabActiveItem,
    stepsRef,
    startRapidSequence,
    chainNextStep,
    updateTabActiveItem,
    cleanup,
  };
}

import { useEffect, useState } from 'react';

import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { buildRapidSteps } from './animation/buildRapidSteps';
import { useFlipAnimation } from './animation/useFlipAnimation';
import { useRapidFlip } from './animation/useRapidFlip';
import { INDEX_LIST, RAPID_FLIP_DURATION } from './constants';
import { useHoldNavigation } from './events/useHoldNavigation';
import { getPageRegistry } from './pageRegistry';
import type { FlipDirection, IndexItem, NavigationStep } from './types';

export function useBookNavigation(breakpoint: Breakpoint) {
  const pageRegistry = getPageRegistry(breakpoint);

  const [activeItem, setActiveItem] = useState<IndexItem>('List');
  const [pageIndices, setPageIndices] = useState<Record<IndexItem, number>>(
    () =>
      Object.fromEntries(INDEX_LIST.map((item) => [item, 0])) as Record<
        IndexItem,
        number
      >,
  );

  const activeIndex = INDEX_LIST.indexOf(activeItem);
  const rawPageIndex = pageIndices[activeItem];
  const totalPages = pageRegistry[activeItem].totalPages;
  const currentPageIndex = Math.min(rawPageIndex, totalPages - 1);

  const canGoLeft = activeIndex > 0 || currentPageIndex > 0;
  const canGoRight =
    activeIndex < INDEX_LIST.length - 1 || currentPageIndex < totalPages - 1;

  // 다음 페이지 계산 (forward)
  let nextPageIndex = currentPageIndex;
  let nextActiveItem: IndexItem = activeItem;
  if (currentPageIndex < totalPages - 1) {
    nextPageIndex = currentPageIndex + 1;
    nextActiveItem = activeItem;
  } else if (activeIndex < INDEX_LIST.length - 1) {
    nextActiveItem = INDEX_LIST[activeIndex + 1];
    nextPageIndex = 0;
  }

  // 이전 페이지 계산 (backward)
  let prevPageIndex = currentPageIndex;
  let prevActiveItem: IndexItem = activeItem;
  if (currentPageIndex > 0) {
    prevPageIndex = currentPageIndex - 1;
    prevActiveItem = activeItem;
  } else if (activeIndex > 0) {
    prevActiveItem = INDEX_LIST[activeIndex - 1];
    prevPageIndex = pageRegistry[prevActiveItem].totalPages - 1;
  }

  // 하위 훅 초기화
  const {
    isFlipping,
    flipDirection,
    isAnimatingRef,
    setOnAnimationComplete,
    startFlipAnimation,
    cleanup: flipCleanup,
  } = useFlipAnimation();
  const {
    isRapidFlipping,
    tabActiveItem,
    startRapidSequence,
    chainNextStep,
    updateTabActiveItem,
    cleanup: rapidCleanup,
  } = useRapidFlip(startFlipAnimation);
  const {
    isHoldChaining,
    clearHoldDirection,
    beginContinuousFlip,
    endContinuousFlip,
    chainHoldFlip,
    syncCallbacks,
  } = useHoldNavigation();

  // step 적용 헬퍼
  function applyNavigationStep(step: NavigationStep) {
    setPageIndices((prev) => ({ ...prev, [step.item]: step.pageIndex }));
    setActiveItem(step.item);
  }

  // 애니메이션 완료 콜백 설정
  setOnAnimationComplete(() => {
    // rapid 체이닝 우선
    if (chainNextStep(applyNavigationStep)) return;
    // hold 체이닝
    chainHoldFlip();
  });

  function navigateLeft(duration?: number) {
    if (!canGoLeft) {
      clearHoldDirection();
      return;
    }
    startFlipAnimation(
      'backward',
      () => {
        if (currentPageIndex > 0) {
          setPageIndices((prev) => ({
            ...prev,
            [activeItem]: prev[activeItem] - 1,
          }));
        } else if (activeIndex > 0) {
          const prev = INDEX_LIST[activeIndex - 1];
          const prevTotalPages = pageRegistry[prev].totalPages;
          setPageIndices((p) => ({ ...p, [prev]: prevTotalPages - 1 }));
          setActiveItem(prev);
          updateTabActiveItem(prev);
        }
      },
      duration,
    );
  }

  function navigateRight(duration?: number) {
    if (!canGoRight) {
      clearHoldDirection();
      return;
    }
    startFlipAnimation(
      'forward',
      () => {
        if (currentPageIndex < totalPages - 1) {
          setPageIndices((prev) => ({
            ...prev,
            [activeItem]: prev[activeItem] + 1,
          }));
        } else if (activeIndex < INDEX_LIST.length - 1) {
          const next = INDEX_LIST[activeIndex + 1];
          setPageIndices((p) => ({ ...p, [next]: 0 }));
          setActiveItem(next);
          updateTabActiveItem(next);
        }
      },
      duration,
    );
  }

  function navigateToCategory(
    item: IndexItem,
    pageIndex = 0,
    useRapidFlip = false,
  ) {
    const newIndex = INDEX_LIST.indexOf(item);
    if (newIndex === activeIndex && pageIndex === currentPageIndex) return;
    if (isAnimatingRef.current) return;

    let direction: FlipDirection;
    if (newIndex !== activeIndex) {
      direction = newIndex > activeIndex ? 'forward' : 'backward';
    } else {
      direction = pageIndex > currentPageIndex ? 'forward' : 'backward';
    }

    if (!useRapidFlip) {
      startFlipAnimation(direction, () => {
        setPageIndices((prev) => ({ ...prev, [item]: pageIndex }));
        setActiveItem(item);
        updateTabActiveItem(item);
      });
      return;
    }

    const steps = buildRapidSteps({
      activeItem,
      activeIndex,
      currentPageIndex,
      totalPages,
      targetItem: item,
      targetPageIndex: pageIndex,
      targetTotalPages: pageRegistry[item].totalPages,
      direction,
    });

    startRapidSequence(steps, direction, item, applyNavigationStep);
  }

  // 매 렌더 후 최신 함수 반영
  useEffect(() => {
    syncCallbacks(
      navigateLeft,
      navigateRight,
      endContinuousFlip,
      () => navigateLeft(RAPID_FLIP_DURATION),
      () => navigateRight(RAPID_FLIP_DURATION),
    );
  });

  // 클린업
  useEffect(() => {
    return () => {
      flipCleanup();
      rapidCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activeItem,
    tabActiveItem,
    currentPageIndex,
    canGoLeft,
    canGoRight,
    isFlipping,
    flipDirection,
    isRapidFlipping,
    isHoldChaining,
    nextPageIndex,
    nextActiveItem,
    prevPageIndex,
    prevActiveItem,
    navigateToCategory,
    beginContinuousFlip,
  };
}

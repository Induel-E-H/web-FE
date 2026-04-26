import { useEffect, useState } from 'react';

import type { Breakpoint } from '@shared/lib/breakpoint';

import { buildRapidSteps } from './animation/buildRapidSteps';
import { useFlipAnimation } from './animation/useFlipAnimation';
import { useRapidFlip } from './animation/useRapidFlip';
import { INDEX_LIST, RAPID_FLIP_DURATION } from './constants';
import { useHoldNavigation } from './events/useHoldNavigation';
import type { PageConfig } from './pageRegistry';
import { getPageRegistry } from './pageRegistry';
import type { FlipDirection, IndexItem, NavigationStep } from './types';

function pageCountToShadowCount(pages: number): number {
  if (pages >= 10) return 3;
  if (pages >= 5) return 2;
  if (pages >= 2) return 1;
  return 0;
}

function computeGlobalSpreadIndex(
  item: IndexItem,
  pageIndex: number,
  registry: Record<IndexItem, PageConfig>,
): number {
  const itemIdx = INDEX_LIST.indexOf(item);
  let total = 0;
  for (let i = 0; i < itemIdx; i++) {
    total += registry[INDEX_LIST[i]].totalPages;
  }
  return total + pageIndex;
}

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

  let nextPageIndex = currentPageIndex;
  let nextActiveItem: IndexItem = activeItem;
  if (currentPageIndex < totalPages - 1) {
    nextPageIndex = currentPageIndex + 1;
    nextActiveItem = activeItem;
  } else if (activeIndex < INDEX_LIST.length - 1) {
    nextActiveItem = INDEX_LIST[activeIndex + 1];
    nextPageIndex = 0;
  }

  let prevPageIndex = currentPageIndex;
  let prevActiveItem: IndexItem = activeItem;
  if (currentPageIndex > 0) {
    prevPageIndex = currentPageIndex - 1;
    prevActiveItem = activeItem;
  } else if (activeIndex > 0) {
    prevActiveItem = INDEX_LIST[activeIndex - 1];
    prevPageIndex = pageRegistry[prevActiveItem].totalPages - 1;
  }

  const {
    isFlipping,
    flipDirection,
    currentFlipDuration,
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
    chainHoldFlip,
    syncCallbacks,
    syncBoundaryCallbacks,
    syncCoverCallbacks,
  } = useHoldNavigation();

  function applyNavigationStep(step: NavigationStep) {
    setPageIndices((prev) => ({ ...prev, [step.item]: step.pageIndex }));
    setActiveItem(step.item);
  }

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
      activeIndex,
      currentPageIndex,
      targetItem: item,
      targetPageIndex: pageIndex,
      direction,
      getLastPageIndex: (i) => pageRegistry[i].totalPages - 1,
    });

    // 카테고리 1칸 이동은 일반 flip으로 처리 (300ms rapid는 시각적으로 순간이동처럼 보임)
    if (steps.length === 1) {
      startFlipAnimation(direction, () => {
        setPageIndices((prev) => ({ ...prev, [item]: pageIndex }));
        setActiveItem(item);
        updateTabActiveItem(item);
      });
      return;
    }

    startRapidSequence(steps, direction, item, applyNavigationStep);
  }

  useEffect(() => {
    syncCallbacks(
      navigateLeft,
      navigateRight,
      () => navigateLeft(RAPID_FLIP_DURATION),
      () => navigateRight(RAPID_FLIP_DURATION),
    );
  });

  useEffect(() => {
    return () => {
      flipCleanup();
      rapidCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSpreads = INDEX_LIST.reduce(
    (sum, item) => sum + pageRegistry[item].totalPages,
    0,
  );

  let staticLeftGlobalIdx: number;
  let staticRightGlobalIdx: number;

  if (flipDirection === 'forward') {
    staticLeftGlobalIdx = computeGlobalSpreadIndex(
      activeItem,
      currentPageIndex,
      pageRegistry,
    );
    staticRightGlobalIdx = computeGlobalSpreadIndex(
      nextActiveItem,
      nextPageIndex,
      pageRegistry,
    );
  } else if (flipDirection === 'backward') {
    staticLeftGlobalIdx = computeGlobalSpreadIndex(
      prevActiveItem,
      prevPageIndex,
      pageRegistry,
    );
    staticRightGlobalIdx = computeGlobalSpreadIndex(
      activeItem,
      currentPageIndex,
      pageRegistry,
    );
  } else {
    staticLeftGlobalIdx = computeGlobalSpreadIndex(
      activeItem,
      currentPageIndex,
      pageRegistry,
    );
    staticRightGlobalIdx = staticLeftGlobalIdx;
  }

  const leftShadowCount = pageCountToShadowCount(staticLeftGlobalIdx);
  const rightShadowCount = pageCountToShadowCount(
    totalSpreads - 1 - staticRightGlobalIdx,
  );

  return {
    activeItem,
    tabActiveItem,
    currentPageIndex,
    canGoLeft,
    canGoRight,
    isFlipping,
    flipDirection,
    currentFlipDuration,
    isRapidFlipping,
    isHoldChaining,
    nextPageIndex,
    nextActiveItem,
    prevPageIndex,
    prevActiveItem,
    navigateToCategory,
    beginContinuousFlip,
    syncBoundaryCallbacks,
    syncCoverCallbacks,
    leftShadowCount,
    rightShadowCount,
    startFlipAnimation,
    isAnimatingRef,
  };
}

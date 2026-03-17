import { type RefObject, useEffect, useRef, useState } from 'react';

import { INDEX_LIST, PAGE_SIDE } from './constants';
import { PAGE_REGISTRY } from './pageRegistry';
import type { IndexItem, PageSide } from './types';

type FlipState = { side: PageSide } | null;

const HOLD_DELAY = 800;
const HOLD_INTERVAL = 150;
const FLIP_DURATION = 250;

export function useBookNavigation() {
  const [activeItem, setActiveItem] = useState<IndexItem>('List');
  const [pageIndices, setPageIndices] = useState<Record<IndexItem, number>>(
    () =>
      Object.fromEntries(INDEX_LIST.map((item) => [item, 0])) as Record<
        IndexItem,
        number
      >,
  );
  const [flipState, setFlipState] = useState<FlipState>(null);

  const activeIndex = INDEX_LIST.indexOf(activeItem);
  const currentPageIndex = pageIndices[activeItem];
  const totalPages = PAGE_REGISTRY[activeItem].totalPages;

  const canGoLeft = activeIndex > 0 || currentPageIndex > 0;
  const canGoRight =
    activeIndex < INDEX_LIST.length - 1 || currentPageIndex < totalPages - 1;

  const isAnimatingRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftClickRef = useRef<() => void>(() => {});
  const rightClickRef = useRef<() => void>(() => {});

  function stopHold() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }

  function triggerFlip(side: PageSide, nav: () => void) {
    if (isAnimatingRef.current) return;
    stopHold();
    isAnimatingRef.current = true;
    setFlipState({ side });
    setTimeout(() => {
      nav();
      setFlipState(null);
      isAnimatingRef.current = false;
    }, FLIP_DURATION);
  }

  function goLeft() {
    if (!canGoLeft) return;
    triggerFlip(PAGE_SIDE.LEFT, () => {
      if (currentPageIndex > 0) {
        setPageIndices((prev) => ({
          ...prev,
          [activeItem]: prev[activeItem] - 1,
        }));
      } else if (activeIndex > 0) {
        const prev = INDEX_LIST[activeIndex - 1];
        const prevTotalPages = PAGE_REGISTRY[prev].totalPages;
        setPageIndices((p) => ({ ...p, [prev]: prevTotalPages - 1 }));
        setActiveItem(prev);
      }
    });
  }

  function goRight() {
    if (!canGoRight) return;
    triggerFlip(PAGE_SIDE.RIGHT, () => {
      if (currentPageIndex < totalPages - 1) {
        setPageIndices((prev) => ({
          ...prev,
          [activeItem]: prev[activeItem] + 1,
        }));
      } else if (activeIndex < INDEX_LIST.length - 1) {
        const next = INDEX_LIST[activeIndex + 1];
        setPageIndices((p) => ({ ...p, [next]: 0 }));
        setActiveItem(next);
      }
    });
  }

  function goToItem(item: IndexItem, pageIndex = 0) {
    const newIndex = INDEX_LIST.indexOf(item);
    if (newIndex === activeIndex && pageIndex === currentPageIndex) return;
    const side = newIndex >= activeIndex ? PAGE_SIDE.RIGHT : PAGE_SIDE.LEFT;
    triggerFlip(side, () => {
      setPageIndices((prev) => ({ ...prev, [item]: pageIndex }));
      setActiveItem(item);
    });
  }

  function startHold(clickRef: RefObject<() => void>) {
    clickRef.current();
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(
        () => clickRef.current(),
        HOLD_INTERVAL,
      );
    }, HOLD_DELAY);
  }

  useEffect(() => {
    leftClickRef.current = goLeft;
    rightClickRef.current = goRight;
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') leftClickRef.current();
      else if (e.key === 'ArrowRight') rightClickRef.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const isAnimating = flipState !== null;
  const leftAnimClass =
    flipState?.side === PAGE_SIDE.LEFT ? 'page-flip-out' : undefined;
  const rightAnimClass =
    flipState?.side === PAGE_SIDE.RIGHT ? 'page-flip-out' : undefined;

  return {
    activeItem,
    currentPageIndex,
    canGoLeft,
    canGoRight,
    isAnimating,
    leftAnimClass,
    rightAnimClass,
    goToItem,
    stopHold,
    startHold,
    leftClickRef,
    rightClickRef,
  };
}

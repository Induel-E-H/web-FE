import { type RefObject, useEffect, useRef, useState } from 'react';

import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { INDEX_LIST } from './constants';
import { getPageRegistry } from './pageRegistry';
import type { IndexItem } from './types';

const HOLD_DELAY = 800;
const HOLD_INTERVAL = 150;

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
  const [flipDirection, setFlipDirection] = useState<
    'forward' | 'backward' | null
  >(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const activeIndex = INDEX_LIST.indexOf(activeItem);
  const rawPageIndex = pageIndices[activeItem];
  const totalPages = pageRegistry[activeItem].totalPages;
  const currentPageIndex = Math.min(rawPageIndex, totalPages - 1);

  const canGoLeft = activeIndex > 0 || currentPageIndex > 0;
  const canGoRight =
    activeIndex < INDEX_LIST.length - 1 || currentPageIndex < totalPages - 1;

  const isAnimatingRef = useRef(false);
  const pendingNavRef = useRef<(() => void) | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftClickRef = useRef<() => void>(() => {});
  const rightClickRef = useRef<() => void>(() => {});

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

  function onFlipComplete() {
    const nav = pendingNavRef.current;
    pendingNavRef.current = null;
    if (nav) nav();
    setFlipDirection(null);
    setIsFlipping(false);
    isAnimatingRef.current = false;
  }

  function triggerFlip(direction: 'forward' | 'backward', nav: () => void) {
    if (isAnimatingRef.current) return;
    stopHold();
    isAnimatingRef.current = true;
    pendingNavRef.current = nav;
    setFlipDirection(direction);
    setIsFlipping(true);
  }

  function goLeft() {
    if (!canGoLeft) return;
    triggerFlip('backward', () => {
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
      }
    });
  }

  function goRight() {
    if (!canGoRight) return;
    triggerFlip('forward', () => {
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
    const direction = newIndex >= activeIndex ? 'forward' : 'backward';
    triggerFlip(direction, () => {
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

  return {
    activeItem,
    currentPageIndex,
    canGoLeft,
    canGoRight,
    isFlipping,
    flipDirection,
    onFlipComplete,
    nextPageIndex,
    nextActiveItem,
    prevPageIndex,
    prevActiveItem,
    goToItem,
    stopHold,
    startHold,
    leftClickRef,
    rightClickRef,
  };
}

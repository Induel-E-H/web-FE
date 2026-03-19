import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { INDEX_LIST } from './constants';
import { getPageRegistry } from './pageRegistry';
import type { IndexItem } from './types';

const FLIP_DURATION = 800;
const RAPID_FLIP_DURATION = 300;

export function useBookNavigation(breakpoint: Breakpoint) {
  const pageRegistry = getPageRegistry(breakpoint);

  const [activeItem, setActiveItem] = useState<IndexItem>('List');
  const [tabActiveItem, setTabActiveItem] = useState<IndexItem>('List');
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
  const [isRapidFlipping, setIsRapidFlipping] = useState(false);

  const activeIndex = INDEX_LIST.indexOf(activeItem);
  const rawPageIndex = pageIndices[activeItem];
  const totalPages = pageRegistry[activeItem].totalPages;
  const currentPageIndex = Math.min(rawPageIndex, totalPages - 1);

  const canGoLeft = activeIndex > 0 || currentPageIndex > 0;
  const canGoRight =
    activeIndex < INDEX_LIST.length - 1 || currentPageIndex < totalPages - 1;

  const isAnimatingRef = useRef(false);
  const pendingNavRef = useRef<(() => void) | null>(null);
  const holdDirectionRef = useRef<'left' | 'right' | null>(null);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rapidStepsRef = useRef<{ item: IndexItem; pageIndex: number }[]>([]);
  const rapidDirectionRef = useRef<'forward' | 'backward'>('forward');

  const goLeftRef = useRef<() => void>(() => {});
  const goRightRef = useRef<() => void>(() => {});
  const stopHoldRef = useRef<() => void>(() => {});

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

  function completeFlip() {
    if (!isAnimatingRef.current) return;

    const nav = pendingNavRef.current;
    pendingNavRef.current = null;

    // flushSync로 리셋 렌더를 동기적으로 커밋
    // React auto-batching이 isFlipping false→true를 병합하는 것을 방지
    flushSync(() => {
      if (nav) nav();
      setFlipDirection(null);
      setIsFlipping(false);
    });

    isAnimatingRef.current = false;

    // Rapid flip 체이닝이 우선
    if (rapidStepsRef.current.length > 0) {
      const step = rapidStepsRef.current.shift()!;
      const isLast = rapidStepsRef.current.length === 0;

      chainTimerRef.current = setTimeout(() => {
        triggerFlip(
          rapidDirectionRef.current,
          () => {
            setPageIndices((prev) => ({
              ...prev,
              [step.item]: step.pageIndex,
            }));
            setActiveItem(step.item);
            if (isLast) setIsRapidFlipping(false);
          },
          RAPID_FLIP_DURATION,
        );
      }, 0);
      return;
    }

    // Hold 중이면 다음 플립 체이닝
    if (holdDirectionRef.current) {
      chainTimerRef.current = setTimeout(() => {
        if (holdDirectionRef.current === 'left') goLeftRef.current();
        else if (holdDirectionRef.current === 'right') goRightRef.current();
      }, 0);
    }
  }

  function triggerFlip(
    direction: 'forward' | 'backward',
    nav: () => void,
    duration = FLIP_DURATION,
  ) {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    pendingNavRef.current = nav;
    setFlipDirection(direction);
    setIsFlipping(true);

    // CSS transition과 동일한 duration 후 완료
    flipTimerRef.current = setTimeout(completeFlip, duration);
  }

  function goLeft() {
    if (!canGoLeft) {
      holdDirectionRef.current = null;
      return;
    }
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
        setTabActiveItem(prev);
      }
    });
  }

  function goRight() {
    if (!canGoRight) {
      holdDirectionRef.current = null;
      return;
    }
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
        setTabActiveItem(next);
      }
    });
  }

  function goToItem(item: IndexItem, pageIndex = 0, rapid = false) {
    const newIndex = INDEX_LIST.indexOf(item);
    if (newIndex === activeIndex && pageIndex === currentPageIndex) return;
    if (isAnimatingRef.current) return;

    let direction: 'forward' | 'backward';
    if (newIndex !== activeIndex) {
      direction = newIndex > activeIndex ? 'forward' : 'backward';
    } else {
      direction = pageIndex > currentPageIndex ? 'forward' : 'backward';
    }

    if (!rapid) {
      triggerFlip(direction, () => {
        setPageIndices((prev) => ({ ...prev, [item]: pageIndex }));
        setActiveItem(item);
        setTabActiveItem(item);
      });
      return;
    }

    // Rapid multi-flip: 카테고리 횡단 스텝 구축
    const crossSteps: { item: IndexItem; pageIndex: number }[] = [];
    if (newIndex === activeIndex) {
      // 같은 카테고리, 다른 페이지
      crossSteps.push({ item, pageIndex });
    } else if (direction === 'forward') {
      for (let i = activeIndex + 1; i <= newIndex; i++) {
        crossSteps.push({
          item: INDEX_LIST[i],
          pageIndex: i === newIndex ? pageIndex : 0,
        });
      }
    } else {
      for (let i = activeIndex - 1; i >= newIndex; i--) {
        crossSteps.push({
          item: INDEX_LIST[i],
          pageIndex: i === newIndex ? pageIndex : 0,
        });
      }
    }

    // 최소 3회 플립을 위해 패딩 추가
    const MIN_RAPID_FLIPS = 3;
    const paddingNeeded = Math.max(MIN_RAPID_FLIPS - crossSteps.length, 0);

    // 1단계: 현재 카테고리 내 페이지로 앞/뒤 패딩
    const prePadding: { item: IndexItem; pageIndex: number }[] = [];
    for (let p = 1; p <= paddingNeeded; p++) {
      if (direction === 'forward') {
        const padPage = currentPageIndex + p;
        if (padPage >= totalPages) break;
        prePadding.push({ item: activeItem, pageIndex: padPage });
      } else {
        const padPage = currentPageIndex - p;
        if (padPage < 0) break;
        prePadding.push({ item: activeItem, pageIndex: padPage });
      }
    }

    // 2단계: 부족하면 타겟 카테고리 내 페이지로 추가 패딩
    const targetTotalPages = pageRegistry[item].totalPages;
    const stillNeeded = paddingNeeded - prePadding.length;
    const postPadding: { item: IndexItem; pageIndex: number }[] = [];
    for (let p = 1; p <= stillNeeded; p++) {
      if (direction === 'forward') {
        // forward: 타겟 뒤쪽 페이지에서 접근 (높은 페이지 → 타겟)
        const padPage = pageIndex + (stillNeeded - p + 1);
        if (padPage >= targetTotalPages || padPage <= pageIndex) continue;
        postPadding.push({ item, pageIndex: padPage });
      } else {
        // backward: 타겟 앞쪽 페이지에서 접근 (낮은 페이지 → 타겟)
        const padPage = pageIndex + p;
        if (padPage >= targetTotalPages) break;
        postPadding.push({ item, pageIndex: padPage });
      }
    }
    // backward 타겟 패딩은 높→낮 순서로 정렬
    if (direction === 'backward') postPadding.reverse();

    // cross의 마지막(타겟)을 분리하고 postPadding을 그 앞에 삽입
    const allSteps = [...prePadding, ...crossSteps];
    if (postPadding.length > 0) {
      const targetStep = allSteps.pop()!;
      allSteps.push(...postPadding, targetStep);
    }

    // 양쪽 패딩 모두 부족 시 시각적 플립(제자리)으로 보충
    while (allSteps.length < MIN_RAPID_FLIPS) {
      allSteps.unshift({ item: activeItem, pageIndex: currentPageIndex });
    }

    const firstStep = allSteps.shift()!;
    rapidStepsRef.current = allSteps;
    rapidDirectionRef.current = direction;
    setIsRapidFlipping(true);
    setTabActiveItem(item);

    const isLast = allSteps.length === 0;
    triggerFlip(
      direction,
      () => {
        setPageIndices((prev) => ({
          ...prev,
          [firstStep.item]: firstStep.pageIndex,
        }));
        setActiveItem(firstStep.item);
        if (isLast) setIsRapidFlipping(false);
      },
      RAPID_FLIP_DURATION,
    );
  }

  function startHold(direction: 'left' | 'right') {
    holdDirectionRef.current = direction;
    if (direction === 'left') goLeftRef.current();
    else goRightRef.current();
  }

  function stopHold() {
    holdDirectionRef.current = null;
    if (chainTimerRef.current) {
      clearTimeout(chainTimerRef.current);
      chainTimerRef.current = null;
    }
  }

  // 매 렌더 후 최신 함수 반영
  useEffect(() => {
    goLeftRef.current = goLeft;
    goRightRef.current = goRight;
    stopHoldRef.current = stopHold;
  });

  // 마우스: window-level mouseup
  useEffect(() => {
    function handleMouseUp() {
      stopHoldRef.current();
    }
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // 키보드
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') {
        holdDirectionRef.current = 'left';
        goLeftRef.current();
      } else if (e.key === 'ArrowRight') {
        holdDirectionRef.current = 'right';
        goRightRef.current();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && holdDirectionRef.current === 'left')
        stopHoldRef.current();
      else if (e.key === 'ArrowRight' && holdDirectionRef.current === 'right')
        stopHoldRef.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 클린업
  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      if (chainTimerRef.current) clearTimeout(chainTimerRef.current);
    };
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
    nextPageIndex,
    nextActiveItem,
    prevPageIndex,
    prevActiveItem,
    goToItem,
    startHold,
  };
}

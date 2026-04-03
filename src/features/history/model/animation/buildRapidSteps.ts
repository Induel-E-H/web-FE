import { INDEX_LIST, MIN_RAPID_FLIPS } from '../constants';
import type { FlipDirection, IndexItem, NavigationStep } from '../types';

export function buildRapidSteps(params: {
  activeItem: IndexItem;
  activeIndex: number;
  currentPageIndex: number;
  totalPages: number;
  targetItem: IndexItem;
  targetPageIndex: number;
  targetTotalPages: number;
  direction: FlipDirection;
}): NavigationStep[] {
  const {
    activeItem,
    activeIndex,
    currentPageIndex,
    totalPages,
    targetItem,
    targetPageIndex,
    targetTotalPages,
    direction,
  } = params;

  const targetIndex = INDEX_LIST.indexOf(targetItem);

  // 카테고리 횡단 스텝
  const crossSteps: NavigationStep[] = [];
  if (targetIndex === activeIndex) {
    crossSteps.push({ item: targetItem, pageIndex: targetPageIndex });
  } else if (direction === 'forward') {
    for (let i = activeIndex + 1; i <= targetIndex; i++) {
      crossSteps.push({
        item: INDEX_LIST[i],
        pageIndex: i === targetIndex ? targetPageIndex : 0,
      });
    }
  } else {
    for (let i = activeIndex - 1; i >= targetIndex; i--) {
      crossSteps.push({
        item: INDEX_LIST[i],
        pageIndex: i === targetIndex ? targetPageIndex : 0,
      });
    }
  }

  // 1단계: 현재 카테고리 내 페이지 패딩
  const paddingNeeded = Math.max(MIN_RAPID_FLIPS - crossSteps.length, 0);
  const prePadding: NavigationStep[] = [];
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

  // 2단계: 타겟 카테고리 내 페이지 패딩
  const stillNeeded = paddingNeeded - prePadding.length;
  const postPadding: NavigationStep[] = [];
  for (let p = 1; p <= stillNeeded; p++) {
    if (direction === 'forward') {
      const padPage = targetPageIndex + (stillNeeded - p + 1);
      if (padPage >= targetTotalPages || padPage <= targetPageIndex) continue;
      postPadding.push({ item: targetItem, pageIndex: padPage });
    } else {
      const padPage = targetPageIndex + p;
      if (padPage >= targetTotalPages) break;
      postPadding.push({ item: targetItem, pageIndex: padPage });
    }
  }
  if (direction === 'backward') postPadding.reverse();

  // 조합
  const allSteps = [...prePadding, ...crossSteps];
  if (postPadding.length > 0) {
    const targetStep = allSteps.pop()!;
    allSteps.push(...postPadding, targetStep);
  }

  // 제자리 플립으로 최소 횟수 보충
  while (allSteps.length < MIN_RAPID_FLIPS) {
    allSteps.unshift({ item: activeItem, pageIndex: currentPageIndex });
  }

  return allSteps;
}

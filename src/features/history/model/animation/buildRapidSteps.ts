import {
  INDEX_LIST,
  MAX_SOURCE_PAGE_FLIPS,
  PASS_THROUGH_FLIP_DURATION,
  RAPID_FLIP_DURATION,
} from '../constants';
import type { FlipDirection, IndexItem, NavigationStep } from '../types';

export function buildRapidSteps(params: {
  activeIndex: number;
  currentPageIndex: number;
  targetItem: IndexItem;
  targetPageIndex: number;
  direction: FlipDirection;
  getLastPageIndex: (item: IndexItem) => number;
}): NavigationStep[] {
  const {
    activeIndex,
    currentPageIndex,
    targetItem,
    targetPageIndex,
    direction,
    getLastPageIndex,
  } = params;

  const targetIndex = INDEX_LIST.indexOf(targetItem);

  if (targetIndex === activeIndex) {
    return [
      {
        item: targetItem,
        pageIndex: targetPageIndex,
        duration: RAPID_FLIP_DURATION,
      },
    ];
  }

  const steps: NavigationStep[] = [];
  const sourceItem = INDEX_LIST[activeIndex];

  if (direction === 'forward') {
    const sourceLast = getLastPageIndex(sourceItem);
    const fwdEnd = Math.min(
      currentPageIndex + MAX_SOURCE_PAGE_FLIPS,
      sourceLast,
    );
    for (let p = currentPageIndex + 1; p <= fwdEnd; p++) {
      steps.push({
        item: sourceItem,
        pageIndex: p,
        duration: PASS_THROUGH_FLIP_DURATION,
      });
    }
    for (let i = activeIndex + 1; i < targetIndex; i++) {
      steps.push({
        item: INDEX_LIST[i],
        pageIndex: getLastPageIndex(INDEX_LIST[i]),
        duration: PASS_THROUGH_FLIP_DURATION,
      });
    }
    const numApproach = Math.min(MAX_SOURCE_PAGE_FLIPS - 1, targetPageIndex);
    for (let p = targetPageIndex - numApproach; p < targetPageIndex; p++) {
      steps.push({
        item: targetItem,
        pageIndex: p,
        duration: PASS_THROUGH_FLIP_DURATION,
      });
    }
    steps.push({
      item: targetItem,
      pageIndex: targetPageIndex,
      duration: RAPID_FLIP_DURATION,
    });
  } else {
    const bwdEnd = Math.max(currentPageIndex - MAX_SOURCE_PAGE_FLIPS, 0);
    for (let p = currentPageIndex - 1; p >= bwdEnd; p--) {
      steps.push({
        item: sourceItem,
        pageIndex: p,
        duration: PASS_THROUGH_FLIP_DURATION,
      });
    }
    for (let i = activeIndex - 1; i > targetIndex; i--) {
      steps.push({
        item: INDEX_LIST[i],
        pageIndex: 0,
        duration: PASS_THROUGH_FLIP_DURATION,
      });
    }
    const destLast = getLastPageIndex(targetItem);
    const numApproach = Math.min(
      MAX_SOURCE_PAGE_FLIPS - 1,
      destLast - targetPageIndex,
    );
    for (let p = targetPageIndex + numApproach; p > targetPageIndex; p--) {
      steps.push({
        item: targetItem,
        pageIndex: p,
        duration: PASS_THROUGH_FLIP_DURATION,
      });
    }
    steps.push({
      item: targetItem,
      pageIndex: targetPageIndex,
      duration: RAPID_FLIP_DURATION,
    });
  }

  return steps;
}

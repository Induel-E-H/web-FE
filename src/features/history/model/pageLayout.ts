import type { Breakpoint } from '@shared/lib/breakpoint';

import { INDEX_LIST, PAGE_SIDE } from './constants';
import { getPageRegistry } from './pageRegistry';
import type { IndexItem, PageSide } from './types';

export type PageLeaf = {
  kind: 'page';
  item: IndexItem;
  pageIndex: number;
  side: PageSide;
};

export type Leaf =
  | { kind: 'cover-front' } // 앞표지
  | { kind: 'inside-front' } // 앞표지 안쪽 (하드)
  | { kind: 'title' } // 속지 (제목)
  | { kind: 'colophon' } // 뒤 속지 (판권면)
  | { kind: 'blank' } // 반쪽 보기에서 화면 밖에 가려지는 오른쪽 장
  | { kind: 'inside-back' } // 뒤표지 안쪽 (하드)
  | { kind: 'cover-back' } // 뒤표지
  | PageLeaf;

function buildReadingOrder(breakpoint: Breakpoint): Leaf[] {
  const registry = getPageRegistry(breakpoint);
  const pages: Leaf[] = [];
  for (const item of INDEX_LIST) {
    for (
      let pageIndex = 0;
      pageIndex < registry[item].totalPages;
      pageIndex++
    ) {
      pages.push(
        { kind: 'page', item, pageIndex, side: PAGE_SIDE.LEFT },
        { kind: 'page', item, pageIndex, side: PAGE_SIDE.RIGHT },
      );
    }
  }
  return [
    { kind: 'inside-front' },
    { kind: 'title' },
    ...pages,
    { kind: 'colophon' },
    { kind: 'inside-back' },
  ];
}

/**
 * 엔진에 넘길 장 목록. 항상 짝수 장이라 앞표지는 오른쪽, 뒤표지는 왼쪽에 단독으로 놓인다.
 * - desktop: [표지] [표지안쪽|속지] [List 좌|우] ... [판권면|뒤표지안쪽] [뒤표지]
 * - tablet/mobile(반쪽 보기): 펼침면의 왼쪽만 보이므로 읽는 순서의 각 장을 왼쪽에 두고
 *   오른쪽(화면 밖)에는 빈 장을 끼워, 다음 장이 오른쪽에서 넘어오게 한다.
 */
export function buildLeaves(breakpoint: Breakpoint): Leaf[] {
  const order = buildReadingOrder(breakpoint);
  const body =
    breakpoint === 'desktop'
      ? order
      : order.flatMap((leaf): Leaf[] => [leaf, { kind: 'blank' }]);
  return [{ kind: 'cover-front' }, ...body, { kind: 'cover-back' }];
}

export function findLeafIndex(
  leaves: readonly Leaf[],
  item: IndexItem,
  pageIndex = 0,
): number {
  return leaves.findIndex(
    (leaf) =>
      leaf.kind === 'page' &&
      leaf.item === item &&
      leaf.pageIndex === pageIndex,
  );
}

export function getLeafItem(leaves: readonly Leaf[], index: number): IndexItem {
  const leaf = leaves[index];
  if (leaf?.kind === 'page') return leaf.item;
  const firstPage = leaves.findIndex((l) => l.kind === 'page');
  return index < firstPage ? INDEX_LIST[0] : INDEX_LIST[INDEX_LIST.length - 1];
}

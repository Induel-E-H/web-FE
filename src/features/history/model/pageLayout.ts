import { artworks } from '@entities/history';
import type { Breakpoint } from '@shared/lib/breakpoint';

import { CHAIN_EDGE_FLIPS, INDEX_LIST, PAGE_SIDE } from './constants';
import { getArtworkIndex } from './helpers';
import {
  getPageRegistry,
  MILESTONES_YEAR_RANGES_BY_BREAKPOINT,
} from './pageRegistry';
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

/**
 * 좌/우 두 쪽으로 나눠 담다 보니 항목 수가 홀수면 마지막 오른쪽 쪽이 빈다
 * (Content 의 작품, Milestones 의 연도 구간).
 */
export function hasPageContent(leaf: PageLeaf, breakpoint: Breakpoint) {
  const index = getArtworkIndex(leaf.pageIndex, leaf.side);
  if (leaf.item === 'Content') return index < artworks.length;
  if (leaf.item === 'Milestones') {
    return index < MILESTONES_YEAR_RANGES_BY_BREAKPOINT[breakpoint].length;
  }
  return true;
}

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
 *   [표지] [표지안쪽|빈] [속지|빈] ... [판권면|빈] [뒤표지]
 */
export function buildLeaves(breakpoint: Breakpoint): Leaf[] {
  const order = buildReadingOrder(breakpoint);
  // 반쪽 보기는 한 쪽씩 넘기므로
  // - 내용이 없는 쪽은 빈 장이 통째로 보이지 않게 뺀다.
  // - 뒤표지 안쪽은 따로 한 쪽이 되어 뒤표지가 두 장처럼 보이므로 뺀다.
  //   (판권면 다음에 뒤표지가 오른쪽에서 넘어와 덮으며 닫힌다)
  const body =
    breakpoint === 'desktop'
      ? order
      : order
          .filter((leaf) =>
            leaf.kind === 'page'
              ? hasPageContent(leaf, breakpoint)
              : leaf.kind !== 'inside-back',
          )
          .flatMap((leaf): Leaf[] => [leaf, { kind: 'blank' }]);
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

const MIN_STACK = 0.2;

/**
 * 펼친 위치(head: 펼침면의 첫 장)에서 왼쪽·오른쪽에 쌓인 종이 두께를 0~1 로 계산한다.
 * 엔진에서 한 장의 종이는 (2k, 2k+1) 두 면이고, 첫 장(표지)과 마지막 장(뒤표지)은 커버다.
 * 지금 펼쳐져 보이는 맨 위 장은 두께에 넣지 않는다 (그 아래에 깔린 장만 두께가 된다).
 * 한 장이라도 깔려 있으면 최소 MIN_STACK 만큼은 보이게 한다.
 */
export function getPaperStack(
  leaves: readonly Leaf[],
  head: number,
): { left: number; right: number } {
  const lastLeaf = leaves.length - 1;
  const sheets = Math.max(0, (lastLeaf - 3) / 2);
  let leftSheets = 0;
  for (let k = 1; k <= sheets; k++) {
    if (2 * k + 1 <= head) leftSheets += 1;
  }
  const rightSheets = sheets - leftSheets;
  const toStack = (visible: number) => {
    const under = visible - 1;
    if (under <= 0 || sheets <= 1) return 0;
    return MIN_STACK + (1 - MIN_STACK) * (under / (sheets - 1));
  };
  return { left: toStack(leftSheets), right: toStack(rightSheets) };
}

/**
 * 한 장 넘긴 뒤의 펼침면 시작 장. 하드커버라 펼침면 시작 장은 0, 1, 3, 5, ..., lastLeaf 이다.
 */
export function getAdjacentHead(
  head: number,
  direction: 'next' | 'prev',
  lastLeaf: number,
): number {
  if (direction === 'next')
    return head === 0 ? 1 : Math.min(head + 2, lastLeaf);
  return head <= 1 ? 0 : head === lastLeaf ? lastLeaf - 2 : head - 2;
}

/**
 * 이번 넘김이 표지로 책을 닫는 넘김이면 닫히는 쪽을 돌려준다.
 * (앞표지로 닫히면 왼쪽, 뒤표지로 닫히면 오른쪽 커버가 넘어간다)
 */
export function getClosingSide(
  head: number,
  direction: 'next' | 'prev',
  lastLeaf: number,
): 'front' | 'back' | null {
  const target = getAdjacentHead(head, direction, lastLeaf);
  if (target === 0 && head !== 0) return 'front';
  if (target === lastLeaf && head !== lastLeaf) return 'back';
  return null;
}

const LEAF_LABEL: Record<Exclude<Leaf['kind'], 'page'>, string> = {
  'cover-front': '앞표지',
  'inside-front': '앞표지 안쪽',
  title: '속지',
  colophon: '판권면',
  blank: '',
  'inside-back': '뒤표지 안쪽',
  'cover-back': '뒤표지',
};

/** 스크린 리더 안내용 장 이름. 반쪽 보기의 빈 장은 빈 문자열이다. */
export function describeLeaf(leaf: Leaf | undefined): string {
  if (!leaf) return '';
  if (leaf.kind === 'page') return `${leaf.item} ${leaf.pageIndex + 1}페이지`;
  return LEAF_LABEL[leaf.kind];
}

export function getLeafKey(leaf: Leaf, index: number): string {
  return leaf.kind === 'page'
    ? `${leaf.item}-${leaf.pageIndex}-${leaf.side}`
    : `${leaf.kind}-${index}`;
}

/** 펼침면 앞뒤로 내용을 미리 그려 두는 장 수 (두 펼침면씩) */
const RENDER_REACH = 4;
/** 여러 장 이동의 목적지 앞뒤로 그려 두는 장 수. 가운데를 건너뛴 뒤 넘기는 펼침면까지 덮는다. */
const TARGET_REACH = (CHAIN_EDGE_FLIPS + 1) * 2;

/**
 * 장의 내용을 그릴지 정한다. 멀리 있는 장은 빈 종이로 두어 이미지를 한꺼번에 받지 않는다.
 * 여러 장 이동(target)은 가운데를 건너뛰어 목적지 근처에 바로 도착하므로, 출발할 때부터 그쪽도 그려 둔다.
 */
export function shouldRenderLeaf(
  index: number,
  head: number,
  target: number | null,
): boolean {
  if (index >= head - RENDER_REACH && index <= head + 1 + RENDER_REACH)
    return true;
  return target !== null && Math.abs(index - target) <= TARGET_REACH;
}

/** 표지 안쪽 장은 표지와 함께 딱딱하게 넘어간다 (앞·뒤표지는 엔진의 hardCovers 가 처리) */
export function isHardLeaf(leaf: Leaf): boolean {
  return leaf.kind === 'inside-front' || leaf.kind === 'inside-back';
}

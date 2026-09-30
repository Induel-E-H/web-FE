import { describe, expect, it } from 'vitest';

import { INDEX_LIST } from './constants';
import { buildLeaves, findLeafIndex, getLeafItem } from './pageLayout';
import { getPageRegistry } from './pageRegistry';

function contentPageCount(breakpoint: 'desktop' | 'tablet' | 'mobile') {
  const registry = getPageRegistry(breakpoint);
  return INDEX_LIST.reduce(
    (sum, item) => sum + registry[item].totalPages * 2,
    0,
  );
}

describe('buildLeaves', () => {
  it.each(['desktop', 'tablet', 'mobile'] as const)(
    '%s: 앞표지로 시작해 뒤표지로 끝나고 전체 장 수가 짝수이다',
    (breakpoint) => {
      const leaves = buildLeaves(breakpoint);
      expect(leaves[0]).toEqual({ kind: 'cover-front' });
      expect(leaves[leaves.length - 1]).toEqual({ kind: 'cover-back' });
      expect(leaves.length % 2).toBe(0);
    },
  );

  describe('desktop (펼침면)', () => {
    const leaves = buildLeaves('desktop');

    it('표지를 열면 [표지 안쪽 | 속지], 그다음 [List 좌 | List 우] 가 나온다', () => {
      expect(leaves.slice(1, 5)).toEqual([
        { kind: 'inside-front' },
        { kind: 'title' },
        { kind: 'page', item: 'List', pageIndex: 0, side: 'left' },
        { kind: 'page', item: 'List', pageIndex: 0, side: 'right' },
      ]);
    });

    it('뒤표지 직전은 [판권면 | 뒤표지 안쪽] 이다', () => {
      expect(leaves.slice(-3, -1)).toEqual([
        { kind: 'colophon' },
        { kind: 'inside-back' },
      ]);
    });

    it('페이지 수 = 콘텐츠 + 표지 2 + 표지 안쪽 2 + 속지 2', () => {
      expect(leaves).toHaveLength(contentPageCount('desktop') + 6);
    });

    it('콘텐츠의 왼쪽 장은 항상 펼침면 왼쪽(홀수 인덱스)에 놓인다', () => {
      leaves.forEach((leaf, i) => {
        if (leaf.kind === 'page' && leaf.side === 'left') {
          expect(i % 2).toBe(1);
        }
      });
    });
  });

  describe('mobile (반쪽 보기)', () => {
    const leaves = buildLeaves('mobile');

    it('읽는 순서의 모든 장이 펼침면 왼쪽(홀수 인덱스)에 놓인다', () => {
      leaves.forEach((leaf, i) => {
        if (['page', 'title', 'colophon'].includes(leaf.kind)) {
          expect(i % 2).toBe(1);
        }
      });
    });

    it('화면 밖 오른쪽에는 빈 장이 끼워진다', () => {
      for (let i = 2; i < leaves.length - 1; i += 2) {
        expect(leaves[i]).toEqual({ kind: 'blank' });
      }
    });

    it('List 좌/우가 각각 한 장씩 보인다', () => {
      const list = leaves.filter(
        (leaf) => leaf.kind === 'page' && leaf.item === 'List',
      );
      expect(list).toHaveLength(2);
    });
  });
});

describe('findLeafIndex', () => {
  const leaves = buildLeaves('desktop');

  it('카테고리 첫 페이지의 왼쪽 장 인덱스를 반환한다', () => {
    expect(findLeafIndex(leaves, 'List')).toBe(3);
    expect(findLeafIndex(leaves, 'Content')).toBe(5);
  });

  it('pageIndex 를 반영한다', () => {
    expect(findLeafIndex(leaves, 'Content', 2)).toBe(9);
  });

  it('없는 페이지는 -1 을 반환한다', () => {
    expect(findLeafIndex(leaves, 'List', 5)).toBe(-1);
  });

  it('반쪽 보기에서도 해당 장을 찾는다', () => {
    const mobile = buildLeaves('mobile');
    const index = findLeafIndex(mobile, 'Timeline');
    expect(mobile[index]).toMatchObject({ item: 'Timeline', side: 'left' });
  });
});

describe('getLeafItem', () => {
  const leaves = buildLeaves('desktop');

  it('페이지 장은 해당 카테고리를 반환한다', () => {
    expect(getLeafItem(leaves, findLeafIndex(leaves, 'Timeline'))).toBe(
      'Timeline',
    );
  });

  it('콘텐츠 앞쪽 장(표지, 속지)은 첫 카테고리를 반환한다', () => {
    expect(getLeafItem(leaves, 0)).toBe('List');
    expect(getLeafItem(leaves, 1)).toBe('List');
  });

  it('콘텐츠 뒤쪽 장은 마지막 카테고리를 반환한다', () => {
    expect(getLeafItem(leaves, leaves.length - 2)).toBe('Milestones');
    expect(getLeafItem(leaves, leaves.length - 1)).toBe('Milestones');
  });
});

import { artworks } from '@entities/history';
import { describe, expect, it } from 'vitest';

import { INDEX_LIST } from './constants';
import {
  buildLeaves,
  findLeafIndex,
  getAdjacentHead,
  getLeafItem,
  getPaperStack,
  hasPageContent,
} from './pageLayout';
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

    it('내용이 없는 쪽(홀수 개의 마지막 오른쪽)은 넘김 순서에서 뺀다', () => {
      leaves.forEach((leaf) => {
        if (leaf.kind === 'page') {
          expect(hasPageContent(leaf, 'mobile')).toBe(true);
        }
      });
      const content = leaves.filter(
        (leaf) => leaf.kind === 'page' && leaf.item === 'Content',
      );
      expect(content).toHaveLength(artworks.length);
    });

    it('판권면 다음이 바로 뒤표지이다 (뒤표지 안쪽이 따로 한 쪽이 되지 않는다)', () => {
      expect(leaves.some((leaf) => leaf.kind === 'inside-back')).toBe(false);
      expect(leaves.slice(-3)).toEqual([
        { kind: 'colophon' },
        { kind: 'blank' },
        { kind: 'cover-back' },
      ]);
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

describe('getPaperStack', () => {
  const leaves = buildLeaves('desktop');
  const last = leaves.length - 1;

  it('앞표지로 닫혀 있거나 막 연 펼침면은 왼쪽에 두께가 없고 오른쪽이 가득이다', () => {
    expect(getPaperStack(leaves, 0)).toEqual({ left: 0, right: 1 });
    expect(getPaperStack(leaves, 1)).toEqual({ left: 0, right: 1 });
  });

  it('List 첫 펼침면은 왼쪽이 속지와 한 장이라 왼쪽 두께가 없다', () => {
    const list = findLeafIndex(leaves, 'List');
    expect(getPaperStack(leaves, list).left).toBe(0);
  });

  it('마지막 내부 펼침면은 오른쪽이 판권면 한 장이라 오른쪽 두께가 없다', () => {
    expect(getPaperStack(leaves, last - 2).right).toBe(0);
  });

  it('뒤표지로 닫혀 있으면 왼쪽이 가득이고 오른쪽 두께가 없다', () => {
    expect(getPaperStack(leaves, last)).toEqual({ left: 1, right: 0 });
  });

  it('넘길수록 왼쪽은 두꺼워지고 오른쪽은 얇아진다', () => {
    const early = getPaperStack(leaves, findLeafIndex(leaves, 'Content'));
    const late = getPaperStack(leaves, findLeafIndex(leaves, 'Milestones'));
    expect(late.left).toBeGreaterThan(early.left);
    expect(late.right).toBeLessThan(early.right);
  });

  it('깔린 장이 한 장이라도 있으면 최소 두께 이상이다', () => {
    const { left, right } = getPaperStack(
      leaves,
      findLeafIndex(leaves, 'Content'),
    );
    expect(left).toBeGreaterThanOrEqual(0.2);
    expect(right).toBeGreaterThanOrEqual(0.2);
  });
});

describe('getAdjacentHead', () => {
  const last = 21;

  it('앞으로 넘기면 표지 → 1, 이후 두 장씩, 끝은 뒤표지이다', () => {
    expect(getAdjacentHead(0, 'next', last)).toBe(1);
    expect(getAdjacentHead(1, 'next', last)).toBe(3);
    expect(getAdjacentHead(last - 2, 'next', last)).toBe(last);
    expect(getAdjacentHead(last, 'next', last)).toBe(last);
  });

  it('뒤로 넘기면 두 장씩, 1 → 표지, 뒤표지 → 마지막 내부 펼침면이다', () => {
    expect(getAdjacentHead(5, 'prev', last)).toBe(3);
    expect(getAdjacentHead(1, 'prev', last)).toBe(0);
    expect(getAdjacentHead(0, 'prev', last)).toBe(0);
    expect(getAdjacentHead(last, 'prev', last)).toBe(last - 2);
  });
});

describe('hasPageContent', () => {
  const page = (
    item: 'List' | 'Content' | 'Timeline' | 'Milestones',
    pageIndex: number,
    side: 'left' | 'right',
  ) => ({ kind: 'page' as const, item, pageIndex, side });

  it('Content 는 작품 수를 넘는 쪽이 비어 있다', () => {
    const lastIndex = artworks.length - 1;
    const lastPage = Math.floor(lastIndex / 2);
    const lastSide = lastIndex % 2 === 0 ? 'left' : 'right';
    expect(hasPageContent(page('Content', lastPage, lastSide), 'desktop')).toBe(
      true,
    );
    expect(
      hasPageContent(page('Content', lastPage + 1, 'left'), 'desktop'),
    ).toBe(false);
  });

  it('Milestones 는 브레이크포인트별 연도 구간 수를 넘는 쪽이 비어 있다', () => {
    expect(hasPageContent(page('Milestones', 3, 'left'), 'mobile')).toBe(true);
    expect(hasPageContent(page('Milestones', 3, 'right'), 'mobile')).toBe(
      false,
    );
  });

  it('List 와 Timeline 은 항상 내용이 있다', () => {
    expect(hasPageContent(page('List', 0, 'right'), 'mobile')).toBe(true);
    expect(hasPageContent(page('Timeline', 0, 'right'), 'mobile')).toBe(true);
  });
});

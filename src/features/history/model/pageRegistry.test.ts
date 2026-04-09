import { artworks } from '@entities/history';
import { describe, expect, it } from 'vitest';

import {
  getPageRegistry,
  MILESTONES_YEAR_RANGES_BY_BREAKPOINT,
} from './pageRegistry';

describe('MILESTONES_YEAR_RANGES_BY_BREAKPOINT', () => {
  it('desktop과 tablet 브레이크포인트 키가 존재한다', () => {
    expect(MILESTONES_YEAR_RANGES_BY_BREAKPOINT).toHaveProperty('desktop');
    expect(MILESTONES_YEAR_RANGES_BY_BREAKPOINT).toHaveProperty('tablet');
  });

  it('각 브레이크포인트의 범위는 [시작연도, 끝연도] 쌍의 배열이다', () => {
    (['desktop', 'tablet'] as const).forEach((bp) => {
      MILESTONES_YEAR_RANGES_BY_BREAKPOINT[bp].forEach((range) => {
        expect(range).toHaveLength(2);
        expect(range[0]).toBeLessThanOrEqual(range[1]);
        expect(typeof range[0]).toBe('number');
        expect(typeof range[1]).toBe('number');
      });
    });
  });

  it('desktop보다 tablet의 범위 개수가 더 많다(더 촘촘하게 분할)', () => {
    expect(MILESTONES_YEAR_RANGES_BY_BREAKPOINT.tablet.length).toBeGreaterThan(
      MILESTONES_YEAR_RANGES_BY_BREAKPOINT.desktop.length,
    );
  });

  it('desktop 범위들은 연속적으로 이어진다', () => {
    const ranges = MILESTONES_YEAR_RANGES_BY_BREAKPOINT.desktop;
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i][0]).toBe(ranges[i - 1][1] + 1);
    }
  });

  it('tablet 범위들은 연속적으로 이어진다', () => {
    const ranges = MILESTONES_YEAR_RANGES_BY_BREAKPOINT.tablet;
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i][0]).toBe(ranges[i - 1][1] + 1);
    }
  });
});

describe('getPageRegistry', () => {
  it('List, Content, Timeline, Milestones 네 개의 카테고리를 반환한다', () => {
    const registry = getPageRegistry('desktop');
    expect(registry).toHaveProperty('List');
    expect(registry).toHaveProperty('Content');
    expect(registry).toHaveProperty('Timeline');
    expect(registry).toHaveProperty('Milestones');
  });

  it('List와 Timeline의 totalPages는 1이다', () => {
    const registry = getPageRegistry('desktop');
    expect(registry.List.totalPages).toBe(1);
    expect(registry.Timeline.totalPages).toBe(1);
  });

  it('Content의 totalPages는 작품 수를 2로 나눈 올림값이다', () => {
    const registry = getPageRegistry('desktop');
    expect(registry.Content.totalPages).toBe(Math.ceil(artworks.length / 2));
  });

  it('desktop Milestones의 totalPages는 범위 개수를 2로 나눈 올림값이다', () => {
    const registry = getPageRegistry('desktop');
    const desktopRanges = MILESTONES_YEAR_RANGES_BY_BREAKPOINT.desktop;
    expect(registry.Milestones.totalPages).toBe(
      Math.ceil(desktopRanges.length / 2),
    );
  });

  it('tablet Milestones의 totalPages는 desktop보다 크다', () => {
    const desktopRegistry = getPageRegistry('desktop');
    const tabletRegistry = getPageRegistry('tablet');
    expect(tabletRegistry.Milestones.totalPages).toBeGreaterThan(
      desktopRegistry.Milestones.totalPages,
    );
  });

  it('동일한 브레이크포인트로 여러 번 호출하면 같은 객체를 반환한다(캐시)', () => {
    const first = getPageRegistry('desktop');
    const second = getPageRegistry('desktop');
    expect(first).toBe(second);
  });

  it('모든 totalPages는 1 이상이다', () => {
    (['desktop', 'tablet'] as const).forEach((bp) => {
      const registry = getPageRegistry(bp);
      Object.values(registry).forEach(({ totalPages }) => {
        expect(totalPages).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

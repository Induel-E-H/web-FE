import { describe, expect, it } from 'vitest';

import { PASS_THROUGH_FLIP_DURATION, RAPID_FLIP_DURATION } from '../constants';
import { buildRapidSteps } from './buildRapidSteps';

// Content has 4 pages (index 0–3), others have 1 page (index 0)
const getLastPageIndex = (item: string) => (item === 'Content' ? 3 : 0);

describe('buildRapidSteps', () => {
  describe('같은 카테고리 내 이동', () => {
    it('동일 카테고리 이동 시 스텝 1개를 반환한다', () => {
      const steps = buildRapidSteps({
        activeIndex: 1,
        currentPageIndex: 0,
        targetItem: 'Content',
        targetPageIndex: 3,
        direction: 'forward',
        getLastPageIndex,
      });
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual(
        expect.objectContaining({ item: 'Content', pageIndex: 3 }),
      );
    });
  });

  describe('출발 카테고리 잔여 페이지', () => {
    it('forward: 잔여 페이지가 스텝에 포함된다 (최대 3장)', () => {
      // Content page 0 → Timeline: source pages 1, 2, 3 + Timeline p0
      const steps = buildRapidSteps({
        activeIndex: 1,
        currentPageIndex: 0,
        targetItem: 'Timeline',
        targetPageIndex: 0,
        direction: 'forward',
        getLastPageIndex,
      });
      expect(steps[0]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 1,
          duration: PASS_THROUGH_FLIP_DURATION,
        }),
      );
      expect(steps[1]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 2,
          duration: PASS_THROUGH_FLIP_DURATION,
        }),
      );
      expect(steps[2]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 3,
          duration: PASS_THROUGH_FLIP_DURATION,
        }),
      );
      expect(steps[steps.length - 1]).toEqual(
        expect.objectContaining({
          item: 'Timeline',
          pageIndex: 0,
          duration: RAPID_FLIP_DURATION,
        }),
      );
    });

    it('backward: 잔여 페이지가 스텝에 포함된다', () => {
      // Milestones page 1 (index 3) → Timeline: source Milestones p0, then Timeline p0 terminal
      const steps = buildRapidSteps({
        activeIndex: 3,
        currentPageIndex: 1,
        targetItem: 'Timeline',
        targetPageIndex: 0,
        direction: 'backward',
        getLastPageIndex,
      });
      expect(steps[0]).toEqual(
        expect.objectContaining({
          item: 'Milestones',
          pageIndex: 0,
          duration: PASS_THROUGH_FLIP_DURATION,
        }),
      );
      expect(steps[steps.length - 1]).toEqual(
        expect.objectContaining({
          item: 'Timeline',
          pageIndex: 0,
          duration: RAPID_FLIP_DURATION,
        }),
      );
    });
  });

  describe('목적지 approach 페이지', () => {
    it('backward로 Content page 0에 도착할 때 approach 페이지가 생성된다', () => {
      // Timeline → Content: source 없음, Content p2, p1 approach + p0 terminal
      const steps = buildRapidSteps({
        activeIndex: 2,
        currentPageIndex: 0,
        targetItem: 'Content',
        targetPageIndex: 0,
        direction: 'backward',
        getLastPageIndex,
      });
      expect(steps[0]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 2,
          duration: PASS_THROUGH_FLIP_DURATION,
        }),
      );
      expect(steps[1]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 1,
          duration: PASS_THROUGH_FLIP_DURATION,
        }),
      );
      expect(steps[2]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 0,
          duration: RAPID_FLIP_DURATION,
        }),
      );
      expect(steps).toHaveLength(3);
    });

    it('forward로 targetPageIndex=0에 도착할 때 approach 페이지가 없다', () => {
      // List → Content page 0: 출발 source 없음, approach 없음, 스텝 1개
      const steps = buildRapidSteps({
        activeIndex: 0,
        currentPageIndex: 0,
        targetItem: 'Content',
        targetPageIndex: 0,
        direction: 'forward',
        getLastPageIndex,
      });
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual(
        expect.objectContaining({
          item: 'Content',
          pageIndex: 0,
          duration: RAPID_FLIP_DURATION,
        }),
      );
    });
  });

  describe('forward 방향 카테고리 횡단', () => {
    it('List → Milestones: Content, Timeline 통과 후 Milestones terminal', () => {
      const steps = buildRapidSteps({
        activeIndex: 0,
        currentPageIndex: 0,
        targetItem: 'Milestones',
        targetPageIndex: 0,
        direction: 'forward',
        getLastPageIndex,
      });
      // List source 없음, Content 통과 (last=3), Timeline 통과 (last=0), Milestones terminal
      expect(steps.some((s) => s.item === 'Content')).toBe(true);
      expect(steps.some((s) => s.item === 'Timeline')).toBe(true);
      expect(steps[steps.length - 1]).toEqual(
        expect.objectContaining({
          item: 'Milestones',
          pageIndex: 0,
          duration: RAPID_FLIP_DURATION,
        }),
      );
    });
  });

  describe('backward 방향 카테고리 횡단', () => {
    it('Milestones → List: Timeline, Content 통과 후 List terminal', () => {
      const steps = buildRapidSteps({
        activeIndex: 3,
        currentPageIndex: 0,
        targetItem: 'List',
        targetPageIndex: 0,
        direction: 'backward',
        getLastPageIndex,
      });
      expect(steps.some((s) => s.item === 'Timeline')).toBe(true);
      expect(steps.some((s) => s.item === 'Content')).toBe(true);
      expect(steps[steps.length - 1]).toEqual(
        expect.objectContaining({
          item: 'List',
          pageIndex: 0,
          duration: RAPID_FLIP_DURATION,
        }),
      );
    });

    it('마지막 스텝은 항상 targetItem + targetPageIndex이다', () => {
      const steps = buildRapidSteps({
        activeIndex: 1,
        currentPageIndex: 0,
        targetItem: 'List',
        targetPageIndex: 0,
        direction: 'backward',
        getLastPageIndex,
      });
      const last = steps[steps.length - 1];
      expect(last.item).toBe('List');
      expect(last.pageIndex).toBe(0);
    });
  });
});

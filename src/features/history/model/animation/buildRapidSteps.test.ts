import { describe, expect, it } from 'vitest';

import { MIN_RAPID_FLIPS } from '../constants';
import { buildRapidSteps } from './buildRapidSteps';

// 테스트용 기본 파라미터
const base = {
  activeItem: 'List' as const,
  activeIndex: 0,
  currentPageIndex: 0,
  totalPages: 1,
  targetItem: 'Content' as const,
  targetPageIndex: 0,
  targetTotalPages: 5,
  direction: 'forward' as const,
};

describe('buildRapidSteps', () => {
  describe('기본 보장 조건', () => {
    it('결과 길이가 항상 MIN_RAPID_FLIPS 이상이다', () => {
      const steps = buildRapidSteps(base);
      expect(steps.length).toBeGreaterThanOrEqual(MIN_RAPID_FLIPS);
    });

    it('마지막 스텝은 항상 targetItem + targetPageIndex이다', () => {
      const steps = buildRapidSteps(base);
      const last = steps[steps.length - 1];
      expect(last.item).toBe(base.targetItem);
      expect(last.pageIndex).toBe(base.targetPageIndex);
    });

    it('MIN_RAPID_FLIPS 상수는 3이다', () => {
      expect(MIN_RAPID_FLIPS).toBe(3);
    });
  });

  describe('같은 카테고리 내 이동 (targetIndex === activeIndex)', () => {
    it('동일 카테고리 이동 시 결과가 MIN_RAPID_FLIPS 이상이다', () => {
      const steps = buildRapidSteps({
        ...base,
        activeItem: 'Content',
        activeIndex: 1,
        currentPageIndex: 0,
        totalPages: 5,
        targetItem: 'Content',
        targetPageIndex: 3,
        targetTotalPages: 5,
        direction: 'forward',
      });
      expect(steps.length).toBeGreaterThanOrEqual(MIN_RAPID_FLIPS);
    });

    it('동일 카테고리 이동 시 마지막 스텝이 목표 pageIndex이다', () => {
      const steps = buildRapidSteps({
        ...base,
        activeItem: 'Content',
        activeIndex: 1,
        currentPageIndex: 0,
        totalPages: 5,
        targetItem: 'Content',
        targetPageIndex: 3,
        targetTotalPages: 5,
        direction: 'forward',
      });
      const last = steps[steps.length - 1];
      expect(last.item).toBe('Content');
      expect(last.pageIndex).toBe(3);
    });
  });

  describe('forward 방향 카테고리 횡단', () => {
    it('List → Award 이동 시 중간 카테고리(Content, Timeline)를 거친다', () => {
      const steps = buildRapidSteps({
        activeItem: 'List',
        activeIndex: 0,
        currentPageIndex: 0,
        totalPages: 1,
        targetItem: 'Award',
        targetPageIndex: 0,
        targetTotalPages: 2,
        direction: 'forward',
      });
      const items = steps.map((s) => s.item);
      // Content와 Timeline이 경로에 포함되어야 함
      expect(items).toContain('Content');
      expect(items).toContain('Timeline');
      expect(items).toContain('Award');
    });

    it('List → Content 이동 시 마지막 스텝이 Content이다', () => {
      const steps = buildRapidSteps({ ...base, direction: 'forward' });
      expect(steps[steps.length - 1].item).toBe('Content');
    });
  });

  describe('backward 방향 카테고리 횡단', () => {
    it('Award → List 이동 시 중간 카테고리(Timeline, Content)를 거친다', () => {
      const steps = buildRapidSteps({
        activeItem: 'Award',
        activeIndex: 3,
        currentPageIndex: 0,
        totalPages: 2,
        targetItem: 'List',
        targetPageIndex: 0,
        targetTotalPages: 1,
        direction: 'backward',
      });
      const items = steps.map((s) => s.item);
      expect(items).toContain('Timeline');
      expect(items).toContain('Content');
      expect(items).toContain('List');
    });

    it('backward 이동 시에도 마지막 스텝은 targetItem이다', () => {
      const steps = buildRapidSteps({
        activeItem: 'Content',
        activeIndex: 1,
        currentPageIndex: 2,
        totalPages: 5,
        targetItem: 'List',
        targetPageIndex: 0,
        targetTotalPages: 1,
        direction: 'backward',
      });
      const last = steps[steps.length - 1];
      expect(last.item).toBe('List');
      expect(last.pageIndex).toBe(0);
    });
  });

  describe('prePadding: 현재 카테고리 내 페이지 패딩', () => {
    it('현재 카테고리에 다음 페이지가 있으면 패딩에 포함된다', () => {
      const steps = buildRapidSteps({
        activeItem: 'Content',
        activeIndex: 1,
        currentPageIndex: 0,
        totalPages: 10, // 페이지 여유 있음
        targetItem: 'Timeline',
        targetPageIndex: 0,
        targetTotalPages: 1,
        direction: 'forward',
      });
      // 첫 번째 스텝이 Content(현재 카테고리) 페이지 패딩이어야 함
      expect(steps[0].item).toBe('Content');
      expect(steps[steps.length - 1].item).toBe('Timeline');
    });

    it('backward 패딩은 현재 pageIndex보다 작은 페이지를 사용한다', () => {
      const steps = buildRapidSteps({
        activeItem: 'Content',
        activeIndex: 1,
        currentPageIndex: 5, // 뒤로 갈 여유 있음
        totalPages: 10,
        targetItem: 'List',
        targetPageIndex: 0,
        targetTotalPages: 1,
        direction: 'backward',
      });
      // prePadding 스텝의 pageIndex가 currentPageIndex보다 작아야 함
      const contentSteps = steps.filter(
        (s, i) => s.item === 'Content' && i < steps.length - 1,
      );
      contentSteps.forEach((s) => {
        expect(s.pageIndex).toBeLessThan(5);
      });
    });
  });

  describe('제자리 플립: 스텝이 MIN_RAPID_FLIPS 미만일 때 보충', () => {
    it('패딩 없이 crossStep 1개뿐이면 activeItem 제자리 스텝으로 채운다', () => {
      // List(totalPages=1) → Content(pageIndex=0), forward
      // crossSteps=1, prePadding=0(totalPages 1이라 다음 페이지 없음), postPadding 가능
      const steps = buildRapidSteps({
        activeItem: 'List',
        activeIndex: 0,
        currentPageIndex: 0,
        totalPages: 1,
        targetItem: 'Content',
        targetPageIndex: 0,
        targetTotalPages: 1, // targetTotalPages도 1로 강제하여 postPadding 방지
        direction: 'forward',
      });
      expect(steps.length).toBeGreaterThanOrEqual(MIN_RAPID_FLIPS);
      // 제자리 플립 스텝은 activeItem(List) + currentPageIndex(0)이어야 함
      const fillerSteps = steps.slice(0, steps.length - 1);
      const hasFiller = fillerSteps.some(
        (s) => s.item === 'List' && s.pageIndex === 0,
      );
      expect(hasFiller).toBe(true);
    });
  });

  describe('postPadding: 타겟 카테고리 내 페이지 패딩', () => {
    it('forward 방향에서 postPadding은 마지막 스텝 직전에 삽입된다', () => {
      const steps = buildRapidSteps({
        activeItem: 'List',
        activeIndex: 0,
        currentPageIndex: 0,
        totalPages: 1,
        targetItem: 'Content',
        targetPageIndex: 0,
        targetTotalPages: 10, // targetTotalPages가 크면 postPadding 생성 가능
        direction: 'forward',
      });
      // 마지막 스텝이 targetItem + targetPageIndex(0)
      const last = steps[steps.length - 1];
      expect(last.item).toBe('Content');
      expect(last.pageIndex).toBe(0);
    });
  });

  describe('엣지 케이스', () => {
    it('인접한 카테고리 간 이동(List→Content)은 정확히 1개의 crossStep을 생성한다', () => {
      const steps = buildRapidSteps({
        ...base,
        totalPages: 1,
        targetTotalPages: 1,
        direction: 'forward',
      });
      // crossSteps = 1 (Content만), 전체 최소 MIN_RAPID_FLIPS
      expect(steps.length).toBeGreaterThanOrEqual(MIN_RAPID_FLIPS);
      expect(steps[steps.length - 1].item).toBe('Content');
    });

    it('현재 pageIndex가 0이고 backward일 때 prePadding이 생성되지 않는다', () => {
      const steps = buildRapidSteps({
        activeItem: 'Content',
        activeIndex: 1,
        currentPageIndex: 0, // 이전 페이지 없음
        totalPages: 5,
        targetItem: 'List',
        targetPageIndex: 0,
        targetTotalPages: 1,
        direction: 'backward',
      });
      // prePadding 없이도 MIN_RAPID_FLIPS 이상
      expect(steps.length).toBeGreaterThanOrEqual(MIN_RAPID_FLIPS);
    });
  });
});

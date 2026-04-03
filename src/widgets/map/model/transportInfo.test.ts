import { describe, expect, it } from 'vitest';

import { TRANSPORT_ITEMS } from './transportInfo';

describe('TRANSPORT_ITEMS', () => {
  it('3개의 교통수단 항목을 포함한다', () => {
    expect(TRANSPORT_ITEMS).toHaveLength(3);
  });

  it('각 항목에 고유한 id가 있다', () => {
    const ids = TRANSPORT_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('모든 항목에 Icon 컴포넌트가 함수로 존재한다', () => {
    TRANSPORT_ITEMS.forEach((item) => {
      expect(typeof item.Icon).toBe('function');
    });
  });

  it('도보 항목이 올바른 데이터를 가진다', () => {
    const walk = TRANSPORT_ITEMS.find((item) => item.id === 'map__walk');
    expect(walk).toBeDefined();
    expect(walk!.label).toBe('도보');
    expect(walk!.lines).toEqual([
      '부산 남구 수영로 274-16',
      '프렌즈 스크린 부산 대연점 옆 건물',
    ]);
  });

  it('버스 항목이 올바른 데이터를 가진다', () => {
    const bus = TRANSPORT_ITEMS.find((item) => item.id === 'map__bus');
    expect(bus).toBeDefined();
    expect(bus!.label).toBe('버스');
    expect(bus!.lines).toEqual(['대연역 정거장', '경성대학교 정거장']);
  });

  it('지하철 항목이 올바른 데이터를 가진다', () => {
    const subway = TRANSPORT_ITEMS.find((item) => item.id === 'map__subway');
    expect(subway).toBeDefined();
    expect(subway!.label).toBe('지하철');
    expect(subway!.lines).toEqual(['2호선 경성대부경대역 5번 출구']);
  });
});

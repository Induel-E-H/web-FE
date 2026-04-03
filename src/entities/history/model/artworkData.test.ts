import { describe, expect, it } from 'vitest';

import { ARTWORK_LIST } from './artworkData';

describe('ARTWORK_LIST', () => {
  it('하나 이상의 작품이 존재한다', () => {
    expect(ARTWORK_LIST.length).toBeGreaterThan(0);
  });

  it('id가 0부터 순서대로 할당되어 있다', () => {
    ARTWORK_LIST.forEach((item, index) => {
      expect(item.id).toBe(index);
    });
  });

  it('각 작품에 고유한 id가 있다', () => {
    const ids = ARTWORK_LIST.map((a) => a.id);
    expect(new Set(ids).size).toBe(ARTWORK_LIST.length);
  });

  it('titleEng, title, description, address 필드가 비어있지 않다', () => {
    ARTWORK_LIST.forEach((item) => {
      expect(item.titleEng.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
      expect(item.address.length).toBeGreaterThan(0);
    });
  });

  it('time 필드는 string 타입이다', () => {
    ARTWORK_LIST.forEach((item) => {
      expect(typeof item.time).toBe('string');
    });
  });

  it('content는 string 또는 string[]이다', () => {
    ARTWORK_LIST.forEach((item) => {
      const isStringOrArray =
        typeof item.content === 'string' || Array.isArray(item.content);
      expect(isStringOrArray).toBe(true);
    });
  });

  it('area는 string[] 타입이며 각 요소는 문자열이다', () => {
    ARTWORK_LIST.forEach((item) => {
      expect(Array.isArray(item.area)).toBe(true);
      item.area.forEach((a) => expect(typeof a).toBe('string'));
    });
  });

  it('subTitle은 선택적 필드이며 string 또는 string[]이다', () => {
    const withSubTitle = ARTWORK_LIST.filter((a) => a.subTitle !== undefined);
    expect(withSubTitle.length).toBeGreaterThan(0);

    withSubTitle.forEach((item) => {
      const isStringOrArray =
        typeof item.subTitle === 'string' || Array.isArray(item.subTitle);
      expect(isStringOrArray).toBe(true);
    });
  });

  it('time이 비어있지 않은 항목은 YYYY. MM 기반 형식을 따른다', () => {
    // YYYY. MM / YYYY. MM ~ YYYY. MM / YYYY. MM. DD ~ YYYY. MM. DD 형식 허용
    const timePattern =
      /^\d{4}\.\s\d{2}(\.\s\d{2})?(\s~\s\d{4}\.\s\d{2}(\.\s\d{2})?)?$/;
    ARTWORK_LIST.filter((item) => item.time !== '').forEach((item) => {
      expect(item.time).toMatch(timePattern);
    });
  });
});

import { describe, expect, it } from 'vitest';

import PATENT_LIST_DATA from './PatentListData';

describe('PATENT_LIST_DATA', () => {
  it('하나 이상의 항목이 존재한다', () => {
    expect(PATENT_LIST_DATA.length).toBeGreaterThan(0);
  });

  it('모든 항목은 비어있지 않은 문자열이다', () => {
    PATENT_LIST_DATA.forEach((item) => {
      expect(typeof item).toBe('string');
      expect(item.length).toBeGreaterThan(0);
    });
  });

  it('모든 항목은 10-XXXXXXX-00-00 형식의 특허번호로 시작한다', () => {
    const patentNumberPattern = /^10-\d{7}-\d{2}-\d{2}/;
    PATENT_LIST_DATA.forEach((item) => {
      expect(item).toMatch(patentNumberPattern);
    });
  });

  it('모든 항목은 특허번호 뒤에 공백과 명칭이 있다', () => {
    // 형식: "10-XXXXXXX-00-00 [명칭]"
    const fullPattern = /^10-\d{7}-\d{2}-\d{2} .+$/;
    PATENT_LIST_DATA.forEach((item) => {
      expect(item).toMatch(fullPattern);
    });
  });
});

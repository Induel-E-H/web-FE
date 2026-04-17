import { describe, expect, it } from 'vitest';

import { PATENT_EXPIRE_LIST, PATENT_VALID_LIST } from './patentListData';

describe('PATENT_VALID_LIST', () => {
  it('하나 이상의 항목이 존재한다', () => {
    expect(PATENT_VALID_LIST.length).toBeGreaterThan(0);
  });

  it('모든 항목에 필수 필드가 비어있지 않은 문자열로 존재한다', () => {
    PATENT_VALID_LIST.forEach((item) => {
      expect(item.serialNumber.length).toBeGreaterThan(0);
      expect(item.applicationNumber.length).toBeGreaterThan(0);
      expect(item.filingDate.length).toBeGreaterThan(0);
      expect(item.registrationDate.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
    });
  });

  it('serialNumber는 "제 10-XXXXXXX호" 형식이다', () => {
    const pattern = /^제 10-\d{7}호$/;
    PATENT_VALID_LIST.forEach((item) => {
      expect(item.serialNumber).toMatch(pattern);
    });
  });

  it('applicationNumber는 "제 10-XXXX-XXXXXXX호" 형식이다', () => {
    const pattern = /^제 10-\d{4}-\d{7}호$/;
    PATENT_VALID_LIST.forEach((item) => {
      expect(item.applicationNumber).toMatch(pattern);
    });
  });

  it('filingDate는 "YYYY. MM. DD" 형식이다', () => {
    const pattern = /^\d{4}\. \d{2}\. \d{2}$/;
    PATENT_VALID_LIST.forEach((item) => {
      expect(item.filingDate).toMatch(pattern);
    });
  });

  it('registrationDate는 "YYYY. MM. DD" 형식이다', () => {
    const pattern = /^\d{4}\. \d{2}\. \d{2}$/;
    PATENT_VALID_LIST.forEach((item) => {
      expect(item.registrationDate).toMatch(pattern);
    });
  });

  it('registrationDate가 filingDate 이후다', () => {
    PATENT_VALID_LIST.forEach((item) => {
      const filing = item.filingDate.replace(/\. /g, '-');
      const registration = item.registrationDate.replace(/\. /g, '-');
      expect(registration > filing).toBe(true);
    });
  });
});

describe('PATENT_EXPIRE_LIST', () => {
  it('하나 이상의 항목이 존재한다', () => {
    expect(PATENT_EXPIRE_LIST.length).toBeGreaterThan(0);
  });

  it('모든 항목에 serialNumber와 title이 비어있지 않은 문자열로 존재한다', () => {
    PATENT_EXPIRE_LIST.forEach((item) => {
      expect(item.serialNumber.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
    });
  });

  it('serialNumber는 "10-XXXXXXX" 형식이다', () => {
    const pattern = /^10-\d{7}$/;
    PATENT_EXPIRE_LIST.forEach((item) => {
      expect(item.serialNumber).toMatch(pattern);
    });
  });
});

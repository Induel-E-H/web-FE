import { describe, expect, it } from 'vitest';

import { COMPANY } from './company';

describe('COMPANY 상수', () => {
  describe('회사명', () => {
    it('한국어 회사명이 "인들이앤에이치"이다', () => {
      expect(COMPANY.NAME_KO).toBe('인들이앤에이치');
    });

    it('영문 약칭이 "INDUEL E&H"이다', () => {
      expect(COMPANY.NAME_EN).toBe('INDUEL E&H');
    });

    it('영문 전체 사명이 "INDUEL ENGINEERING & HOLDINGS"이다', () => {
      expect(COMPANY.NAME_EN_FULL).toBe('INDUEL ENGINEERING & HOLDINGS');
    });
  });

  describe('대표자 및 사업자 정보', () => {
    it('대표자명이 "이선학"이다', () => {
      expect(COMPANY.CEO).toBe('이선학');
    });

    it('사업자등록번호가 "617-81-27655"이다', () => {
      expect(COMPANY.BUSINESS_NO).toBe('617-81-27655');
    });
  });

  describe('연락처', () => {
    it('전화번호(하이픈 없음)가 "0516266277"이다', () => {
      expect(COMPANY.PHONE).toBe('0516266277');
    });

    it('전화번호(표시용)가 "051-626-6277"이다', () => {
      expect(COMPANY.PHONE_DISPLAY).toBe('051-626-6277');
    });

    it('팩스번호가 "051-625-6279"이다', () => {
      expect(COMPANY.FAX).toBe('051-625-6279');
    });

    it('이메일이 "seven@induel.co.kr"이다', () => {
      expect(COMPANY.EMAIL).toBe('seven@induel.co.kr');
    });
  });

  describe('주소', () => {
    it('지하철 안내가 올바르다', () => {
      expect(COMPANY.ADDRESS_SUB).toBe('2호선 경성대부경대역 5번 출구 348m');
    });

    it('도로명 주소가 올바르다', () => {
      expect(COMPANY.ADDRESS_FULL).toBe('부산광역시 남구 수영로 274-16');
    });
  });

  describe('설립일', () => {
    it('설립일(ISO 형식)이 "2000-04-27"이다', () => {
      expect(COMPANY.ESTABLISHED).toBe('2000-04-27');
    });

    it('설립일(표시용)이 "2000.04.27"이다', () => {
      expect(COMPANY.ESTABLISHED_DISPLAY).toBe('2000.04.27');
    });
  });

  describe('좌표', () => {
    it('위도가 35.13488이다', () => {
      expect(COMPANY.LAT).toBe(35.13488);
    });

    it('경도가 129.0968이다', () => {
      expect(COMPANY.LNG).toBe(129.0968);
    });
  });
});

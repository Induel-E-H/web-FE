import { describe, expect, it } from 'vitest';

import { getOrdinalSuffix } from './getOrdinalSuffix';

describe('getOrdinalSuffix', () => {
  describe('mod100 11-13 예외 (항상 th)', () => {
    it('11 → th', () => expect(getOrdinalSuffix(11)).toBe('th'));
    it('12 → th', () => expect(getOrdinalSuffix(12)).toBe('th'));
    it('13 → th', () => expect(getOrdinalSuffix(13)).toBe('th'));
    it('111 → th (mod100=11)', () => expect(getOrdinalSuffix(111)).toBe('th'));
    it('112 → th (mod100=12)', () => expect(getOrdinalSuffix(112)).toBe('th'));
    it('113 → th (mod100=13)', () => expect(getOrdinalSuffix(113)).toBe('th'));
  });

  describe('st (mod10=1, mod100 예외 제외)', () => {
    it('1 → st', () => expect(getOrdinalSuffix(1)).toBe('st'));
    it('21 → st', () => expect(getOrdinalSuffix(21)).toBe('st'));
    it('101 → st', () => expect(getOrdinalSuffix(101)).toBe('st'));
  });

  describe('nd (mod10=2, mod100 예외 제외)', () => {
    it('2 → nd', () => expect(getOrdinalSuffix(2)).toBe('nd'));
    it('22 → nd', () => expect(getOrdinalSuffix(22)).toBe('nd'));
    it('102 → nd', () => expect(getOrdinalSuffix(102)).toBe('nd'));
  });

  describe('rd (mod10=3, mod100 예외 제외)', () => {
    it('3 → rd', () => expect(getOrdinalSuffix(3)).toBe('rd'));
    it('23 → rd', () => expect(getOrdinalSuffix(23)).toBe('rd'));
    it('103 → rd', () => expect(getOrdinalSuffix(103)).toBe('rd'));
  });

  describe('th (나머지)', () => {
    it('4 → th', () => expect(getOrdinalSuffix(4)).toBe('th'));
    it('10 → th', () => expect(getOrdinalSuffix(10)).toBe('th'));
    it('14 → th', () => expect(getOrdinalSuffix(14)).toBe('th'));
    it('20 → th', () => expect(getOrdinalSuffix(20)).toBe('th'));
    it('100 → th', () => expect(getOrdinalSuffix(100)).toBe('th'));
  });
});

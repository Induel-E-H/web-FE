import { describe, expect, it } from 'vitest';

import { getBrowserSupport } from './detectBrowser';

const UA = {
  chrome100:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
  chrome90:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
  chrome89:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
  chrome80:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
  chrome79:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
  chrome50:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4501.0 Safari/537.36 Edg/91.0.866.0',
  opera:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 OPR/76.0.4017.107',
  samsung:
    'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.0 Chrome/87.0.4280.141 Mobile Safari/537.36',
  firefox:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  safari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
};

describe('getBrowserSupport', () => {
  describe('Chrome 완전 지원 (90+)', () => {
    it('Chrome 90 → full', () => {
      expect(getBrowserSupport(UA.chrome90)).toBe('full');
    });

    it('Chrome 100 → full', () => {
      expect(getBrowserSupport(UA.chrome100)).toBe('full');
    });
  });

  describe('Chrome 제한 지원 (80–89)', () => {
    it('Chrome 89 → limited', () => {
      expect(getBrowserSupport(UA.chrome89)).toBe('limited');
    });

    it('Chrome 80 → limited', () => {
      expect(getBrowserSupport(UA.chrome80)).toBe('limited');
    });
  });

  describe('Chrome 미지원 (80 미만)', () => {
    it('Chrome 79 → unsupported', () => {
      expect(getBrowserSupport(UA.chrome79)).toBe('unsupported');
    });

    it('Chrome 50 → unsupported', () => {
      expect(getBrowserSupport(UA.chrome50)).toBe('unsupported');
    });
  });

  describe('Chromium 기반 비-Chrome 브라우저 → full', () => {
    it('Edge → full (Edg/ 포함)', () => {
      expect(getBrowserSupport(UA.edge)).toBe('full');
    });

    it('Opera → full (OPR/ 포함)', () => {
      expect(getBrowserSupport(UA.opera)).toBe('full');
    });

    it('Samsung Browser → full (SamsungBrowser/ 포함)', () => {
      expect(getBrowserSupport(UA.samsung)).toBe('full');
    });
  });

  describe('비-Chromium 브라우저 → full', () => {
    it('Firefox → full', () => {
      expect(getBrowserSupport(UA.firefox)).toBe('full');
    });

    it('Safari → full', () => {
      expect(getBrowserSupport(UA.safari)).toBe('full');
    });
  });
});

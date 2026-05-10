import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { printAsciiBanner } from './banner';

describe('printAsciiBanner', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('production 환경이 아닌 경우', () => {
    it('테스트 환경(MODE=test)에서는 console.log가 호출되지 않는다', () => {
      printAsciiBanner();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('production 환경인 경우', () => {
    it('MODE가 "production"이면 console.log가 호출된다', () => {
      vi.stubEnv('MODE', 'production');
      printAsciiBanner();
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });
});

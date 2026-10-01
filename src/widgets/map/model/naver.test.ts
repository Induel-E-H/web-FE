import { COMPANY } from '@shared/constant';
import { afterEach, describe, expect, it } from 'vitest';

import {
  FALLBACK_MAP_URL,
  getNaverSdkUrl,
  isNaverAvailable,
  type NaverWindow,
} from './naver';

describe('naver', () => {
  afterEach(() => {
    delete (window as NaverWindow).naver;
  });

  it('isNaverAvailable은 naver.maps.Map이 있을 때만 true를 반환한다', () => {
    expect(isNaverAvailable()).toBe(false);
    (window as NaverWindow).naver = { maps: {} };
    expect(isNaverAvailable()).toBe(false);
    (window as NaverWindow).naver = { maps: { Map: class {} } };
    expect(isNaverAvailable()).toBe(true);
  });

  it('getNaverSdkUrl은 키를 ncpKeyId 쿼리로 붙인다', () => {
    expect(getNaverSdkUrl('abc')).toBe(
      'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=abc',
    );
  });

  it('FALLBACK_MAP_URL은 회사 좌표를 마커로 포함한다', () => {
    expect(FALLBACK_MAP_URL).toContain(
      `marker=${COMPANY.LAT}%2C${COMPANY.LNG}`,
    );
  });
});

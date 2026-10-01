import { COMPANY } from '@shared/constant';

export type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

const BBOX_OFFSET = 0.01;

export const NAVER_SDK_SELECTOR = 'script[src*="oapi.map.naver.com"]';

export const FALLBACK_MAP_URL = [
  'https://www.openstreetmap.org/export/embed.html',
  `?bbox=${COMPANY.LNG - BBOX_OFFSET}%2C${COMPANY.LAT - BBOX_OFFSET}`,
  `%2C${COMPANY.LNG + BBOX_OFFSET}%2C${COMPANY.LAT + BBOX_OFFSET}`,
  `&layer=mapnik&marker=${COMPANY.LAT}%2C${COMPANY.LNG}`,
].join('');

export function getNaverSdkUrl(key: string) {
  return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${key}`;
}

export function getNaverMapKey() {
  return import.meta.env.VITE_NAVER_MAP_API_KEY as string | undefined;
}

export function isNaverAvailable() {
  return !!(window as NaverWindow).naver?.maps?.Map;
}

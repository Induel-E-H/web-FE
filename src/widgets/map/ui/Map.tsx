import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { COMPANY } from '@shared/constant';

import { MAP_STATE, type MapState } from '../model/constant';
import { makeMap } from '../model/map';
import '../styles/Map.css';
import { MapCard } from './MapCard';
import { MapInfoCard } from './MapInfoCard';
import { MapMarker } from './MapMarker';
import { MapTitle } from './MapTitle';

const INFO_CARD_HTML = renderToStaticMarkup(<MapInfoCard />);
const MARKER_SVG = renderToStaticMarkup(<MapMarker />);

type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

const BBOX_OFFSET = 0.01;
const FALLBACK_MAP_URL = [
  'https://www.openstreetmap.org/export/embed.html',
  `?bbox=${COMPANY.LNG - BBOX_OFFSET}%2C${COMPANY.LAT - BBOX_OFFSET}`,
  `%2C${COMPANY.LNG + BBOX_OFFSET}%2C${COMPANY.LAT + BBOX_OFFSET}`,
  `&layer=mapnik&marker=${COMPANY.LAT}%2C${COMPANY.LNG}`,
].join('');

function isNaverAvailable() {
  const w = window as NaverWindow;
  return !!w.naver?.maps?.Map;
}

export function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>(() => {
    if (isNaverAvailable()) return MAP_STATE.READY;
    const key = import.meta.env.VITE_NAVER_MAP_API_KEY as string | undefined;
    if (!key) return MAP_STATE.FALLBACK;
    return MAP_STATE.LOADING;
  });

  // Naver Maps SDK 동적 주입 — Map 컴포넌트 마운트 시점으로 지연
  useEffect(() => {
    if (isNaverAvailable()) return;

    const key = import.meta.env.VITE_NAVER_MAP_API_KEY as string | undefined;
    if (!key) return;

    const handleLoad = () =>
      setMapState(isNaverAvailable() ? MAP_STATE.READY : MAP_STATE.FALLBACK);

    const existing = document.querySelector(
      'script[src*="oapi.map.naver.com"]',
    );
    if (existing) {
      if (isNaverAvailable()) {
        // 스크립트는 이미 로드됨 (Strict Mode 재실행 등)
        queueMicrotask(handleLoad);
      } else {
        existing.addEventListener('load', handleLoad);
        return () => existing.removeEventListener('load', handleLoad);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${key}`;
    script.async = true;
    script.onload = handleLoad;
    script.onerror = () => setMapState(MAP_STATE.FALLBACK);
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  // 지도 초기화 — SDK 준비 완료 후 실행
  useEffect(() => {
    if (mapState !== MAP_STATE.READY || !mapRef.current) return;

    const w = window as unknown as NaverWindow;

    // 인증 실패(401 등) 시 Naver Maps SDK가 호출하는 공식 콜백
    w.navermap_authFailure = () => setMapState(MAP_STATE.FALLBACK);

    let cleanup: (() => void) | undefined;
    try {
      cleanup = makeMap(mapRef.current, INFO_CARD_HTML, MARKER_SVG);
    } catch {
      queueMicrotask(() => setMapState(MAP_STATE.FALLBACK));
    }

    return () => {
      w.navermap_authFailure = undefined;
      cleanup?.();
    };
  }, [mapState]);

  return (
    <section id='map' className='map' aria-label='찾아오시는 길'>
      <MapTitle />
      <div className='map__card'>
        {mapState === MAP_STATE.FALLBACK ? (
          <iframe
            className='map__content map__content--fallback'
            src={FALLBACK_MAP_URL}
            title='인들이앤에이치 본사 위치 지도'
            loading='lazy'
          />
        ) : (
          <div
            ref={mapRef}
            className='map__content'
            role='img'
            aria-label='인들이앤에이치 본사 위치 지도'
          />
        )}
        <MapCard />
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  trackMapLoadFailure,
  trackMapLoadSuccess,
} from '@shared/lib/analytics';

import { MAP_STATE, type MapState } from '../model/constant';
import { makeMap } from '../model/map';
import {
  FALLBACK_MAP_URL,
  getNaverMapKey,
  getNaverSdkUrl,
  isNaverAvailable,
  NAVER_SDK_SELECTOR,
  type NaverWindow,
} from '../model/naver';
import '../styles/Map.css';
import { MapCard } from './MapCard';
import { MapInfoCard } from './MapInfoCard';
import { MapMarker } from './MapMarker';
import { MapTitle } from './MapTitle';

const INFO_CARD_HTML = renderToStaticMarkup(<MapInfoCard />);
const MARKER_SVG = renderToStaticMarkup(<MapMarker />);

export function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>(() => {
    if (isNaverAvailable()) return MAP_STATE.READY;
    return getNaverMapKey() ? MAP_STATE.LOADING : MAP_STATE.FALLBACK;
  });

  useEffect(() => {
    if (isNaverAvailable()) return;

    const key = getNaverMapKey();
    if (!key) return;

    const handleLoad = () => {
      const ready = isNaverAvailable();
      setMapState(ready ? MAP_STATE.READY : MAP_STATE.FALLBACK);
      if (ready) trackMapLoadSuccess();
      else trackMapLoadFailure();
    };

    const existing = document.querySelector(NAVER_SDK_SELECTOR);
    if (existing) {
      if (isNaverAvailable()) {
        queueMicrotask(handleLoad);
      } else {
        existing.addEventListener('load', handleLoad);
        return () => existing.removeEventListener('load', handleLoad);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = getNaverSdkUrl(key);
    script.async = true;
    script.onload = handleLoad;
    script.onerror = () => {
      setMapState(MAP_STATE.FALLBACK);
      trackMapLoadFailure();
    };
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (mapState !== MAP_STATE.READY || !mapRef.current) return;

    const w = window as NaverWindow;

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
            aria-label='인들이앤에이치 본사 위치 지도'
          />
        )}
        <MapCard />
      </div>
    </section>
  );
}

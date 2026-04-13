import { useEffect, useRef, useState } from 'react';

import { makeMap } from '../model/map';
import '../styles/Map.css';
import '../styles/mapInfoCard.css';
import '../styles/mapMarker.css';
import { MapCard } from './MapCard';
import { MapTitle } from './Title';

type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

const FALLBACK_MAP_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=129.0868%2C35.1249%2C129.1068%2C35.1449&layer=mapnik&marker=35.13488%2C129.0968';

function isNaverAvailable() {
  const w = window as unknown as NaverWindow;
  return !!w.naver?.maps?.Map;
}

function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  // SDK 미로드 여부를 렌더 시점에 lazy하게 판단 (effect 내 동기 setState 회피)
  const [isFallback, setIsFallback] = useState(() => !isNaverAvailable());

  useEffect(() => {
    if (isFallback || !mapRef.current) return;

    const w = window as unknown as NaverWindow;

    // 인증 실패(401 등) 시 Naver Maps SDK가 호출하는 공식 콜백
    w.navermap_authFailure = () => setIsFallback(true);

    let cleanup: (() => void) | undefined;
    try {
      cleanup = makeMap(mapRef.current);
    } catch {
      queueMicrotask(() => setIsFallback(true));
    }

    return () => {
      w.navermap_authFailure = undefined;
      cleanup?.();
    };
  }, [isFallback]);

  return (
    <section className='map'>
      <MapTitle />
      <div className='map__card'>
        {isFallback ? (
          <iframe
            className='map__content map__content--fallback'
            src={FALLBACK_MAP_URL}
            title='위치 지도'
            loading='lazy'
          />
        ) : (
          <div ref={mapRef} className='map__content' />
        )}
        <MapCard />
      </div>
    </section>
  );
}

export default Map;

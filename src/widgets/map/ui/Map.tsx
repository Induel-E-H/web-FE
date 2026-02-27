import { useEffect, useRef } from 'react';
import { MdDirectionsBus, MdSubway } from 'react-icons/md';
import { TbWalk } from 'react-icons/tb';

import { makeMap } from '../model/map';
import '../styles/Map.css';
import '../styles/mapInfoCard.css';
import '../styles/mapMarker.css';

function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) return makeMap(mapRef.current);
  }, []);

  return (
    <section className='map'>
      <div className='map__title'>
        <hr aria-hidden='true' />
        <h2>INDUEL E&H Address</h2>
        <hr aria-hidden='true' />
      </div>
      <div className='map__wrapper'>
        <div ref={mapRef} className='map__content'></div>
      </div>
      <address className='map__description'>
        <ul>
          <li>
            <div className='map__description_title'>
              <TbWalk className='map__icon' id='map__walk' aria-hidden='true' />
              <h3>도보</h3>
            </div>
            <p>부산 남구 수영로 274-16</p>
            <p>프렌즈 스크린 부산 대연점 옆 건물</p>
          </li>
          <li>
            <div className='map__description_title'>
              <MdDirectionsBus
                className='map__icon'
                id='map__bus'
                aria-hidden='true'
              />
              <h3>버스</h3>
            </div>
            <p>대연역 정거장</p>
            <p>경성대학교 정거장</p>
          </li>
          <li>
            <div className='map__description_title'>
              <MdSubway
                className='map__icon'
                id='map__subway'
                aria-hidden='true'
              />
              <h3>지하철</h3>
            </div>
            <p>2호선 경성대부경대역 5번 출구</p>
          </li>
        </ul>
      </address>
    </section>
  );
}

export default Map;

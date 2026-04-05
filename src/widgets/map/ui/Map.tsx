import { useEffect, useRef } from 'react';
import { FiPhoneCall } from 'react-icons/fi';

import { TRANSPORT_ITEMS } from '@entities/map/model/transportInfo';
import { COMPANY } from '@shared/constant';

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
        <hgroup className='map__title_text'>
          <p>LOCATION</p>
          <h2>찾아오시는 길</h2>
        </hgroup>
        <hr />
      </div>
      <div className='map__card'>
        <div className='map__wrapper'>
          <div ref={mapRef} className='map__content' />
        </div>
        <address className='map__card_content'>
          <p>(주) 인들이앤에이치 본사</p>
          <ul>
            {TRANSPORT_ITEMS.map(({ id, Icon, label, lines }) => (
              <li key={id}>
                <div className='map__icon_frame'>
                  <Icon className='map__icon' id={id} aria-hidden='true' />
                </div>
                <div className='map__description_text'>
                  <h3>{label}</h3>
                  <div className='map__description__content'>
                    {lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <hr />
          <div className='map__description_call'>
            <FiPhoneCall aria-hidden='true' />
            <div className='map__description_call_text'>
              <span>문의 전화:</span>
              <span>{COMPANY.PHONE_DISPLAY}</span>
            </div>
          </div>
        </address>
      </div>
    </section>
  );
}

export default Map;

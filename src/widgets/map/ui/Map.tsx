import { useEffect, useRef } from 'react';

import { makeMap } from '../model/map';
import { TRANSPORT_ITEMS } from '../model/transportInfo';
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
          {TRANSPORT_ITEMS.map(({ id, Icon, label, lines }) => (
            <li key={id}>
              <div className='map__description_title'>
                <Icon className='map__icon' id={id} aria-hidden='true' />
                <h3>{label}</h3>
              </div>
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </li>
          ))}
        </ul>
      </address>
    </section>
  );
}

export default Map;

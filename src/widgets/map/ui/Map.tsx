import { useEffect, useRef } from 'react';

import { makeMap } from '../model/map';
import '../styles/Map.css';
import '../styles/mapInfoCard.css';
import '../styles/mapMarker.css';
import { MapCard } from './MapCard';
import { MapTitle } from './Title';

function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) return makeMap(mapRef.current);
  }, []);

  return (
    <section className='map'>
      <MapTitle />
      <div className='map__card'>
        <div ref={mapRef} className='map__content' />
        <MapCard />
      </div>
    </section>
  );
}

export default Map;

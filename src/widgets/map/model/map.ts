import { COMPANY } from '@shared/constant';

import { makeInfoCard } from './mapInfoCard';
import { makeMapMarker, updateMarkerIcon } from './mapMarker';

function getZoom(): number {
  const physicalWidth = window.screen.width * window.devicePixelRatio;
  if (physicalWidth >= 7680) return 20;
  return 17;
}

export function makeMap(
  el: HTMLDivElement,
  infoCardHTML: string,
  markerSVG: string,
): () => void {
  const map = new naver.maps.Map(el, {
    center: new naver.maps.LatLng(COMPANY.LAT, COMPANY.LNG),
    zoom: getZoom(),
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT,
    },
  });
  const marker = makeMapMarker(map, markerSVG);
  const infoWindow = makeInfoCard(map, marker, infoCardHTML);

  const onResize = () => {
    const wasOpen = !!infoWindow.getMap();
    updateMarkerIcon(marker, markerSVG);
    if (wasOpen) {
      infoWindow.close();
      infoWindow.open(map, marker);
    }
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

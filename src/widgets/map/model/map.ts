import { makeInfoCard } from './mapInfoCard';
import { makeMapMarker, updateMarkerIcon } from './mapMarker';

function getZoom(): number {
  const physicalWidth = window.screen.width * window.devicePixelRatio;
  if (physicalWidth >= 7680) return 20;
  if (physicalWidth >= 3840) return 17;
  return 15;
}

export function makeMap(el: HTMLDivElement): () => void {
  const map = new naver.maps.Map(el, {
    center: new naver.maps.LatLng(35.13488, 129.0968),
    zoom: getZoom(),
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT,
    },
  });
  const marker = makeMapMarker(map);
  const infoWindow = makeInfoCard(map, marker);

  const onResize = () => {
    updateMarkerIcon(marker);
    infoWindow.close();
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

import rawInduelIcon from '@assets/induel-icon.svg?raw';

const ICON_INNER = rawInduelIcon
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .trim();

function createMarkerSvg() {
  return `
<svg class="map__marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 56">
  <defs>
    <radialGradient id="pinGrad" cx="38%" cy="28%" r="62%">
      <stop offset="0%" stop-color="#4a3527"/>
      <stop offset="100%" stop-color="#241812"/>
    </radialGradient>
  </defs>
  <ellipse class="map__marker__shadow" cx="22" cy="54" rx="7" ry="2.5"/>
  <path class="map__marker__body" d="M22 1C10.95 1 2 9.95 2 21C2 34.5 22 54 22 54C22 54 42 34.5 42 21C42 9.95 33.05 1 22 1Z"/>
  <path class="map__marker__highlight" d="M22 3C14.5 3 8 7.5 5.5 14C9 9 15 6 22 6C29 6 35 9 38.5 14C36 7.5 29.5 3 22 3Z"/>
  <circle class="map__marker__circle" cx="22" cy="21" r="14"/>
  <svg x="15" y="12" width="16" height="18" viewBox="0 0 649 748" preserveAspectRatio="xMidYMid meet">
    ${ICON_INNER}
  </svg>
</svg>
`;
}

const MARKER_VMAX = 2.292;

function getMarkerConfig() {
  const vmax = Math.max(window.innerWidth, window.innerHeight) / 100;
  const iconW = Math.round(MARKER_VMAX * vmax);
  const iconH = Math.round((iconW * 56) / 44);
  return {
    iconW,
    iconH,
    anchorX: Math.round(iconW / 2),
    anchorY: Math.round((iconH * 54) / 56),
  };
}

export function makeMapMarker(map: naver.maps.Map): naver.maps.Marker {
  const { iconW, iconH, anchorX, anchorY } = getMarkerConfig();
  return new naver.maps.Marker({
    position: map.getCenter(),
    map,
    icon: {
      content: createMarkerSvg(),
      size: new naver.maps.Size(iconW, iconH),
      anchor: new naver.maps.Point(anchorX, anchorY),
    },
  });
}

export function updateMarkerIcon(marker: naver.maps.Marker) {
  const { iconW, iconH, anchorX, anchorY } = getMarkerConfig();
  marker.setIcon({
    content: createMarkerSvg(),
    size: new naver.maps.Size(iconW, iconH),
    anchor: new naver.maps.Point(anchorX, anchorY),
  });
}

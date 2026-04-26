const MARKER_DESKTOP_VMAX = 2.292;
const MARKER_TABLET_VMIN = 7;
const MARKER_MOBILE_VMIN = 10;

function getMarkerConfig() {
  const width = window.innerWidth;

  const maxPx = Math.max(window.innerWidth, window.innerHeight);
  const minPx = Math.min(window.innerWidth, window.innerHeight);

  const vmaxPx = maxPx / 100;
  const vminPx = minPx / 100;

  let size: number;
  let unitPx: number;

  if (width <= 767) {
    size = MARKER_MOBILE_VMIN;
    unitPx = vminPx;
  } else if (width <= 1024) {
    size = MARKER_TABLET_VMIN;
    unitPx = vminPx;
  } else {
    size = MARKER_DESKTOP_VMAX;
    unitPx = vmaxPx;
  }

  const iconW = Math.round(size * unitPx);
  const iconH = Math.round((iconW * 56) / 44);

  return {
    iconW,
    iconH,
    anchorX: Math.round(iconW / 2),
    anchorY: Math.round((iconH * 54) / 56),
  };
}

function createMarkerIcon(svgContent: string) {
  const { iconW, iconH, anchorX, anchorY } = getMarkerConfig();
  return {
    content: svgContent,
    size: new naver.maps.Size(iconW, iconH),
    anchor: new naver.maps.Point(anchorX, anchorY),
  };
}

export function makeMapMarker(
  map: naver.maps.Map,
  svgContent: string,
): naver.maps.Marker {
  return new naver.maps.Marker({
    position: map.getCenter(),
    map,
    icon: createMarkerIcon(svgContent),
  });
}

export function updateMarkerIcon(
  marker: naver.maps.Marker,
  svgContent: string,
) {
  marker.setIcon(createMarkerIcon(svgContent));
}

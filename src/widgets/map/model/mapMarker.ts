const MARKER_MIN_PX = 32;
const MARKER_MAX_PX = 48;
const MARKER_VW = 2.29;

function getMarkerConfig() {
  const iconW = Math.round(
    Math.min(
      MARKER_MAX_PX,
      Math.max(MARKER_MIN_PX, (MARKER_VW * window.innerWidth) / 100),
    ),
  );
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

export function makeInfoCard(
  map: naver.maps.Map,
  marker: naver.maps.Marker,
  content: string,
): naver.maps.InfoWindow {
  const infoWindow = new naver.maps.InfoWindow({
    content,
    borderWidth: 0,
    disableAnchor: true,
    backgroundColor: 'transparent',
  });

  naver.maps.Event.addListener(marker, 'click', function () {
    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open(map, marker);
    }
  });

  return infoWindow;
}

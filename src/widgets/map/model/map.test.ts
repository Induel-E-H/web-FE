import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeMap } from './map';

const mockMakeMapMarker = vi.hoisted(() => vi.fn());
const mockUpdateMarkerIcon = vi.hoisted(() => vi.fn());
const mockMakeInfoCard = vi.hoisted(() => vi.fn());

vi.mock('./mapMarker', () => ({
  makeMapMarker: mockMakeMapMarker,
  updateMarkerIcon: mockUpdateMarkerIcon,
}));
vi.mock('./mapInfoCard', () => ({
  makeInfoCard: mockMakeInfoCard,
}));

const TEST_INFO_CARD_HTML = '<div class="map__info__card">test</div>';
const TEST_MARKER_SVG = '<svg class="map__marker"></svg>';

describe('map', () => {
  const mockMapObj = { getCenter: vi.fn() };
  const mockMarker = {};
  const mockGetMap = vi.fn();
  const mockClose = vi.fn();
  const mockOpenIW = vi.fn();
  const mockInfoWindow = {
    getMap: mockGetMap,
    close: mockClose,
    open: mockOpenIW,
  };

  const MockNaverMap = vi.fn().mockImplementation(function () {
    return mockMapObj;
  });
  const MockLatLng = vi.fn().mockImplementation(function (
    lat: number,
    lng: number,
  ) {
    return { lat, lng };
  });

  let mockEl: HTMLDivElement;
  let lastCleanup: (() => void) | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEl = document.createElement('div');
    mockMakeMapMarker.mockReturnValue(mockMarker);
    mockMakeInfoCard.mockReturnValue(mockInfoWindow);
    mockGetMap.mockReturnValue(null);

    vi.stubGlobal('naver', {
      maps: {
        Map: MockNaverMap,
        LatLng: MockLatLng,
        Position: { TOP_RIGHT: 'TOP_RIGHT' },
      },
    });

    vi.stubGlobal('screen', { width: 1920 });
    vi.stubGlobal('devicePixelRatio', 1);
  });

  afterEach(() => {
    lastCleanup?.();
    lastCleanup = undefined;
    vi.unstubAllGlobals();
  });

  describe('getZoom (makeMap을 통해 간접 검증)', () => {
    it('physicalWidth < 7680이면 zoom 17로 지도가 생성된다', () => {
      vi.stubGlobal('screen', { width: 1920 });
      vi.stubGlobal('devicePixelRatio', 1);

      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoom: 17 }),
      );
    });

    it('physicalWidth >= 7680이면 zoom 20으로 지도가 생성된다', () => {
      vi.stubGlobal('screen', { width: 7680 });
      vi.stubGlobal('devicePixelRatio', 1);

      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoom: 20 }),
      );
    });

    it('devicePixelRatio 2에서 physicalWidth >= 7680이면 zoom 20으로 지도가 생성된다', () => {
      vi.stubGlobal('screen', { width: 3840 });
      vi.stubGlobal('devicePixelRatio', 2);

      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoom: 20 }),
      );
    });
  });

  describe('makeMap', () => {
    it('center로 LatLng(35.13488, 129.0968)를 사용한다', () => {
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(MockLatLng).toHaveBeenCalledWith(35.13488, 129.0968);
    });

    it('zoomControl이 활성화된다', () => {
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoomControl: true }),
      );
    });

    it('zoomControlOptions에 TOP_RIGHT position이 설정된다', () => {
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({
          zoomControlOptions: expect.objectContaining({
            position: 'TOP_RIGHT',
          }) as unknown,
        }),
      );
    });

    it('makeMapMarker가 생성된 지도와 markerSVG로 호출된다', () => {
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(mockMakeMapMarker).toHaveBeenCalledWith(
        mockMapObj,
        TEST_MARKER_SVG,
      );
    });

    it('makeInfoCard가 지도, 마커, infoCardHTML로 호출된다', () => {
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(mockMakeInfoCard).toHaveBeenCalledWith(
        mockMapObj,
        mockMarker,
        TEST_INFO_CARD_HTML,
      );
    });

    it('window에 resize 이벤트 리스너가 등록된다', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');

      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('반환된 cleanup 함수 호출 시 resize 리스너가 제거된다', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener');

      const cleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);
      cleanup();

      expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('onResize 핸들러', () => {
    it('InfoWindow가 닫혀있을 때 resize → updateMarkerIcon만 호출된다', () => {
      mockGetMap.mockReturnValue(null);
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      window.dispatchEvent(new Event('resize'));

      expect(mockUpdateMarkerIcon).toHaveBeenCalledWith(
        mockMarker,
        TEST_MARKER_SVG,
      );
      expect(mockClose).not.toHaveBeenCalled();
      expect(mockOpenIW).not.toHaveBeenCalled();
    });

    it('InfoWindow가 열려있을 때 resize → close 후 재오픈된다', () => {
      mockGetMap.mockReturnValue({});
      lastCleanup = makeMap(mockEl, TEST_INFO_CARD_HTML, TEST_MARKER_SVG);

      window.dispatchEvent(new Event('resize'));

      expect(mockUpdateMarkerIcon).toHaveBeenCalledWith(
        mockMarker,
        TEST_MARKER_SVG,
      );
      expect(mockClose).toHaveBeenCalledOnce();
      expect(mockOpenIW).toHaveBeenCalledWith(mockMapObj, mockMarker);
    });
  });
});

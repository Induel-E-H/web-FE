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

    // 기본 screen/devicePixelRatio (physicalWidth = 1920)
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
      vi.stubGlobal('devicePixelRatio', 1); // 1920 * 1 = 1920

      lastCleanup = makeMap(mockEl);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoom: 17 }),
      );
    });

    it('physicalWidth >= 7680이면 zoom 20으로 지도가 생성된다', () => {
      vi.stubGlobal('screen', { width: 7680 });
      vi.stubGlobal('devicePixelRatio', 1); // 7680 * 1 = 7680

      lastCleanup = makeMap(mockEl);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoom: 20 }),
      );
    });

    it('devicePixelRatio 2에서 physicalWidth >= 7680이면 zoom 20으로 지도가 생성된다', () => {
      vi.stubGlobal('screen', { width: 3840 });
      vi.stubGlobal('devicePixelRatio', 2); // 3840 * 2 = 7680

      lastCleanup = makeMap(mockEl);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoom: 20 }),
      );
    });
  });

  describe('makeMap', () => {
    it('center로 LatLng(35.13488, 129.0968)를 사용한다', () => {
      lastCleanup = makeMap(mockEl);

      expect(MockLatLng).toHaveBeenCalledWith(35.13488, 129.0968);
    });

    it('zoomControl이 활성화된다', () => {
      lastCleanup = makeMap(mockEl);

      expect(MockNaverMap).toHaveBeenCalledWith(
        mockEl,
        expect.objectContaining({ zoomControl: true }),
      );
    });

    it('makeMapMarker가 생성된 지도로 호출된다', () => {
      lastCleanup = makeMap(mockEl);

      expect(mockMakeMapMarker).toHaveBeenCalledWith(mockMapObj);
    });

    it('makeInfoCard가 지도와 마커로 호출된다', () => {
      lastCleanup = makeMap(mockEl);

      expect(mockMakeInfoCard).toHaveBeenCalledWith(mockMapObj, mockMarker);
    });

    it('window에 resize 이벤트 리스너가 등록된다', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');

      lastCleanup = makeMap(mockEl);

      expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('반환된 cleanup 함수 호출 시 resize 리스너가 제거된다', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener');

      const cleanup = makeMap(mockEl);
      cleanup();

      expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('onResize 핸들러', () => {
    it('InfoWindow가 닫혀있을 때 resize → updateMarkerIcon만 호출된다', () => {
      mockGetMap.mockReturnValue(null);
      lastCleanup = makeMap(mockEl);

      window.dispatchEvent(new Event('resize'));

      expect(mockUpdateMarkerIcon).toHaveBeenCalledWith(mockMarker);
      expect(mockClose).not.toHaveBeenCalled();
      expect(mockOpenIW).not.toHaveBeenCalled();
    });

    it('InfoWindow가 열려있을 때 resize → close 후 재오픈된다', () => {
      mockGetMap.mockReturnValue({} /* truthy */);
      lastCleanup = makeMap(mockEl);

      window.dispatchEvent(new Event('resize'));

      expect(mockUpdateMarkerIcon).toHaveBeenCalledWith(mockMarker);
      expect(mockClose).toHaveBeenCalledOnce();
      expect(mockOpenIW).toHaveBeenCalledWith(mockMapObj, mockMarker);
    });
  });
});

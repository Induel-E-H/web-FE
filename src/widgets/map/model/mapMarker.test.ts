import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeMapMarker, updateMarkerIcon } from './mapMarker';

const TEST_SVG = '<svg class="map__marker" viewBox="0 0 44 56"></svg>';

describe('mapMarker', () => {
  const mockSetIcon = vi.fn();
  const mockMarker = { setIcon: mockSetIcon };
  const mockGetCenter = vi
    .fn()
    .mockReturnValue({ lat: 35.13488, lng: 129.0968 });
  const mockMap = { getCenter: mockGetCenter };

  const MockSize = vi.fn().mockImplementation(function (w: number, h: number) {
    return { width: w, height: h };
  });
  const MockPoint = vi.fn().mockImplementation(function (x: number, y: number) {
    return { x, y };
  });
  const MockMarker = vi.fn().mockImplementation(function () {
    return mockMarker;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('naver', {
      maps: {
        Marker: MockMarker,
        Size: MockSize,
        Point: MockPoint,
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('makeMapMarker', () => {
    it('마커를 생성하고 반환한다', () => {
      const result = makeMapMarker(
        mockMap as unknown as naver.maps.Map,
        TEST_SVG,
      );

      expect(MockMarker).toHaveBeenCalledOnce();
      expect(result).toBe(mockMarker);
    });

    it('마커 위치로 지도 중심을 사용한다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);

      expect(mockGetCenter).toHaveBeenCalledOnce();
    });

    it('마커 아이콘 생성 시 Size가 계산된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);

      expect(MockSize).toHaveBeenCalledOnce();
    });

    it('마커 아이콘 생성 시 Point(anchor)가 계산된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);

      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('Marker 생성자에 position, map, icon이 전달된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);

      expect(MockMarker).toHaveBeenCalledWith(
        expect.objectContaining({
          position: expect.anything() as unknown,
          map: mockMap,
          icon: expect.objectContaining({
            content: TEST_SVG,
          }) as unknown,
        }),
      );
    });
  });

  describe('updateMarkerIcon', () => {
    it('마커의 setIcon이 호출된다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker, TEST_SVG);

      expect(mockSetIcon).toHaveBeenCalledOnce();
    });

    it('전달받은 SVG content가 setIcon에 전달된다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker, TEST_SVG);

      expect(mockSetIcon).toHaveBeenCalledWith(
        expect.objectContaining({ content: TEST_SVG }) as unknown,
      );
    });

    it('업데이트 시 Size와 Point가 재생성된다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker, TEST_SVG);

      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });
  });

  describe('브레이크포인트별 마커 사이즈', () => {
    function stubWindowSize(width: number, height: number) {
      vi.stubGlobal('innerWidth', width);
      vi.stubGlobal('innerHeight', height);
    }

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.stubGlobal('naver', {
        maps: { Marker: MockMarker, Size: MockSize, Point: MockPoint },
      });
    });

    it('모바일(width=375)에서 makeMapMarker가 정상 동작한다', () => {
      stubWindowSize(375, 812);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('태블릿(width=768)에서 makeMapMarker가 정상 동작한다', () => {
      stubWindowSize(768, 1024);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('데스크탑(width=1440)에서 makeMapMarker가 정상 동작한다', () => {
      stubWindowSize(1440, 900);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('모바일에서 vmin 기반으로 아이콘 크기가 계산된다', () => {
      stubWindowSize(375, 812);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      const [w, h] = MockSize.mock.calls[0] as [number, number];
      expect(w).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(w);
    });

    it('태블릿에서 vmin 기반으로 아이콘 크기가 계산된다', () => {
      stubWindowSize(768, 1024);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      const [w, h] = MockSize.mock.calls[0] as [number, number];
      expect(w).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(w);
    });

    it('데스크탑에서 vmax 기반으로 아이콘 크기가 계산된다', () => {
      // width=1920, height=1080: vmaxPx=19.2, iconW=round(2.292*19.2)=44
      stubWindowSize(1920, 1080);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      const [w] = MockSize.mock.calls[0] as [number, number];
      // vmin(minPx=1080) 기반이었다면 round(2.292*10.8)=25가 되어야 함
      // vmax(maxPx=1920) 기반이면 44 → 두 값이 다름으로 vmax 경로 확인
      expect(w).toBe(44);
    });

    it('anchorY가 iconH의 54/56 비율로 계산된다', () => {
      stubWindowSize(1920, 1080);
      makeMapMarker(mockMap as unknown as naver.maps.Map, TEST_SVG);
      const [, iconH] = MockSize.mock.calls[0] as [number, number];
      const [, anchorY] = MockPoint.mock.calls[0] as [number, number];
      expect(anchorY).toBe(Math.round((iconH * 54) / 56));
    });
  });
});

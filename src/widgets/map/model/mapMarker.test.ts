import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeMapMarker, updateMarkerIcon } from './mapMarker';

vi.mock('@assets/induel-icon.svg?raw', () => ({
  default: '<svg viewBox="0 0 649 748"><g /></svg>',
}));

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
      const result = makeMapMarker(mockMap as unknown as naver.maps.Map);

      expect(MockMarker).toHaveBeenCalledOnce();
      expect(result).toBe(mockMarker);
    });

    it('마커 위치로 지도 중심을 사용한다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map);

      expect(mockGetCenter).toHaveBeenCalledOnce();
    });

    it('마커 아이콘 생성 시 Size가 계산된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map);

      expect(MockSize).toHaveBeenCalledOnce();
    });

    it('마커 아이콘 생성 시 Point(anchor)가 계산된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map);

      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('Marker 생성자에 position, map, icon이 전달된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map);

      expect(MockMarker).toHaveBeenCalledWith(
        expect.objectContaining({
          position: expect.anything() as unknown,
          map: mockMap,
          icon: expect.objectContaining({
            content: expect.any(String) as unknown,
          }) as unknown,
        }),
      );
    });

    it('마커 SVG content에 map__marker 클래스가 포함된다', () => {
      makeMapMarker(mockMap as unknown as naver.maps.Map);

      const call = MockMarker.mock.calls[0][0] as { icon: { content: string } };
      expect(call.icon.content).toContain('map__marker');
    });
  });

  describe('updateMarkerIcon', () => {
    it('마커의 setIcon이 호출된다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker);

      expect(mockSetIcon).toHaveBeenCalledOnce();
    });

    it('새로운 아이콘 객체를 setIcon에 전달한다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker);

      expect(mockSetIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.any(String) as unknown,
        }) as unknown,
      );
    });

    it('업데이트 시 Size와 Point가 재생성된다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker);

      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('setIcon에 전달된 content가 map__marker SVG를 포함한다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker);

      const icon = mockSetIcon.mock.calls[0][0] as { content: string };
      expect(icon.content).toContain('map__marker');
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
      makeMapMarker(mockMap as unknown as naver.maps.Map);
      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('태블릿(width=768)에서 makeMapMarker가 정상 동작한다', () => {
      stubWindowSize(768, 1024);
      makeMapMarker(mockMap as unknown as naver.maps.Map);
      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('데스크탑(width=1440)에서 makeMapMarker가 정상 동작한다', () => {
      stubWindowSize(1440, 900);
      makeMapMarker(mockMap as unknown as naver.maps.Map);
      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });

    it('모바일에서 vmin 기반으로 아이콘 크기가 계산된다', () => {
      stubWindowSize(375, 812);
      makeMapMarker(mockMap as unknown as naver.maps.Map);
      const [w, h] = MockSize.mock.calls[0] as [number, number];
      expect(w).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(w);
    });

    it('태블릿에서 vmin 기반으로 아이콘 크기가 계산된다', () => {
      stubWindowSize(768, 1024);
      makeMapMarker(mockMap as unknown as naver.maps.Map);
      const [w, h] = MockSize.mock.calls[0] as [number, number];
      expect(w).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(w);
    });
  });
});

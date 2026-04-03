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
          position: expect.anything(),
          map: mockMap,
          icon: expect.objectContaining({ content: expect.any(String) }),
        }),
      );
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
        expect.objectContaining({ content: expect.any(String) }),
      );
    });

    it('업데이트 시 Size와 Point가 재생성된다', () => {
      updateMarkerIcon(mockMarker as unknown as naver.maps.Marker);

      expect(MockSize).toHaveBeenCalledOnce();
      expect(MockPoint).toHaveBeenCalledOnce();
    });
  });
});

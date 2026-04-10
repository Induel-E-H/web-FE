import { COMPANY } from '@shared/constant';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeInfoCard } from './mapInfoCard';

vi.mock('@assets/induel-icon.svg?raw', () => ({
  default: '<svg viewBox="0 0 649 748"><g /></svg>',
}));

describe('mapInfoCard', () => {
  const mockGetMap = vi.fn();
  const mockClose = vi.fn();
  const mockOpen = vi.fn();
  const mockInfoWindow = {
    getMap: mockGetMap,
    close: mockClose,
    open: mockOpen,
  };

  let capturedClickHandler: (() => void) | null = null;

  const MockInfoWindow = vi.fn().mockImplementation(function () {
    return mockInfoWindow;
  });
  const MockAddListener = vi
    .fn()
    .mockImplementation(
      (_marker: unknown, _event: string, handler: () => void) => {
        capturedClickHandler = handler;
      },
    );

  const mockMap = {} as naver.maps.Map;
  const mockMarker = {} as naver.maps.Marker;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedClickHandler = null;
    vi.stubGlobal('naver', {
      maps: {
        InfoWindow: MockInfoWindow,
        Event: { addListener: MockAddListener },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('makeInfoCard', () => {
    it('InfoWindow를 생성하고 반환한다', () => {
      const result = makeInfoCard(mockMap, mockMarker);

      expect(MockInfoWindow).toHaveBeenCalledOnce();
      expect(result).toBe(mockInfoWindow);
    });

    it('InfoWindow content에 회사 한글 이름이 포함된다', () => {
      makeInfoCard(mockMap, mockMarker);

      const content = (MockInfoWindow.mock.calls[0][0] as { content: string })
        .content;
      expect(content).toContain(COMPANY.NAME_KO);
    });

    it('InfoWindow content에 회사 영문 전체 명칭이 포함된다', () => {
      makeInfoCard(mockMap, mockMarker);

      const content = (MockInfoWindow.mock.calls[0][0] as { content: string })
        .content;
      expect(content).toContain('INDUEL ENGINEERING & HOLDINGS');
    });

    it('InfoWindow content에 전화번호 tel: 링크가 포함된다', () => {
      makeInfoCard(mockMap, mockMarker);

      const content = (MockInfoWindow.mock.calls[0][0] as { content: string })
        .content;
      expect(content).toContain(`tel:${COMPANY.PHONE}`);
      expect(content).toContain(COMPANY.PHONE_DISPLAY);
    });

    it('InfoWindow content에 회사 주소가 포함된다', () => {
      makeInfoCard(mockMap, mockMarker);

      const content = (MockInfoWindow.mock.calls[0][0] as { content: string })
        .content;
      expect(content).toContain(COMPANY.ADDRESS_FULL);
      expect(content).toContain(COMPANY.ADDRESS_SUB);
    });

    it('마커에 click 이벤트 리스너가 등록된다', () => {
      makeInfoCard(mockMap, mockMarker);

      expect(MockAddListener).toHaveBeenCalledWith(
        mockMarker,
        'click',
        expect.any(Function),
      );
    });

    it('InfoWindow에 borderWidth: 0이 설정된다', () => {
      makeInfoCard(mockMap, mockMarker);

      expect(MockInfoWindow).toHaveBeenCalledWith(
        expect.objectContaining({ borderWidth: 0 }),
      );
    });

    it('InfoWindow에 disableAnchor: true가 설정된다', () => {
      makeInfoCard(mockMap, mockMarker);

      expect(MockInfoWindow).toHaveBeenCalledWith(
        expect.objectContaining({ disableAnchor: true }),
      );
    });

    it('InfoWindow에 backgroundColor가 transparent로 설정된다', () => {
      makeInfoCard(mockMap, mockMarker);

      expect(MockInfoWindow).toHaveBeenCalledWith(
        expect.objectContaining({ backgroundColor: 'transparent' }),
      );
    });
  });

  describe('click 핸들러 토글', () => {
    it('InfoWindow가 열려있을 때 클릭하면 닫힌다', () => {
      mockGetMap.mockReturnValue({} /* truthy — 열려있음 */);
      makeInfoCard(mockMap, mockMarker);

      capturedClickHandler!();

      expect(mockClose).toHaveBeenCalledOnce();
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it('InfoWindow가 닫혀있을 때 클릭하면 열린다', () => {
      mockGetMap.mockReturnValue(null /* falsy — 닫혀있음 */);
      makeInfoCard(mockMap, mockMarker);

      capturedClickHandler!();

      expect(mockOpen).toHaveBeenCalledWith(mockMap, mockMarker);
      expect(mockClose).not.toHaveBeenCalled();
    });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeInfoCard } from './mapInfoCard';

const TEST_CONTENT = '<div class="map__info__card">test</div>';

describe('makeInfoCard', () => {
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

  it('InfoWindow를 생성하고 반환한다', () => {
    const result = makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

    expect(MockInfoWindow).toHaveBeenCalledOnce();
    expect(result).toBe(mockInfoWindow);
  });

  it('전달받은 content를 InfoWindow에 그대로 사용한다', () => {
    makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

    expect(MockInfoWindow).toHaveBeenCalledWith(
      expect.objectContaining({ content: TEST_CONTENT }),
    );
  });

  it('InfoWindow에 borderWidth: 0이 설정된다', () => {
    makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

    expect(MockInfoWindow).toHaveBeenCalledWith(
      expect.objectContaining({ borderWidth: 0 }),
    );
  });

  it('InfoWindow에 disableAnchor: true가 설정된다', () => {
    makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

    expect(MockInfoWindow).toHaveBeenCalledWith(
      expect.objectContaining({ disableAnchor: true }),
    );
  });

  it('InfoWindow에 backgroundColor가 transparent로 설정된다', () => {
    makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

    expect(MockInfoWindow).toHaveBeenCalledWith(
      expect.objectContaining({ backgroundColor: 'transparent' }),
    );
  });

  it('마커에 click 이벤트 리스너가 등록된다', () => {
    makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

    expect(MockAddListener).toHaveBeenCalledWith(
      mockMarker,
      'click',
      expect.any(Function),
    );
  });

  describe('click 핸들러 토글', () => {
    it('InfoWindow가 열려있을 때 클릭하면 닫힌다', () => {
      mockGetMap.mockReturnValue({});
      makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

      capturedClickHandler!();

      expect(mockClose).toHaveBeenCalledOnce();
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it('InfoWindow가 닫혀있을 때 클릭하면 열린다', () => {
      mockGetMap.mockReturnValue(null);
      makeInfoCard(mockMap, mockMarker, TEST_CONTENT);

      capturedClickHandler!();

      expect(mockOpen).toHaveBeenCalledWith(mockMap, mockMarker);
      expect(mockClose).not.toHaveBeenCalled();
    });
  });
});

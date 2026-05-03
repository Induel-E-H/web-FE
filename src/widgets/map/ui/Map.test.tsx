// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Map } from './Map';

const mockMakeMap = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../model/map', () => ({
  makeMap: mockMakeMap,
}));

type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

function setNaverMaps(available: boolean) {
  const w = window as unknown as NaverWindow;
  if (available) {
    w.naver = { maps: { Map: vi.fn() } };
  } else {
    delete w.naver;
  }
}

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setNaverMaps(true);
  });

  describe('시맨틱 구조', () => {
    it('section.map 요소가 렌더링된다', () => {
      const { container } = render(<Map />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('map');
    });

    it('section에 id="map" 속성이 있다', () => {
      const { container } = render(<Map />);

      expect(container.querySelector('section')).toHaveAttribute('id', 'map');
    });

    it('section에 aria-label="찾아오시는 길" 속성이 있다', () => {
      render(<Map />);

      expect(
        screen.getByRole('region', { name: '찾아오시는 길' }),
      ).toBeInTheDocument();
    });

    it('Naver 가용 상태에서 .map__content div에 aria-label 속성이 있다', () => {
      const { container } = render(<Map />);

      const mapContent = container.querySelector('div.map__content');
      expect(mapContent).toHaveAttribute(
        'aria-label',
        '인들이앤에이치 본사 위치 지도',
      );
    });
  });

  describe('useEffect — makeMap 호출', () => {
    it('마운트 시 makeMap이 호출된다', () => {
      render(<Map />);

      expect(mockMakeMap).toHaveBeenCalledOnce();
    });

    it('makeMap에 HTMLDivElement와 HTML/SVG 문자열이 전달된다', () => {
      render(<Map />);

      expect(mockMakeMap).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.any(String),
        expect.any(String),
      );
    });

    it('언마운트 시 makeMap의 cleanup 함수가 호출된다', () => {
      const mockCleanup = vi.fn();
      mockMakeMap.mockReturnValueOnce(mockCleanup);

      const { unmount } = render(<Map />);
      unmount();

      expect(mockCleanup).toHaveBeenCalledOnce();
    });

    it('언마운트 시 navermap_authFailure 콜백이 정리된다', () => {
      const w = window as unknown as NaverWindow;
      const { unmount } = render(<Map />);

      expect(w.navermap_authFailure).toBeTypeOf('function');
      unmount();
      expect(w.navermap_authFailure).toBeUndefined();
    });
  });

  describe('fallback — Naver Maps SDK 미로드', () => {
    it('naver.maps가 없으면 iframe fallback이 렌더링된다', () => {
      setNaverMaps(false);
      render(<Map />);

      expect(
        screen.getByTitle('인들이앤에이치 본사 위치 지도'),
      ).toBeInTheDocument();
      expect(mockMakeMap).not.toHaveBeenCalled();
    });

    it('naver.maps가 없으면 makeMap이 호출되지 않는다', () => {
      setNaverMaps(false);
      render(<Map />);

      expect(mockMakeMap).not.toHaveBeenCalled();
    });

    it('fallback iframe에 loading="lazy" 속성이 있다', () => {
      setNaverMaps(false);
      render(<Map />);

      expect(
        screen.getByTitle('인들이앤에이치 본사 위치 지도'),
      ).toHaveAttribute('loading', 'lazy');
    });

    it('fallback iframe에 map__content--fallback 클래스가 있다', () => {
      setNaverMaps(false);
      render(<Map />);

      expect(screen.getByTitle('인들이앤에이치 본사 위치 지도')).toHaveClass(
        'map__content--fallback',
      );
    });
  });

  describe('fallback — makeMap 실행 중 오류', () => {
    it('makeMap이 throw하면 iframe fallback이 렌더링된다', async () => {
      mockMakeMap.mockImplementationOnce(() => {
        throw new Error('map init failed');
      });

      render(<Map />);

      // queueMicrotask로 지연된 setState 완료를 기다림
      await waitFor(() => {
        expect(
          screen.getByTitle('인들이앤에이치 본사 위치 지도'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('loading 상태 — API 키 있음, SDK 미로드', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
      document
        .querySelectorAll('script[src*="oapi.map.naver.com"]')
        .forEach((el) => el.remove());
    });

    it('API 키가 있고 Naver SDK 미로드 시 div.map__content가 렌더링된다', () => {
      setNaverMaps(false);
      vi.stubEnv('VITE_NAVER_MAP_API_KEY', 'test-api-key');

      const { container } = render(<Map />);

      expect(container.querySelector('.map__content')).toBeInTheDocument();
      expect(
        screen.queryByTitle('인들이앤에이치 본사 위치 지도'),
      ).not.toBeInTheDocument();
    });

    it('API 키가 있고 Naver SDK 미로드 시 스크립트가 동적으로 삽입된다', () => {
      setNaverMaps(false);
      vi.stubEnv('VITE_NAVER_MAP_API_KEY', 'test-api-key');

      render(<Map />);

      const script = document.querySelector(
        'script[src*="oapi.map.naver.com"]',
      );
      expect(script).toBeInTheDocument();
      expect(script?.getAttribute('src')).toContain('test-api-key');
    });

    it('스크립트 로드 실패 시 iframe fallback이 렌더링된다', async () => {
      setNaverMaps(false);
      vi.stubEnv('VITE_NAVER_MAP_API_KEY', 'test-api-key');

      render(<Map />);

      const script = document.querySelector(
        'script[src*="oapi.map.naver.com"]',
      );

      script?.dispatchEvent(new Event('error'));

      await waitFor(() => {
        expect(
          screen.getByTitle('인들이앤에이치 본사 위치 지도'),
        ).toBeInTheDocument();
      });
    });

    it('스크립트 load 이벤트 후 Naver SDK가 없으면 fallback이 렌더링된다', async () => {
      setNaverMaps(false);
      vi.stubEnv('VITE_NAVER_MAP_API_KEY', 'test-api-key');

      render(<Map />);

      const script = document.querySelector(
        'script[src*="oapi.map.naver.com"]',
      );
      script?.dispatchEvent(new Event('load'));

      await waitFor(() => {
        expect(
          screen.getByTitle('인들이앤에이치 본사 위치 지도'),
        ).toBeInTheDocument();
      });
    });

    it('이미 스크립트가 있고 Naver SDK 미로드 시 load 이벤트를 기다린다', async () => {
      setNaverMaps(false);
      vi.stubEnv('VITE_NAVER_MAP_API_KEY', 'test-api-key');

      const existingScript = document.createElement('script');
      existingScript.src =
        'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=test-api-key';
      document.head.appendChild(existingScript);

      render(<Map />);

      existingScript.dispatchEvent(new Event('load'));

      await waitFor(() => {
        expect(
          screen.getByTitle('인들이앤에이치 본사 위치 지도'),
        ).toBeInTheDocument();
      });

      existingScript.remove();
    });
  });

  describe('fallback — 인증 실패 (401)', () => {
    it('navermap_authFailure 호출 시 iframe fallback이 렌더링된다', () => {
      const { rerender } = render(<Map />);

      const w = window as unknown as NaverWindow;
      w.navermap_authFailure?.();

      rerender(<Map />);

      expect(
        screen.getByTitle('인들이앤에이치 본사 위치 지도'),
      ).toBeInTheDocument();
    });

    it('마운트 시 navermap_authFailure 콜백이 등록된다', () => {
      const w = window as unknown as NaverWindow;
      render(<Map />);

      expect(w.navermap_authFailure).toBeTypeOf('function');
    });
  });
});

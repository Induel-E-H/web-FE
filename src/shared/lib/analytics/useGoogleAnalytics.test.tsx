import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGoogleAnalytics } from './useGoogleAnalytics';

const GA_ID = 'G-JMQZ9VKYZ6';

function TestComponent() {
  useGoogleAnalytics();
  return null;
}

describe('useGoogleAnalytics', () => {
  let mockScript: { src: string; async: boolean };
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    originalCreateElement = document.createElement.bind(document);
    mockScript = { src: '', async: false };

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'script') return mockScript as unknown as HTMLScriptElement;
      return originalCreateElement(tag);
    });
    appendChildSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as Partial<Window & typeof globalThis>).dataLayer;
    delete (window as Partial<Window & typeof globalThis>).gtag;
  });

  describe('마운트 시 script 태그 추가', () => {
    it('document.head.appendChild가 script 태그로 호출된다', () => {
      render(<TestComponent />);
      expect(appendChildSpy).toHaveBeenCalledWith(mockScript);
    });

    it('script src가 googletagmanager.com gtag/js URL 형식이다', () => {
      render(<TestComponent />);
      expect(mockScript.src).toContain(
        'https://www.googletagmanager.com/gtag/js',
      );
    });

    it('script src에 GA ID가 포함된다', () => {
      render(<TestComponent />);
      expect(mockScript.src).toContain(GA_ID);
    });

    it('script의 async 속성이 true이다', () => {
      render(<TestComponent />);
      expect(mockScript.async).toBe(true);
    });
  });

  describe('window 전역 설정', () => {
    it('window.dataLayer가 배열로 초기화된다', () => {
      render(<TestComponent />);
      expect(Array.isArray(window.dataLayer)).toBe(true);
    });

    it('window.gtag가 함수로 설정된다', () => {
      render(<TestComponent />);
      expect(typeof window.gtag).toBe('function');
    });

    it('window.gtag 호출 시 dataLayer에 항목이 추가된다', () => {
      render(<TestComponent />);
      const prevLength = window.dataLayer.length;
      window.gtag('event', 'test_event');
      expect(window.dataLayer.length).toBeGreaterThan(prevLength);
    });
  });
});

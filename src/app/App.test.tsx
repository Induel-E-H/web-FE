import { MemoryRouter } from 'react-router-dom';

import { trackBrowserLimited } from '@shared/lib/analytics';
import { getBrowserSupport } from '@shared/lib/browserCompat';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App';

vi.mock('@pages/home', () => ({ Home: () => <p>홈 페이지</p> }));
vi.mock('@pages/privacy-policy', () => ({
  PrivacyPolicy: () => <p>개인정보 처리방침 페이지</p>,
}));
vi.mock('@pages/not-found', () => ({ NotFound: () => <p>404 페이지</p> }));
vi.mock('@shared/lib/analytics', () => ({
  useGoogleAnalytics: vi.fn(),
  trackBrowserLimited: vi.fn(),
}));
vi.mock('@shared/lib/browserCompat', () => ({
  getBrowserSupport: vi.fn(() => 'full'),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBrowserSupport).mockReturnValue('full');
  });

  describe('라우팅', () => {
    it.each([
      ['/', '홈 페이지'],
      ['/privacy_policy', '개인정보 처리방침 페이지'],
      ['/unknown', '404 페이지'],
    ])('%s 경로는 %s를 렌더링한다', (path, text) => {
      renderAt(path);
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe('브라우저 지원 이벤트', () => {
    it('제한 지원 브라우저면 trackBrowserLimited를 기록한다', () => {
      vi.mocked(getBrowserSupport).mockReturnValue('limited');
      renderAt('/');
      expect(trackBrowserLimited).toHaveBeenCalledTimes(1);
    });

    it('완전 지원 브라우저면 기록하지 않는다', () => {
      renderAt('/');
      expect(trackBrowserLimited).not.toHaveBeenCalled();
    });
  });
});

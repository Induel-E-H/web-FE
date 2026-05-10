import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UnsupportedBrowser } from './UnsupportedBrowser';

vi.mock('@shared/lib/analytics', () => ({
  initGA: vi.fn(),
  trackBrowserUnsupported: vi.fn(),
}));

describe('UnsupportedBrowser', () => {
  describe('헤딩 및 안내 메시지', () => {
    it('h1 제목이 렌더링된다', () => {
      render(<UnsupportedBrowser />);
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: '브라우저 업데이트가 필요합니다',
        }),
      ).toBeInTheDocument();
    });

    it('"Chrome 90+" 버전 항목이 표시된다', () => {
      render(<UnsupportedBrowser />);
      expect(screen.getByText('Chrome 90+')).toBeInTheDocument();
    });
  });

  describe('버전 지원 안내', () => {
    it('완전 지원 항목이 표시된다', () => {
      render(<UnsupportedBrowser />);
      expect(screen.getByText('완전 지원')).toBeInTheDocument();
    });

    it('제한 지원 항목이 표시된다', () => {
      render(<UnsupportedBrowser />);
      expect(screen.getByText('제한 지원')).toBeInTheDocument();
    });

    it('미지원 항목이 표시된다', () => {
      render(<UnsupportedBrowser />);
      expect(screen.getByText('미지원')).toBeInTheDocument();
    });
  });

  describe('Chrome 다운로드 링크', () => {
    it('다운로드 링크가 렌더링된다', () => {
      render(<UnsupportedBrowser />);
      expect(
        screen.getByRole('link', { name: 'Chrome 최신 버전 다운로드' }),
      ).toBeInTheDocument();
    });

    it('링크가 google.com/chrome/ 를 가리킨다', () => {
      render(<UnsupportedBrowser />);
      const link = screen.getByRole('link', {
        name: 'Chrome 최신 버전 다운로드',
      });
      expect(link).toHaveAttribute('href', 'https://www.google.com/chrome/');
    });

    it('링크가 새 탭에서 열린다', () => {
      render(<UnsupportedBrowser />);
      const link = screen.getByRole('link', {
        name: 'Chrome 최신 버전 다운로드',
      });
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('링크에 rel="noopener noreferrer" 가 있다', () => {
      render(<UnsupportedBrowser />);
      const link = screen.getByRole('link', {
        name: 'Chrome 최신 버전 다운로드',
      });
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});

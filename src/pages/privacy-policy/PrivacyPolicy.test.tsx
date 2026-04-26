import { MemoryRouter } from 'react-router-dom';

import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrivacyPolicy } from './PrivacyPolicy';

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@widgets/header', () => ({
  Header: () => <header data-testid='header' />,
}));

vi.mock('@widgets/footer', () => ({
  Footer: () => <footer data-testid='footer' />,
}));

vi.mock('react-icons/fi', () => ({
  FiDatabase: () => <svg data-testid='icon-database' />,
  FiClock: () => <svg data-testid='icon-clock' />,
  FiShare2: () => <svg data-testid='icon-share' />,
  FiTruck: () => <svg data-testid='icon-truck' />,
  FiTrash2: () => <svg data-testid='icon-trash' />,
  FiHome: () => <svg data-testid='icon-home' />,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <PrivacyPolicy />
    </MemoryRouter>,
  );
}

describe('PrivacyPolicy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  describe('페이지 진입 동작', () => {
    it('마운트 시 window.scrollTo(0, 0)이 호출된다', () => {
      renderPage();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('시맨틱 구조', () => {
    it('최상위 요소에 privacy-policy 클래스가 있다', () => {
      const { container } = renderPage();
      expect(container.querySelector('.privacy-policy')).toBeInTheDocument();
    });

    it('Header가 렌더링된다', () => {
      renderPage();
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('main 요소가 렌더링된다', () => {
      renderPage();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('Footer가 렌더링된다', () => {
      renderPage();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Hero 섹션', () => {
    it('페이지 제목 "개인정보처리방침"이 표시된다', () => {
      renderPage();
      expect(
        screen.getByRole('heading', { level: 1, name: '개인정보처리방침' }),
      ).toBeInTheDocument();
    });

    it('시행일이 표시된다', () => {
      renderPage();
      expect(screen.getByText(/시행일/)).toBeInTheDocument();
    });

    it('인트로 문구에 회사명이 포함된다', () => {
      const { container } = renderPage();
      const intro = container.querySelector('.privacy-policy__intro');
      expect(intro?.textContent).toMatch(/인들이앤에이치/);
    });
  });

  describe('주요 개인정보 처리 표시 (highlights)', () => {
    it('aria-label "주요 개인정보 처리 표시" 섹션이 렌더링된다', () => {
      renderPage();
      expect(
        screen.getByRole('region', { name: '주요 개인정보 처리 표시' }),
      ).toBeInTheDocument();
    });

    it('수집 항목 카드가 표시된다', () => {
      renderPage();
      expect(screen.getByText('수집 항목')).toBeInTheDocument();
    });

    it('보유 기간 카드가 표시된다', () => {
      renderPage();
      expect(screen.getByText('보유 기간')).toBeInTheDocument();
    });

    it('제3자 제공 카드가 표시된다', () => {
      renderPage();
      expect(screen.getByText('제3자 제공')).toBeInTheDocument();
    });

    it('처리 위탁 카드가 표시된다', () => {
      renderPage();
      expect(screen.getByText('처리 위탁')).toBeInTheDocument();
    });

    it('파기 방법 카드가 표시된다', () => {
      renderPage();
      expect(screen.getByText('파기 방법')).toBeInTheDocument();
    });
  });

  describe('목차 (TOC)', () => {
    it('aria-label "목차" nav가 렌더링된다', () => {
      renderPage();
      expect(
        screen.getByRole('navigation', { name: '목차' }),
      ).toBeInTheDocument();
    });

    it('목차 항목이 15개 렌더링된다', () => {
      renderPage();
      const toc = screen.getByRole('navigation', { name: '목차' });
      const links = toc.querySelectorAll('a');
      expect(links).toHaveLength(15);
    });

    it('각 목차 링크가 해당 section id를 가리킨다', () => {
      renderPage();
      const toc = screen.getByRole('navigation', { name: '목차' });
      const links = toc.querySelectorAll('a');
      links.forEach((link, index) => {
        expect(link).toHaveAttribute('href', `#section-${index + 1}`);
      });
    });

    it('첫 번째 목차 링크에 "처리 목적"이 포함된다', () => {
      renderPage();
      const toc = screen.getByRole('navigation', { name: '목차' });
      const firstLink = toc.querySelector('a');
      expect(firstLink?.textContent).toMatch(/처리 목적/);
    });
  });

  describe('본문 articles', () => {
    it('article이 15개 렌더링된다', () => {
      const { container } = renderPage();
      const articles = container.querySelectorAll(
        'article.privacy-policy__article',
      );
      expect(articles).toHaveLength(15);
    });

    it('각 article에 section-N id가 있다', () => {
      const { container } = renderPage();
      for (let i = 1; i <= 15; i++) {
        expect(container.querySelector(`#section-${i}`)).toBeInTheDocument();
      }
    });

    it('제 1조 본문 제목이 표시된다', () => {
      const { container } = renderPage();
      const heading = container.querySelector(
        '#section-1 .privacy-policy__article-title',
      );
      expect(heading?.textContent).toMatch(/제 1조.*처리 목적/);
    });

    it('개인정보 보호책임자 섹션에 담당자 정보가 표시된다', () => {
      renderPage();
      expect(screen.getAllByText(COMPANY.CEO).length).toBeGreaterThan(0);
    });

    it('연락처 섹션에 이메일이 표시된다', () => {
      renderPage();
      expect(screen.getAllByText(COMPANY.EMAIL).length).toBeGreaterThan(0);
    });
  });

  describe('메인 페이지로 돌아가기 버튼', () => {
    it('버튼이 렌더링된다', () => {
      renderPage();
      expect(
        screen.getByRole('button', { name: /메인 페이지로 돌아가기/ }),
      ).toBeInTheDocument();
    });

    it('버튼 클릭 시 "/" 로 navigate한다', async () => {
      renderPage();
      await userEvent.click(
        screen.getByRole('button', { name: /메인 페이지로 돌아가기/ }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

import { MemoryRouter } from 'react-router-dom';

import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Footer } from './Footer';

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );
}

describe('Footer', () => {
  describe('회사 정보 표시', () => {
    it('회사 한글 이름이 표시된다', () => {
      renderFooter();
      expect(screen.getByText(`(주) ${COMPANY.NAME_KO}`)).toBeInTheDocument();
    });

    it('회사 영문 풀네임이 표시된다', () => {
      renderFooter();
      expect(screen.getAllByText(COMPANY.NAME_EN_FULL).length).toBeGreaterThan(
        0,
      );
    });

    it('대표자 이름이 표시된다', () => {
      renderFooter();
      expect(screen.getByText(COMPANY.CEO)).toBeInTheDocument();
    });

    it('사업자 등록 번호가 표시된다', () => {
      renderFooter();
      expect(screen.getByText(COMPANY.BUSINESS_NO)).toBeInTheDocument();
    });
  });

  describe('연락처 표시', () => {
    it('전화번호가 표시 형식으로 렌더링된다', () => {
      renderFooter();
      expect(screen.getByText(COMPANY.PHONE_DISPLAY)).toBeInTheDocument();
    });

    it('팩스 번호가 표시된다', () => {
      renderFooter();
      expect(screen.getByText(COMPANY.FAX)).toBeInTheDocument();
    });

    it('이메일 주소가 표시된다', () => {
      renderFooter();
      expect(screen.getByText(COMPANY.EMAIL)).toBeInTheDocument();
    });
  });

  describe('주소 표시', () => {
    it('전체 주소가 표시된다', () => {
      renderFooter();
      expect(screen.getByText(COMPANY.ADDRESS_FULL)).toBeInTheDocument();
    });
  });

  describe('저작권 표시', () => {
    const foundedYear = new Date(COMPANY.ESTABLISHED).getFullYear();
    const currentYear = new Date().getFullYear();

    it('저작권 문구에 창립 연도가 포함된다', () => {
      renderFooter();
      expect(
        screen.getByText((_, element) => {
          return (
            element?.tagName === 'P' &&
            (element.textContent ?? '').includes(String(foundedYear))
          );
        }),
      ).toBeInTheDocument();
    });

    it('저작권 문구에 현재 연도가 포함된다', () => {
      renderFooter();
      expect(
        screen.getByText((_, element) => {
          return (
            element?.tagName === 'P' &&
            (element.textContent ?? '').includes(String(currentYear))
          );
        }),
      ).toBeInTheDocument();
    });

    it('저작권 문구에 회사 영문 풀네임과 All rights reserved가 포함된다', () => {
      renderFooter();
      expect(
        screen.getByText((_, element) => {
          return (
            element?.tagName === 'P' &&
            (element.textContent ?? '').includes(COMPANY.NAME_EN_FULL) &&
            (element.textContent ?? '').includes('All rights reserved')
          );
        }),
      ).toBeInTheDocument();
    });
  });

  describe('시맨틱 구조', () => {
    it('최상위 요소가 footer로 렌더링된다', () => {
      const { container } = renderFooter();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('footer 요소에 footer 클래스가 있다', () => {
      const { container } = renderFooter();
      expect(container.querySelector('footer')).toHaveClass('footer');
    });
  });

  describe('개인정보처리방침 버튼', () => {
    it('개인정보처리방침 버튼이 렌더링된다', () => {
      renderFooter();
      expect(
        screen.getByRole('button', { name: '개인정보처리방침' }),
      ).toBeInTheDocument();
    });

    it('개인정보처리방침 버튼 클릭 시 /privacy_policy로 이동한다', async () => {
      renderFooter();
      await userEvent.click(
        screen.getByRole('button', { name: '개인정보처리방침' }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/privacy_policy');
    });
  });
});

import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Footer } from './Footer';

describe('Footer', () => {
  describe('회사 정보 표시', () => {
    it('회사 영문 약칭이 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.NAME_EN)).toBeInTheDocument();
    });

    it('회사 한글 이름이 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.NAME_KO)).toBeInTheDocument();
    });

    it('회사 영문 풀네임이 표시된다', () => {
      render(<Footer />);

      expect(screen.getAllByText(COMPANY.NAME_EN_FULL).length).toBeGreaterThan(
        0,
      );
    });

    it('대표자 이름이 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.CEO)).toBeInTheDocument();
    });

    it('사업자 등록 번호가 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.BUSINESS_NO)).toBeInTheDocument();
    });
  });

  describe('연락처 표시', () => {
    it('전화번호가 표시 형식으로 렌더링된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.PHONE_DISPLAY)).toBeInTheDocument();
    });

    it('전화번호 링크가 tel: 프로토콜로 연결된다', () => {
      render(<Footer />);

      const telLink = screen.getByRole('link', { name: COMPANY.PHONE_DISPLAY });
      expect(telLink).toHaveAttribute('href', `tel:${COMPANY.PHONE}`);
    });

    it('팩스 번호가 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.FAX)).toBeInTheDocument();
    });

    it('이메일 주소가 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.EMAIL)).toBeInTheDocument();
    });

    it('이메일 링크가 mailto: 프로토콜로 연결된다', () => {
      render(<Footer />);

      const mailLink = screen.getByRole('link', { name: COMPANY.EMAIL });
      expect(mailLink).toHaveAttribute('href', `mailto:${COMPANY.EMAIL}`);
    });
  });

  describe('주소 표시', () => {
    it('전체 주소가 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText(COMPANY.ADDRESS_FULL)).toBeInTheDocument();
    });
  });

  describe('저작권 표시', () => {
    it('저작권 문구에 회사 영문 풀네임이 포함된다', () => {
      render(<Footer />);

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

  describe('React Compiler 메모이제이션 캐시 히트', () => {
    it('재렌더링 시에도 동일한 UI가 유지된다 (캐시 히트 분기 커버)', () => {
      const { rerender } = render(<Footer />);

      rerender(<Footer />);

      expect(screen.getByText(COMPANY.NAME_EN)).toBeInTheDocument();
      expect(screen.getByText(COMPANY.NAME_KO)).toBeInTheDocument();
    });
  });

  describe('시맨틱 구조', () => {
    it('최상위 요소가 footer로 렌더링된다', () => {
      const { container } = render(<Footer />);

      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('footer 요소에 footer 클래스가 있다', () => {
      const { container } = render(<Footer />);

      expect(container.querySelector('footer')).toHaveClass('footer');
    });

    it('Contact 섹션 제목이 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('Address 섹션 제목이 표시된다', () => {
      render(<Footer />);

      expect(screen.getByText('Address')).toBeInTheDocument();
    });

    it('address 요소가 3개 렌더링된다', () => {
      const { container } = render(<Footer />);

      expect(container.querySelectorAll('address')).toHaveLength(3);
    });
  });
});

import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Hero from './Hero';

// Three.js 의존성을 가진 HeroBackground를 격리
vi.mock('./HeroBackground', () => ({
  default: () => <canvas aria-hidden='true' />,
}));

describe('Hero', () => {
  describe('회사 정보 표시', () => {
    it('회사 로고가 올바른 alt 텍스트로 렌더링된다', () => {
      render(<Hero />);

      expect(screen.getByAltText('인들이앤에이치 로고')).toBeInTheDocument();
    });

    it('로고 이미지에 src 속성이 존재한다', () => {
      render(<Hero />);

      const logo = screen.getByAltText('인들이앤에이치 로고');
      expect(logo).toHaveAttribute('src');
      expect(logo.getAttribute('src')).not.toBe('');
    });

    it('회사 한글 이름이 h1 요소로 표시된다', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(`(주) ${COMPANY.NAME_KO}`);
    });

    it('회사 영문 풀네임이 표시된다', () => {
      render(<Hero />);

      expect(screen.getByText(COMPANY.NAME_EN_FULL)).toBeInTheDocument();
    });

    it('설립일이 올바른 dateTime 속성과 함께 표시된다', () => {
      render(<Hero />);

      const timeEl = screen.getByText(`SINCE ${COMPANY.ESTABLISHED_DISPLAY}`, {
        exact: false,
      });
      expect(timeEl).toBeInTheDocument();
      expect(timeEl.tagName).toBe('TIME');
      expect(timeEl).toHaveAttribute('dateTime', COMPANY.ESTABLISHED);
    });
  });

  describe('시맨틱 구조', () => {
    it('최상위 요소가 section으로 렌더링된다', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('hero');
    });

    it('HeroBackground canvas가 렌더링된다', () => {
      const { container } = render(<Hero />);

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  describe('환경별 분기', () => {
    it('비프로덕션 환경에서 개발 중 안내 문구가 표시된다', () => {
      render(<Hero />);

      expect(screen.getByText('현재 개발중입니다!')).toBeInTheDocument();
    });

    // production 분기 테스트는 Hero.prod.test.tsx에서 수행
    // (V8 커버리지가 모듈 레벨 상수의 분기를 추적하려면 모듈 최초 로드 시 환경이 설정되어야 함)
  });
});

import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Hero } from './Hero';

const HeroBackgroundMock = vi.hoisted(() =>
  vi.fn(() => <canvas aria-hidden='true' />),
);
vi.mock('./HeroBackground', () => ({ default: HeroBackgroundMock }));

vi.mock('react-icons/io', () => ({
  IoIosArrowDown: (props: Record<string, unknown>) => (
    <svg data-testid='arrow-down-icon' {...props} />
  ),
}));

afterEach(() => {
  import.meta.env.MODE = 'test';
});

describe('Hero', () => {
  describe('회사 정보 표시', () => {
    it('회사 로고가 올바른 alt 텍스트로 렌더링된다', () => {
      render(<Hero showScrollArrow={false} />);

      expect(screen.getByAltText('인들이앤에이치 로고')).toBeInTheDocument();
    });

    it('로고 이미지에 src 속성이 존재한다', () => {
      render(<Hero showScrollArrow={false} />);

      const logo = screen.getByAltText('인들이앤에이치 로고');
      expect(logo).toHaveAttribute('src');
      expect(logo.getAttribute('src')).not.toBe('');
    });

    it('로고 이미지에 hero__logo 클래스가 적용된다', () => {
      render(<Hero showScrollArrow={false} />);

      expect(screen.getByAltText('인들이앤에이치 로고')).toHaveClass(
        'hero__logo',
      );
    });

    it('회사 한글 이름이 h1 요소로 표시된다', () => {
      render(<Hero showScrollArrow={false} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(`(주) ${COMPANY.NAME_KO}`);
    });

    it('회사 영문 풀네임이 표시된다', () => {
      render(<Hero showScrollArrow={false} />);

      expect(screen.getByText(COMPANY.NAME_EN_FULL)).toBeInTheDocument();
    });

    it('설립일이 올바른 dateTime 속성과 함께 표시된다', () => {
      render(<Hero showScrollArrow={false} />);

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
      const { container } = render(<Hero showScrollArrow={false} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('hero');
    });

    it('HeroBackground canvas가 렌더링된다', () => {
      const { container } = render(<Hero showScrollArrow={false} />);

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('회사명과 영문명이 hgroup으로 묶인다', () => {
      const { container } = render(<Hero showScrollArrow={false} />);

      const hgroup = container.querySelector('hgroup');
      expect(hgroup).toBeInTheDocument();
      expect(hgroup?.querySelector('h1')).toBeInTheDocument();
      expect(hgroup?.querySelector('p')).toBeInTheDocument();
    });

    it('설립일 time 요소는 hgroup 밖에 위치한다', () => {
      const { container } = render(<Hero showScrollArrow={false} />);

      const hgroup = container.querySelector('hgroup');
      expect(hgroup?.querySelector('time')).not.toBeInTheDocument();
      expect(container.querySelector('time')).toBeInTheDocument();
    });
  });

  describe('showScrollArrow 분기', () => {
    it('false일 때 개발 중 안내 문구가 표시된다', () => {
      render(<Hero showScrollArrow={false} />);

      expect(screen.getByText('현재 개발중입니다!')).toBeInTheDocument();
    });

    it('true일 때 하단 화살표 아이콘이 렌더링된다', () => {
      render(<Hero showScrollArrow={true} />);

      expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
    });

    it('true일 때 개발 문구는 표시되지 않는다', () => {
      render(<Hero showScrollArrow={true} />);

      expect(screen.queryByText('현재 개발중입니다!')).not.toBeInTheDocument();
    });

    it('화살표 아이콘에 hero__down-icon 클래스가 적용된다', () => {
      render(<Hero showScrollArrow={true} />);

      expect(screen.getByTestId('arrow-down-icon')).toHaveClass(
        'hero__down-icon',
      );
    });

    it('화살표 아이콘은 스크린 리더에서 숨겨진다', () => {
      render(<Hero showScrollArrow={true} />);

      expect(screen.getByTestId('arrow-down-icon')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });
});

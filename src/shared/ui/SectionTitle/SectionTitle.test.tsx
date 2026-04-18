import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  describe('label', () => {
    it('label 텍스트가 렌더링된다', () => {
      render(<SectionTitle label='AWARD' headings='수상 기록' />);
      expect(screen.getByText('AWARD')).toBeInTheDocument();
    });

    it('hr 구분선이 렌더링된다', () => {
      const { container } = render(
        <SectionTitle label='AWARD' headings='수상 기록' />,
      );
      expect(container.querySelector('hr')).toBeInTheDocument();
    });
  });

  describe('headings — 단일 문자열', () => {
    it('h2가 하나 렌더링된다', () => {
      render(<SectionTitle label='AWARD' headings='수상 기록' />);
      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('수상 기록');
    });
  });

  describe('headings — 튜플', () => {
    it('h2가 두 개 렌더링된다', () => {
      render(
        <SectionTitle
          label='PATENTS'
          headings={['특허 취득 기록', '혁신의 증명']}
        />,
      );
      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('특허 취득 기록');
      expect(headings[1]).toHaveTextContent('혁신의 증명');
    });
  });

  describe('className', () => {
    it('className이 없으면 section-title만 적용된다', () => {
      const { container } = render(
        <SectionTitle label='AWARD' headings='수상 기록' />,
      );
      expect(container.firstChild).toHaveClass('section-title');
    });

    it('className을 전달하면 section-title과 함께 적용된다', () => {
      const { container } = render(
        <SectionTitle
          label='AWARD'
          headings='수상 기록'
          className='award__title'
        />,
      );
      const root = container.firstChild;
      expect(root).toHaveClass('section-title');
      expect(root).toHaveClass('award__title');
    });
  });

  describe('ref', () => {
    it('ref가 hgroup 요소에 연결된다', () => {
      const ref = createRef<HTMLElement>();
      const { container } = render(
        <SectionTitle label='AWARD' headings='수상 기록' ref={ref} />,
      );
      expect(ref.current).toBe(container.querySelector('hgroup'));
    });
  });

  describe('시맨틱 구조', () => {
    it('루트 요소가 hgroup이다', () => {
      const { container } = render(
        <SectionTitle label='AWARD' headings='수상 기록' />,
      );
      expect(container.querySelector('hgroup')).toBeInTheDocument();
    });
  });
});

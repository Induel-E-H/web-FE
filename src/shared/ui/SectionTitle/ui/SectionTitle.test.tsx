import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  describe('label', () => {
    it('label 텍스트가 렌더링된다', () => {
      render(<SectionTitle subTitle='AWARD' title='수상 기록' />);
      expect(screen.getByText('AWARD')).toBeInTheDocument();
    });

    it('hr 구분선이 렌더링된다', () => {
      const { container } = render(
        <SectionTitle subTitle='AWARD' title='수상 기록' />,
      );
      expect(container.querySelector('hr')).toBeInTheDocument();
    });
  });

  describe('title', () => {
    it('h2가 하나 렌더링된다', () => {
      render(<SectionTitle subTitle='AWARD' title='수상 기록' />);
      const title = screen.getAllByRole('heading', { level: 2 });
      expect(title).toHaveLength(1);
      expect(title[0]).toHaveTextContent('수상 기록');
    });
  });

  describe('className', () => {
    it('className이 없으면 section-title만 적용된다', () => {
      const { container } = render(
        <SectionTitle subTitle='AWARD' title='수상 기록' />,
      );
      expect(container.firstChild).toHaveClass('section-title');
    });

    it('className을 전달하면 section-title과 함께 적용된다', () => {
      const { container } = render(
        <SectionTitle
          subTitle='AWARD'
          title='수상 기록'
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
      let refElement: HTMLElement | null = null;
      const { container } = render(
        <SectionTitle
          subTitle='AWARD'
          title='수상 기록'
          ref={(el: HTMLElement | null) => {
            refElement = el;
          }}
        />,
      );
      expect(refElement).toBe(container.querySelector('hgroup'));
    });
  });

  describe('시맨틱 구조', () => {
    it('루트 요소가 hgroup이다', () => {
      const { container } = render(
        <SectionTitle subTitle='AWARD' title='수상 기록' />,
      );
      expect(container.querySelector('hgroup')).toBeInTheDocument();
    });
  });

  describe('variant', () => {
    it('variant를 전달하지 않으면 section-title--reverse 클래스가 없다', () => {
      const { container } = render(
        <SectionTitle subTitle='AWARD' title='수상 기록' />,
      );
      expect(container.firstChild).not.toHaveClass('section-title--reverse');
    });

    it('variant="default"이면 section-title--reverse 클래스가 없다', () => {
      const { container } = render(
        <SectionTitle subTitle='AWARD' title='수상 기록' variant='default' />,
      );
      expect(container.firstChild).not.toHaveClass('section-title--reverse');
    });

    it('variant="reverse"이면 section-title--reverse 클래스가 적용된다', () => {
      const { container } = render(
        <SectionTitle subTitle='AWARD' title='수상 기록' variant='reverse' />,
      );
      expect(container.firstChild).toHaveClass('section-title--reverse');
    });

    it('variant="reverse"와 className을 함께 전달하면 두 클래스가 모두 적용된다', () => {
      const { container } = render(
        <SectionTitle
          subTitle='AWARD'
          title='수상 기록'
          variant='reverse'
          className='award__title'
        />,
      );
      const root = container.firstChild;
      expect(root).toHaveClass('section-title--reverse');
      expect(root).toHaveClass('award__title');
    });
  });
});

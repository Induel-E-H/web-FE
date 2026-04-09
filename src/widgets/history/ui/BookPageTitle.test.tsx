import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookPageTitle } from './BookPageTitle';

describe('BookPageTitle', () => {
  describe('렌더링', () => {
    it('title이 h3로 렌더링된다', () => {
      render(<BookPageTitle title='List' />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'List',
      );
    });

    it('hr 요소는 aria-hidden=true이다', () => {
      const { container } = render(<BookPageTitle title='List' />);
      const hrs = container.querySelectorAll('hr');
      hrs.forEach((hr) => {
        expect(hr).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('hr이 2개 렌더링된다', () => {
      const { container } = render(<BookPageTitle title='List' />);
      expect(container.querySelectorAll('hr')).toHaveLength(2);
    });
  });

  describe('hidden prop', () => {
    it('hidden이 없으면 --hidden 클래스가 없다', () => {
      const { container } = render(<BookPageTitle title='List' />);
      expect(container.firstChild).not.toHaveClass('book-page-title--hidden');
    });

    it('hidden=true이면 --hidden 클래스가 추가된다', () => {
      const { container } = render(<BookPageTitle title='List' hidden />);
      expect(container.firstChild).toHaveClass('book-page-title--hidden');
    });

    it('hidden=false이면 --hidden 클래스가 없다', () => {
      const { container } = render(
        <BookPageTitle title='List' hidden={false} />,
      );
      expect(container.firstChild).not.toHaveClass('book-page-title--hidden');
    });
  });

  describe('hrWidth prop', () => {
    it('hrWidth가 없으면 CSS 커스텀 프로퍼티가 설정되지 않는다', () => {
      const { container } = render(<BookPageTitle title='List' />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--title-hr-width')).toBe('');
    });

    it('hrWidth prop이 있으면 CSS 커스텀 프로퍼티가 설정된다', () => {
      const { container } = render(
        <BookPageTitle title='List' hrWidth='50%' />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--title-hr-width')).toBe('50%');
    });
  });
});

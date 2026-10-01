import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookPageTitle } from './PageTitle';

describe('BookPageTitle', () => {
  describe('렌더링', () => {
    it('한글 label이 h3로 렌더링된다', () => {
      render(<BookPageTitle title='List' label='목차' />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        '목차',
      );
    });

    it('영문 title이 h3 아래 영어 문단으로 렌더링된다', () => {
      render(<BookPageTitle title='List' label='목차' />);
      const en = screen.getByText('List');
      expect(en.tagName).toBe('P');
      expect(en).toHaveAttribute('lang', 'en');
    });

    it('양옆 장식 줄은 aria-hidden=true이다', () => {
      const { container } = render(<BookPageTitle title='List' label='목차' />);
      const decorations = container.querySelectorAll('.book-page-title__line');
      expect(decorations).toHaveLength(2);
      decorations.forEach((el) => {
        expect(el).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('hidden prop', () => {
    it('hidden이 없으면 --hidden 클래스가 없다', () => {
      const { container } = render(<BookPageTitle title='List' label='목차' />);
      expect(container.firstChild).not.toHaveClass('book-page-title--hidden');
    });

    it('hidden=true이면 --hidden 클래스가 추가된다', () => {
      const { container } = render(
        <BookPageTitle title='List' label='목차' hidden />,
      );
      expect(container.firstChild).toHaveClass('book-page-title--hidden');
    });
  });
});

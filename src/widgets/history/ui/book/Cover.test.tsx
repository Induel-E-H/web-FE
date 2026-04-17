import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookCover } from './Cover';

describe('BookCover', () => {
  describe('side prop', () => {
    it('side="left"이면 history__book-cover-left 클래스를 가진다', () => {
      const { container } = render(<BookCover side='left' />);
      expect(
        container.querySelector('.history__book-cover-left'),
      ).toBeInTheDocument();
    });

    it('side="right"이면 history__book-cover-right 클래스를 가진다', () => {
      const { container } = render(<BookCover side='right' />);
      expect(
        container.querySelector('.history__book-cover-right'),
      ).toBeInTheDocument();
    });
  });

  describe('isHidden prop', () => {
    it('isHidden=true이면 history__book-cover--hidden 클래스를 가진다', () => {
      const { container } = render(<BookCover side='left' isHidden={true} />);
      expect(container.firstChild).toHaveClass('history__book-cover--hidden');
    });

    it('isHidden 기본값(false)이면 history__book-cover--hidden 클래스가 없다', () => {
      const { container } = render(<BookCover side='left' />);
      expect(container.firstChild).not.toHaveClass(
        'history__book-cover--hidden',
      );
    });

    it('isHidden=false이면 history__book-cover--hidden 클래스가 없다', () => {
      const { container } = render(<BookCover side='right' isHidden={false} />);
      expect(container.firstChild).not.toHaveClass(
        'history__book-cover--hidden',
      );
    });
  });

  describe('spine 구조', () => {
    it('side="left"이면 spine-left 요소가 렌더링된다', () => {
      const { container } = render(<BookCover side='left' />);
      expect(
        container.querySelector('.history__book-cover-center-spine-left'),
      ).toBeInTheDocument();
    });

    it('side="left"이면 spine-right 요소가 렌더링되지 않는다', () => {
      const { container } = render(<BookCover side='left' />);
      expect(
        container.querySelector('.history__book-cover-center-spine-right'),
      ).not.toBeInTheDocument();
    });

    it('side="right"이면 spine-right 요소가 렌더링된다', () => {
      const { container } = render(<BookCover side='right' />);
      expect(
        container.querySelector('.history__book-cover-center-spine-right'),
      ).toBeInTheDocument();
    });

    it('side="right"이면 spine-left 요소가 렌더링되지 않는다', () => {
      const { container } = render(<BookCover side='right' />);
      expect(
        container.querySelector('.history__book-cover-center-spine-left'),
      ).not.toBeInTheDocument();
    });

    it('spine-center는 항상 렌더링된다', () => {
      const { container: left } = render(<BookCover side='left' />);
      const { container: right } = render(<BookCover side='right' />);
      expect(
        left.querySelector('.history__book-cover-center-spine-center'),
      ).toBeInTheDocument();
      expect(
        right.querySelector('.history__book-cover-center-spine-center'),
      ).toBeInTheDocument();
    });
  });
});

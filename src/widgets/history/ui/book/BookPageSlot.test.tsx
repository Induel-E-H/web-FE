import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookPageSlot } from './BookPageSlot';

describe('BookPageSlot', () => {
  describe('side="left" 렌더링', () => {
    it('history__book-page-left 클래스 래퍼가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='left' shadowCount={0}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-page-left'),
      ).toBeInTheDocument();
    });

    it('BookCover의 history__book-cover-left가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='left' shadowCount={0}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-cover-left'),
      ).toBeInTheDocument();
    });

    it('shadowCount=2이면 history__book-page-outer-shadow-2가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='left' shadowCount={2}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-page-outer-shadow-2'),
      ).toBeInTheDocument();
    });
  });

  describe('side="right" 렌더링', () => {
    it('history__book-page-right 클래스 래퍼가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='right' shadowCount={0}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-page-right'),
      ).toBeInTheDocument();
    });

    it('BookCover의 history__book-cover-right가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='right' shadowCount={0}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-cover-right'),
      ).toBeInTheDocument();
    });

    it('shadowCount=2이면 history__book-page-outer-shadow-2가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='right' shadowCount={2}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-page-outer-shadow-2'),
      ).toBeInTheDocument();
    });
  });

  describe('공통 렌더링', () => {
    it('children이 렌더링된다', () => {
      const { getByText } = render(
        <BookPageSlot side='left' shadowCount={0}>
          <span>child content</span>
        </BookPageSlot>,
      );
      expect(getByText('child content')).toBeInTheDocument();
    });

    it('history__book-page-content 요소가 렌더링된다', () => {
      const { container } = render(
        <BookPageSlot side='left' shadowCount={0}>
          <span>content</span>
        </BookPageSlot>,
      );
      expect(
        container.querySelector('.history__book-page-content'),
      ).toBeInTheDocument();
    });
  });
});

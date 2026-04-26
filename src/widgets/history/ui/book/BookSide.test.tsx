import type { BookState, PageSide } from '@features/history';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BookSide } from './BookSide';

const defaultProps = {
  side: 'left' as PageSide,
  bookState: 'open' as BookState,
  isBookOpen: true,
  isCoverFlip: false,
  isFlipping: false,
  isRapidFlipping: false,
  isHoldChaining: false,
  flipDirection: null,
  currentFlipDuration: 400,
  staticPageContent: <span>static</span>,
  flipFrontPageContent: <span>flip-front</span>,
  flipBackPageContent: <span>flip-back</span>,
  shadowCount: 0,
};

describe('BookSide', () => {
  it('side="left"이면 history__book-left 클래스를 가진다', () => {
    const { container } = render(<BookSide {...defaultProps} side='left' />);
    expect(container.querySelector('.history__book-left')).toBeInTheDocument();
  });

  it('side="right"이면 history__book-right 클래스를 가진다', () => {
    const { container } = render(<BookSide {...defaultProps} side='right' />);
    expect(container.querySelector('.history__book-right')).toBeInTheDocument();
  });

  it('isRapidFlipping=true이면 --rapid 클래스를 가진다', () => {
    const { container } = render(
      <BookSide {...defaultProps} isRapidFlipping={true} />,
    );
    const el = container.querySelector('.history__book-left')!;
    expect(el.className).toContain('history__book-page--rapid');
  });

  it('isHoldChaining=true이면 --hold 클래스를 가진다', () => {
    const { container } = render(
      <BookSide {...defaultProps} isHoldChaining={true} />,
    );
    const el = container.querySelector('.history__book-left')!;
    expect(el.className).toContain('history__book-page--hold');
  });

  describe('BookPageSide 렌더링', () => {
    it('isBookOpen=true이면 staticContent가 렌더링된다', () => {
      const { getByText } = render(
        <BookSide {...defaultProps} isBookOpen={true} />,
      );
      expect(getByText('static')).toBeInTheDocument();
    });

    it('isBookOpen=false이면 staticContent가 렌더링되지 않는다', () => {
      const { queryByText } = render(
        <BookSide {...defaultProps} isBookOpen={false} />,
      );
      expect(queryByText('static')).not.toBeInTheDocument();
    });
  });

  describe('BookCover 렌더링 조건', () => {
    it('bookState="open"이면 BookCover가 렌더링된다', () => {
      const { container } = render(
        <BookSide {...defaultProps} side='left' bookState='open' />,
      );
      expect(
        container.querySelector('.history__book-cover-left'),
      ).toBeInTheDocument();
    });

    it('bookState="cover-front"이면 BookCover가 렌더링되지 않는다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='cover-front'
          isBookOpen={false}
        />,
      );
      expect(
        container.querySelector('.history__book-cover-left'),
      ).not.toBeInTheDocument();
    });

    it('bookState="cover-back"이면 BookCover가 렌더링되지 않는다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='cover-back'
          isBookOpen={false}
        />,
      );
      expect(
        container.querySelector('.history__book-cover-left'),
      ).not.toBeInTheDocument();
    });
  });

  describe('BookFrontCover / BookBackCover 렌더링 조건', () => {
    it('bookState="cover-front", side="right"이면 BookFrontCover가 렌더링된다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='right'
          bookState='cover-front'
          isBookOpen={false}
          onFrontCoverClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector('.history__front-cover'),
      ).toBeInTheDocument();
    });

    it('bookState="cover-front", side="left"이면 BookFrontCover가 렌더링되지 않는다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='cover-front'
          isBookOpen={false}
          onFrontCoverClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector('.history__front-cover'),
      ).not.toBeInTheDocument();
    });

    it('bookState="cover-back", side="left"이면 BookBackCover가 렌더링된다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='cover-back'
          isBookOpen={false}
          onBackCoverClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector('.history__back-cover'),
      ).toBeInTheDocument();
    });

    it('bookState="cover-back", side="right"이면 BookBackCover가 렌더링되지 않는다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='right'
          bookState='cover-back'
          isBookOpen={false}
          onBackCoverClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector('.history__back-cover'),
      ).not.toBeInTheDocument();
    });
  });

  describe('BookCoverFlip 렌더링 조건', () => {
    it('isCoverFlip=true, side="right", bookState="opening-front"이면 CoverFlip이 렌더링된다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='right'
          bookState='opening-front'
          isCoverFlip={true}
          isBookOpen={false}
        />,
      );
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).toBeInTheDocument();
    });

    it('isCoverFlip=true, side="left", bookState="opening-back"이면 CoverFlip이 렌더링된다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='opening-back'
          isCoverFlip={true}
          isBookOpen={false}
        />,
      );
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).toBeInTheDocument();
    });

    it('isCoverFlip=false이면 CoverFlip이 렌더링되지 않는다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='right'
          bookState='opening-front'
          isCoverFlip={false}
          isBookOpen={false}
        />,
      );
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).not.toBeInTheDocument();
    });
  });

  describe('pointer-events 비활성화 (cover 중앙 이동 시 반대편 side 차단)', () => {
    it('cover-front 상태에서 left side는 no-pointer 클래스를 가진다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='cover-front'
          isBookOpen={false}
        />,
      );
      const el = container.querySelector('.history__book-left')!;
      expect(el.className).toContain('history__book--no-pointer');
    });

    it('cover-front 상태에서 right side는 no-pointer 클래스가 없다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='right'
          bookState='cover-front'
          isBookOpen={false}
          onFrontCoverClick={vi.fn()}
        />,
      );
      const el = container.querySelector('.history__book-right')!;
      expect(el.className).not.toContain('history__book--no-pointer');
    });

    it('cover-back 상태에서 right side는 no-pointer 클래스를 가진다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='right'
          bookState='cover-back'
          isBookOpen={false}
        />,
      );
      const el = container.querySelector('.history__book-right')!;
      expect(el.className).toContain('history__book--no-pointer');
    });

    it('cover-back 상태에서 left side는 no-pointer 클래스가 없다', () => {
      const { container } = render(
        <BookSide
          {...defaultProps}
          side='left'
          bookState='cover-back'
          isBookOpen={false}
          onBackCoverClick={vi.fn()}
        />,
      );
      const el = container.querySelector('.history__book-left')!;
      expect(el.className).not.toContain('history__book--no-pointer');
    });

    it('open 상태에서는 no-pointer 클래스가 없다', () => {
      const { container } = render(
        <BookSide {...defaultProps} side='left' bookState='open' />,
      );
      const el = container.querySelector('.history__book-left')!;
      expect(el.className).not.toContain('history__book--no-pointer');
    });
  });
});

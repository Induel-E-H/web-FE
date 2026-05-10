import type { PageSide } from '@features/history';
import { useHistoryStore } from '@features/history';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BookSide } from './BookSide';

const defaultProps = {
  side: 'left' as PageSide,
  staticPageContent: <span>static</span>,
  flipFrontPageContent: <span>flip-front</span>,
  flipBackPageContent: <span>flip-back</span>,
  shadowCount: 0,
};

describe('BookSide', () => {
  beforeEach(() => {
    useHistoryStore.getState().reset();
    useHistoryStore.setState({ bookState: 'open' });
  });

  afterEach(() => {
    useHistoryStore.getState().reset();
  });

  it('side="left"이면 history__book-left 클래스를 가진다', () => {
    const { container } = render(<BookSide {...defaultProps} side='left' />);
    expect(container.querySelector('.history__book-left')).toBeInTheDocument();
  });

  it('side="right"이면 history__book-right 클래스를 가진다', () => {
    const { container } = render(<BookSide {...defaultProps} side='right' />);
    expect(container.querySelector('.history__book-right')).toBeInTheDocument();
  });

  it('isRapidFlipping=true이면 --rapid 클래스를 가진다', () => {
    useHistoryStore.setState({ isRapidFlipping: true });
    const { container } = render(<BookSide {...defaultProps} />);
    const el = container.querySelector('.history__book-left')!;
    expect(el.className).toContain('history__book-page--rapid');
  });

  it('isHoldChaining=true이면 --hold 클래스를 가진다', () => {
    useHistoryStore.setState({ isHoldChaining: true });
    const { container } = render(<BookSide {...defaultProps} />);
    const el = container.querySelector('.history__book-left')!;
    expect(el.className).toContain('history__book-page--hold');
  });

  describe('BookPageSide 렌더링', () => {
    it('bookState="open"이면 staticContent가 렌더링된다', () => {
      const { getByText } = render(<BookSide {...defaultProps} />);
      expect(getByText('static')).toBeInTheDocument();
    });

    it('bookState="cover-front"이면 staticContent가 렌더링되지 않는다', () => {
      useHistoryStore.setState({ bookState: 'cover-front' });
      const { queryByText } = render(<BookSide {...defaultProps} />);
      expect(queryByText('static')).not.toBeInTheDocument();
    });
  });

  describe('BookCover 렌더링 조건', () => {
    it('bookState="open"이면 BookCover가 렌더링된다', () => {
      const { container } = render(<BookSide {...defaultProps} side='left' />);
      expect(
        container.querySelector('.history__book-cover-left'),
      ).toBeInTheDocument();
    });

    it('bookState="cover-front"이면 BookCover가 렌더링되지 않는다', () => {
      useHistoryStore.setState({ bookState: 'cover-front' });
      const { container } = render(<BookSide {...defaultProps} side='left' />);
      expect(
        container.querySelector('.history__book-cover-left'),
      ).not.toBeInTheDocument();
    });

    it('bookState="cover-back"이면 BookCover가 렌더링되지 않는다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      const { container } = render(<BookSide {...defaultProps} side='left' />);
      expect(
        container.querySelector('.history__book-cover-left'),
      ).not.toBeInTheDocument();
    });
  });

  describe('BookFrontCover / BookBackCover 렌더링 조건', () => {
    it('bookState="cover-front", side="right"이면 BookFrontCover가 렌더링된다', () => {
      useHistoryStore.setState({ bookState: 'cover-front' });
      const { container } = render(
        <BookSide {...defaultProps} side='right' onFrontCoverClick={vi.fn()} />,
      );
      expect(
        container.querySelector('.history__front-cover'),
      ).toBeInTheDocument();
    });

    it('bookState="cover-front", side="left"이면 BookFrontCover가 렌더링되지 않는다', () => {
      useHistoryStore.setState({ bookState: 'cover-front' });
      const { container } = render(
        <BookSide {...defaultProps} side='left' onFrontCoverClick={vi.fn()} />,
      );
      expect(
        container.querySelector('.history__front-cover'),
      ).not.toBeInTheDocument();
    });

    it('bookState="cover-back", side="left"이면 BookBackCover가 렌더링된다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      const { container } = render(
        <BookSide {...defaultProps} side='left' onBackCoverClick={vi.fn()} />,
      );
      expect(
        container.querySelector('.history__back-cover'),
      ).toBeInTheDocument();
    });

    it('bookState="cover-back", side="right"이면 BookBackCover가 렌더링되지 않는다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      const { container } = render(
        <BookSide {...defaultProps} side='right' onBackCoverClick={vi.fn()} />,
      );
      expect(
        container.querySelector('.history__back-cover'),
      ).not.toBeInTheDocument();
    });
  });

  describe('BookCoverFlip 렌더링 조건', () => {
    it('bookState="opening-front", side="right"이면 CoverFlip이 렌더링된다', () => {
      useHistoryStore.setState({ bookState: 'opening-front' });
      const { container } = render(<BookSide {...defaultProps} side='right' />);
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).toBeInTheDocument();
    });

    it('bookState="opening-back", side="left"이면 CoverFlip이 렌더링된다', () => {
      useHistoryStore.setState({ bookState: 'opening-back' });
      const { container } = render(<BookSide {...defaultProps} side='left' />);
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).toBeInTheDocument();
    });

    it('bookState="open"이면 CoverFlip이 렌더링되지 않는다', () => {
      const { container } = render(<BookSide {...defaultProps} side='right' />);
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).not.toBeInTheDocument();
    });
  });

  describe('pointer-events 비활성화', () => {
    it('cover-front 상태에서 left side는 no-pointer 클래스를 가진다', () => {
      useHistoryStore.setState({ bookState: 'cover-front' });
      const { container } = render(<BookSide {...defaultProps} side='left' />);
      const el = container.querySelector('.history__book-left')!;
      expect(el.className).toContain('history__book--no-pointer');
    });

    it('cover-front 상태에서 right side는 no-pointer 클래스가 없다', () => {
      useHistoryStore.setState({ bookState: 'cover-front' });
      const { container } = render(
        <BookSide {...defaultProps} side='right' onFrontCoverClick={vi.fn()} />,
      );
      const el = container.querySelector('.history__book-right')!;
      expect(el.className).not.toContain('history__book--no-pointer');
    });

    it('cover-back 상태에서 right side는 no-pointer 클래스를 가진다', () => {
      useHistoryStore.setState({ bookState: 'cover-back' });
      const { container } = render(<BookSide {...defaultProps} side='right' />);
      const el = container.querySelector('.history__book-right')!;
      expect(el.className).toContain('history__book--no-pointer');
    });

    it('open 상태에서는 no-pointer 클래스가 없다', () => {
      const { container } = render(<BookSide {...defaultProps} side='left' />);
      const el = container.querySelector('.history__book-left')!;
      expect(el.className).not.toContain('history__book--no-pointer');
    });
  });
});

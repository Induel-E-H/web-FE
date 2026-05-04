import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookCoverFlip } from './CoverFlip';

describe('BookCoverFlip', () => {
  const defaultProps = {
    isFlipping: false,
    flipDirection: 'forward' as const,
    flipDuration: 400,
    frontContent: <span>front</span>,
    backContent: <span>back</span>,
  };

  it('렌더링된다', () => {
    const { container } = render(<BookCoverFlip {...defaultProps} />);
    expect(
      container.querySelector('.history__book-cover-flip'),
    ).toBeInTheDocument();
  });

  it('flipDirection="forward"이면 --forward 클래스를 가진다', () => {
    const { container } = render(
      <BookCoverFlip {...defaultProps} flipDirection='forward' />,
    );
    expect(
      container.querySelector('.history__book-cover-flip-panel--forward'),
    ).toBeInTheDocument();
  });

  it('flipDirection="backward"이면 --backward 클래스를 가진다', () => {
    const { container } = render(
      <BookCoverFlip {...defaultProps} flipDirection='backward' />,
    );
    expect(
      container.querySelector('.history__book-cover-flip-panel--backward'),
    ).toBeInTheDocument();
  });

  it('초기에는 --hidden 클래스가 있다', () => {
    const { container } = render(<BookCoverFlip {...defaultProps} />);
    expect(
      container.querySelector('.history__book-cover-flip-panel--hidden'),
    ).toBeInTheDocument();
  });

  it('frontContent가 렌더링된다', () => {
    const { getByText } = render(<BookCoverFlip {...defaultProps} />);
    expect(getByText('front')).toBeInTheDocument();
  });

  it('backContent가 렌더링된다', () => {
    const { getByText } = render(<BookCoverFlip {...defaultProps} />);
    expect(getByText('back')).toBeInTheDocument();
  });

  it('isFlipping=true이면 --hidden 클래스가 없다', () => {
    const { container } = render(
      <BookCoverFlip {...defaultProps} isFlipping={true} />,
    );
    expect(
      container.querySelector('.history__book-cover-flip-panel--hidden'),
    ).not.toBeInTheDocument();
  });

  it('isFlipping=false이면 --hidden 클래스가 있다', () => {
    const { container } = render(
      <BookCoverFlip {...defaultProps} isFlipping={false} />,
    );
    expect(
      container.querySelector('.history__book-cover-flip-panel--hidden'),
    ).toBeInTheDocument();
  });
});

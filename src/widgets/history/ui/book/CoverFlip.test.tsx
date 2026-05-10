import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BookCoverFlip } from './CoverFlip';

vi.mock('@shared/lib/breakpoint/useBreakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('desktop'),
}));

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

  describe('모바일 breakpoint (isVertical=true)', () => {
    afterEach(() => {
      vi.mocked(useBreakpoint).mockReturnValue('desktop');
    });

    it('mobile breakpoint에서 forward flip으로 렌더링된다', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile');
      const { container } = render(
        <BookCoverFlip
          {...defaultProps}
          isFlipping={true}
          flipDirection='forward'
        />,
      );
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).toBeInTheDocument();
    });

    it('mobile breakpoint에서 backward flip으로 렌더링된다', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile');
      const { container } = render(
        <BookCoverFlip
          {...defaultProps}
          isFlipping={true}
          flipDirection='backward'
        />,
      );
      expect(
        container.querySelector('.history__book-cover-flip-panel--backward'),
      ).toBeInTheDocument();
    });

    it('tablet breakpoint에서 forward flip으로 렌더링된다', () => {
      vi.mocked(useBreakpoint).mockReturnValue('tablet');
      const { container } = render(
        <BookCoverFlip
          {...defaultProps}
          isFlipping={true}
          flipDirection='forward'
        />,
      );
      expect(
        container.querySelector('.history__book-cover-flip'),
      ).toBeInTheDocument();
    });
  });
});

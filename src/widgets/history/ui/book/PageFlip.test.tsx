import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageFlip } from './PageFlip';

describe('PageFlip', () => {
  const defaultProps = {
    isFlipping: false,
    flipDirection: 'forward' as const,
    flipDuration: 400,
    flipFrontContent: <span>front</span>,
    flipBackContent: <span>back</span>,
    isRapidFlipping: false,
    isHoldChaining: false,
  };

  it('초기에 --hidden 클래스가 있다', () => {
    const { container } = render(<PageFlip {...defaultProps} />);
    expect(
      container.querySelector('.history__book-page-flip-panel--hidden'),
    ).toBeInTheDocument();
  });

  it('flipDirection="forward"이면 --forward 클래스를 가진다', () => {
    const { container } = render(
      <PageFlip {...defaultProps} flipDirection='forward' />,
    );
    expect(
      container.querySelector('.history__book-page-flip-panel--forward'),
    ).toBeInTheDocument();
  });

  it('flipDirection="backward"이면 --backward 클래스를 가진다', () => {
    const { container } = render(
      <PageFlip {...defaultProps} flipDirection='backward' />,
    );
    expect(
      container.querySelector('.history__book-page-flip-panel--backward'),
    ).toBeInTheDocument();
  });

  it('isRapidFlipping=true이면 --rapid 클래스를 가진다', () => {
    const { container } = render(
      <PageFlip {...defaultProps} isRapidFlipping={true} />,
    );
    expect(
      container.querySelector('.history__book-page--rapid'),
    ).toBeInTheDocument();
  });

  it('isHoldChaining=true이면 --rapid 클래스를 가진다', () => {
    const { container } = render(
      <PageFlip {...defaultProps} isHoldChaining={true} />,
    );
    expect(
      container.querySelector('.history__book-page--rapid'),
    ).toBeInTheDocument();
  });

  it('isRapidFlipping=false, isHoldChaining=false이면 --rapid 클래스가 없다', () => {
    const { container } = render(<PageFlip {...defaultProps} />);
    expect(
      container.querySelector('.history__book-page--rapid'),
    ).not.toBeInTheDocument();
  });

  it('isFlipping=true이면 --hidden 클래스가 없다', () => {
    const { container } = render(
      <PageFlip {...defaultProps} isFlipping={true} />,
    );
    expect(
      container.querySelector('.history__book-page-flip-panel--hidden'),
    ).not.toBeInTheDocument();
  });

  it('isFlipping=true → false로 변경 시 --hidden 클래스가 추가된다', () => {
    const { container, rerender } = render(
      <PageFlip {...defaultProps} isFlipping={true} />,
    );
    expect(
      container.querySelector('.history__book-page-flip-panel--hidden'),
    ).not.toBeInTheDocument();
    rerender(<PageFlip {...defaultProps} isFlipping={false} />);
    expect(
      container.querySelector('.history__book-page-flip-panel--hidden'),
    ).toBeInTheDocument();
  });

  it('flipFrontContent가 렌더링된다', () => {
    const { getByText } = render(<PageFlip {...defaultProps} />);
    expect(getByText('front')).toBeInTheDocument();
  });

  it('flipBackContent가 렌더링된다', () => {
    const { getByText } = render(<PageFlip {...defaultProps} />);
    expect(getByText('back')).toBeInTheDocument();
  });

  describe('direction별 flip front/back 클래스', () => {
    it('direction="forward"이면 front는 right 클래스를 가진다', () => {
      const { container } = render(
        <PageFlip {...defaultProps} flipDirection='forward' />,
      );
      expect(
        container.querySelector(
          '.history__book-page-flip-front.history__book-page-right',
        ),
      ).toBeInTheDocument();
    });

    it('direction="forward"이면 back은 left 클래스를 가진다', () => {
      const { container } = render(
        <PageFlip {...defaultProps} flipDirection='forward' />,
      );
      expect(
        container.querySelector(
          '.history__book-page-flip-back.history__book-page-left',
        ),
      ).toBeInTheDocument();
    });

    it('direction="backward"이면 front는 left 클래스를 가진다', () => {
      const { container } = render(
        <PageFlip {...defaultProps} flipDirection='backward' />,
      );
      expect(
        container.querySelector(
          '.history__book-page-flip-front.history__book-page-left',
        ),
      ).toBeInTheDocument();
    });

    it('direction="backward"이면 back은 right 클래스를 가진다', () => {
      const { container } = render(
        <PageFlip {...defaultProps} flipDirection='backward' />,
      );
      expect(
        container.querySelector(
          '.history__book-page-flip-back.history__book-page-right',
        ),
      ).toBeInTheDocument();
    });
  });
});

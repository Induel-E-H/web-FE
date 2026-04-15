import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BookPageOuterShadow, BookPageSide } from './BookPageSide';

describe('BookPageOuterShadow', () => {
  it('컨테이너 div가 렌더링된다', () => {
    const { container } = render(<BookPageOuterShadow side='left' count={0} />);
    expect(
      container.querySelector('.history__book-page-outer-shadow'),
    ).toBeInTheDocument();
  });

  it('count=0이면 shadow 요소가 없다', () => {
    const { container } = render(<BookPageOuterShadow side='left' count={0} />);
    const wrapper = container.querySelector(
      '.history__book-page-outer-shadow',
    )!;
    expect(wrapper.children.length).toBe(0);
  });

  it('side="left", count=3이면 레벨이 [3, 2, 1] 순으로 렌더링된다 (내림차순)', () => {
    const { container } = render(<BookPageOuterShadow side='left' count={3} />);
    const wrapper = container.querySelector(
      '.history__book-page-outer-shadow',
    )!;
    expect(wrapper.children.length).toBe(3);
    expect(wrapper.children[0].className).toBe(
      'history__book-page-outer-shadow-3',
    );
    expect(wrapper.children[1].className).toBe(
      'history__book-page-outer-shadow-2',
    );
    expect(wrapper.children[2].className).toBe(
      'history__book-page-outer-shadow-1',
    );
  });

  it('side="right", count=3이면 레벨이 [1, 2, 3] 순으로 렌더링된다 (오름차순)', () => {
    const { container } = render(
      <BookPageOuterShadow side='right' count={3} />,
    );
    const wrapper = container.querySelector(
      '.history__book-page-outer-shadow',
    )!;
    expect(wrapper.children.length).toBe(3);
    expect(wrapper.children[0].className).toBe(
      'history__book-page-outer-shadow-1',
    );
    expect(wrapper.children[1].className).toBe(
      'history__book-page-outer-shadow-2',
    );
    expect(wrapper.children[2].className).toBe(
      'history__book-page-outer-shadow-3',
    );
  });
});

describe('BookPageSide', () => {
  const defaultProps = {
    side: 'left' as const,
    staticContent: <span>static</span>,
    flipFrontContent: <span>front</span>,
    flipBackContent: <span>back</span>,
    isFlipping: false,
    flipDirection: null,
    flipDuration: 400,
    shadowCount: 0,
    isHidden: false,
  };

  it('side="left"이면 history__book-page-left 클래스를 가진다', () => {
    const { container } = render(
      <BookPageSide {...defaultProps} side='left' />,
    );
    expect(
      container.querySelector('.history__book-page-left'),
    ).toBeInTheDocument();
  });

  it('side="right"이면 history__book-page-right 클래스를 가진다', () => {
    const { container } = render(
      <BookPageSide {...defaultProps} side='right' />,
    );
    expect(
      container.querySelector('.history__book-page-right'),
    ).toBeInTheDocument();
  });

  it('--clickable 클래스를 가진다', () => {
    const { container } = render(<BookPageSide {...defaultProps} />);
    expect(
      container.querySelector('.history__book-page-left--clickable'),
    ).toBeInTheDocument();
  });

  it('isHidden=true이면 history__book-page-hidden 클래스를 가진다', () => {
    const { container } = render(
      <BookPageSide {...defaultProps} isHidden={true} />,
    );
    const el = container.querySelector('.history__book-page-left')!;
    expect(el.className).toContain('history__book-page-hidden');
  });

  it('isHidden=false이면 history__book-page-hidden 클래스가 없다', () => {
    const { container } = render(
      <BookPageSide {...defaultProps} isHidden={false} />,
    );
    const el = container.querySelector('.history__book-page-left')!;
    expect(el.className).not.toContain('history__book-page-hidden');
  });

  it('staticContent가 렌더링된다', () => {
    const { getByText } = render(<BookPageSide {...defaultProps} />);
    expect(getByText('static')).toBeInTheDocument();
  });

  it('onMouseDown이 호출된다', () => {
    const onMouseDown = vi.fn();
    const { container } = render(
      <BookPageSide {...defaultProps} onMouseDown={onMouseDown} />,
    );
    const el = container.querySelector('.history__book-page-left')!;
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  describe('PageFlip 렌더링 조건', () => {
    it('isFlipping=false이면 PageFlip이 렌더링되지 않는다', () => {
      const { container } = render(
        <BookPageSide
          {...defaultProps}
          isFlipping={false}
          flipDirection='backward'
        />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).not.toBeInTheDocument();
    });

    it('side="left", isFlipping=true, direction="backward"이면 PageFlip이 렌더링된다', () => {
      const { container } = render(
        <BookPageSide
          {...defaultProps}
          side='left'
          isFlipping={true}
          flipDirection='backward'
        />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).toBeInTheDocument();
    });

    it('side="left", isFlipping=true, direction="forward"이면 PageFlip이 렌더링되지 않는다', () => {
      const { container } = render(
        <BookPageSide
          {...defaultProps}
          side='left'
          isFlipping={true}
          flipDirection='forward'
        />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).not.toBeInTheDocument();
    });

    it('side="right", isFlipping=true, direction="forward"이면 PageFlip이 렌더링된다', () => {
      const { container } = render(
        <BookPageSide
          {...defaultProps}
          side='right'
          isFlipping={true}
          flipDirection='forward'
        />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).toBeInTheDocument();
    });

    it('side="right", isFlipping=true, direction="backward"이면 PageFlip이 렌더링되지 않는다', () => {
      const { container } = render(
        <BookPageSide
          {...defaultProps}
          side='right'
          isFlipping={true}
          flipDirection='backward'
        />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).not.toBeInTheDocument();
    });
  });
});

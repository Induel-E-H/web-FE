import { useHistoryStore } from '@features/history';
import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BookPageSide } from './BookPageSide';

const defaultProps = {
  side: 'left' as const,
  staticContent: <span>static</span>,
  flipFrontContent: <span>front</span>,
  flipBackContent: <span>back</span>,
  shadowCount: 0,
};

describe('BookPageSide', () => {
  beforeEach(() => {
    useHistoryStore.getState().reset();
    // 기본: bookState='open'으로 설정 (isCoverFlip=false, isHidden=false)
    useHistoryStore.setState({ bookState: 'open' });
  });

  afterEach(() => {
    useHistoryStore.getState().reset();
  });

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

  it('bookState="opening-front", side="left"이면 history__book-page-hidden 클래스를 가진다', () => {
    useHistoryStore.setState({ bookState: 'opening-front' });
    const { container } = render(
      <BookPageSide {...defaultProps} side='left' />,
    );
    const el = container.querySelector('.history__book-page-left')!;
    expect(el.className).toContain('history__book-page-hidden');
  });

  it('bookState="open"이면 history__book-page-hidden 클래스가 없다', () => {
    const { container } = render(<BookPageSide {...defaultProps} />);
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
    fireEvent.mouseDown(el);
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  describe('키보드 이벤트 (onKeyDown)', () => {
    it('Enter 키 입력 시 onMouseDown이 호출된다', () => {
      const onMouseDown = vi.fn();
      const { container } = render(
        <BookPageSide {...defaultProps} onMouseDown={onMouseDown} />,
      );
      const el = container.querySelector('.history__book-page-left')!;
      fireEvent.keyDown(el, { key: 'Enter' });
      expect(onMouseDown).toHaveBeenCalledTimes(1);
    });

    it('Space 키 입력 시 onMouseDown이 호출된다', () => {
      const onMouseDown = vi.fn();
      const { container } = render(
        <BookPageSide {...defaultProps} onMouseDown={onMouseDown} />,
      );
      const el = container.querySelector('.history__book-page-left')!;
      fireEvent.keyDown(el, { key: ' ' });
      expect(onMouseDown).toHaveBeenCalledTimes(1);
    });

    it('Enter repeat=true이면 onMouseDown이 호출되지 않는다', () => {
      const onMouseDown = vi.fn();
      const { container } = render(
        <BookPageSide {...defaultProps} onMouseDown={onMouseDown} />,
      );
      const el = container.querySelector('.history__book-page-left')!;
      fireEvent.keyDown(el, { key: 'Enter', repeat: true });
      expect(onMouseDown).not.toHaveBeenCalled();
    });

    it('다른 키(예: a) 입력 시 onMouseDown이 호출되지 않는다', () => {
      const onMouseDown = vi.fn();
      const { container } = render(
        <BookPageSide {...defaultProps} onMouseDown={onMouseDown} />,
      );
      const el = container.querySelector('.history__book-page-left')!;
      fireEvent.keyDown(el, { key: 'a' });
      expect(onMouseDown).not.toHaveBeenCalled();
    });

    it('onMouseDown 없이 keyDown 발생해도 오류가 발생하지 않는다', () => {
      const { container } = render(<BookPageSide {...defaultProps} />);
      const el = container.querySelector('.history__book-page-left')!;
      expect(() => fireEvent.keyDown(el, { key: 'Enter' })).not.toThrow();
    });

    it('자식 요소에서 keyDown 발생 시(target !== currentTarget) onMouseDown이 호출되지 않는다', () => {
      const onMouseDown = vi.fn();
      const { getByText } = render(
        <BookPageSide {...defaultProps} onMouseDown={onMouseDown} />,
      );
      // staticContent(<span>static</span>)는 page div의 자식 — target !== currentTarget
      const childEl = getByText('static');
      fireEvent.keyDown(childEl, { key: 'Enter' });
      expect(onMouseDown).not.toHaveBeenCalled();
    });
  });

  describe('PageFlip 렌더링 조건', () => {
    it('isFlipping=false이면 PageFlip이 렌더링되지 않는다', () => {
      useHistoryStore.setState({
        isFlipping: false,
        flipDirection: 'backward',
      });
      const { container } = render(<BookPageSide {...defaultProps} />);
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).not.toBeInTheDocument();
    });

    it('side="left", isFlipping=true, direction="backward"이면 PageFlip이 렌더링된다', () => {
      useHistoryStore.setState({ isFlipping: true, flipDirection: 'backward' });
      const { container } = render(
        <BookPageSide {...defaultProps} side='left' />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).toBeInTheDocument();
    });

    it('side="left", isFlipping=true, direction="forward"이면 PageFlip이 렌더링되지 않는다', () => {
      useHistoryStore.setState({ isFlipping: true, flipDirection: 'forward' });
      const { container } = render(
        <BookPageSide {...defaultProps} side='left' />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).not.toBeInTheDocument();
    });

    it('side="right", isFlipping=true, direction="forward"이면 PageFlip이 렌더링된다', () => {
      useHistoryStore.setState({ isFlipping: true, flipDirection: 'forward' });
      const { container } = render(
        <BookPageSide {...defaultProps} side='right' />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).toBeInTheDocument();
    });

    it('side="right", isFlipping=true, direction="backward"이면 PageFlip이 렌더링되지 않는다', () => {
      useHistoryStore.setState({ isFlipping: true, flipDirection: 'backward' });
      const { container } = render(
        <BookPageSide {...defaultProps} side='right' />,
      );
      expect(
        container.querySelector('.history__book-page-flip-panel'),
      ).not.toBeInTheDocument();
    });
  });
});

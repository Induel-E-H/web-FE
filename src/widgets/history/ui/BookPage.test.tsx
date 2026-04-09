import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BookPage } from './BookPage';

const defaultProps = {
  staticLeftContent: <div>static-left</div>,
  staticRightContent: <div>static-right</div>,
  flipFrontContent: <div>flip-front</div>,
  flipBackContent: <div>flip-back</div>,
  isFlipping: false,
  flipDirection: null as null,
  canGoLeft: true,
  canGoRight: true,
};

describe('BookPage', () => {
  describe('렌더링', () => {
    it('static left 컨텐츠가 렌더링된다', () => {
      render(<BookPage {...defaultProps} />);
      expect(screen.getByText('static-left')).toBeInTheDocument();
    });

    it('static right 컨텐츠가 렌더링된다', () => {
      render(<BookPage {...defaultProps} />);
      expect(screen.getByText('static-right')).toBeInTheDocument();
    });

    it('flip front 컨텐츠가 DOM에 존재한다', () => {
      render(<BookPage {...defaultProps} />);
      expect(screen.getByText('flip-front')).toBeInTheDocument();
    });
  });

  describe('이동 가능 클래스', () => {
    it('canGoLeft=true이면 left에 clickable 클래스가 적용된다', () => {
      const { container } = render(
        <BookPage {...defaultProps} canGoLeft={true} />,
      );
      expect(
        container.querySelector('.history__book-page-left--clickable'),
      ).toBeInTheDocument();
    });

    it('canGoLeft=false이면 left에 clickable 클래스가 없다', () => {
      const { container } = render(
        <BookPage {...defaultProps} canGoLeft={false} />,
      );
      expect(
        container.querySelector('.history__book-page-left--clickable'),
      ).not.toBeInTheDocument();
    });

    it('canGoRight=true이면 right에 clickable 클래스가 적용된다', () => {
      const { container } = render(
        <BookPage {...defaultProps} canGoRight={true} />,
      );
      expect(
        container.querySelector('.history__book-page-right--clickable'),
      ).toBeInTheDocument();
    });

    it('canGoRight=false이면 right에 clickable 클래스가 없다', () => {
      const { container } = render(
        <BookPage {...defaultProps} canGoRight={false} />,
      );
      expect(
        container.querySelector('.history__book-page-right--clickable'),
      ).not.toBeInTheDocument();
    });
  });

  describe('마우스 이벤트', () => {
    it('canGoLeft=true일 때 left 영역 mousedown 시 onLeftMouseDown이 호출된다', () => {
      const onLeftMouseDown = vi.fn();
      const { container } = render(
        <BookPage
          {...defaultProps}
          canGoLeft={true}
          onLeftMouseDown={onLeftMouseDown}
        />,
      );
      const leftArea = container.querySelector('.history__book-static-left')!;
      fireEvent.mouseDown(leftArea);
      expect(onLeftMouseDown).toHaveBeenCalledTimes(1);
    });

    it('canGoLeft=false일 때 left 영역 mousedown 시 onLeftMouseDown이 호출되지 않는다', () => {
      const onLeftMouseDown = vi.fn();
      const { container } = render(
        <BookPage
          {...defaultProps}
          canGoLeft={false}
          onLeftMouseDown={onLeftMouseDown}
        />,
      );
      const leftArea = container.querySelector('.history__book-static-left')!;
      fireEvent.mouseDown(leftArea);
      expect(onLeftMouseDown).not.toHaveBeenCalled();
    });

    it('canGoRight=true일 때 right 영역 mousedown 시 onRightMouseDown이 호출된다', () => {
      const onRightMouseDown = vi.fn();
      const { container } = render(
        <BookPage
          {...defaultProps}
          canGoRight={true}
          onRightMouseDown={onRightMouseDown}
        />,
      );
      const rightArea = container.querySelector('.history__book-static-right')!;
      fireEvent.mouseDown(rightArea);
      expect(onRightMouseDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('flip 방향 클래스', () => {
    it('flipDirection=null이면 flip panel에 forward 클래스가 기본 적용된다', () => {
      const { container } = render(
        <BookPage {...defaultProps} flipDirection={null} />,
      );
      expect(
        container.querySelector('.history__book-flip-panel--forward'),
      ).toBeInTheDocument();
    });

    it('flipDirection=backward이면 flip panel에 backward 클래스가 적용된다', () => {
      const { container } = render(
        <BookPage {...defaultProps} flipDirection='backward' />,
      );
      expect(
        container.querySelector('.history__book-flip-panel--backward'),
      ).toBeInTheDocument();
    });
  });
});

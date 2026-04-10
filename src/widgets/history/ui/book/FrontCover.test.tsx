import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BookFrontCover, FrontCoverInner } from './FrontCover';

describe('FrontCoverInner', () => {
  it('INDUEL DESIGN 텍스트가 렌더링된다', () => {
    render(<FrontCoverInner />);
    expect(screen.getByText('INDUEL')).toBeInTheDocument();
    expect(screen.getByText('DESIGN')).toBeInTheDocument();
  });

  it('연도 숫자 요소가 렌더링된다', () => {
    render(<FrontCoverInner />);
    const yearEl = document.querySelector('.history__front-cover-year-number');
    expect(yearEl).toBeInTheDocument();
  });
});

describe('BookFrontCover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('렌더링된다', () => {
    const { container } = render(<BookFrontCover onClick={vi.fn()} />);
    expect(
      container.querySelector('.history__front-cover'),
    ).toBeInTheDocument();
  });

  it('마운트 직후에는 centered 클래스가 없다', () => {
    const { container } = render(<BookFrontCover onClick={vi.fn()} />);
    expect(
      container.querySelector('.history__front-cover--centered'),
    ).not.toBeInTheDocument();
  });

  it('rAF 이후 centered 클래스가 적용된다', () => {
    const { container } = render(<BookFrontCover onClick={vi.fn()} />);
    act(() => {
      vi.runAllTimers();
    });
    expect(
      container.querySelector('.history__front-cover--centered'),
    ).toBeInTheDocument();
  });

  it('centered 전에는 클릭이 무시된다', () => {
    const onClick = vi.fn();
    const { container } = render(<BookFrontCover onClick={onClick} />);
    const el = container.querySelector('.history__front-cover')!;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('centered 후 클릭 시 onClick이 호출된다', () => {
    const onClick = vi.fn();
    const { container } = render(<BookFrontCover onClick={onClick} />);
    act(() => {
      vi.runAllTimers();
    });
    const el = container.querySelector('.history__front-cover')!;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

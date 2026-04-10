import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BackCoverInner, BookBackCover } from './BackCover';

describe('BackCoverInner', () => {
  it('EXHIBITION, ENVIRONMENTAL, INTERIOR 텍스트가 렌더링된다', () => {
    render(<BackCoverInner />);
    expect(screen.getByText('EXHIBITION')).toBeInTheDocument();
    expect(screen.getByText('ENVIRONMENTAL')).toBeInTheDocument();
    expect(screen.getByText('INTERIOR')).toBeInTheDocument();
  });
});

describe('BookBackCover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('렌더링된다', () => {
    const { container } = render(<BookBackCover onClick={vi.fn()} />);
    expect(container.querySelector('.history__back-cover')).toBeInTheDocument();
  });

  it('마운트 직후에는 centered 클래스가 없다', () => {
    const { container } = render(<BookBackCover onClick={vi.fn()} />);
    expect(
      container.querySelector('.history__back-cover--centered'),
    ).not.toBeInTheDocument();
  });

  it('rAF 이후 centered 클래스가 적용된다', () => {
    const { container } = render(<BookBackCover onClick={vi.fn()} />);
    act(() => {
      vi.runAllTimers();
    });
    expect(
      container.querySelector('.history__back-cover--centered'),
    ).toBeInTheDocument();
  });

  it('centered 전에는 클릭이 무시된다', () => {
    const onClick = vi.fn();
    const { container } = render(<BookBackCover onClick={onClick} />);
    const el = container.querySelector('.history__back-cover')!;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('centered 후 클릭 시 onClick이 호출된다', () => {
    const onClick = vi.fn();
    const { container } = render(<BookBackCover onClick={onClick} />);
    act(() => {
      vi.runAllTimers();
    });
    const el = container.querySelector('.history__back-cover')!;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

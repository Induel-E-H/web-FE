import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
  it('렌더링된다', () => {
    const { container } = render(<BookBackCover onClick={vi.fn()} />);
    expect(container.querySelector('.history__back-cover')).toBeInTheDocument();
  });

  it('클릭 시 onClick이 호출된다', () => {
    const onClick = vi.fn();
    const { container } = render(<BookBackCover onClick={onClick} />);
    const el = container.querySelector('.history__back-cover')!;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

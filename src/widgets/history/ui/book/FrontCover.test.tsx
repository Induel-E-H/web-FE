import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
  it('렌더링된다', () => {
    const { container } = render(<BookFrontCover onClick={vi.fn()} />);
    expect(
      container.querySelector('.history__front-cover'),
    ).toBeInTheDocument();
  });

  it('클릭 시 onClick이 호출된다', () => {
    const onClick = vi.fn();
    const { container } = render(<BookFrontCover onClick={onClick} />);
    const el = container.querySelector('.history__front-cover')!;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

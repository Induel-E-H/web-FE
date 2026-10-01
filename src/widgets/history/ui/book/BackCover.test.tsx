import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BackCoverInner } from './BackCover';

describe('BackCoverInner', () => {
  it('EXHIBITION, ENVIRONMENTAL, INTERIOR 텍스트가 렌더링된다', () => {
    render(<BackCoverInner />);
    expect(screen.getByText('EXHIBITION')).toBeInTheDocument();
    expect(screen.getByText('ENVIRONMENTAL')).toBeInTheDocument();
    expect(screen.getByText('INTERIOR')).toBeInTheDocument();
  });
});

describe('BackCoverInner 접근성', () => {
  it('장식용이므로 aria-hidden 처리된다', () => {
    const { container } = render(<BackCoverInner />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

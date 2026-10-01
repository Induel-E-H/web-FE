import { ESTABLISHED_YEAR } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FrontCoverInner } from './FrontCover';

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

  it('연도 숫자는 설립 이후 햇수다', () => {
    render(<FrontCoverInner />);
    expect(
      document.querySelector('.history__front-cover-year-number'),
    ).toHaveTextContent(String(new Date().getFullYear() - ESTABLISHED_YEAR));
  });
});

describe('FrontCoverInner 접근성', () => {
  it('장식용이므로 aria-hidden 처리된다', () => {
    const { container } = render(<FrontCoverInner />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Patent } from './Patent';

describe('Patent', () => {
  it('section.patent로 렌더링된다', () => {
    const { container } = render(<Patent />);
    expect(container.querySelector('section.patent')).toBeInTheDocument();
  });

  it('유효 특허증 섹션이 렌더링된다', () => {
    render(<Patent />);
    expect(screen.getByText(/유효 특허증/)).toBeInTheDocument();
  });

  it('만료 특허 항목 목록이 렌더링된다', () => {
    const { container } = render(<Patent />);
    expect(
      container.querySelector('article.patent__expiration'),
    ).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PatentTitle } from './PatentTitle';

describe('PatentTitle', () => {
  it('"PATENTS" 문구가 렌더링된다', () => {
    render(<PatentTitle />);
    expect(screen.getByText('PATENTS')).toBeInTheDocument();
  });

  it('h2 "특허 취득 기록"이 렌더링된다', () => {
    render(<PatentTitle />);
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('특허 취득 기록');
  });

  it('h2 "혁신의 증명" 문구가 렌더링된다', () => {
    render(<PatentTitle />);
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[1]).toHaveTextContent('혁신의 증명');
  });

  it('hgroup.patent__title 요소가 렌더링된다', () => {
    const { container } = render(<PatentTitle />);
    expect(container.querySelector('hgroup.patent__title')).toBeInTheDocument();
  });

  it('hr 요소가 렌더링된다', () => {
    const { container } = render(<PatentTitle />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });
});

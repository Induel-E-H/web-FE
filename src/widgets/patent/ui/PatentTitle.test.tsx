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
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      '특허 취득 기록',
    );
  });

  it('"끊임없는 기술 개발과 혁신의 증명" 문구가 렌더링된다', () => {
    render(<PatentTitle />);
    expect(
      screen.getByText('끊임없는 기술 개발과 혁신의 증명'),
    ).toBeInTheDocument();
  });
});

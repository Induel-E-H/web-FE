import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HistoryTitle } from './Title';

describe('HistoryTitle', () => {
  it('h2 "걸어온 길"이 렌더링된다', () => {
    render(<HistoryTitle />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      '걸어온 길',
    );
  });

  it('"COMPANY HISTORY" 텍스트가 렌더링된다', () => {
    render(<HistoryTitle />);
    expect(screen.getByText('COMPANY HISTORY')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AwardTitle } from './Title';

describe('AwardTitle', () => {
  it('hgroup.award__title 요소가 렌더링된다', () => {
    const { container } = render(<AwardTitle />);
    expect(container.querySelector('hgroup.award__title')).toBeInTheDocument();
  });

  it('h2 "수상 기록"이 렌더링된다', () => {
    render(<AwardTitle />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      '수상 기록',
    );
  });

  it('"Award" 문구가 렌더링된다', () => {
    render(<AwardTitle />);
    expect(screen.getByText('Award')).toBeInTheDocument();
  });
});

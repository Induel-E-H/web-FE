import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AwardTitle } from './Title';

describe('AwardTitle', () => {
  it('hgroup.award__title 요소가 렌더링된다', () => {
    const { container } = render(<AwardTitle />);
    expect(container.querySelector('hgroup.award__title')).toBeInTheDocument();
  });

  it('h2 "Award"가 렌더링된다', () => {
    render(<AwardTitle />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Award',
    );
  });

  it('"수상 및 인증 내역" 문구가 렌더링된다', () => {
    render(<AwardTitle />);
    expect(screen.getByText('수상 및 인증 내역')).toBeInTheDocument();
  });

  it('재렌더링 시에도 동일한 UI가 유지된다 (React Compiler 캐시 히트 분기 커버)', () => {
    const { rerender } = render(<AwardTitle />);

    rerender(<AwardTitle />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Award',
    );
  });
});

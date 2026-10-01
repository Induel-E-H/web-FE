import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TitlePage } from './TitlePage';

describe('TitlePage', () => {
  it('HISTORY 제목과 부제를 렌더링한다', () => {
    render(<TitlePage />);
    expect(
      screen.getByRole('heading', { name: 'HISTORY' }),
    ).toBeInTheDocument();
    expect(screen.getByText('걸어온 길')).toBeInTheDocument();
  });

  it('회사 영문명과 설립 연도부터 올해까지의 기간을 표시한다', () => {
    render(<TitlePage />);
    expect(screen.getByText('INDUEL E&H')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`— ${new Date().getFullYear()}$`)),
    ).toBeInTheDocument();
  });
});

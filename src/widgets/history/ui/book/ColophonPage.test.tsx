import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ColophonPage } from './ColophonPage';

describe('ColophonPage', () => {
  it('회사 영문명을 제목으로 렌더링한다', () => {
    render(<ColophonPage />);
    expect(
      screen.getByRole('heading', { name: COMPANY.NAME_EN }),
    ).toBeInTheDocument();
    expect(screen.getByText(COMPANY.NAME_EN_FULL)).toBeInTheDocument();
  });

  it('사업 분야를 표시한다', () => {
    render(<ColophonPage />);
    expect(
      screen.getByText('EXHIBITION · ENVIRONMENTAL · INTERIOR'),
    ).toBeInTheDocument();
  });

  it('상호, 설립일, 주소, 전화, 메일을 표시한다', () => {
    render(<ColophonPage />);
    [
      COMPANY.NAME_KR,
      COMPANY.ESTABLISHED_DISPLAY,
      COMPANY.ADDRESS_FULL,
      COMPANY.PHONE_DISPLAY,
      COMPANY.EMAIL,
    ].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});

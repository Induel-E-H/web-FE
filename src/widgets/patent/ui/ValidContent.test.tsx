import { PATENT_VALID_LIST } from '@entities/patent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PatentValidContent } from './ValidContent';

describe('PatentValidContent', () => {
  it('유효 특허 건수가 표시된다', () => {
    render(<PatentValidContent />);
    expect(
      screen.getByText(`유효 특허증 (${PATENT_VALID_LIST.length}건)`),
    ).toBeInTheDocument();
  });

  it('PATENT_VALID_LIST 개수만큼 카드가 렌더링된다', () => {
    const { container } = render(<PatentValidContent />);
    expect(container.querySelectorAll('div.patent__card')).toHaveLength(
      PATENT_VALID_LIST.length,
    );
  });

  it('각 카드에 특허 제목이 표시된다', () => {
    render(<PatentValidContent />);
    PATENT_VALID_LIST.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });
});

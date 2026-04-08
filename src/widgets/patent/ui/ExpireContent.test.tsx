import { PATENT_EXPIRE_LIST } from '@entities/patent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PatentExpireContent } from './ExpireContent';

describe('PatentExpireContent', () => {
  it('PATENT_EXPIRE_LIST 개수만큼 항목이 렌더링된다', () => {
    const { container } = render(<PatentExpireContent />);
    expect(
      container.querySelectorAll('div.patent__expiration__item'),
    ).toHaveLength(PATENT_EXPIRE_LIST.length);
  });

  it('각 항목의 제목이 표시된다', () => {
    render(<PatentExpireContent />);
    PATENT_EXPIRE_LIST.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('항목 번호가 1부터 순서대로 표시된다', () => {
    render(<PatentExpireContent />);
    PATENT_EXPIRE_LIST.forEach((_, index) => {
      expect(screen.getByText(`${index + 1}.`)).toBeInTheDocument();
    });
  });
});

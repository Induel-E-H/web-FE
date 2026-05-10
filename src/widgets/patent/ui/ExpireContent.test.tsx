import { PATENT_EXPIRE_LIST } from '@entities/patent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PatentExpireContent } from './ExpireContent';

describe('PatentExpireContent', () => {
  it('PATENT_EXPIRE_LIST 개수만큼 항목이 렌더링된다', () => {
    const { container } = render(<PatentExpireContent />);
    expect(
      container.querySelectorAll('li.patent__expiration__item'),
    ).toHaveLength(PATENT_EXPIRE_LIST.length);
  });

  it('헤더에 만료 특허 건수가 표시된다', () => {
    render(<PatentExpireContent />);
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: `만료 특허 이력 (${PATENT_EXPIRE_LIST.length}건)`,
      }),
    ).toBeInTheDocument();
  });

  it('각 항목의 제목이 표시된다', () => {
    render(<PatentExpireContent />);
    PATENT_EXPIRE_LIST.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('각 항목의 serialNumber가 표시된다', () => {
    render(<PatentExpireContent />);
    PATENT_EXPIRE_LIST.forEach((item) => {
      expect(screen.getByText(item.serialNumber)).toBeInTheDocument();
    });
  });

  it('항목 번호가 1부터 순서대로 표시된다', () => {
    render(<PatentExpireContent />);
    PATENT_EXPIRE_LIST.forEach((_, index) => {
      expect(screen.getByText(`${index + 1}.`)).toBeInTheDocument();
    });
  });
});

import type { PatentValidType } from '@entities/patent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PatentCard } from './Card';

const mockItem: PatentValidType = {
  serialNumber: '제 10-1506087호',
  applicationNumber: '제 10-2013-0112981호',
  filingDate: '2013. 09. 24',
  registrationDate: '2015. 03. 19',
  title: '신체적 약자를 위한 일체형 다용도 화장대',
};

describe('PatentCard', () => {
  it('div.patent__card로 렌더링된다', () => {
    const { container } = render(<PatentCard item={mockItem} />);
    expect(container.querySelector('div.patent__card')).toBeInTheDocument();
  });

  it('특허 제목이 표시된다', () => {
    render(<PatentCard item={mockItem} />);
    expect(
      screen.getByText('신체적 약자를 위한 일체형 다용도 화장대'),
    ).toBeInTheDocument();
  });

  it('등록번호(serialNumber)가 표시된다', () => {
    render(<PatentCard item={mockItem} />);
    expect(screen.getByText('제 10-1506087호')).toBeInTheDocument();
  });

  it('출원 연도(filingDate 앞 4자리)가 표시된다', () => {
    render(<PatentCard item={mockItem} />);
    expect(screen.getByText('2013')).toBeInTheDocument();
  });
});

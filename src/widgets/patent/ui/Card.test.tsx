import type { PatentValidType } from '@entities/patent';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PatentCard } from './Card';

const mockItem: PatentValidType = {
  serialNumber: '제 10-1506087호',
  applicationNumber: '제 10-2013-0112981호',
  filingDate: '2013. 09. 24',
  registrationDate: '2015. 03. 19',
  title: '신체적 약자를 위한 일체형 다용도 화장대',
};

describe('PatentCard', () => {
  it('button.patent__card로 렌더링된다', () => {
    const { container } = render(
      <PatentCard item={mockItem} onClick={vi.fn()} />,
    );
    expect(container.querySelector('button.patent__card')).toBeInTheDocument();
  });

  it('특허 제목이 표시된다', () => {
    render(<PatentCard item={mockItem} onClick={vi.fn()} />);
    expect(
      screen.getByText('신체적 약자를 위한 일체형 다용도 화장대'),
    ).toBeInTheDocument();
  });

  it('등록번호(serialNumber)가 표시된다', () => {
    render(<PatentCard item={mockItem} onClick={vi.fn()} />);
    expect(screen.getByText('제 10-1506087호')).toBeInTheDocument();
  });

  it('출원 연도(filingDate 앞 4자리)가 표시된다', () => {
    render(<PatentCard item={mockItem} onClick={vi.fn()} />);
    expect(screen.getByText('2013년 출원')).toBeInTheDocument();
  });

  it('time 요소의 dateTime이 "YYYY-MM-DD" 형식이다', () => {
    const { container } = render(
      <PatentCard item={mockItem} onClick={vi.fn()} />,
    );
    const time = container.querySelector('time.info-card__text__year');
    expect(time).toHaveAttribute('dateTime', '2013-09-24');
  });

  it('클릭 시 onClick이 호출된다', () => {
    const onClick = vi.fn();
    render(<PatentCard item={mockItem} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

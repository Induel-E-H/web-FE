import type { AwardItem } from '@entities/award';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AwardCount } from './Count';

const mockList: AwardItem[] = [
  {
    id: 0,
    title: '테스트1',
    category: '표창장',
    date: '2008. 01. 01',
    issuer: '기관A',
  },
  {
    id: 1,
    title: '테스트2',
    category: '당선작',
    date: '2014. 01. 01',
    issuer: '기관B',
  },
  {
    id: 2,
    title: '테스트3',
    category: '당선증',
    date: '2006. 01. 01',
    issuer: '기관C',
  },
];

describe('AwardCount', () => {
  it('div.award__count로 렌더링된다', () => {
    const { container } = render(<AwardCount awardList={mockList} />);
    expect(container.querySelector('div.award__count')).toBeInTheDocument();
  });

  it('awardList 길이가 건수로 표시된다', () => {
    render(<AwardCount awardList={mockList} />);
    expect(screen.getByText('총 3건의 표창 및 수상')).toBeInTheDocument();
  });

  it('빈 리스트일 때 0건으로 표시된다', () => {
    render(<AwardCount awardList={[]} />);
    expect(screen.getByText('총 0건의 표창 및 수상')).toBeInTheDocument();
  });
});

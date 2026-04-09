import { awardData } from '@entities/history';
import { AWARD_YEAR_RANGES_BY_BREAKPOINT } from '@features/history/model/pageRegistry';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AwardPage } from './Award';

const [desktopStart0, desktopEnd0] = AWARD_YEAR_RANGES_BY_BREAKPOINT.desktop[0];
const firstRangeItems = awardData.filter(
  (item) => item.year >= desktopStart0 && item.year <= desktopEnd0,
);

describe('AwardPage', () => {
  describe('타이틀', () => {
    it('pageIndex=0, side=left(dataIndex=0)이면 "Award" 타이틀이 보인다', () => {
      render(<AwardPage side='left' pageIndex={0} breakpoint='desktop' />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Award',
      );
    });

    it('pageIndex=0, side=right(dataIndex=1)이면 타이틀이 없다', () => {
      render(<AwardPage side='right' pageIndex={0} breakpoint='desktop' />);
      expect(
        screen.queryByRole('heading', { level: 3 }),
      ).not.toBeInTheDocument();
    });
  });

  describe('데이터 렌더링', () => {
    it('desktop 첫 번째 범위 내 연도 그룹이 렌더링된다', () => {
      render(<AwardPage side='left' pageIndex={0} breakpoint='desktop' />);
      firstRangeItems.forEach((group) => {
        expect(screen.getByText(String(group.year))).toBeInTheDocument();
      });
    });

    it('desktop 첫 번째 범위의 수상 내용이 렌더링된다', () => {
      render(<AwardPage side='left' pageIndex={0} breakpoint='desktop' />);
      if (
        firstRangeItems.length > 0 &&
        firstRangeItems[0].contents.length > 0
      ) {
        expect(
          screen.getByText(firstRangeItems[0].contents[0]),
        ).toBeInTheDocument();
      }
    });

    it('유효하지 않은 pageIndex에서도 오류 없이 빈 컨테이너를 렌더링한다', () => {
      expect(() =>
        render(<AwardPage side='left' pageIndex={99} breakpoint='desktop' />),
      ).not.toThrow();
    });

    it('tablet breakpoint에서도 오류 없이 렌더링된다', () => {
      expect(() =>
        render(<AwardPage side='left' pageIndex={0} breakpoint='tablet' />),
      ).not.toThrow();
    });
  });
});

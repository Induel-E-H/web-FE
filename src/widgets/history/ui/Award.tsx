import { awardData } from '@entities/history';
import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { getArtworkIndex } from '../model/helpers';
import { AWARD_YEAR_RANGES_BY_BREAKPOINT } from '../model/pageRegistry';
import type { PageSide } from '../model/types';
import '../styles/Award.css';
import { BookPageTitle } from './BookPageTitle';

function getItemsByRange(start: number, end: number) {
  return awardData.filter((item) => item.year >= start && item.year <= end);
}

const pagesByBreakpoint = Object.fromEntries(
  Object.entries(AWARD_YEAR_RANGES_BY_BREAKPOINT).map(([bp, ranges]) => [
    bp,
    ranges.map(([start, end]) => getItemsByRange(start, end)),
  ]),
) as Record<Breakpoint, ReturnType<typeof getItemsByRange>[]>;

export function AwardPage({
  side,
  pageIndex,
  breakpoint,
}: {
  side: PageSide;
  pageIndex: number;
  breakpoint: Breakpoint;
}) {
  const pages = pagesByBreakpoint[breakpoint];
  const dataIndex = getArtworkIndex(pageIndex, side);
  const items = pages[dataIndex] ?? [];
  const showTitle = dataIndex === 0;

  return (
    <div className='award__container'>
      {showTitle && <BookPageTitle title='Award' />}
      <div className='award__content'>
        {items.map((group) => (
          <div key={group.year} className='award__year-group'>
            <h4 className='award__year'>{group.year}</h4>
            <ul className='award__ul'>
              {group.contents.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

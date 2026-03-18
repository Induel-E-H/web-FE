import { awardData } from '@entities/history';
import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { getDataIndex } from '../model/helpers';
import { AWARD_YEAR_RANGES_BY_BREAKPOINT } from '../model/pageRegistry';
import type { PageSide } from '../model/types';
import '../styles/Award.css';
import { BookPageTitle } from './BookPageTitle';

function getItemsByRange(start: number, end: number) {
  return awardData.filter((item) => item.year >= start && item.year <= end);
}

export function AwardPage({
  side,
  pageIndex,
}: {
  side: PageSide;
  pageIndex: number;
}) {
  const breakpoint = useBreakpoint();
  const ranges = AWARD_YEAR_RANGES_BY_BREAKPOINT[breakpoint];
  const pages = ranges.map(([start, end]) => getItemsByRange(start, end));
  const dataIndex = getDataIndex(pageIndex, side);
  const items = pages[dataIndex] ?? [];
  const showTitle = dataIndex === 0;

  return (
    <div className='award__container'>
      {showTitle && <BookPageTitle title='Award' />}
      <div className='award__content'>
        {items.map((group) => (
          <div key={group.year} className='award__year-group'>
            <span className='award__year'>{group.year}</span>
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

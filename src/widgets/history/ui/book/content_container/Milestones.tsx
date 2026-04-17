import { milestonesData } from '@entities/history';
import { getArtworkIndex } from '@features/history/model/helpers';
import { MILESTONES_YEAR_RANGES_BY_BREAKPOINT } from '@features/history/model/pageRegistry';
import type { PageSide } from '@features/history/model/types';
import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import '../../../styles/book/content_container/Milestones.css';
import { BookPageTitle } from '../PageTitle';

function getItemsByRange(start: number, end: number) {
  return milestonesData.filter(
    (item) => item.year >= start && item.year <= end,
  );
}

const pagesByBreakpoint = Object.fromEntries(
  Object.entries(MILESTONES_YEAR_RANGES_BY_BREAKPOINT).map(([bp, ranges]) => [
    bp,
    ranges.map(([start, end]) => getItemsByRange(start, end)),
  ]),
) as Record<Breakpoint, ReturnType<typeof getItemsByRange>[]>;

export function MilestonesPage({
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
    <div className='milestones__container'>
      {showTitle && <BookPageTitle title='Milestones' />}
      <div className='milestones__content'>
        {items.map((group) => (
          <div key={group.year} className='milestones__year-group'>
            <h4 className='milestones__year'>{group.year}</h4>
            <ul className='milestones__ul'>
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

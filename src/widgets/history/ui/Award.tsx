import awardData from '../model/data/award.json';
import { getDataIndex } from '../model/helpers';
import { AWARD_YEAR_RANGES } from '../model/pageRegistry';
import type { PageSide } from '../model/types';
import '../styles/Award.css';
import { BookPageTitle } from './BookPageTitle';

function getItemsByRange(start: number, end: number) {
  return awardData.filter((item) => item.year >= start && item.year <= end);
}

const pages = AWARD_YEAR_RANGES.map(([start, end]) =>
  getItemsByRange(start, end),
);

export function AwardPage({
  side,
  pageIndex,
}: {
  side: PageSide;
  pageIndex: number;
}) {
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

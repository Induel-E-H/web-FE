import { timelineData } from '@entities/history';
import type { PageSide } from '@features/history';
import { PAGE_SIDE } from '@features/history';

import '../../../styles/book/content_container/Timeline.css';
import { BookPageTitle } from '../PageTitle';

const maxPerPage = Math.ceil(timelineData.length / 2);
const leftItems = timelineData.slice(0, maxPerPage);
const rightItems = timelineData.slice(maxPerPage);

export function TimelinePage({ side }: { side: PageSide }) {
  const isLeft = side === PAGE_SIDE.LEFT;
  const isRight = side === PAGE_SIDE.RIGHT;
  const items = isLeft ? leftItems : rightItems;

  return (
    <div className='timeline__container'>
      <BookPageTitle title='Timeline' hidden={isRight} />
      <ul className='timeline__ul'>
        {Array.from({ length: maxPerPage }, (_, i) => {
          const item = items[i];
          return item ? (
            <li key={item.name}>
              <time>{item.date}</time>:<span>{item.name}</span>
            </li>
          ) : (
            <li
              key={`empty-${i}`}
              aria-hidden='true'
              className='timeline__ul-placeholder'
            />
          );
        })}
      </ul>
    </div>
  );
}

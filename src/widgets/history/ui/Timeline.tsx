import timelineItem from '../model/data/timeline.json';
import type { PageSide } from '../model/types';
import '../styles/Timeline.css';
import { BookPageTitle } from './BookPageTitle';

const maxPerPage = Math.ceil(timelineItem.length / 2);
const leftItems = timelineItem.slice(0, maxPerPage);
const rightItems = timelineItem.slice(maxPerPage);

export function TimelinePage({ side }: { side: PageSide }) {
  const items = side === 'left' ? leftItems : rightItems;

  return (
    <div className='timeline__container'>
      <BookPageTitle title='Timeline' hidden={side === 'right'} />
      <ul className='timeline__ul'>
        {Array.from({ length: maxPerPage }, (_, i) => {
          const item = items[i];
          return item ? (
            <li key={item.name}>
              <span>{item.date}:</span>
              <span>{item.name}</span>
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

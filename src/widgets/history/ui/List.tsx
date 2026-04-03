import { artworks } from '@entities/history';

import type { PageSide } from '../model/types';
import '../styles/List.css';
import { BookPageTitle } from './BookPageTitle';

const midpoint = Math.ceil(artworks.length / 2);
const leftItems = artworks.slice(0, midpoint);
const rightItems = artworks.slice(midpoint);

export function ListPage({
  side,
  onItemClick,
}: {
  side: PageSide;
  onItemClick?: (artworkIndex: number) => void;
}) {
  const items = side === 'left' ? leftItems : rightItems;
  const offset = side === 'left' ? 0 : midpoint;

  return (
    <nav className='list__container' aria-label='작품 목록'>
      <BookPageTitle title='List' hidden={side === 'right'} hrWidth='41.32%' />
      <ul className='list__ul'>
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type='button'
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onItemClick?.(offset + i)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

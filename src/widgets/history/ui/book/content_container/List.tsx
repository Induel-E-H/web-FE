import { artworks } from '@entities/history';
import { PAGE_SIDE } from '@features/history';
import type { PageSide } from '@features/history/model/types';
import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import '../../../styles/book/content_container/List.css';
import { BookPageTitle } from '../PageTitle';

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
  const breakpoint = useBreakpoint();
  const isLeft = side === PAGE_SIDE.LEFT;
  const isRight = side === PAGE_SIDE.RIGHT;
  const items = isLeft ? leftItems : rightItems;
  const offset = isLeft ? 0 : midpoint;

  return (
    <nav className='list__container' aria-label='작품 목록'>
      <BookPageTitle title='List' hidden={isRight} />
      <ul className='list__ul'>
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type='button'
              onMouseDown={
                breakpoint !== 'mobile' ? (e) => e.stopPropagation() : undefined
              }
              onClick={
                breakpoint !== 'mobile'
                  ? () => onItemClick?.(offset + i)
                  : undefined
              }
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

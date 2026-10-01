import type { CSSProperties } from 'react';

import { artworks } from '@entities/history';
import {
  getListRange,
  LIST_ITEMS_FIRST_PAGE,
  LIST_ITEMS_PER_PAGE,
  PAGE_SIDE,
} from '@features/history';
import type { PageSide } from '@features/history';
import { useBreakpoint } from '@shared/lib/breakpoint';

import '../../../styles/book/content_container/List.css';
import { BookPageTitle } from '../PageTitle';

export function ListPage({
  side,
  pageIndex = 0,
  onItemClick,
}: {
  side: PageSide;
  pageIndex?: number;
  onItemClick?: (artworkIndex: number) => void;
}) {
  const breakpoint = useBreakpoint();
  const isFirstPage = pageIndex === 0 && side === PAGE_SIDE.LEFT;
  const [offset, end] = getListRange(pageIndex, side);
  const items = artworks.slice(offset, end);

  return (
    <nav className='list__container' aria-label='작품 목록'>
      {isFirstPage && <BookPageTitle title='List' label='목차' />}
      <ul
        className='list__ul'
        style={
          {
            '--list-rows': isFirstPage
              ? LIST_ITEMS_FIRST_PAGE
              : LIST_ITEMS_PER_PAGE,
          } as CSSProperties
        }
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type='button'
              title={item.title}
              onMouseDown={
                breakpoint !== 'mobile' ? (e) => e.stopPropagation() : undefined
              }
              onKeyDown={(e) => e.stopPropagation()}
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

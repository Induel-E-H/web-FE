import artworks from '../asset/data/artwork.json';
import type { IndexItem, PageSide } from './types';

export const CONTENT_TOTAL_PAGES = Math.ceil(artworks.length / 2);

export const INDEX_LIST: readonly IndexItem[] = [
  'List',
  'Content',
  'History',
  'Award',
];

export const PAGE_SIDE: { readonly LEFT: PageSide; readonly RIGHT: PageSide } =
  {
    LEFT: 'left',
    RIGHT: 'right',
  };

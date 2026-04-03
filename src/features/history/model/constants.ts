import type { IndexItem, PageSide } from './types';

export const INDEX_LIST: readonly IndexItem[] = [
  'List',
  'Content',
  'Timeline',
  'Award',
];

export const PAGE_SIDE: { readonly LEFT: PageSide; readonly RIGHT: PageSide } =
  {
    LEFT: 'left',
    RIGHT: 'right',
  };

export const FLIP_DURATION = 800;
export const RAPID_FLIP_DURATION = 300;
export const MIN_RAPID_FLIPS = 3;

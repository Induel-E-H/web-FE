import type { IndexItem, PageSide } from './types';

export const INDEX_LIST: readonly IndexItem[] = [
  'List',
  'Content',
  'Timeline',
  'Milestones',
];

export const PAGE_SIDE: { readonly LEFT: PageSide; readonly RIGHT: PageSide } =
  {
    LEFT: 'left',
    RIGHT: 'right',
  };

export const FLIP_DURATION = 800;
export const RAPID_FLIP_DURATION = 300;
export const PASS_THROUGH_FLIP_DURATION = 150;
export const MAX_SOURCE_PAGE_FLIPS = 3;

import type { IndexItem } from './types';

export const INDEX_LIST: readonly IndexItem[] = [
  'List',
  'Content',
  'Timeline',
  'Milestones',
];

export const PAGE_SIDE = { LEFT: 'left', RIGHT: 'right' } as const;

export const FLIP_DURATION = 800;
export const RAPID_FLIP_DURATION = 300;
export const CHAIN_EDGE_FLIPS = 4;
export const LIST_ITEMS_PER_PAGE = 14;

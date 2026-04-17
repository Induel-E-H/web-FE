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
export const PASS_THROUGH_FLIP_DURATION = 150;
export const MAX_SOURCE_PAGE_FLIPS = 3;

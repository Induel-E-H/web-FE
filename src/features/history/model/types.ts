import type { BOOK_STATE } from './constants';

export type PageSide = 'left' | 'right';

export type IndexItem = 'List' | 'Content' | 'Timeline' | 'Milestones';

export type FlipDirection = 'forward' | 'backward';

export type NavigationStep = {
  item: IndexItem;
  pageIndex: number;
  duration?: number;
};

export type BookState = (typeof BOOK_STATE)[keyof typeof BOOK_STATE];

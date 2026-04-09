export type PageSide = 'left' | 'right';

export type IndexItem = 'List' | 'Content' | 'Timeline' | 'Milestones';

export type FlipDirection = 'forward' | 'backward';

export type NavigationStep = {
  item: IndexItem;
  pageIndex: number;
  duration?: number;
};

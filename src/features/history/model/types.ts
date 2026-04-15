export type PageSide = 'left' | 'right';

export type IndexItem = 'List' | 'Content' | 'Timeline' | 'Milestones';

export type FlipDirection = 'forward' | 'backward';

export type NavigationStep = {
  item: IndexItem;
  pageIndex: number;
  duration?: number;
};

export type BookState =
  | 'cover-front' // 앞표지만 보임 (중앙 위치)
  | 'opening-front' // 앞표지 → 첫 페이지 열리는 중 (flip forward)
  | 'open' // 책 펼쳐진 상태
  | 'closing-front' // 첫 페이지 → 앞표지로 닫히는 중 (flip backward)
  | 'cover-back' // 뒤표지만 보임 (중앙 위치)
  | 'opening-back' // 뒤표지 → 마지막 페이지 열리는 중 (flip backward)
  | 'closing-back'; // 마지막 페이지 → 뒤표지로 닫히는 중 (flip forward)

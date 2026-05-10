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

export const BOOK_STATE = {
  COVER_FRONT: 'cover-front', // 앞 표지 상태 (기본 닫힌 상태, 정면)
  OPENING_FRONT: 'opening-front', // 앞 표지 → 펼쳐지는 중 (forward flip 애니메이션)
  OPEN: 'open', // 책이 완전히 펼쳐진 상태 (좌/우 페이지 모두 노출)
  CLOSING_FRONT: 'closing-front', // 펼쳐진 상태 → 앞 표지로 닫히는 중 (reverse flip)
  COVER_BACK: 'cover-back', // 뒤 표지 상태 (뒤쪽 기준 닫힌 상태)
  OPENING_BACK: 'opening-back', // 뒤 표지 → 펼쳐지는 중 (backward flip 애니메이션)
  CLOSING_BACK: 'closing-back', // 펼쳐진 상태 → 뒤 표지로 닫히는 중 (reverse to back cover)
};

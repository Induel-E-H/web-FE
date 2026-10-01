import { artworks, getThumbnailImage } from '@entities/history';
import { preloadImages } from '@shared/lib/preload/preloadImages';

import {
  LIST_ITEMS_FIRST_PAGE,
  LIST_ITEMS_PER_PAGE,
  PAGE_SIDE,
} from './constants';
import type { PageSide } from './types';

export function getArtworkIndex(pageIndex: number, side: PageSide): number {
  const isLeft = side === PAGE_SIDE.LEFT;
  return pageIndex * 2 + (isLeft ? 0 : 1);
}

export function getListRange(
  pageIndex: number,
  side: PageSide,
): [number, number] {
  const page = getArtworkIndex(pageIndex, side);
  if (page === 0) return [0, Math.min(LIST_ITEMS_FIRST_PAGE, artworks.length)];
  const start = LIST_ITEMS_FIRST_PAGE + (page - 1) * LIST_ITEMS_PER_PAGE;
  return [start, Math.min(start + LIST_ITEMS_PER_PAGE, artworks.length)];
}

export function getListPageCount(): number {
  const rest = Math.max(0, artworks.length - LIST_ITEMS_FIRST_PAGE);
  return 1 + Math.ceil(rest / LIST_ITEMS_PER_PAGE);
}

export function preloadContentImages(pageIndex: number): void {
  const indices = [
    getArtworkIndex(pageIndex, 'left'),
    getArtworkIndex(pageIndex, 'right'),
    getArtworkIndex(pageIndex + 1, 'left'),
    getArtworkIndex(pageIndex + 1, 'right'),
    getArtworkIndex(pageIndex - 1, 'left'),
    getArtworkIndex(pageIndex - 1, 'right'),
  ];

  preloadImages(
    indices
      .filter((idx) => idx >= 0 && idx < artworks.length)
      .map((idx) => getThumbnailImage(idx)),
  );
}

import { artworks, getThumbnailImage } from '@entities/history';
import { preloadImages } from '@shared/lib/preload/preloadImages';

import { PAGE_SIDE } from './constants';
import type { PageSide } from './types';

export function getArtworkIndex(pageIndex: number, side: PageSide): number {
  const isLeft = side === PAGE_SIDE.LEFT;
  return pageIndex * 2 + (isLeft ? 0 : 1);
}

export function preloadContentImages(pageIndex: number): void {
  const adjacentIndices = [
    getArtworkIndex(pageIndex + 1, 'left'),
    getArtworkIndex(pageIndex + 1, 'right'),
    getArtworkIndex(pageIndex - 1, 'left'),
    getArtworkIndex(pageIndex - 1, 'right'),
  ];

  preloadImages(
    adjacentIndices
      .filter((idx) => idx >= 0 && idx < artworks.length)
      .map((idx) => getThumbnailImage(idx)),
  );
}

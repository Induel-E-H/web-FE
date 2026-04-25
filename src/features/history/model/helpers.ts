import { artworks, getThumbnailImage } from '@entities/history';

import { PAGE_SIDE } from '../model/constants';
import type { PageSide } from './types';

export function getArtworkIndex(pageIndex: number, side: PageSide): number {
  const isLeft = side === PAGE_SIDE.LEFT;
  return pageIndex * 2 + (isLeft ? 0 : 1);
}

export function preloadContentImages(pageIndex: number): void {
  const adjacentIndices = [
    getArtworkIndex(pageIndex + 1, 'left'),
    getArtworkIndex(pageIndex + 1, 'right'),
    getArtworkIndex(pageIndex + 2, 'left'),
    getArtworkIndex(pageIndex + 2, 'right'),
    getArtworkIndex(pageIndex - 1, 'left'),
    getArtworkIndex(pageIndex - 1, 'right'),
    getArtworkIndex(pageIndex - 2, 'left'),
    getArtworkIndex(pageIndex - 2, 'right'),
  ];

  for (const idx of adjacentIndices) {
    if (idx < 0 || idx >= artworks.length) continue;
    const src = getThumbnailImage(idx);
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }
}

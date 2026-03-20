import { artworks } from '@entities/history';

import type { PageSide } from './types';

export function getArtworkIndex(pageIndex: number, side: PageSide): number {
  return pageIndex * 2 + (side === 'left' ? 0 : 1);
}

const contentImages = import.meta.glob('../assets/content/*/0.webp', {
  eager: true,
  import: 'default',
});

export function getContentImage(index: number): string | undefined {
  const src = contentImages[`../assets/content/${index}/0.webp`];
  return typeof src === 'string' ? src : undefined;
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
    const src = getContentImage(idx);
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }
}

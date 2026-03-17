import type { PageSide } from './types';

export function getDataIndex(pageIndex: number, side: PageSide): number {
  return pageIndex * 2 + (side === 'left' ? 0 : 1);
}

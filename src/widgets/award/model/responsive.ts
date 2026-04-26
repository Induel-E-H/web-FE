import type { Breakpoint } from '@shared/lib/breakpoint';

export function getItemsPerPage(breakpoint: Breakpoint): number {
  if (breakpoint === 'mobile') return 4;
  if (breakpoint === 'tablet') return 6;
  return 10;
}

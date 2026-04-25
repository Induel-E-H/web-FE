import {
  isMobileViewport,
  isTabletViewport,
} from '@shared/lib/breakpoint/viewport';

export function getItemsPerPage(): number {
  if (isMobileViewport()) return 4;
  if (isTabletViewport()) return 6;
  return 10;
}

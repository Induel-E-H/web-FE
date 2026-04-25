import {
  BREAKPOINT_MOBILE_MAX,
  BREAKPOINT_TABLET_MAX,
} from '@shared/lib/breakpoint/useBreakpoint';

export function getItemsPerPage(): number {
  if (window.innerWidth <= BREAKPOINT_MOBILE_MAX) return 4;
  if (window.innerWidth <= BREAKPOINT_TABLET_MAX) return 6;
  return 10;
}

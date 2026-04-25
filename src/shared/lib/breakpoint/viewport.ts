import { BREAKPOINT_MOBILE_MAX, BREAKPOINT_TABLET_MAX } from './useBreakpoint';

export function isMobileViewport(): boolean {
  return window.innerWidth <= BREAKPOINT_MOBILE_MAX;
}

export function isTabletViewport(): boolean {
  return window.innerWidth <= BREAKPOINT_TABLET_MAX;
}

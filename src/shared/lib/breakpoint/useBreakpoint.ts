import { useSyncExternalStore } from 'react';

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export const BREAKPOINT_MOBILE_MAX = 767;
export const BREAKPOINT_TABLET_MAX = 1024;

const MOBILE_QUERY = `(max-width: ${BREAKPOINT_MOBILE_MAX}px)`;
const TABLET_QUERY = `(max-width: ${BREAKPOINT_TABLET_MAX}px)`;

const mobileMql = window.matchMedia(MOBILE_QUERY);
const tabletMql = window.matchMedia(TABLET_QUERY);

function getBreakpoint(): Breakpoint {
  if (mobileMql.matches) return 'mobile';
  if (tabletMql.matches) return 'tablet';
  return 'desktop';
}

let cached: Breakpoint = getBreakpoint();

function subscribe(callback: () => void) {
  const handler = () => {
    cached = getBreakpoint();
    callback();
  };
  mobileMql.addEventListener('change', handler);
  tabletMql.addEventListener('change', handler);
  return () => {
    mobileMql.removeEventListener('change', handler);
    tabletMql.removeEventListener('change', handler);
  };
}

function getSnapshot(): Breakpoint {
  return cached;
}

function getServerSnapshot(): Breakpoint {
  return 'desktop';
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

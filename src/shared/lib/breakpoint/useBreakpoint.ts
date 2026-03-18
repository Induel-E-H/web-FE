import { useSyncExternalStore } from 'react';

export type Breakpoint = 'desktop' | 'tablet';

const TABLET_QUERY = '(max-width: 1024px)';
const tabletMql = window.matchMedia(TABLET_QUERY);

function getBreakpoint(): Breakpoint {
  return tabletMql.matches ? 'tablet' : 'desktop';
}

let cached: Breakpoint = getBreakpoint();

function subscribe(callback: () => void) {
  const handler = () => {
    cached = getBreakpoint();
    callback();
  };
  tabletMql.addEventListener('change', handler);
  return () => {
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

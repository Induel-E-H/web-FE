import { useSyncExternalStore } from 'react';

type Breakpoint = 'desktop' | 'tablet';

const TABLET_QUERY = '(max-width: 1024px)';

function getBreakpoint(): Breakpoint {
  if (window.matchMedia(TABLET_QUERY).matches) return 'tablet';
  return 'desktop';
}

let cached: Breakpoint = getBreakpoint();

function subscribe(callback: () => void) {
  const tabletMql = window.matchMedia(TABLET_QUERY);
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

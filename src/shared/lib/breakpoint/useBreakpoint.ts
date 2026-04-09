import { useSyncExternalStore } from 'react';

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(max-width: 1024px)';

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

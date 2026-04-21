import { artworks } from '@entities/history';
import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import type { IndexItem } from './types';

export const MILESTONES_YEAR_RANGES_BY_BREAKPOINT: Record<
  Breakpoint,
  readonly (readonly [number, number])[]
> = {
  desktop: [
    [2003, 2006],
    [2007, 2009],
    [2010, 2012],
    [2013, 2015],
    [2016, 2018],
    [2019, 2019],
  ],
  tablet: [
    [2003, 2006],
    [2007, 2009],
    [2010, 2012],
    [2013, 2015],
    [2016, 2018],
    [2019, 2019],
  ],
  mobile: [
    [2003, 2005],
    [2006, 2007],
    [2008, 2009],
    [2010, 2012],
    [2013, 2015],
    [2016, 2018],
    [2019, 2019],
  ],
};

export type PageConfig = {
  totalPages: number;
};

const cache = new Map<Breakpoint, Record<IndexItem, PageConfig>>();

export function getPageRegistry(
  breakpoint: Breakpoint,
): Record<IndexItem, PageConfig> {
  const cachedRegistry = cache.get(breakpoint);
  if (cachedRegistry) return cachedRegistry;

  const ranges = MILESTONES_YEAR_RANGES_BY_BREAKPOINT[breakpoint];
  const registry: Record<IndexItem, PageConfig> = {
    List: { totalPages: 1 },
    Content: { totalPages: Math.ceil(artworks.length / 2) },
    Timeline: { totalPages: 1 },
    Milestones: { totalPages: Math.ceil(ranges.length / 2) },
  };
  cache.set(breakpoint, registry);
  return registry;
}

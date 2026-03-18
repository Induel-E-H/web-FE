import { artworks } from '@entities/history';

import type { IndexItem } from './types';

type Breakpoint = 'desktop' | 'tablet';

export const AWARD_YEAR_RANGES_BY_BREAKPOINT: Record<
  Breakpoint,
  readonly (readonly [number, number])[]
> = {
  desktop: [
    [2003, 2007],
    [2008, 2011],
    [2012, 2015],
    [2016, 2019],
  ],
  tablet: [
    [2003, 2006],
    [2007, 2009],
    [2010, 2013],
    [2014, 2016],
    [2017, 2019],
  ],
};

type PageConfig = {
  totalPages: number;
};

export function getPageRegistry(
  breakpoint: Breakpoint,
): Record<IndexItem, PageConfig> {
  const ranges = AWARD_YEAR_RANGES_BY_BREAKPOINT[breakpoint];
  return {
    List: { totalPages: 1 },
    Content: { totalPages: Math.ceil(artworks.length / 2) },
    Timeline: { totalPages: 1 },
    Award: { totalPages: Math.ceil(ranges.length / 2) },
  };
}

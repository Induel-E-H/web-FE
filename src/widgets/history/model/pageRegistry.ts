import artworks from './data/artwork.json';
import type { IndexItem } from './types';

export const AWARD_YEAR_RANGES = [
  [2003, 2007],
  [2008, 2011],
  [2012, 2015],
  [2016, 2019],
] as const;

type PageConfig = {
  totalPages: number;
};

export const PAGE_REGISTRY: Record<IndexItem, PageConfig> = {
  List: { totalPages: 1 },
  Content: { totalPages: Math.ceil(artworks.length / 2) },
  Timeline: { totalPages: 1 },
  Award: { totalPages: Math.ceil(AWARD_YEAR_RANGES.length / 2) },
};

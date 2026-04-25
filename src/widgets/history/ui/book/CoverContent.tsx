import type { ReactNode } from 'react';

import type { BookState } from '@features/history';

import { BackCoverInner } from './BackCover';
import { FrontCoverInner } from './FrontCover';

export type CoverContent = {
  coverFrontContent: ReactNode;
  coverBackContent: ReactNode;
};

export function buildCoverContent(
  bookState: BookState,
  leftSlot: ReactNode,
  rightSlot: ReactNode,
): CoverContent {
  switch (bookState) {
    case 'opening-front':
      return {
        coverFrontContent: <FrontCoverInner />,
        coverBackContent: leftSlot,
      };
    case 'closing-front':
      return {
        coverFrontContent: leftSlot,
        coverBackContent: <FrontCoverInner />,
      };
    case 'closing-back':
      return {
        coverFrontContent: rightSlot,
        coverBackContent: <BackCoverInner />,
      };
    case 'opening-back':
      return {
        coverFrontContent: <BackCoverInner />,
        coverBackContent: rightSlot,
      };
    default:
      return { coverFrontContent: null, coverBackContent: null };
  }
}

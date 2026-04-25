import type { ReactNode } from 'react';

import { PAGE_SIDE } from '@features/history';
import type { PageSide } from '@features/history';

import { BookPageOuterShadow } from './BookPageOuterShadow';
import { BookCover } from './Cover';

interface BookPageSlotProps {
  side: PageSide;
  shadowCount: number;
  children: ReactNode;
}

export function BookPageSlot({
  side,
  shadowCount,
  children,
}: BookPageSlotProps) {
  const isLeft = side === PAGE_SIDE.LEFT;

  return (
    <>
      <BookCover side={side} />
      {isLeft ? (
        <div className='history__book-page-left'>
          <BookPageOuterShadow side={side} count={shadowCount} />
          <div className='history__book-page-content'>{children}</div>
        </div>
      ) : (
        <div className='history__book-page-right'>
          <div className='history__book-page-content'>{children}</div>
          <BookPageOuterShadow side={side} count={shadowCount} />
        </div>
      )}
    </>
  );
}

import type { ReactNode } from 'react';

import { PAGE_SIDE } from '@features/history';
import type { PageSide } from '@features/history';

import '../../styles/book/BookPageSide.css';
import { BookPageOuterShadow } from './BookPageOuterShadow';
import { PageFlip } from './PageFlip';

interface BookPageSideProps {
  side: PageSide;
  staticContent: ReactNode;
  flipFrontContent: ReactNode;
  flipBackContent: ReactNode;
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward' | null;
  flipDuration: number;
  onMouseDown?: () => void;
  shadowCount: number;
  isRapidFlipping?: boolean;
  isHoldChaining?: boolean;
  isHidden: boolean;
}

export function BookPageSide({
  side,
  staticContent,
  flipFrontContent,
  flipBackContent,
  isFlipping,
  flipDirection,
  flipDuration,
  onMouseDown,
  shadowCount,
  isRapidFlipping = false,
  isHoldChaining = false,
  isHidden,
}: BookPageSideProps) {
  const isLeft = side === PAGE_SIDE.LEFT;
  const isRight = side === PAGE_SIDE.RIGHT;

  const panelDirection = flipDirection ?? 'forward';

  const shouldRenderFlip =
    isFlipping &&
    ((isLeft && panelDirection === 'backward') ||
      (isRight && panelDirection === 'forward'));

  return (
    <>
      <div
        className={`history__book-page-${side} history__book-page-${side}--clickable${isHidden ? ' history__book-page-hidden' : ''}`}
        onMouseDown={onMouseDown}
      >
        {isLeft ? (
          <BookPageOuterShadow side={side} count={shadowCount} />
        ) : null}
        <div className='history__book-page-content'>{staticContent}</div>
        {isRight ? (
          <BookPageOuterShadow side={side} count={shadowCount} />
        ) : null}
      </div>

      {shouldRenderFlip && (
        <div className='history__book-page-flip-wrapper'>
          <PageFlip
            isFlipping={isFlipping}
            flipDirection={panelDirection}
            flipDuration={flipDuration}
            flipFrontContent={flipFrontContent}
            flipBackContent={flipBackContent}
            isRapidFlipping={isRapidFlipping}
            isHoldChaining={isHoldChaining}
          />
        </div>
      )}
    </>
  );
}

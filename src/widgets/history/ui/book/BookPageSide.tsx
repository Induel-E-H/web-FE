import type { ReactNode } from 'react';

import { PAGE_SIDE } from '@features/history/model/constants';
import type { PageSide } from '@features/history/model/types';

import '../../styles/book/BookPageOuterShadow.css';
import '../../styles/book/BookPageSide.css';
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

export function BookPageOuterShadow({
  side,
  count,
}: {
  side: PageSide;
  count: number;
}) {
  const levels =
    side === PAGE_SIDE.LEFT
      ? Array.from({ length: count }, (_, i) => count - i)
      : Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className='history__book-page-outer-shadow'>
      {count
        ? levels.map((level) => (
            <div
              key={level}
              className={`history__book-page-outer-shadow-${level}`}
            />
          ))
        : null}
    </div>
  );
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

  const panelDirection = flipDirection ?? 'forward';

  const shouldRenderFlip =
    isFlipping &&
    ((isLeft && panelDirection === 'backward') ||
      (!isLeft && panelDirection === 'forward'));

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
        {!isLeft ? (
          <BookPageOuterShadow side={side} count={shadowCount} />
        ) : null}
      </div>

      {shouldRenderFlip && (
        <PageFlip
          isFlipping={isFlipping}
          flipDirection={panelDirection}
          flipDuration={flipDuration}
          flipFrontContent={flipFrontContent}
          flipBackContent={flipBackContent}
          isRapidFlipping={isRapidFlipping}
          isHoldChaining={isHoldChaining}
        />
      )}
    </>
  );
}

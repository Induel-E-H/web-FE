import type { ReactNode } from 'react';

import { useHistoryStore } from '@features/history';
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
  onMouseDown?: () => void;
  shadowCount: number;
  ariaLabel?: string;
}

export function BookPageSide({
  side,
  staticContent,
  flipFrontContent,
  flipBackContent,
  onMouseDown,
  shadowCount,
  ariaLabel,
}: BookPageSideProps) {
  const bookState = useHistoryStore((s) => s.bookState);
  const isFlipping = useHistoryStore((s) => s.isFlipping);
  const flipDirection = useHistoryStore((s) => s.flipDirection);
  const flipDuration = useHistoryStore((s) => s.currentFlipDuration);
  const isRapidFlipping = useHistoryStore((s) => s.isRapidFlipping);
  const isHoldChaining = useHistoryStore((s) => s.isHoldChaining);

  const isLeft = side === PAGE_SIDE.LEFT;
  const isRight = side === PAGE_SIDE.RIGHT;

  const isCoverFlip =
    bookState.startsWith('opening') || bookState.startsWith('closing');
  const pageIsFlipping = !isCoverFlip && isFlipping;

  const isHidden =
    (isLeft &&
      (bookState === 'opening-front' || bookState === 'closing-front')) ||
    (isRight && (bookState === 'opening-back' || bookState === 'closing-back'));

  const panelDirection = flipDirection ?? 'forward';

  const shouldRenderFlip =
    pageIsFlipping &&
    ((isLeft && panelDirection === 'backward') ||
      (isRight && panelDirection === 'forward'));

  return (
    <>
      <div
        className={`history__book-page-${side} history__book-page-${side}--clickable${isHidden ? ' history__book-page-hidden' : ''}`}
        onMouseDown={onMouseDown}
        tabIndex={0}
        role='button'
        aria-label={ariaLabel}
        onKeyDown={
          onMouseDown
            ? (e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!e.repeat) onMouseDown();
                }
              }
            : undefined
        }
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
            isFlipping={pageIsFlipping}
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

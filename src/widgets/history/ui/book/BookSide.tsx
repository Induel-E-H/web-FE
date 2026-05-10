import type { ReactNode } from 'react';

import { useHistoryStore } from '@features/history';
import { PAGE_SIDE } from '@features/history';
import type { PageSide } from '@features/history';

import '../../styles/book/BookSide.css';
import { BookBackCover } from './BackCover';
import { BookPageSide } from './BookPageSide';
import { BookCover } from './Cover';
import { BookCoverFlip } from './CoverFlip';
import { BookFrontCover } from './FrontCover';

interface BookSideProps {
  side: PageSide;
  staticPageContent: ReactNode;
  flipFrontPageContent: ReactNode;
  flipBackPageContent: ReactNode;
  shadowCount: number;
  onMouseDown?: () => void;
  onFrontCoverClick?: () => void;
  onBackCoverClick?: () => void;
  coverFrontContent?: ReactNode;
  coverBackContent?: ReactNode;
  ariaLabel?: string;
}

export function BookSide({
  side,
  staticPageContent,
  flipFrontPageContent,
  flipBackPageContent,
  shadowCount,
  onMouseDown,
  onFrontCoverClick,
  onBackCoverClick,
  coverFrontContent,
  coverBackContent,
  ariaLabel,
}: BookSideProps) {
  const bookState = useHistoryStore((s) => s.bookState);
  const isRapidFlipping = useHistoryStore((s) => s.isRapidFlipping);
  const isHoldChaining = useHistoryStore((s) => s.isHoldChaining);
  const currentFlipDuration = useHistoryStore((s) => s.currentFlipDuration);

  const isLeft = side === PAGE_SIDE.LEFT;
  const isRight = side === PAGE_SIDE.RIGHT;

  const isCoverFlip =
    bookState.startsWith('opening') || bookState.startsWith('closing');
  const isBookOpen = bookState !== 'cover-front' && bookState !== 'cover-back';

  const showFrontCover = isRight && bookState === 'cover-front';
  const showBackCover = isLeft && bookState === 'cover-back';

  const showBookCover =
    bookState !== 'cover-front' && bookState !== 'cover-back';

  const showCoverFlip =
    isCoverFlip &&
    ((isLeft &&
      (bookState === 'opening-back' || bookState === 'closing-front')) ||
      (isRight &&
        (bookState === 'opening-front' || bookState === 'closing-back')));

  const isHidden =
    (isLeft &&
      (bookState === 'opening-front' || bookState === 'closing-front')) ||
    (isRight && (bookState === 'opening-back' || bookState === 'closing-back'));

  const isPointerDisabled =
    (isLeft && bookState === 'cover-front') ||
    (isRight && bookState === 'cover-back');

  const sideClassName = `history__book-${side}${isRapidFlipping ? ' history__book-page--rapid' : ''}${isHoldChaining ? ' history__book-page--hold' : ''}${isPointerDisabled ? ' history__book--no-pointer' : ''}`;

  return (
    <div className={sideClassName}>
      {isBookOpen && (
        <BookPageSide
          side={side}
          staticContent={staticPageContent}
          flipFrontContent={flipFrontPageContent}
          flipBackContent={flipBackPageContent}
          onMouseDown={onMouseDown}
          shadowCount={shadowCount}
          ariaLabel={ariaLabel}
        />
      )}

      {/* Cover Background */}
      {showBookCover && <BookCover side={side} isHidden={isHidden} />}

      {/* Cover Flip */}
      {showCoverFlip && (
        <BookCoverFlip
          isFlipping={isCoverFlip}
          flipDirection={isLeft ? 'backward' : 'forward'}
          flipDuration={currentFlipDuration}
          frontContent={coverFrontContent}
          backContent={coverBackContent}
        />
      )}

      {showFrontCover && onFrontCoverClick && (
        <BookFrontCover onClick={onFrontCoverClick} />
      )}

      {showBackCover && onBackCoverClick && (
        <BookBackCover onClick={onBackCoverClick} />
      )}
    </div>
  );
}

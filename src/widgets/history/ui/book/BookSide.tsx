import type { ReactNode } from 'react';

import { PAGE_SIDE } from '@features/history/model/constants';
import type { BookState, PageSide } from '@features/history/model/types';

import '../../styles/book/BookSide.css';
import { BookBackCover } from './BackCover';
import { BookPageSide } from './BookPageSide';
import { BookCover } from './Cover';
import { BookCoverFlip } from './CoverFlip';
import { BookFrontCover } from './FrontCover';

interface BookSideProps {
  side: PageSide;
  bookState: BookState;
  isBookOpen: boolean;
  isCoverFlip: boolean;
  isFlipping: boolean;
  isRapidFlipping: boolean;
  isHoldChaining: boolean;
  flipDirection: 'forward' | 'backward' | null;
  currentFlipDuration: number;
  staticPageContent: ReactNode;
  flipFrontPageContent: ReactNode;
  flipBackPageContent: ReactNode;
  shadowCount: number;
  onMouseDown?: () => void;
  onFrontCoverClick?: () => void;
  onBackCoverClick?: () => void;
  coverFrontContent?: ReactNode;
  coverBackContent?: ReactNode;
}

export function BookSide({
  side,
  bookState,
  isBookOpen,
  isCoverFlip,
  isFlipping,
  isRapidFlipping,
  isHoldChaining,
  flipDirection,
  currentFlipDuration,
  staticPageContent,
  flipFrontPageContent,
  flipBackPageContent,
  shadowCount,
  onMouseDown,
  onFrontCoverClick,
  onBackCoverClick,
  coverFrontContent,
  coverBackContent,
}: BookSideProps) {
  const isLeft = side === PAGE_SIDE.LEFT;
  const isRight = side === PAGE_SIDE.RIGHT;

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
          isFlipping={isFlipping}
          flipDirection={flipDirection}
          flipDuration={currentFlipDuration}
          onMouseDown={onMouseDown}
          shadowCount={shadowCount}
          isRapidFlipping={isRapidFlipping}
          isHoldChaining={isHoldChaining}
          isHidden={isHidden}
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

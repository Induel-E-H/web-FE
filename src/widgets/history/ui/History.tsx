import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { PAGE_SIDE, RAPID_FLIP_DURATION } from '@features/history';
import type { IndexItem } from '@features/history';
import { useBookCoverState } from '@features/history';
import { useBookNavigation } from '@features/history';
import { BOOK_STATE } from '@features/history';
import { useBreakpoint } from '@shared/lib/breakpoint';

import '../styles/History.css';
import { BookPageContent } from './book/BookPageContent';
import { BookPageSlot } from './book/BookPageSlot';
import { BookSide } from './book/BookSide';
import { buildCoverContent } from './book/CoverContent';
import { HistoryCategory } from './Category';
import { HistoryTitle } from './HistoryTitle';

export function History() {
  const breakpoint = useBreakpoint();
  const {
    bookState,
    openingFront,
    onOpened,
    closingFront,
    onFrontClosed,
    closingBack,
    onBackClosed,
    openingBack,
  } = useBookCoverState();

  const {
    activeItem,
    tabActiveItem,
    currentPageIndex,
    canGoLeft,
    canGoRight,
    isFlipping,
    flipDirection,
    currentFlipDuration,
    isRapidFlipping,
    isHoldChaining,
    nextPageIndex,
    nextActiveItem,
    prevPageIndex,
    prevActiveItem,
    navigateToCategory,
    beginContinuousFlip,
    syncBoundaryCallbacks,
    syncCoverCallbacks,
    leftShadowCount,
    rightShadowCount,
    startFlipAnimation,
    isAnimatingRef,
  } = useBookNavigation(breakpoint);

  useEffect(() => {
    syncBoundaryCallbacks(
      (duration) => {
        if (bookState === BOOK_STATE.OPEN && !isAnimatingRef.current) {
          closingFront();
          startFlipAnimation('backward', onFrontClosed, duration);
        }
      },
      (duration) => {
        if (bookState === BOOK_STATE.OPEN && !isAnimatingRef.current) {
          closingBack();
          startFlipAnimation('forward', onBackClosed, duration);
        }
      },
    );
    syncCoverCallbacks(
      bookState === 'cover-front',
      bookState === 'cover-back',
      (duration) => {
        if (!isAnimatingRef.current) {
          openingFront();
          startFlipAnimation('forward', onOpened, duration);
        }
      },
      (duration) => {
        if (!isAnimatingRef.current) {
          openingBack();
          startFlipAnimation('backward', onOpened, duration);
        }
      },
    );
  });

  const [pendingCategory, setPendingCategory] = useState<IndexItem | null>(
    null,
  );
  const pendingFiredRef = useRef(false);

  useEffect(() => {
    if (
      bookState === BOOK_STATE.OPEN &&
      pendingCategory !== null &&
      !pendingFiredRef.current
    ) {
      pendingFiredRef.current = true;
      const cat = pendingCategory;
      setTimeout(() => {
        pendingFiredRef.current = false;
        setPendingCategory(null);
        navigateToCategory(cat, 0, true);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookState, pendingCategory]);

  function handleListItemClick(index: number) {
    navigateToCategory('Content', Math.floor(index / 2), true);
  }

  function page(
    item: IndexItem,
    pageIndex: number,
    side: typeof PAGE_SIDE.LEFT | typeof PAGE_SIDE.RIGHT,
  ): ReactNode {
    return (
      <BookPageContent
        side={side}
        pageIndex={pageIndex}
        item={item}
        breakpoint={breakpoint}
        onListItemClick={handleListItemClick}
      />
    );
  }

  const isCoverFlip =
    bookState.startsWith('opening') || bookState.startsWith('closing');
  const isBookOpen = bookState !== 'cover-front' && bookState !== 'cover-back';

  const leftSlot = (
    <BookPageSlot side={PAGE_SIDE.LEFT} shadowCount={leftShadowCount}>
      {page(activeItem, currentPageIndex, PAGE_SIDE.LEFT)}
    </BookPageSlot>
  );
  const rightSlot = (
    <BookPageSlot side={PAGE_SIDE.RIGHT} shadowCount={rightShadowCount}>
      {page(activeItem, currentPageIndex, PAGE_SIDE.RIGHT)}
    </BookPageSlot>
  );

  const { coverFrontContent, coverBackContent } = buildCoverContent(
    bookState,
    leftSlot,
    rightSlot,
  );

  let staticLeftContent: ReactNode;
  let staticRightContent: ReactNode;
  let flipFrontContent: ReactNode;
  let flipBackContent: ReactNode;

  if (isCoverFlip) {
    staticLeftContent = page(activeItem, currentPageIndex, PAGE_SIDE.LEFT);
    staticRightContent = page(activeItem, currentPageIndex, PAGE_SIDE.RIGHT);
  } else if (flipDirection === 'forward') {
    staticLeftContent = page(activeItem, currentPageIndex, PAGE_SIDE.LEFT);
    staticRightContent = page(nextActiveItem, nextPageIndex, PAGE_SIDE.RIGHT);
    flipFrontContent = page(activeItem, currentPageIndex, PAGE_SIDE.RIGHT);
    flipBackContent = page(nextActiveItem, nextPageIndex, PAGE_SIDE.LEFT);
  } else if (flipDirection === 'backward') {
    staticLeftContent = page(prevActiveItem, prevPageIndex, PAGE_SIDE.LEFT);
    staticRightContent = page(activeItem, currentPageIndex, PAGE_SIDE.RIGHT);
    flipFrontContent = page(activeItem, currentPageIndex, PAGE_SIDE.LEFT);
    flipBackContent = page(prevActiveItem, prevPageIndex, PAGE_SIDE.RIGHT);
  } else {
    staticLeftContent = page(activeItem, currentPageIndex, PAGE_SIDE.LEFT);
    staticRightContent = page(activeItem, currentPageIndex, PAGE_SIDE.RIGHT);
    flipFrontContent = page(activeItem, currentPageIndex, PAGE_SIDE.RIGHT);
    flipBackContent = null;
  }

  function handleFrontCoverClick() {
    if (isAnimatingRef.current) return;
    openingFront();
    startFlipAnimation('forward', onOpened);
  }

  function handleBackCoverClick() {
    if (isAnimatingRef.current) return;
    openingBack();
    startFlipAnimation('backward', onOpened);
  }

  function handleLeftMouseDown() {
    if (!canGoLeft) {
      if (bookState === BOOK_STATE.OPEN && !isAnimatingRef.current) {
        closingFront();
        startFlipAnimation('backward', onFrontClosed);
      }
      return;
    }
    beginContinuousFlip(PAGE_SIDE.LEFT);
  }

  function handleRightMouseDown() {
    if (!canGoRight) {
      if (bookState === BOOK_STATE.OPEN && !isAnimatingRef.current) {
        closingBack();
        startFlipAnimation('forward', onBackClosed);
      }
      return;
    }
    beginContinuousFlip(PAGE_SIDE.RIGHT);
  }

  function handleNavigateToCategory(item: IndexItem) {
    if (bookState === 'cover-front') {
      if (isAnimatingRef.current) return;
      setPendingCategory(item);
      openingFront();
      startFlipAnimation('forward', onOpened, RAPID_FLIP_DURATION);
    } else if (bookState === 'cover-back') {
      if (isAnimatingRef.current) return;
      setPendingCategory(item);
      openingBack();
      startFlipAnimation('backward', onOpened, RAPID_FLIP_DURATION);
    } else {
      navigateToCategory(item, 0, true);
    }
  }

  const pageIsFlipping = !isCoverFlip && isFlipping;

  return (
    <section id='history' className='history' aria-label='회사 역사'>
      <HistoryTitle />
      <HistoryCategory
        tabActiveItem={tabActiveItem}
        navigateToCategory={handleNavigateToCategory}
      />
      <div className='history__book'>
        <BookSide
          side={PAGE_SIDE.LEFT}
          bookState={bookState}
          isBookOpen={isBookOpen}
          isCoverFlip={isCoverFlip}
          isFlipping={pageIsFlipping}
          isRapidFlipping={isRapidFlipping}
          isHoldChaining={isHoldChaining}
          flipDirection={flipDirection}
          currentFlipDuration={currentFlipDuration}
          staticPageContent={staticLeftContent}
          flipFrontPageContent={flipFrontContent}
          flipBackPageContent={flipBackContent}
          shadowCount={leftShadowCount}
          onMouseDown={handleLeftMouseDown}
          onBackCoverClick={handleBackCoverClick}
          coverFrontContent={coverFrontContent}
          coverBackContent={coverBackContent}
        />
        <BookSide
          side={PAGE_SIDE.RIGHT}
          bookState={bookState}
          isBookOpen={isBookOpen}
          isCoverFlip={isCoverFlip}
          isFlipping={pageIsFlipping}
          isRapidFlipping={isRapidFlipping}
          isHoldChaining={isHoldChaining}
          flipDirection={flipDirection}
          currentFlipDuration={currentFlipDuration}
          staticPageContent={staticRightContent}
          flipFrontPageContent={flipFrontContent}
          flipBackPageContent={flipBackContent}
          shadowCount={rightShadowCount}
          onMouseDown={handleRightMouseDown}
          onFrontCoverClick={handleFrontCoverClick}
          coverFrontContent={coverFrontContent}
          coverBackContent={coverBackContent}
        />
      </div>
    </section>
  );
}

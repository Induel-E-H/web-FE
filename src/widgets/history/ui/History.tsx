import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import {
  PAGE_SIDE,
  RAPID_FLIP_DURATION,
} from '@features/history/model/constants';
import type { IndexItem, PageSide } from '@features/history/model/types';
import { useBookCoverState } from '@features/history/model/useBookCoverState';
import { useBookNavigation } from '@features/history/model/useBookNavigation';
import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import '../styles/History.css';
import { BackCoverInner } from './book/BackCover';
import { BookPageOuterShadow } from './book/BookPageSide';
import { BookSide } from './book/BookSide';
import { ContentPage } from './book/content_container/Content';
import { ListPage } from './book/content_container/List';
import { MilestonesPage } from './book/content_container/Milestones';
import { TimelinePage } from './book/content_container/Timeline';
import { BookCover } from './book/Cover';
import { FrontCoverInner } from './book/FrontCover';
import { HistoryCategory } from './Category';
import { HistoryTitle } from './HistoryTitle';

function History() {
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
        if (bookState === 'open' && !isAnimatingRef.current) {
          closingFront();
          startFlipAnimation('backward', onFrontClosed, duration);
        }
      },
      (duration) => {
        if (bookState === 'open' && !isAnimatingRef.current) {
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

  useEffect(() => {
    if (bookState === 'open' && pendingCategory !== null) {
      const cat = pendingCategory;
      setPendingCategory(null);
      setTimeout(() => {
        navigateToCategory(cat, 0, true);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookState, pendingCategory]);

  function handleListItemClick(index: number) {
    navigateToCategory('Content', Math.floor(index / 2), true);
  }

  function renderPage(
    side: PageSide,
    pageIndex: number,
    item: IndexItem,
  ): ReactNode {
    switch (item) {
      case 'List':
        return <ListPage side={side} onItemClick={handleListItemClick} />;
      case 'Content':
        return <ContentPage side={side} pageIndex={pageIndex} />;
      case 'Timeline':
        return <TimelinePage side={side} />;
      case 'Milestones':
        return (
          <MilestonesPage
            side={side}
            pageIndex={pageIndex}
            breakpoint={breakpoint}
          />
        );
    }
  }

  const isCoverFlip =
    bookState.startsWith('opening') || bookState.startsWith('closing');
  const isBookOpen = bookState !== 'cover-front' && bookState !== 'cover-back';

  let coverFrontContent: ReactNode = null;
  let coverBackContent: ReactNode = null;

  if (bookState === 'opening-front') {
    coverFrontContent = <FrontCoverInner />;
    coverBackContent = (
      <>
        <BookCover side={PAGE_SIDE.LEFT} />
        <div className='history__book-page-left'>
          <BookPageOuterShadow side={PAGE_SIDE.LEFT} count={leftShadowCount} />
          <div className='history__book-page-content'>
            {renderPage(PAGE_SIDE.LEFT, currentPageIndex, activeItem)}
          </div>
        </div>
      </>
    );
  } else if (bookState === 'closing-front') {
    coverFrontContent = (
      <>
        <BookCover side={PAGE_SIDE.LEFT} />
        <div className='history__book-page-left'>
          <BookPageOuterShadow side={PAGE_SIDE.LEFT} count={leftShadowCount} />
          <div className='history__book-page-content'>
            {renderPage(PAGE_SIDE.LEFT, currentPageIndex, activeItem)}
          </div>
        </div>
      </>
    );
    coverBackContent = <FrontCoverInner />;
  } else if (bookState === 'closing-back') {
    coverFrontContent = (
      <>
        <BookCover side={PAGE_SIDE.RIGHT} />
        <div className='history__book-page-right'>
          <div className='history__book-page-content'>
            {renderPage(PAGE_SIDE.RIGHT, currentPageIndex, activeItem)}
          </div>
          <BookPageOuterShadow
            side={PAGE_SIDE.RIGHT}
            count={rightShadowCount}
          />
        </div>
      </>
    );
    coverBackContent = <BackCoverInner />;
  } else if (bookState === 'opening-back') {
    coverFrontContent = <BackCoverInner />;
    coverBackContent = (
      <>
        <BookCover side={PAGE_SIDE.RIGHT} />
        <div className='history__book-page-right'>
          <div className='history__book-page-content'>
            {renderPage(PAGE_SIDE.RIGHT, currentPageIndex, activeItem)}
          </div>
          <BookPageOuterShadow
            side={PAGE_SIDE.RIGHT}
            count={rightShadowCount}
          />
        </div>
      </>
    );
  }

  let staticLeftContent: ReactNode;
  let staticRightContent: ReactNode;
  let flipFrontContent: ReactNode;
  let flipBackContent: ReactNode;

  if (isCoverFlip) {
    staticLeftContent = renderPage(
      PAGE_SIDE.LEFT,
      currentPageIndex,
      activeItem,
    );
    staticRightContent = renderPage(
      PAGE_SIDE.RIGHT,
      currentPageIndex,
      activeItem,
    );
  } else if (flipDirection === 'forward') {
    staticLeftContent = renderPage(
      PAGE_SIDE.LEFT,
      currentPageIndex,
      activeItem,
    );
    staticRightContent = renderPage(
      PAGE_SIDE.RIGHT,
      nextPageIndex,
      nextActiveItem,
    );
    flipFrontContent = renderPage(
      PAGE_SIDE.RIGHT,
      currentPageIndex,
      activeItem,
    );
    flipBackContent = renderPage(PAGE_SIDE.LEFT, nextPageIndex, nextActiveItem);
  } else if (flipDirection === 'backward') {
    staticLeftContent = renderPage(
      PAGE_SIDE.LEFT,
      prevPageIndex,
      prevActiveItem,
    );
    staticRightContent = renderPage(
      PAGE_SIDE.RIGHT,
      currentPageIndex,
      activeItem,
    );
    flipFrontContent = renderPage(PAGE_SIDE.LEFT, currentPageIndex, activeItem);
    flipBackContent = renderPage(
      PAGE_SIDE.RIGHT,
      prevPageIndex,
      prevActiveItem,
    );
  } else {
    staticLeftContent = renderPage(
      PAGE_SIDE.LEFT,
      currentPageIndex,
      activeItem,
    );
    staticRightContent = renderPage(
      PAGE_SIDE.RIGHT,
      currentPageIndex,
      activeItem,
    );
    flipFrontContent = renderPage(
      PAGE_SIDE.RIGHT,
      currentPageIndex,
      activeItem,
    );
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
      if (bookState === 'open' && !isAnimatingRef.current) {
        closingFront();
        startFlipAnimation('backward', onFrontClosed);
      }
      return;
    }
    beginContinuousFlip(PAGE_SIDE.LEFT);
  }

  function handleRightMouseDown() {
    if (!canGoRight) {
      if (bookState === 'open' && !isAnimatingRef.current) {
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
    <section className='history'>
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

export default History;

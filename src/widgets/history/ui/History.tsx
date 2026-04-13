import type { ReactNode } from 'react';

import { PAGE_SIDE } from '@features/history/model/constants';
import type { IndexItem, PageSide } from '@features/history/model/types';
import { useBookCoverState } from '@features/history/model/useBookCoverState';
import { useBookNavigation } from '@features/history/model/useBookNavigation';
import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import '../styles/History.css';
import { BackCoverInner, BookBackCover } from './book/BackCover';
import { ContentPage } from './book/content_container/Content';
import { ListPage } from './book/content_container/List';
import { MilestonesPage } from './book/content_container/Milestones';
import { TimelinePage } from './book/content_container/Timeline';
import { BookCover } from './book/Cover';
import { BookFrontCover, FrontCoverInner } from './book/FrontCover';
import { BookPage } from './book/Page';
import { HistoryCategory } from './Category';
import { HistoryTitle } from './Title';

function History() {
  const breakpoint = useBreakpoint();
  const {
    bookState,
    openFromFront,
    onFrontOpened,
    closeFront,
    onFrontClosed,
    closeBack,
    onBackClosed,
    openFromBack,
    onBackOpened,
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
    leftShadowCount,
    rightShadowCount,
    startFlipAnimation,
    isAnimatingRef,
  } = useBookNavigation(breakpoint);

  function handleListItemClick(index: number) {
    navigateToCategory('Content', Math.floor(index / 2), true);
  }

  function renderPage(
    side: PageSide,
    pageIndex: number,
    item: IndexItem,
  ): ReactNode {
    const pageSide = side === PAGE_SIDE.LEFT ? PAGE_SIDE.LEFT : PAGE_SIDE.RIGHT;
    switch (item) {
      case 'List':
        return <ListPage side={pageSide} onItemClick={handleListItemClick} />;
      case 'Content':
        return <ContentPage side={pageSide} pageIndex={pageIndex} />;
      case 'Timeline':
        return <TimelinePage side={pageSide} />;
      case 'Milestones':
        return (
          <MilestonesPage
            side={pageSide}
            pageIndex={pageIndex}
            breakpoint={breakpoint}
          />
        );
    }
  }

  function handleFrontCoverClick() {
    if (isAnimatingRef.current) return;
    openFromFront();
    startFlipAnimation('forward', onFrontOpened);
  }

  function handleBackCoverClick() {
    if (isAnimatingRef.current) return;
    openFromBack();
    startFlipAnimation('backward', onBackOpened);
  }

  function handleLeftMouseDown() {
    if (!canGoLeft) {
      if (bookState === 'open' && !isAnimatingRef.current) {
        closeFront();
        startFlipAnimation('backward', onFrontClosed);
      }
      return;
    }
    beginContinuousFlip(PAGE_SIDE.LEFT);
  }

  function handleRightMouseDown() {
    if (!canGoRight) {
      if (bookState === 'open' && !isAnimatingRef.current) {
        closeBack();
        startFlipAnimation('forward', onBackClosed);
      }
      return;
    }
    beginContinuousFlip(PAGE_SIDE.RIGHT);
  }

  const isCoverFlip =
    bookState.startsWith('opening') || bookState.startsWith('closing');
  const isBookOpen = bookState !== 'cover-front' && bookState !== 'cover-back';

  const showFrontCover = bookState === 'cover-front';
  const showBackCover = bookState === 'cover-back';

  let coverFrontContent: ReactNode;
  let coverBackContent: ReactNode;

  let staticLeftContent: ReactNode;
  let staticRightContent: ReactNode;
  let flipFrontContent: ReactNode;
  let flipBackContent: ReactNode;

  if (isCoverFlip) {
    if (bookState === 'opening-front' || bookState === 'closing-front') {
      if (bookState === 'opening-front') {
        coverFrontContent = <FrontCoverInner />;
        coverBackContent = (
          <>
            <BookCover side={PAGE_SIDE.LEFT}></BookCover>
            <ListPage side={PAGE_SIDE.LEFT} onItemClick={handleListItemClick} />
          </>
        );
      } else {
        coverFrontContent = (
          <>
            <BookCover side={PAGE_SIDE.LEFT}></BookCover>
            <ListPage side={PAGE_SIDE.LEFT} onItemClick={handleListItemClick} />
          </>
        );
        coverBackContent = <FrontCoverInner />;
      }
    } else {
      if (bookState === 'closing-back') {
        coverFrontContent = (
          <>
            <BookCover side={PAGE_SIDE.LEFT}></BookCover>
            {renderPage(PAGE_SIDE.RIGHT, 0, 'Milestones')}
          </>
        );
        coverBackContent = <BackCoverInner />;
      } else {
        coverFrontContent = <BackCoverInner />;
        coverBackContent = (
          <>
            <BookCover side={PAGE_SIDE.LEFT}></BookCover>
            {renderPage(PAGE_SIDE.RIGHT, 0, 'Milestones')}
          </>
        );
      }
    }
  } else {
    if (flipDirection === 'forward') {
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
      flipBackContent = renderPage(
        PAGE_SIDE.LEFT,
        nextPageIndex,
        nextActiveItem,
      );
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
      flipFrontContent = renderPage(
        PAGE_SIDE.LEFT,
        currentPageIndex,
        activeItem,
      );
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
  }

  const activePanelDirection: 'forward' | 'backward' | null = isCoverFlip
    ? bookState === 'opening-front' || bookState === 'closing-back'
      ? 'forward'
      : 'backward'
    : flipDirection;

  const pageCanGoLeft = isBookOpen && !isCoverFlip && !isFlipping && canGoLeft;
  const pageCanGoRight =
    isBookOpen && !isCoverFlip && !isFlipping && canGoRight;

  return (
    <section className='history'>
      <HistoryTitle />
      <HistoryCategory
        tabActiveItem={tabActiveItem}
        navigateToCategory={navigateToCategory}
      />
      <div
        className={`history__book${isBookOpen ? ' history__book--open' : ''}`}
      >
        <div
          className={`history__book-page${isRapidFlipping ? ' history__book-page--rapid' : ''}${isHoldChaining ? ' history__book-page--hold' : ''}${isBookOpen ? ' history__book-page--cover-opening' : ''}`}
        >
          {isBookOpen && (
            <BookPage
              staticLeftContent={staticLeftContent}
              staticRightContent={staticRightContent}
              flipFrontContent={flipFrontContent}
              flipBackContent={flipBackContent}
              isFlipping={isFlipping}
              flipDirection={activePanelDirection}
              flipDuration={currentFlipDuration}
              canGoLeft={pageCanGoLeft}
              canGoRight={pageCanGoRight}
              onLeftMouseDown={handleLeftMouseDown}
              onRightMouseDown={handleRightMouseDown}
              leftShadowCount={leftShadowCount}
              rightShadowCount={rightShadowCount}
            />
          )}
        </div>
        {isBookOpen && (
          <div className='history__book-cover'>
            <BookCover side={PAGE_SIDE.LEFT} />
            <BookCover side={PAGE_SIDE.RIGHT} />
          </div>
        )}
        {showFrontCover && <BookFrontCover onClick={handleFrontCoverClick} />}
        {showBackCover && <BookBackCover onClick={handleBackCoverClick} />}
      </div>
    </section>
  );
}

export default History;

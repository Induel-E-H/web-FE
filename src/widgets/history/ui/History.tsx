import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { PAGE_SIDE } from '@features/history/model/constants';
import type { IndexItem } from '@features/history/model/types';
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

  // 마지막 페이지 정보 저장 (closing-back / opening-back 시 사용)
  const lastPageRef = useRef<{ item: IndexItem; pageIndex: number }>({
    item: 'Milestones',
    pageIndex: 0,
  });
  const [lastPageSnapshot, setLastPageSnapshot] = useState<{
    item: IndexItem;
    pageIndex: number;
  }>({ item: 'Milestones', pageIndex: 0 });

  function handleListItemClick(index: number) {
    navigateToCategory('Content', Math.floor(index / 2), true);
  }

  function renderPage(
    side: 'left' | 'right',
    pageIndex: number,
    item: IndexItem,
  ): ReactNode {
    const pageSide = side === 'left' ? PAGE_SIDE.LEFT : PAGE_SIDE.RIGHT;
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

  // ─── 커버 flip 핸들러 ───

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
    beginContinuousFlip('left');
  }

  function handleRightMouseDown() {
    if (!canGoRight) {
      if (bookState === 'open' && !isAnimatingRef.current) {
        const snapshot = { item: activeItem, pageIndex: currentPageIndex };
        lastPageRef.current = snapshot;
        setLastPageSnapshot(snapshot);
        closeBack();
        startFlipAnimation('forward', onBackClosed);
      }
      return;
    }
    beginContinuousFlip('right');
  }

  // ─── 커버 상태 판별 ───

  const isCoverFlip =
    bookState === 'opening-front' ||
    bookState === 'closing-front' ||
    bookState === 'opening-back' ||
    bookState === 'closing-back';

  // opening 전환 중: 정적 페이지 배경을 투명하게 처리 (이슈 4)
  const isCoverOpeningFlip =
    bookState === 'opening-front' || bookState === 'opening-back';

  const showBookPage =
    bookState === 'open' ||
    bookState === 'opening-front' ||
    bookState === 'closing-front' ||
    bookState === 'opening-back' ||
    bookState === 'closing-back';

  const showBookCover = true; // 항상 렌더링 (이슈 4: cover 상태 전환 시 flash 방지)

  const showFrontCover = bookState === 'cover-front';
  const showBackCover = bookState === 'cover-back';

  // 책이 열린 상태(or 전환 중)일 때만 shadow 표시 (이슈 6)
  const isBookOpen = bookState !== 'cover-front' && bookState !== 'cover-back';

  // ─── Flip 콘텐츠 계산 ───

  let staticLeftContent: ReactNode;
  let staticRightContent: ReactNode;
  let flipFrontContent: ReactNode;
  let flipBackContent: ReactNode;

  if (isCoverFlip) {
    if (bookState === 'opening-front' || bookState === 'closing-front') {
      staticRightContent = (
        <ListPage side={PAGE_SIDE.RIGHT} onItemClick={handleListItemClick} />
      );
      staticLeftContent = null;

      if (bookState === 'opening-front') {
        flipFrontContent = <FrontCoverInner />;
        flipBackContent = (
          <ListPage side={PAGE_SIDE.LEFT} onItemClick={handleListItemClick} />
        );
      } else {
        flipFrontContent = (
          <ListPage side={PAGE_SIDE.LEFT} onItemClick={handleListItemClick} />
        );
        flipBackContent = <FrontCoverInner />;
      }
    } else {
      const lastItem = lastPageSnapshot.item;
      const lastPageIdx = lastPageSnapshot.pageIndex;

      staticLeftContent = renderPage('left', lastPageIdx, lastItem);
      staticRightContent = null;

      if (bookState === 'closing-back') {
        flipFrontContent = renderPage('right', lastPageIdx, lastItem);
        flipBackContent = <BackCoverInner />;
      } else {
        flipFrontContent = <BackCoverInner />;
        flipBackContent = renderPage('right', lastPageIdx, lastItem);
      }
    }
  } else {
    if (flipDirection === 'forward') {
      staticLeftContent = renderPage('left', currentPageIndex, activeItem);
      staticRightContent = renderPage('right', nextPageIndex, nextActiveItem);
      flipFrontContent = renderPage('right', currentPageIndex, activeItem);
      flipBackContent = renderPage('left', nextPageIndex, nextActiveItem);
    } else if (flipDirection === 'backward') {
      staticLeftContent = renderPage('left', prevPageIndex, prevActiveItem);
      staticRightContent = renderPage('right', currentPageIndex, activeItem);
      flipFrontContent = renderPage('left', currentPageIndex, activeItem);
      flipBackContent = renderPage('right', prevPageIndex, prevActiveItem);
    } else {
      staticLeftContent = renderPage('left', currentPageIndex, activeItem);
      staticRightContent = renderPage('right', currentPageIndex, activeItem);
      flipFrontContent = renderPage('right', currentPageIndex, activeItem);
      flipBackContent = null;
    }
  }

  // 커버 flip 방향
  const activePanelDirection: 'forward' | 'backward' | null = isCoverFlip
    ? bookState === 'opening-front' || bookState === 'closing-back'
      ? 'forward'
      : 'backward'
    : flipDirection;

  // 커버 flip 중에는 페이지 클릭 비활성화
  // 경계 페이지에서도 클릭 허용 (첫/마지막 페이지 → 커버 닫기, 이슈 1 & 2)
  const pageCanGoLeft =
    showBookPage &&
    !isCoverFlip &&
    !isFlipping &&
    (canGoLeft || bookState === 'open');
  const pageCanGoRight =
    showBookPage &&
    !isCoverFlip &&
    !isFlipping &&
    (canGoRight || bookState === 'open');

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
          className={`history__book-page${isRapidFlipping ? ' history__book-page--rapid' : ''}${isHoldChaining ? ' history__book-page--hold' : ''}${isCoverOpeningFlip ? ' history__book-page--cover-opening' : ''}`}
        >
          {showBookPage && (
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
        {showBookCover && <BookCover />}
        {showFrontCover && <BookFrontCover onClick={handleFrontCoverClick} />}
        {showBackCover && <BookBackCover onClick={handleBackCoverClick} />}
      </div>
    </section>
  );
}

export default History;

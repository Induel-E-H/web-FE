import { PAGE_SIDE } from '@features/history/model/constants';
import type { IndexItem } from '@features/history/model/types';
import { useBookNavigation } from '@features/history/model/useBookNavigation';
import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import '../styles/History.css';
import { AwardPage } from './book/content_container/Award';
import { ContentPage } from './book/content_container/Content';
import { ListPage } from './book/content_container/List';
import { TimelinePage } from './book/content_container/Timeline';
import { BookCover } from './book/Cover';
import { BookPage } from './book/Page';
import { HistoryCategory } from './Category';
import { HistoryTitle } from './Title';

function History() {
  const breakpoint = useBreakpoint();
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
  } = useBookNavigation(breakpoint);

  function handleListItemClick(index: number) {
    navigateToCategory('Content', Math.floor(index / 2), true);
  }

  function renderPage(
    side: 'left' | 'right',
    pageIndex: number,
    item: IndexItem,
  ) {
    const pageSide = side === 'left' ? PAGE_SIDE.LEFT : PAGE_SIDE.RIGHT;
    switch (item) {
      case 'List':
        return <ListPage side={pageSide} onItemClick={handleListItemClick} />;
      case 'Content':
        return <ContentPage side={pageSide} pageIndex={pageIndex} />;
      case 'Timeline':
        return <TimelinePage side={pageSide} />;
      case 'Award':
        return (
          <AwardPage
            side={pageSide}
            pageIndex={pageIndex}
            breakpoint={breakpoint}
          />
        );
    }
  }

  let staticLeftContent;
  let staticRightContent;
  let flipFrontContent;
  let flipBackContent;

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

  return (
    <section className='history'>
      <HistoryTitle />
      <HistoryCategory
        tabActiveItem={tabActiveItem}
        navigateToCategory={navigateToCategory}
      />
      <div className='history__book'>
        <div
          className={`history__book-page${isRapidFlipping ? ' history__book-page--rapid' : ''}${isHoldChaining ? ' history__book-page--hold' : ''}`}
        >
          <BookPage
            staticLeftContent={staticLeftContent}
            staticRightContent={staticRightContent}
            flipFrontContent={flipFrontContent}
            flipBackContent={flipBackContent}
            isFlipping={isFlipping}
            flipDirection={flipDirection}
            flipDuration={currentFlipDuration}
            canGoLeft={canGoLeft && !isFlipping}
            canGoRight={canGoRight && !isFlipping}
            onLeftMouseDown={() => beginContinuousFlip('left')}
            onRightMouseDown={() => beginContinuousFlip('right')}
          />
        </div>
        <BookCover />
      </div>
    </section>
  );
}

export default History;

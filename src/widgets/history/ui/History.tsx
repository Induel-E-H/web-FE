import { Fragment } from 'react';

import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { INDEX_LIST, PAGE_SIDE } from '../model/constants';
import type { IndexItem } from '../model/types';
import { useBookNavigation } from '../model/useBookNavigation';
import '../styles/History.css';
import { AwardPage } from './Award';
import { BookPage } from './BookPage';
import { ContentPage } from './ContentPage';
import { ListPage } from './List';
import { TimelinePage } from './Timeline';

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

  function handleCategoryClick(item: IndexItem) {
    navigateToCategory(item, 0, true);
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
      <h2 className='history__title'>History</h2>
      <div className='history__category' role='tablist'>
        {INDEX_LIST.map((item, index) => (
          <Fragment key={item}>
            <button
              role='tab'
              aria-selected={tabActiveItem === item}
              className={tabActiveItem === item ? 'active' : ''}
              onClick={() => handleCategoryClick(item)}
            >
              {item}
            </button>
            {index < INDEX_LIST.length - 1 && <span aria-hidden='true'>|</span>}
          </Fragment>
        ))}
      </div>
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
            canGoLeft={canGoLeft && !isFlipping}
            canGoRight={canGoRight && !isFlipping}
            onLeftMouseDown={() => beginContinuousFlip('left')}
            onRightMouseDown={() => beginContinuousFlip('right')}
          />
        </div>
        <div className='history__book-cover'>
          <div className='history__book-cover-left'></div>
          <div className='history__book-cover-center'>
            <div className='history__book-cover-center-line'>
              <div className='history__book-cover-center-line-top'></div>
              <div className='history__book-cover-center-line-bottom'></div>
            </div>
            <div className='history__book-cover-center-spine'>
              <div className='history__book-cover-center-spine-left'></div>
              <div className='history__book-cover-center-spine-center'></div>
              <div className='history__book-cover-center-spine-right'></div>
            </div>
          </div>
          <div className='history__book-cover-right'></div>
        </div>
      </div>
      <div className='history__last'>
        <p>공간을 문화로 창조하는 기업</p>
      </div>
    </section>
  );
}

export default History;

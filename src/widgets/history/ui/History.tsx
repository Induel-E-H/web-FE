import { Fragment } from 'react';

import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { INDEX_LIST, PAGE_SIDE } from '../model/constants';
import type { IndexItem } from '../model/types';
import { useBookNavigation } from '../model/useBookNavigation';
import '../styles/History.css';
import { AwardPage } from './Award';
import { BookPage } from './BookPage';
import { ContentPage } from './Content';
import { ListPage } from './List';
import { TimelinePage } from './Timeline';

function History() {
  const breakpoint = useBreakpoint();
  const {
    activeItem,
    currentPageIndex,
    canGoLeft,
    canGoRight,
    isFlipping,
    flipDirection,
    onFlipComplete,
    nextPageIndex,
    nextActiveItem,
    prevPageIndex,
    prevActiveItem,
    goToItem,
    stopHold,
    startHold,
    leftClickRef,
    rightClickRef,
  } = useBookNavigation(breakpoint);

  function handleListItemClick(index: number) {
    goToItem('Content', Math.floor(index / 2));
  }

  function handleCategoryClick(item: IndexItem) {
    goToItem(item);
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

  // 4-slot 콘텐츠 결정
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
    // Idle 상태
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
              aria-selected={activeItem === item}
              className={activeItem === item ? 'active' : ''}
              onClick={() => handleCategoryClick(item)}
            >
              {item}
            </button>
            {index < INDEX_LIST.length - 1 && <span aria-hidden='true'>|</span>}
          </Fragment>
        ))}
      </div>
      <div className='history__book'>
        <div className='history__book-page'>
          <BookPage
            staticLeftContent={staticLeftContent}
            staticRightContent={staticRightContent}
            flipFrontContent={flipFrontContent}
            flipBackContent={flipBackContent}
            isFlipping={isFlipping}
            flipDirection={flipDirection}
            canGoLeft={canGoLeft && !isFlipping}
            canGoRight={canGoRight && !isFlipping}
            onTransitionEnd={onFlipComplete}
            onLeftMouseDown={() => startHold(leftClickRef)}
            onRightMouseDown={() => startHold(rightClickRef)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
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

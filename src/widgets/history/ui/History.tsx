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
    isAnimating,
    leftAnimClass,
    rightAnimClass,
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

  function renderPage(side: 'left' | 'right') {
    const pageSide = side === 'left' ? PAGE_SIDE.LEFT : PAGE_SIDE.RIGHT;
    switch (activeItem) {
      case 'List':
        return <ListPage side={pageSide} onItemClick={handleListItemClick} />;
      case 'Content':
        return <ContentPage side={pageSide} pageIndex={currentPageIndex} />;
      case 'Timeline':
        return <TimelinePage side={pageSide} />;
      case 'Award':
        return (
          <AwardPage
            side={pageSide}
            pageIndex={currentPageIndex}
            breakpoint={breakpoint}
          />
        );
    }
  }

  return (
    <>
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
              {index < INDEX_LIST.length - 1 && (
                <span aria-hidden='true'>|</span>
              )}
            </Fragment>
          ))}
        </div>
        <div className='history__book'>
          <div className='history__book-page'>
            <BookPage
              side={PAGE_SIDE.LEFT}
              clickable={canGoLeft && !isAnimating}
              onMouseDown={
                canGoLeft && !isAnimating
                  ? () => startHold(leftClickRef)
                  : undefined
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              animClass={leftAnimClass}
            >
              {renderPage('left')}
            </BookPage>
            <BookPage
              side={PAGE_SIDE.RIGHT}
              clickable={canGoRight && !isAnimating}
              onMouseDown={
                canGoRight && !isAnimating
                  ? () => startHold(rightClickRef)
                  : undefined
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              animClass={rightAnimClass}
            >
              {renderPage('right')}
            </BookPage>
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
    </>
  );
}

export default History;

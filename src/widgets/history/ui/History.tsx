import { useRef, useState } from 'react';

import {
  buildLeaves,
  findLeafIndex,
  getLeafItem,
  preloadContentImages,
  useFlipChain,
} from '@features/history';
import type { IndexItem, PageLeaf } from '@features/history';
import type { BookSnapshot, FlipBookHandle } from '@gullabs/react-flipbook';
import {
  trackHistoryCategoryChange,
  trackHistoryCoverOpen,
  trackHistoryPageTurn,
} from '@shared/lib/analytics';
import { useBreakpoint } from '@shared/lib/breakpoint';

import '../styles/History.css';
import { Book } from './book/Book';
import { BookPageContent } from './book/BookPageContent';
import { HistoryCategory } from './Category';
import { HistoryTitle } from './HistoryTitle';

export function History() {
  const breakpoint = useBreakpoint();
  const leaves = buildLeaves(breakpoint);
  const bookRef = useRef<FlipBookHandle>(null);
  const chain = useFlipChain(bookRef);
  const [page, setPage] = useState(0);
  const [targetLeaf, setTargetLeaf] = useState<number | null>(null);

  const activeItem = getLeafItem(leaves, page);

  function navigate(item: IndexItem, pageIndex = 0) {
    const target = findLeafIndex(leaves, item, pageIndex);
    setTargetLeaf(target);
    chain.flipTo(target);
  }

  function handleNavigateToCategory(item: IndexItem) {
    trackHistoryCategoryChange(item);
    if (item === 'Content') preloadContentImages(0);
    navigate(item);
  }

  function handleListItemClick(index: number) {
    const pageIndex = Math.floor(index / 2);
    preloadContentImages(pageIndex);
    navigate('Content', pageIndex);
  }

  function handlePageChange(snapshot: BookSnapshot) {
    const prev = page;
    setPage(snapshot.page);
    if (chain.isChaining()) return;
    if (prev === 0) trackHistoryCoverOpen('front');
    else if (prev === snapshot.pageCount - 1) trackHistoryCoverOpen('back');
    else trackHistoryPageTurn(snapshot.page > prev ? 'forward' : 'backward');
  }

  function renderPage(leaf: PageLeaf) {
    return (
      <BookPageContent
        side={leaf.side}
        pageIndex={leaf.pageIndex}
        item={leaf.item}
        breakpoint={breakpoint}
        onListItemClick={handleListItemClick}
      />
    );
  }

  return (
    <section id='history' className='history' aria-label='회사 역사'>
      <div className='history__top'>
        <HistoryTitle />
        <HistoryCategory
          activeItem={activeItem}
          navigateToCategory={handleNavigateToCategory}
        />
      </div>
      <div className='history__book'>
        <Book
          bookRef={bookRef}
          leaves={leaves}
          landscape={breakpoint === 'desktop'}
          renderPage={renderPage}
          targetLeaf={targetLeaf}
          onPageChange={handlePageChange}
          onSettled={chain.onSettled}
          onHoldStart={chain.startHold}
          onHoldEnd={chain.stopHold}
        />
      </div>
    </section>
  );
}

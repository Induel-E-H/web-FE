import { useState } from 'react';

import type { BookState } from './types';

export function useBookCoverState() {
  const [bookState, setBookState] = useState<BookState>('cover-front');

  function openFromFront() {
    if (bookState !== 'cover-front') return;
    setBookState('opening-front');
  }

  function onFrontOpened() {
    setBookState('open');
  }

  function closeFront() {
    if (bookState !== 'open') return;
    setBookState('closing-front');
  }

  function onFrontClosed() {
    setBookState('cover-front');
  }

  function closeBack() {
    if (bookState !== 'open') return;
    setBookState('closing-back');
  }

  function onBackClosed() {
    setBookState('cover-back');
  }

  function openFromBack() {
    if (bookState !== 'cover-back') return;
    setBookState('opening-back');
  }

  function onBackOpened() {
    setBookState('open');
  }

  return {
    bookState,
    openFromFront,
    onFrontOpened,
    closeFront,
    onFrontClosed,
    closeBack,
    onBackClosed,
    openFromBack,
    onBackOpened,
  };
}

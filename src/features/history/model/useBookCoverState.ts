import { useState } from 'react';

import type { BookState } from './types';

export function useBookCoverState() {
  const [bookState, setBookState] = useState<BookState>('cover-front');

  function openingFront() {
    if (bookState !== 'cover-front') return;
    setBookState('opening-front');
  }

  function onOpened() {
    setBookState('open');
  }

  function closingFront() {
    if (bookState !== 'open') return;
    setBookState('closing-front');
  }

  function onFrontClosed() {
    setBookState('cover-front');
  }

  function closingBack() {
    if (bookState !== 'open') return;
    setBookState('closing-back');
  }

  function onBackClosed() {
    setBookState('cover-back');
  }

  function openingBack() {
    if (bookState !== 'cover-back') return;
    setBookState('opening-back');
  }

  return {
    bookState,
    openingFront,
    onOpened,
    closingFront,
    onFrontClosed,
    closingBack,
    onBackClosed,
    openingBack,
  };
}

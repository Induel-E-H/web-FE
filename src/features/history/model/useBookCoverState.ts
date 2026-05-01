import { useState } from 'react';

import { BOOK_STATE } from './constants';
import { type BookState } from './types';

export function useBookCoverState() {
  const [bookState, setBookState] = useState<BookState>(BOOK_STATE.COVER_FRONT);

  function openingFront() {
    if (bookState !== BOOK_STATE.COVER_FRONT) return;
    setBookState(BOOK_STATE.OPENING_FRONT);
  }

  function onOpened() {
    setBookState(BOOK_STATE.OPEN);
  }

  function closingFront() {
    if (bookState !== BOOK_STATE.OPEN) return;
    setBookState(BOOK_STATE.CLOSING_FRONT);
  }

  function onFrontClosed() {
    setBookState(BOOK_STATE.COVER_FRONT);
  }

  function closingBack() {
    if (bookState !== BOOK_STATE.OPEN) return;
    setBookState(BOOK_STATE.CLOSING_BACK);
  }

  function onBackClosed() {
    setBookState(BOOK_STATE.COVER_BACK);
  }

  function openingBack() {
    if (bookState !== BOOK_STATE.COVER_BACK) return;
    setBookState(BOOK_STATE.OPENING_BACK);
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

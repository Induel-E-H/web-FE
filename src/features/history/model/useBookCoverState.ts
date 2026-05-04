import { BOOK_STATE } from './constants';
import { useHistoryStore } from './useHistoryStore';

export function useBookCoverState() {
  const bookState = useHistoryStore((s) => s.bookState);
  const { setBookState } = useHistoryStore.getState();

  function openingFront() {
    if (useHistoryStore.getState().bookState !== BOOK_STATE.COVER_FRONT) return;
    setBookState(BOOK_STATE.OPENING_FRONT);
  }

  function onOpened() {
    setBookState(BOOK_STATE.OPEN);
  }

  function closingFront() {
    if (useHistoryStore.getState().bookState !== BOOK_STATE.OPEN) return;
    setBookState(BOOK_STATE.CLOSING_FRONT);
  }

  function onFrontClosed() {
    setBookState(BOOK_STATE.COVER_FRONT);
  }

  function closingBack() {
    if (useHistoryStore.getState().bookState !== BOOK_STATE.OPEN) return;
    setBookState(BOOK_STATE.CLOSING_BACK);
  }

  function onBackClosed() {
    setBookState(BOOK_STATE.COVER_BACK);
  }

  function openingBack() {
    if (useHistoryStore.getState().bookState !== BOOK_STATE.COVER_BACK) return;
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

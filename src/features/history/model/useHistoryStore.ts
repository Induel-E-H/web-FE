import { create } from 'zustand';

import { BOOK_STATE, FLIP_DURATION, INDEX_LIST } from './constants';
import type { BookState, FlipDirection, IndexItem } from './types';

interface HistoryState {
  bookState: BookState;
  isFlipping: boolean;
  flipDirection: FlipDirection | null;
  currentFlipDuration: number;
  isRapidFlipping: boolean;
  tabActiveItem: IndexItem;
  isHoldChaining: boolean;
  activeItem: IndexItem;
  pageIndices: Record<IndexItem, number>;
}

interface HistoryActions {
  setBookState: (state: BookState) => void;
  setIsFlipping: (v: boolean) => void;
  setFlipDirection: (d: FlipDirection | null) => void;
  setCurrentFlipDuration: (d: number) => void;
  setIsRapidFlipping: (v: boolean) => void;
  setTabActiveItem: (item: IndexItem) => void;
  setIsHoldChaining: (v: boolean) => void;
  setActiveItem: (item: IndexItem) => void;
  setPageIndices: (
    fn: (prev: Record<IndexItem, number>) => Record<IndexItem, number>,
  ) => void;
  reset: () => void;
}

const makeInitialPageIndices = () =>
  Object.fromEntries(INDEX_LIST.map((item) => [item, 0])) as Record<
    IndexItem,
    number
  >;

const initialState: HistoryState = {
  bookState: BOOK_STATE.COVER_FRONT,
  isFlipping: false,
  flipDirection: null,
  currentFlipDuration: FLIP_DURATION,
  isRapidFlipping: false,
  tabActiveItem: 'List',
  isHoldChaining: false,
  activeItem: 'List',
  pageIndices: makeInitialPageIndices(),
};

export const useHistoryStore = create<HistoryState & HistoryActions>((set) => ({
  ...initialState,
  setBookState: (s) => set({ bookState: s }),
  setIsFlipping: (v) => set({ isFlipping: v }),
  setFlipDirection: (d) => set({ flipDirection: d }),
  setCurrentFlipDuration: (d) => set({ currentFlipDuration: d }),
  setIsRapidFlipping: (v) => set({ isRapidFlipping: v }),
  setTabActiveItem: (item) => set({ tabActiveItem: item }),
  setIsHoldChaining: (v) => set({ isHoldChaining: v }),
  setActiveItem: (item) => set({ activeItem: item }),
  setPageIndices: (fn) => set((s) => ({ pageIndices: fn(s.pageIndices) })),
  reset: () => set({ ...initialState, pageIndices: makeInitialPageIndices() }),
}));

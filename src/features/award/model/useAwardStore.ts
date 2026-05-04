import { create } from 'zustand';

import { YEAR_ALL } from './constant';

interface AwardState {
  activeYear: string | number;
  currentPage: number;
  selectedId: number | null;
}

interface AwardActions {
  handleYearChange: (year: string | number) => void;
  setCurrentPage: (page: number) => void;
  setSelectedId: (id: number | null) => void;
  reset: () => void;
}

const initialState: AwardState = {
  activeYear: YEAR_ALL,
  currentPage: 0,
  selectedId: null,
};

export const useAwardStore = create<AwardState & AwardActions>((set) => ({
  ...initialState,
  handleYearChange: (year) => set({ activeYear: year, currentPage: 0 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedId: (id) => set({ selectedId: id }),
  reset: () => set(initialState),
}));

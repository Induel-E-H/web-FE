import { create } from 'zustand';

import { YEAR_ALL } from './constant';

interface AwardState {
  activeYear: string | number;
  selectedId: number | null;
}

interface AwardActions {
  handleYearChange: (year: string | number) => void;
  setSelectedId: (id: number | null) => void;
  reset: () => void;
}

const initialState: AwardState = {
  activeYear: YEAR_ALL,
  selectedId: null,
};

export const useAwardStore = create<AwardState & AwardActions>((set) => ({
  ...initialState,
  handleYearChange: (year) => set({ activeYear: year }),
  setSelectedId: (id) => set({ selectedId: id }),
  reset: () => set(initialState),
}));

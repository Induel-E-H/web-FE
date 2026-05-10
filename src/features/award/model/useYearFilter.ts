import { YEAR_LIST } from './constant';
import { useAwardStore } from './useAwardStore';

export function useYearFilter() {
  const activeYear = useAwardStore((s) => s.activeYear);
  const handleYearChange = useAwardStore((s) => s.handleYearChange);
  return { activeYear, yearList: YEAR_LIST, handleYearChange };
}

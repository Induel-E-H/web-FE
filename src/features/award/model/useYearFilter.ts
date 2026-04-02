import { useState } from 'react';

import { YEAR_LIST } from './constant';

export function useYearFilter() {
  const [activeYear, setActiveYear] = useState<string | number>('전체');

  function handleYearChange(year: string | number): void {
    setActiveYear(year);
  }

  return { activeYear, yearList: YEAR_LIST, handleYearChange };
}

import { useState } from 'react';

import { YEAR_ALL, YEAR_LIST } from './constant';

export function useYearFilter() {
  const [activeYear, setActiveYear] = useState<string | number>(YEAR_ALL);

  function handleYearChange(year: string | number): void {
    setActiveYear(year);
  }

  return { activeYear, yearList: YEAR_LIST, handleYearChange };
}

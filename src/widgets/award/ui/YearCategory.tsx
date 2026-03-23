import { useState } from 'react';

import '../styles/YearCategory.css';

interface YearCategoryProps {
  yearList: (string | number)[];
}

export function YearCategory({ yearList }: YearCategoryProps) {
  const [tabActiveItem, setTabActiveItem] = useState<string | number>('전체');

  function handleYearClick(year: number | string) {
    setTabActiveItem(year);
  }

  return (
    <div className='award__year_category'>
      {yearList.map((year) => (
        <button
          role='tab'
          key={year}
          className={tabActiveItem === year ? 'active' : ''}
          onClick={() => handleYearClick(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

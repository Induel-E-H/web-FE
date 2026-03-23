import { useState } from 'react';

const INDEX_LIST = ['전체', 2024, 2023, 2022, 2021, 2020];

export function YearCategory() {
  const [tabActiveItem, setTabActiveItem] = useState<string | number>('전체');

  function handleYearClick(year: number | string) {
    setTabActiveItem(year);
  }

  return (
    <div className='award__year_category'>
      {INDEX_LIST.map((year) => (
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

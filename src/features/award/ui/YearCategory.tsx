import '../styles/YearCategory.css';

type YearCategoryProps = {
  yearList: (string | number)[];
  activeYear: string | number;
  onYearChange: (year: string | number) => void;
};

export function YearCategory({
  yearList,
  activeYear,
  onYearChange,
}: YearCategoryProps) {
  return (
    <div className='award__year_category' role='tablist' aria-label='연도 필터'>
      {yearList.map((year) => {
        const isActive = activeYear === year;
        return (
          <button
            type='button'
            role='tab'
            key={year}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={isActive ? 'active' : ''}
            onClick={() => onYearChange(year)}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

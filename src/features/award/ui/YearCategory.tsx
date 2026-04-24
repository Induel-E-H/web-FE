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
    <nav className='award__year_category' aria-label='연도 필터'>
      {yearList.map((year) => {
        const isActive = activeYear === year;
        return (
          <button
            type='button'
            key={year}
            aria-current={isActive ? 'true' : undefined}
            tabIndex={isActive ? 0 : -1}
            className={isActive ? 'active' : ''}
            onClick={() => onYearChange(year)}
          >
            {year}
          </button>
        );
      })}
    </nav>
  );
}

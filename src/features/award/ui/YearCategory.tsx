import '../styles/YearCategory.css';

interface YearCategoryProps {
  yearList: (string | number)[];
  activeYear: string | number;
  onYearChange: (year: string | number) => void;
}

export function YearCategory({
  yearList,
  activeYear,
  onYearChange,
}: YearCategoryProps) {
  return (
    <div className='award__year_category' role='tablist' aria-label='연도 필터'>
      {yearList.map((year) => (
        <button
          type='button'
          role='tab'
          key={year}
          className={activeYear === year ? 'active' : ''}
          onClick={() => onYearChange(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

import { YEAR_LIST } from '../model/constant';
import { useAwardStore } from '../model/useAwardStore';
import '../styles/YearCategory.css';

export function YearCategory() {
  const activeYear = useAwardStore((s) => s.activeYear);
  const handleYearChange = useAwardStore((s) => s.handleYearChange);

  return (
    <nav className='award__year_category' aria-label='연도 필터'>
      {YEAR_LIST.map((year) => {
        const isActive = activeYear === year;
        return (
          <button
            type='button'
            key={year}
            aria-current={isActive ? 'true' : undefined}
            className={isActive ? 'award__year_category--active' : ''}
            onClick={() => handleYearChange(year)}
          >
            {year}
          </button>
        );
      })}
    </nav>
  );
}

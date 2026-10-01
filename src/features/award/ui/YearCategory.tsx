import { useEffect, useRef, useState } from 'react';

import { trackAwardYearFilter } from '@shared/lib/analytics';
import { cx } from '@shared/lib/classNames';

import { YEAR_LIST } from '../model/constant';
import { useAwardStore } from '../model/useAwardStore';
import '../styles/YearCategory.css';

export function YearCategory() {
  const activeYear = useAwardStore((s) => s.activeYear);
  const handleYearChange = useAwardStore((s) => s.handleYearChange);
  const navRef = useRef<HTMLElement>(null);
  const [hasMoreEnd, setHasMoreEnd] = useState(false);

  function updateHasMoreEnd() {
    const el = navRef.current;
    if (!el) return;
    setHasMoreEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateHasMoreEnd);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className={cx(
        'award__year_category',
        hasMoreEnd && 'award__year_category--more',
      )}
      aria-label='연도 필터'
      onScroll={updateHasMoreEnd}
    >
      {YEAR_LIST.map((year) => {
        const isActive = activeYear === year;
        return (
          <button
            type='button'
            key={year}
            aria-current={isActive ? 'true' : undefined}
            className={isActive ? 'award__year_category--active' : ''}
            onClick={() => {
              trackAwardYearFilter(year);
              handleYearChange(year);
            }}
          >
            {year}
          </button>
        );
      })}
    </nav>
  );
}

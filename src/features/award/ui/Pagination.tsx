import { useMemo } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { AWARD_LIST } from '@entities/award';
import { useBreakpoint } from '@shared/lib/breakpoint';

import { YEAR_ALL } from '../model/constant';
import { wrapPage } from '../model/pagination';
import { getItemsPerPage } from '../model/responsive';
import { useAwardStore } from '../model/useAwardStore';
import '../styles/Pagination.css';

export function Pagination() {
  const activeYear = useAwardStore((s) => s.activeYear);
  const currentPage = useAwardStore((s) => s.currentPage);
  const setCurrentPage = useAwardStore((s) => s.setCurrentPage);
  const breakpoint = useBreakpoint();
  const itemsPerPage = getItemsPerPage(breakpoint);

  const filteredList = useMemo(() => {
    const list =
      activeYear === YEAR_ALL
        ? AWARD_LIST
        : AWARD_LIST.filter((award) =>
            award.date.startsWith(String(activeYear)),
          );
    return list;
  }, [activeYear]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  return (
    <div className='award__pagination'>
      <button
        className='award__pagination_arrow'
        type='button'
        aria-label='이전 페이지'
        onClick={() => setCurrentPage(wrapPage(safePage - 1, totalPages))}
      >
        <IoIosArrowBack aria-hidden='true' />
      </button>

      <div
        className='award__pagination_dots'
        role='group'
        aria-label='페이지 목록'
      >
        {Array.from({ length: totalPages }, (_, pageIndex) => {
          const isActive = pageIndex === safePage;
          return (
            <button
              key={pageIndex}
              type='button'
              aria-label={`${pageIndex + 1}페이지`}
              aria-current={isActive ? 'page' : undefined}
              className={`award__pagination_dot ${isActive ? 'award__pagination_dot--active' : ''}`}
              onClick={() => setCurrentPage(pageIndex)}
            />
          );
        })}
      </div>

      <span
        className='award__pagination_info'
        aria-live='polite'
        aria-atomic='true'
      >
        <span className='sr-only'>현재 </span>
        {safePage + 1}/{totalPages}
        <span className='sr-only'> 페이지</span>
      </span>

      <button
        className='award__pagination_arrow'
        type='button'
        aria-label='다음 페이지'
        onClick={() => setCurrentPage(wrapPage(safePage + 1, totalPages))}
      >
        <IoIosArrowForward aria-hidden='true' />
      </button>
    </div>
  );
}

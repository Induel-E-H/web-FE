import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { wrapPage } from '../model/pagination';
import '../styles/Pagination.css';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className='award__pagination'>
      <button
        className='award__pagination_arrow'
        type='button'
        aria-label='이전 페이지'
        onClick={() => onPageChange(wrapPage(currentPage - 1, totalPages))}
      >
        <IoIosArrowBack aria-hidden='true' />
      </button>

      <div
        className='award__pagination_dots'
        role='group'
        aria-label='페이지 목록'
      >
        {Array.from({ length: totalPages }, (_, pageIndex) => {
          const isActive = pageIndex === currentPage;
          return (
            <button
              key={pageIndex}
              type='button'
              aria-label={`${pageIndex + 1}페이지`}
              aria-current={isActive ? 'page' : undefined}
              className={`award__pagination_dot ${isActive ? 'award__pagination_dot--active' : ''}`}
              onClick={() => onPageChange(pageIndex)}
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
        {currentPage + 1}/{totalPages}
        <span className='sr-only'> 페이지</span>
      </span>

      <button
        className='award__pagination_arrow'
        type='button'
        aria-label='다음 페이지'
        onClick={() => onPageChange(wrapPage(currentPage + 1, totalPages))}
      >
        <IoIosArrowForward aria-hidden='true' />
      </button>
    </div>
  );
}

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
        aria-label='Previous page'
        onClick={() => onPageChange(wrapPage(currentPage - 1, totalPages))}
      >
        <IoIosArrowBack />
      </button>

      <div className='award__pagination_dots'>
        {Array.from({ length: totalPages }, (_, pageIndex) => {
          const isActive = pageIndex === currentPage;
          return (
            <button
              key={pageIndex}
              type='button'
              aria-label={`Go to page ${pageIndex + 1}`}
              aria-current={isActive ? 'page' : undefined}
              className={`award__pagination_dot ${isActive ? 'award__pagination_dot--active' : ''}`}
              onClick={() => onPageChange(pageIndex)}
            />
          );
        })}
      </div>

      <span className='award__pagination_info'>
        {currentPage + 1}/{totalPages}
      </span>

      <button
        className='award__pagination_arrow'
        type='button'
        aria-label='Next page'
        onClick={() => onPageChange(wrapPage(currentPage + 1, totalPages))}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
}

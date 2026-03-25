import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

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
        onClick={() =>
          onPageChange(currentPage === 0 ? totalPages - 1 : currentPage - 1)
        }
      >
        <IoIosArrowBack />
      </button>

      <div className='award__pagination_dots'>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            type='button'
            aria-label={`Go to page ${i + 1}`}
            aria-current={i === currentPage ? 'page' : undefined}
            className={`award__pagination_dot ${i === currentPage ? 'award__pagination_dot--active' : ''}`}
            onClick={() => onPageChange(i)}
          />
        ))}
      </div>

      <span className='award__pagination_info'>
        {currentPage + 1}/{totalPages}
      </span>

      <button
        className='award__pagination_arrow'
        type='button'
        aria-label='Next page'
        onClick={() =>
          onPageChange(currentPage === totalPages - 1 ? 0 : currentPage + 1)
        }
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
}

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
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <IoIosArrowBack size={15} />
      </button>

      <div className='award__pagination_dots'>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
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
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <IoIosArrowForward size={15} />
      </button>
    </div>
  );
}

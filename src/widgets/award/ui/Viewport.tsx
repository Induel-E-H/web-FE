import type { AwardItem } from '@entities/award';
import { useSlideGesture } from '@shared/lib/useSlideGesture';

import '../styles/Viewport.css';
import { AwardCard } from './AwardCard';

export function Viewport({
  safePage,
  totalPages,
  filteredList,
  itemsPerPage,
  onCardClick,
  setCurrentPage,
}: {
  safePage: number;
  totalPages: number;
  filteredList: AwardItem[];
  itemsPerPage: number;
  onCardClick: (id: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { ref, onTouchStart, onTouchEnd } = useSlideGesture(
    setCurrentPage,
    totalPages,
  );

  function getPageItems(pageIndex: number) {
    const start = pageIndex * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }

  return (
    <div
      ref={ref}
      className='award__card_viewport'
      role='region'
      aria-label='수상 목록'
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className='award__card_slider'
        style={{
          transform: `translateX(calc(-${safePage * 100}% - ${safePage}vmax))`,
        }}
      >
        {Array.from({ length: totalPages }, (_, pageIndex) => (
          <div key={pageIndex} className='award__card_page'>
            {getPageItems(pageIndex).map((award) => (
              <AwardCard key={award.id} award={award} onClick={onCardClick} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

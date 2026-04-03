import { useEffect, useMemo, useState } from 'react';

import { AWARD_LIST } from '@entities/award';
import { Pagination, useYearFilter, YearCategory } from '@features/award';
import { useSlideGesture } from '@shared/lib/useSlideGesture/useSlideGesture';

import { getItemsPerPage } from '../model/responsive';
import '../styles/Award.css';
import { Card } from './Card';
import { AwardPopup } from './Popup';
import { AwardTitle } from './Title';

function Award() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const isMobile = itemsPerPage < 8;
  const {
    activeYear,
    yearList,
    handleYearChange: changeYear,
  } = useYearFilter();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleCardClick(id: number) {
    setSelectedId(id);
    document.body.style.overflow = 'hidden';
  }

  function handlePopupClose() {
    setSelectedId(null);
    document.body.style.overflow = '';
  }

  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleYearChange(year: string | number): void {
    changeYear(year);
    setCurrentPage(0);
  }

  const filteredAWARD_LIST = useMemo(() => {
    const list =
      activeYear === '전체'
        ? AWARD_LIST
        : AWARD_LIST.filter((award) =>
            award.date.startsWith(String(activeYear)),
          );
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [activeYear]);

  const totalPages = Math.ceil(filteredAWARD_LIST.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  function getPageItems(pageIndex: number) {
    const start = pageIndex * itemsPerPage;
    return filteredAWARD_LIST.slice(start, start + itemsPerPage);
  }

  const { ref, onTouchStart, onTouchEnd } = useSlideGesture(
    setCurrentPage,
    totalPages,
  );

  return (
    <section className='award'>
      <AwardTitle />
      <div className='award__content'>
        <YearCategory
          yearList={yearList}
          activeYear={activeYear}
          onYearChange={handleYearChange}
        />
        <div
          ref={ref}
          className='award__card_viewport'
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
                  <Card
                    key={award.id}
                    award={award}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {isMobile && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        {selectedId !== null && (
          <AwardPopup awardId={selectedId} onClose={handlePopupClose} />
        )}
      </div>
    </section>
  );
}

export default Award;

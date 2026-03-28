import { useEffect, useMemo, useState } from 'react';

import { AWARD_LIST } from '../../../entities/award';
import { YEAR_LIST } from '../model/constant';
import '../styles/Award.css';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { AwardTitle } from './Title';
import { YearCategory } from './YearCategory';

const BREAKPOINTS = {
  mobile: 767,
  tablet: 1024,
} as const;

function getItemsPerPage() {
  if (window.innerWidth <= BREAKPOINTS.mobile) return 4; // 2×2
  if (window.innerWidth <= BREAKPOINTS.tablet) return 6; // 3×2
  return 8; // 4x2
}

function getIsMobile() {
  return window.innerWidth <= BREAKPOINTS.tablet;
}

function Award() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeYear, setActiveYear] = useState<string | number>('전체');
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
      setIsMobile(getIsMobile());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  function handleYearChange(year: string | number) {
    setActiveYear(year);
    setCurrentPage(0);
  }

  return (
    <section className='award'>
      <AwardTitle />
      <div className='award__content'>
        <YearCategory
          yearList={YEAR_LIST}
          activeYear={activeYear}
          onYearChange={handleYearChange}
        />
        <div className='award__card_viewport'>
          <div
            className='award__card_slider'
            style={{
              transform: `translateX(calc(-${safePage * 100}% - ${safePage}vmax))`,
            }}
          >
            {Array.from({ length: totalPages }, (_, pageIndex) => (
              <div key={pageIndex} className='award__card_page'>
                {getPageItems(pageIndex).map((award) => (
                  <Card key={award.id} award={award} />
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
      </div>
    </section>
  );
}

export default Award;

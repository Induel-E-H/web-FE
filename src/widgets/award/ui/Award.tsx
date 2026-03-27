import { useEffect, useMemo, useState } from 'react';

import { AWARD_LIST } from '../../../entities/award';
import { YEAR_LIST } from '../model/constant';
import { getAwardImage } from '../model/helper';
import '../styles/Award.css';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { AwardTitle } from './Title';
import { YearCategory } from './YearCategory';

function getItemsPerPage() {
  if (window.innerWidth <= 767) return 4; // 2×2
  if (window.innerWidth <= 1024) return 6; // 3×2
  return 5; // 5×1
}

function Award() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeYear, setActiveYear] = useState<string | number>('전체');
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredAWARD_LIST = useMemo(
    () =>
      activeYear === '전체'
        ? AWARD_LIST
        : AWARD_LIST.filter((award) =>
            award.date.startsWith(String(activeYear)),
          ),
    [activeYear],
  );

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
                  <Card
                    key={award.id}
                    name={award.title}
                    year={award.date}
                    imageUrl={getAwardImage(award.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default Award;

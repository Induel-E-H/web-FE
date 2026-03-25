import { useMemo, useState } from 'react';

import { award as awards } from '../../../entities/award';
import { YEAR_LIST } from '../model/constant';
import { getAwardImage } from '../model/helper';
import { useGridLayout } from '../model/useGridLayout';
import '../styles/Award.css';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { AwardTitle } from './Title';
import { YearCategory } from './YearCategory';

function Award() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeYear, setActiveYear] = useState<string | number>('전체');
  const { gridRef, columns, rows } = useGridLayout();

  const filteredAwards = useMemo(
    () =>
      activeYear === '전체'
        ? awards
        : awards.filter((award) => award.time.startsWith(String(activeYear))),
    [activeYear],
  );

  const itemsPerPage = columns * rows;
  const totalPages = Math.ceil(filteredAwards.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  function getPageItems(pageIndex: number) {
    const start = pageIndex * itemsPerPage;
    return filteredAwards.slice(start, start + itemsPerPage);
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
              <div
                key={pageIndex}
                ref={pageIndex === 0 ? gridRef : undefined}
                className='award__card_page'
              >
                {getPageItems(pageIndex).map((award) => (
                  <Card
                    key={award.id}
                    name={award.title}
                    year={award.time}
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

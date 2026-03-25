import { useCallback, useMemo, useState } from 'react';

import awards from '../../../entities/award/model/award.json';
import { YEAR_LIST } from '../model/constant';
import { getAwardImage } from '../model/helper';
import '../styles/Award.css';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { AwardTitle } from './Title';
import { YearCategory } from './YearCategory';

const BASE_ITEMS = 5;

function useGridColumns() {
  const [columns, setColumns] = useState(BASE_ITEMS);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(node);
      const cols = style.gridTemplateColumns.split(' ').length;
      setColumns(cols);
    });

    observer.observe(node);
  }, []);

  return { ref, columns };
}

function Award() {
  const [page, setPage] = useState(0);
  const [activeYear, setActiveYear] = useState<string | number>('전체');
  const { ref: gridRef, columns } = useGridColumns();

  const filteredAwards = useMemo(
    () =>
      activeYear === '전체'
        ? awards
        : awards.filter((a) => a.time.startsWith(String(activeYear))),
    [activeYear],
  );

  const rows = Math.ceil(BASE_ITEMS / columns);
  const itemsPerPage = columns * rows;
  const totalPages = Math.ceil(filteredAwards.length / itemsPerPage);

  function handleYearChange(year: string | number) {
    setActiveYear(year);
    setPage(0);
  }

  return (
    <section className='award'>
      <AwardTitle></AwardTitle>
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
              transform: `translateX(calc(-${page * 100}% - ${page}vmax))`,
            }}
          >
            {Array.from({ length: totalPages }, (_, pageIndex) => (
              <div
                key={pageIndex}
                ref={pageIndex === 0 ? gridRef : undefined}
                className='award__card_page'
              >
                {filteredAwards
                  .slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage,
                  )
                  .map((award) => (
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
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

export default Award;

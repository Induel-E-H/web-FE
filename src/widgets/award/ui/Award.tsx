import { useMemo, useState } from 'react';

import awards from '../../../entities/award/model/award.json';
import { YEAR_LIST } from '../model/constant';
import { getAwardImage } from '../model/helper';
import '../styles/Award.css';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { AwardTitle } from './Title';
import { YearCategory } from './YearCategory';

const ITEMS_PER_PAGE = 5;

function Award() {
  const [page, setPage] = useState(0);
  const [activeYear, setActiveYear] = useState<string | number>('전체');

  const filteredAwards = useMemo(
    () =>
      activeYear === '전체'
        ? awards
        : awards.filter((a) => a.time.startsWith(String(activeYear))),
    [activeYear],
  );

  const totalPages = Math.ceil(filteredAwards.length / ITEMS_PER_PAGE);

  function handleYearChange(year: string | number) {
    setActiveYear(year);
    setPage(0);
  }

  return (
    <section className='award'>
      <div className='award__top'>
        <AwardTitle></AwardTitle>
        <YearCategory
          yearList={YEAR_LIST}
          activeYear={activeYear}
          onYearChange={handleYearChange}
        />
      </div>
      <div className='award__card_viewport'>
        <div
          className='award__card_slider'
          style={{
            transform: `translateX(calc(-${page * 100}% - ${page}vmax))`,
          }}
        >
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <div key={pageIndex} className='award__card_page'>
              {filteredAwards
                .slice(
                  pageIndex * ITEMS_PER_PAGE,
                  (pageIndex + 1) * ITEMS_PER_PAGE,
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
    </section>
  );
}

export default Award;

import { useState } from 'react';

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
  const totalPages = Math.ceil(awards.length / ITEMS_PER_PAGE);

  return (
    <section className='award'>
      <div className='award__top'>
        <AwardTitle></AwardTitle>
        <YearCategory yearList={YEAR_LIST}></YearCategory>
      </div>
      <div className='award__card_viewport'>
        <div
          className='award__card_slider'
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <div key={pageIndex} className='award__card_page'>
              {awards
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

import { useMemo, useState } from 'react';

import { AWARD_LIST } from '@entities/award';
import {
  Pagination,
  useYearFilter,
  YEAR_ALL,
  YearCategory,
} from '@features/award';
import { useBreakpoint } from '@shared/lib/breakpoint';

import { getItemsPerPage } from '../model/responsive';
import '../styles/Award.css';
import { AwardTitle } from './AwardTitle';
import { AwardCount } from './Count';
import { AwardPopup } from './Popup';
import { Viewport } from './Viewport';

export function Award() {
  const [currentPage, setCurrentPage] = useState(0);
  const breakpoint = useBreakpoint();
  const itemsPerPage = getItemsPerPage(breakpoint);
  const showPagination = breakpoint !== 'desktop';
  const {
    activeYear,
    yearList,
    handleYearChange: changeYear,
  } = useYearFilter();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleYearChange(year: string | number): void {
    changeYear(year);
    setCurrentPage(0);
  }

  const filteredList = useMemo(() => {
    const list =
      activeYear === YEAR_ALL
        ? AWARD_LIST
        : AWARD_LIST.filter((award) =>
            award.date.startsWith(String(activeYear)),
          );
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [activeYear]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  return (
    <section id='award' className='award' aria-label='수상 기록'>
      <div className='award__top'>
        <AwardTitle />
        <AwardCount awardList={AWARD_LIST} />
      </div>

      <div className='award__content'>
        <YearCategory
          yearList={yearList}
          activeYear={activeYear}
          onYearChange={handleYearChange}
        />
        <Viewport
          safePage={safePage}
          totalPages={totalPages}
          filteredList={filteredList}
          itemsPerPage={itemsPerPage}
          onCardClick={setSelectedId}
          setCurrentPage={setCurrentPage}
        />
        {showPagination && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        {selectedId !== null && (
          <AwardPopup
            awardId={selectedId}
            awardTitle={
              AWARD_LIST.find((a) => a.id === selectedId)?.title ??
              '수상 이미지'
            }
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </section>
  );
}

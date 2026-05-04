import { useMemo } from 'react';

import { AWARD_LIST } from '@entities/award';
import { useAwardStore, YEAR_ALL } from '@features/award';
import { getItemsPerPage } from '@features/award';
import { useBreakpoint } from '@shared/lib/breakpoint';
import { useSlideGesture } from '@shared/lib/useSlideGesture';
import { motion } from 'framer-motion';

import '../styles/Viewport.css';
import { AwardCard } from './AwardCard';

export function Viewport() {
  const activeYear = useAwardStore((s) => s.activeYear);
  const currentPage = useAwardStore((s) => s.currentPage);
  const setCurrentPage = useAwardStore((s) => s.setCurrentPage);
  const setSelectedId = useAwardStore((s) => s.setSelectedId);
  const breakpoint = useBreakpoint();
  const itemsPerPage = getItemsPerPage(breakpoint);

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

  function dispatchPage(valueOrFn: React.SetStateAction<number>) {
    const next =
      typeof valueOrFn === 'function'
        ? valueOrFn(useAwardStore.getState().currentPage)
        : valueOrFn;
    setCurrentPage(next);
  }

  const { ref, onTouchStart, onTouchEnd } = useSlideGesture(
    dispatchPage,
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
      <motion.div
        className='award__card_slider'
        animate={{ x: `-${safePage * 100}%` }}
        transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
      >
        {Array.from({ length: totalPages }, (_, pageIndex) => (
          <div key={pageIndex} className='award__card_page'>
            {getPageItems(pageIndex).map((award) => (
              <AwardCard
                key={award.id}
                award={award}
                onClick={() => setSelectedId(award.id)}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

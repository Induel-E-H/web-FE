import { useMemo, useRef } from 'react';

import { AWARD_LIST, getAwardImage } from '@entities/award';
import { useAwardStore, YearCategory } from '@features/award';
import { useBreakpoint } from '@shared/lib/breakpoint';
import { usePreloadOnVisible } from '@shared/lib/preload/usePreloadOnVisible';
import { AnimatePresence } from 'framer-motion';

import '../styles/Award.css';
import { AwardTitle } from './AwardTitle';
import { AwardCount } from './Count';
import { AwardPopup } from './Popup';
import { Viewport } from './Viewport';

export function Award() {
  const sectionRef = useRef<HTMLElement>(null);
  const awardImageUrls = useMemo(
    () => AWARD_LIST.map((award) => getAwardImage(award.id)),
    [],
  );
  usePreloadOnVisible(sectionRef, awardImageUrls);

  const selectedId = useAwardStore((s) => s.selectedId);
  const isMobile = useBreakpoint() === 'mobile';
  const count = <AwardCount awardList={AWARD_LIST} />;

  return (
    <section
      ref={sectionRef}
      id='award'
      className='award'
      aria-label='수상 기록'
    >
      <div className='award__top'>
        <AwardTitle />
        {isMobile && count}
      </div>

      <div className='award__content'>
        <div className='award__filter'>
          <div className='award__filter-years'>
            <YearCategory />
          </div>
          {!isMobile && count}
        </div>
        <Viewport />
        <AnimatePresence>
          {selectedId !== null && <AwardPopup key='award-popup' />}
        </AnimatePresence>
      </div>
    </section>
  );
}

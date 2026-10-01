import { useRef, useState } from 'react';

import { getPatentImage, PATENT_VALID_LIST } from '@entities/patent';
import { trackPatentCardOpen } from '@shared/lib/analytics';
import { usePreloadOnVisible } from '@shared/lib/preload/usePreloadOnVisible';
import { AnimatePresence } from 'framer-motion';

import '../styles/ValidContent.css';
import { PatentCard } from './PatentCard';
import { PatentPopup } from './Popup';

export function PatentValidContent() {
  const articleRef = useRef<HTMLElement>(null);
  usePreloadOnVisible(
    articleRef,
    PATENT_VALID_LIST.map((_, i) => getPatentImage(i)),
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <article ref={articleRef} className='patent__content'>
      <header className='patent__content__title'>
        <h3 aria-label={`유효 특허증 ${PATENT_VALID_LIST.length}건`}>
          유효 특허증
          <span className='patent__content__badge'>
            {PATENT_VALID_LIST.length}
          </span>
        </h3>
        <hr aria-hidden='true' />
      </header>
      <ul className='patent__content__item__list'>
        {PATENT_VALID_LIST.map((patent, index) => (
          <li key={patent.serialNumber}>
            <PatentCard
              patent={patent}
              onClick={() => {
                trackPatentCardOpen(patent.title);
                setSelectedId(index);
              }}
            />
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {selectedId !== null && (
          <PatentPopup
            patentId={selectedId}
            patentTitle={PATENT_VALID_LIST[selectedId].title}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </article>
  );
}

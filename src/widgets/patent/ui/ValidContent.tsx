import { useRef, useState } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';

import { getPatentImage, PATENT_VALID_LIST } from '@entities/patent';
import { usePreloadOnVisible } from '@shared/lib/preload/usePreloadOnVisible';

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
        <div className='patent__content__title__text'>
          <FaRegCheckCircle
            className='patent__content__icon'
            aria-hidden='true'
          />
          <h3>유효 특허증 ({PATENT_VALID_LIST.length}건)</h3>
        </div>
        <hr />
      </header>
      <ul className='patent__content__item__list'>
        {PATENT_VALID_LIST.map((patent, index) => (
          <li key={patent.serialNumber}>
            <PatentCard patent={patent} onClick={() => setSelectedId(index)} />
          </li>
        ))}
      </ul>
      {selectedId !== null && (
        <PatentPopup
          patentId={selectedId}
          patentTitle={PATENT_VALID_LIST[selectedId].title}
          onClose={() => setSelectedId(null)}
        />
      )}
    </article>
  );
}

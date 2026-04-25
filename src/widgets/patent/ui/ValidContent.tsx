import { useState } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';

import { PATENT_IMAGES, PATENT_VALID_LIST } from '@entities/patent';
import {
  lockScroll,
  unlockScroll,
} from '@shared/lib/useScrollLock/useScrollLock';
import { Popup } from '@shared/ui/Popup';

import '../styles/ValidContent.css';
import { PatentCard } from './Card';

export function PatentValidContent() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleOpen(index: number) {
    lockScroll();
    setSelectedIndex(index);
  }

  function handleClose() {
    unlockScroll();
    setSelectedIndex(null);
  }

  return (
    <article className='patent__content'>
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
        {PATENT_VALID_LIST.map((item, index) => (
          <li key={item.serialNumber}>
            <PatentCard item={item} onClick={() => handleOpen(index)} />
          </li>
        ))}
      </ul>
      {selectedIndex !== null && (
        <Popup
          ariaLabel={PATENT_VALID_LIST[selectedIndex].title}
          onClose={handleClose}
        >
          <img
            src={PATENT_IMAGES[selectedIndex]}
            alt={PATENT_VALID_LIST[selectedIndex].title}
            loading='lazy'
          />
        </Popup>
      )}
    </article>
  );
}

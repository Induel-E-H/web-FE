import { useState } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';

import { PATENT_VALID_LIST } from '@entities/patent';
import img0 from '@entities/patent/assets/0.webp';
import img1 from '@entities/patent/assets/1.webp';
import img2 from '@entities/patent/assets/2.webp';
import img3 from '@entities/patent/assets/3.webp';
import img4 from '@entities/patent/assets/4.webp';
import {
  lockScroll,
  unlockScroll,
} from '@shared/lib/useScrollLock/useScrollLock';
import { Popup } from '@shared/ui/Popup';

import '../styles/ValidContent.css';
import { PatentCard } from './Card';

const PATENT_IMAGES = [img0, img1, img2, img3, img4];

export function PatentValidContent() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleOpen = (index: number) => {
    lockScroll();
    setSelectedIndex(index);
  };

  const handleClose = () => {
    unlockScroll();
    setSelectedIndex(null);
  };

  return (
    <article className='patent__content'>
      <header className='patent__content__title'>
        <div className='patent__content__title__text'>
          <FaRegCheckCircle className='patent__content__icon' />
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

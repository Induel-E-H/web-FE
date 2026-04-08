import { IoDocumentTextOutline } from 'react-icons/io5';

import type { PatentValidType } from '@entities/patent';

import '../styles/Card.css';

export function PatentCard({ item }: { item: PatentValidType }) {
  return (
    <div className='patent__card'>
      <div className='patent__card_frame'>
        <div className='patent__card__content'>
          <IoDocumentTextOutline className='patent__card__content__icon' />
          <div className='patent__card__text'>
            <p className='patent__card__text__title'>{item.title}</p>
            <p className='patent__card__text__serial'>{item.serialNumber}</p>
            <p className='patent__card__text__year'>
              {item.filingDate.slice(0, 4)}년 출원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { IoDocumentTextOutline } from 'react-icons/io5';

import type { PatentValidType } from '@entities/patent';

import '../styles/Card.css';

export function PatentCard({
  item,
  onClick,
}: {
  item: PatentValidType;
  onClick: () => void;
}) {
  return (
    <button className='patent__card' onClick={onClick}>
      <div className='patent__card_frame'>
        <div className='patent__card__content'>
          <IoDocumentTextOutline className='patent__card__content__icon' />
          <div className='patent__card__text'>
            <time
              className='patent__card__text__year'
              dateTime={item.filingDate.replace(/\. /g, '-')}
            >
              {item.filingDate.slice(0, 4)}년 출원
            </time>
            <p className='patent__card__text__title'>{item.title}</p>
            <p className='patent__card__text__serial'>{item.serialNumber}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

import { FaRegCheckCircle } from 'react-icons/fa';

import { PATENT_VALID_LIST } from '@entities/patent';

import '../styles/ValidaContent.css';
import { PatentCard } from './Card';

export function PatentValidContent() {
  return (
    <div className='patent__content'>
      <div className='patent__content__title'>
        <div className='patent__content__title__text'>
          <FaRegCheckCircle className='patent__content__icon' />
          <p>유효 특허증 ({PATENT_VALID_LIST.length}건)</p>
        </div>
        <hr />
      </div>
      <div className='patent__content__item__list'>
        {PATENT_VALID_LIST.map((item) => (
          <PatentCard key={item.serialNumber} item={item} />
        ))}
      </div>
    </div>
  );
}

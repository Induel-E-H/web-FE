import { FaRegFileExcel } from 'react-icons/fa';

import { PATENT_EXPIRE_LIST } from '@entities/patent';

import '../styles/ExpireContent.css';

export function PatentExpireContent() {
  return (
    <div className='patent__expiration'>
      <div className='patent__expiration__title'>
        <div className='patent__expiration__title__text'>
          <FaRegFileExcel className='patent__expiration__icon' />
          <p>만료 특허 이력 ({PATENT_EXPIRE_LIST.length}건)</p>
        </div>
        <hr />
      </div>
      <div className='patent__expiration__content'>
        {PATENT_EXPIRE_LIST.map((item, index) => (
          <div className='patent__expiration__item' key={item.serialNumber}>
            <div className='patent__expiration__item__text'>
              <div className='patent__expiration__item__content'>
                <span>{index + 1}.</span>
                <span>{item.title}</span>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

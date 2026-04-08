import { PATENT_EXPIRE_LIST } from '@entities/patent';

import '../styles/ExpireContent.css';

export function PatentExpireContent() {
  return (
    <div className='patent__expiration'>
      <div className='patent__expiration__title'>
        <div className='patent__expiration__title__text'></div>
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

import { FaRegFileExcel } from 'react-icons/fa';

import { PATENT_EXPIRE_LIST } from '@entities/patent';

import '../styles/ExpireContent.css';

export function PatentExpireContent() {
  return (
    <article className='patent__expiration'>
      <header className='patent__expiration__title'>
        <div className='patent__expiration__title__text'>
          <FaRegFileExcel
            className='patent__expiration__icon'
            aria-hidden='true'
          />
          <h3>만료 특허 이력 ({PATENT_EXPIRE_LIST.length}건)</h3>
        </div>
        <hr />
      </header>
      <ol className='patent__expiration__content'>
        {PATENT_EXPIRE_LIST.map((item, index) => (
          <li className='patent__expiration__item' key={item.serialNumber}>
            <div className='patent__expiration__item__text'>
              <div className='patent__expiration__item__content'>
                <span>{index + 1}.</span>
                <span>{item.title}</span>
              </div>
              <span className='patent__expiration__serial'>
                {item.serialNumber}
              </span>
            </div>
            <hr />
          </li>
        ))}
      </ol>
    </article>
  );
}

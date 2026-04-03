import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import PATENT_LIST_DATA from '@entities/patent/model/patentListData';

function PatentList() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='patent__content-sub'>
      <div className='patent__content-sub-title'>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <IoIosArrowUp size='25' color='var(--typo-contentW)' />
          ) : (
            <IoIosArrowDown size='25' color='var(--typo-contentW)' />
          )}
        </button>
        <span>권리 소멸 목록 ({PATENT_LIST_DATA.length}건)</span>
      </div>

      {isOpen && (
        <ul className='patent__content-sub-list'>
          {PATENT_LIST_DATA.map((item, index) => (
            <li key={index} className='patent__content-sub-list-item'>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatentList;

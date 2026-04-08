import { FiAward } from 'react-icons/fi';

import type { AwardItem } from '@entities/award';

import '../styles/Card.css';

export function Card({
  award,
  onClick,
}: {
  award: AwardItem;
  onClick: (id: number) => void;
}) {
  return (
    <button
      type='button'
      className='award__card'
      onClick={() => onClick(award.id)}
    >
      <div className='award__card__frame'>
        <div className='award__card__content'>
          <FiAward className='award__card__icon' />
          <div className='award__card_text'>
            <p className='award__card_text_year'>{award.date.slice(0, 4)}</p>
            <p className='award__card_text_title'>{award.title}</p>
            <p className='award__card_text_issuer'>{award.issuer}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

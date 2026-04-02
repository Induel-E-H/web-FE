import type { AwardItem } from '@entities/award';

import { getAwardImage } from '../model/image';
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
      <div className='award__card_image'>
        <img src={getAwardImage(award.id)} alt={award.title} loading='lazy' />
      </div>
      <div className='award__card_content'>
        <div className='award__card_text'>
          <p className='award__card_category'>{award.category}</p>
          <strong className='award__card_title'>{award.title}</strong>
        </div>
        <p className='award__card_year'>{award.date.slice(0, 4)}</p>
      </div>
    </button>
  );
}

import { FiAward } from 'react-icons/fi';

import type { AwardItem } from '@entities/award';

import '../styles/AwardCard.css';

export function AwardCard({
  award,
  onClick,
}: {
  award: AwardItem;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      className='award__card'
      onMouseDown={(e) => {
        e.preventDefault();
        e.currentTarget.focus({ preventScroll: true });
      }}
      onClick={onClick}
      aria-label={`${award.title} - ${award.date.slice(0, 4)}, ${award.issuer}`}
    >
      <FiAward className='award__card__icon' aria-hidden='true' />
      <span className='award__card__text' aria-hidden='true'>
        <span className='award__card__title'>{award.title}</span>
        <span className='award__card__issuer'>{award.issuer}</span>
      </span>
    </button>
  );
}

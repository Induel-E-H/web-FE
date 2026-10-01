import { COMPANY } from '@shared/constant';

import '../../styles/book/BackCover.css';

export function BackCoverInner() {
  return (
    <div className='history__back-cover-inner' aria-hidden='true'>
      <hr className='history__back-cover-spine' />
      <div className='history__back-cover-content'>
        {COMPANY.FIELDS.map((word) => (
          <span key={word} className='history__back-cover-word'>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

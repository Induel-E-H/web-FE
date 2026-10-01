import { ESTABLISHED_YEAR } from '@shared/constant';
import { getOrdinalSuffix } from '@shared/lib/ordinal';

import '../../styles/book/FrontCover.css';

export function FrontCoverInner() {
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;

  return (
    <div className='history__front-cover-inner' aria-hidden='true'>
      <hr className='history__front-cover-spine' />
      <div className='history__front-cover-text'>
        <div className='history__front-cover-title'>
          <span>INDUEL</span>
          <span>DESIGN</span>
        </div>
        <div className='history__front-cover-year'>
          <span className='history__front-cover-year-number'>{years}</span>
          <span className='history__front-cover-year-ordinal'>
            {getOrdinalSuffix(years)}
          </span>
        </div>
      </div>
    </div>
  );
}

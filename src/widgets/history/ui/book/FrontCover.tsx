import { COMPANY } from '@shared/constant/company';
import { getOrdinalSuffix } from '@shared/lib/ordinal/getOrdinalSuffix';

import '../../styles/book/FrontCover.css';

const ESTABLISHED_YEAR = new Date(COMPANY.ESTABLISHED).getFullYear();

export function FrontCoverInner() {
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;

  return (
    <div className='history__front-cover-inner'>
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

export function BookFrontCover({ onClick }: { onClick: () => void }) {
  return (
    <div className='history__front-cover' onClick={onClick}>
      <FrontCoverInner />
    </div>
  );
}

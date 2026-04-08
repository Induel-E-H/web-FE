import { FiAward } from 'react-icons/fi';

import type { AwardItem } from '@entities/award';

import '../styles/Count.css';

export function AwardCount({ awardList }: { awardList: AwardItem[] }) {
  return (
    <div className='award__count'>
      <FiAward className='award__count__icon' />
      <p>총 {awardList.length}건의 표창 및 수상</p>
    </div>
  );
}

import { COMPANY } from '@shared/constant';

import '../../styles/book/TitlePage.css';

const ESTABLISHED_YEAR = new Date(COMPANY.ESTABLISHED).getFullYear();

export function TitlePage() {
  return (
    <div className='history__title-page'>
      <span className='history__title-page-company'>{COMPANY.NAME_EN}</span>
      <hr aria-hidden='true' />
      <h3 className='history__title-page-heading'>HISTORY</h3>
      <p className='history__title-page-sub'>걸어온 길</p>
      <hr aria-hidden='true' />
      <span className='history__title-page-years'>
        {ESTABLISHED_YEAR} — {new Date().getFullYear()}
      </span>
    </div>
  );
}

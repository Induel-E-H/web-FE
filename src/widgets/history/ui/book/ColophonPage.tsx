import { COMPANY } from '@shared/constant';

import '../../styles/book/ColophonPage.css';

const FIELDS = ['EXHIBITION', 'ENVIRONMENTAL', 'INTERIOR'] as const;

export function ColophonPage() {
  return (
    <div className='history__colophon'>
      <h3 className='history__colophon-name'>{COMPANY.NAME_EN}</h3>
      <p className='history__colophon-full'>{COMPANY.NAME_EN_FULL}</p>
      <p className='history__colophon-fields'>{FIELDS.join(' · ')}</p>
      <hr aria-hidden='true' />
      <dl className='history__colophon-info'>
        <div>
          <dt>상호</dt>
          <dd>{COMPANY.NAME_KR}</dd>
        </div>
        <div>
          <dt>설립</dt>
          <dd>{COMPANY.ESTABLISHED_DISPLAY}</dd>
        </div>
        <div>
          <dt>주소</dt>
          <dd>{COMPANY.ADDRESS_FULL}</dd>
        </div>
        <div>
          <dt>전화</dt>
          <dd>{COMPANY.PHONE_DISPLAY}</dd>
        </div>
        <div>
          <dt>메일</dt>
          <dd>{COMPANY.EMAIL}</dd>
        </div>
      </dl>
    </div>
  );
}

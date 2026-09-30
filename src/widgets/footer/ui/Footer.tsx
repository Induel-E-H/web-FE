import { useNavigate } from 'react-router-dom';

import { COMPANY } from '@shared/constant';
import { trackPrivacyPolicyClick } from '@shared/lib/analytics';

import '../styles/Footer.css';

const INFO = [
  ['대표이사', COMPANY.CEO],
  ['사업자등록번호', COMPANY.BUSINESS_NO],
  ['주소', COMPANY.ADDRESS_FULL],
  ['TEL', COMPANY.PHONE_DISPLAY],
  ['FAX', COMPANY.FAX],
  ['EMAIL', COMPANY.EMAIL],
] as const;

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className='footer'>
      <div className='footer__top'>
        <div className='footer__company'>
          <div className='footer__icon-frame'>
            <img src='/favicon.svg' alt='인들이앤에이치 로고' loading='lazy' />
          </div>
          <div>
            <strong>{COMPANY.NAME_KR}</strong>
            {COMPANY.NAME_EN_FULL}
          </div>
        </div>
        <button
          type='button'
          className='footer__privacy'
          onClick={() => {
            trackPrivacyPolicyClick();
            void navigate('/privacy_policy');
          }}
        >
          개인정보처리방침
        </button>
      </div>
      <dl className='footer__info'>
        {INFO.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className='footer__copyright'>
        © {new Date(COMPANY.ESTABLISHED).getFullYear()}–
        {new Date().getFullYear()} {COMPANY.NAME_EN_FULL}. All rights reserved.
      </p>
    </footer>
  );
}

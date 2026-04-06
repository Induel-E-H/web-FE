import { COMPANY } from '@shared/constant';

import induelIcon from '@assets/induel-icon.svg';

import '../styles/Footer.css';

export function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__top'>
        <div className='footer__company'>
          <div className='footer__icon-frame'>
            <img src={induelIcon} alt='인들이앤에이치 로고' />
          </div>
          <div className='footer__company_name'>
            <p className='footer__company_name-kor'>(주) {COMPANY.NAME_KO}</p>
            <p className='footer__company_name-eng'>{COMPANY.NAME_EN_FULL}</p>
          </div>
        </div>
        <div className='footer__information'>
          <button>이용약관</button>
          <button>
            <b>개인정보처리방침</b>
          </button>
        </div>
      </div>
      <hr />
      <div className='footer__content'>
        <div className='footer__left'>
          <div className='footer__company_owner'>
            <div className='footer__row'>
              <span>대표이사</span>
              <span>{COMPANY.CEO}</span>
            </div>
            <p className='footer__company_split'>|</p>
            <div className='footer__row'>
              <span>사업자 등록 번호</span>
              <span>{COMPANY.BUSINESS_NO}</span>
            </div>
          </div>
          <div className='footer__row'>
            <span>주소</span>
            <span>{COMPANY.ADDRESS_FULL}</span>
          </div>
        </div>
        <div className='footer__right'>
          <div className='footer__contact'>
            <div className='footer__row'>
              <span>TEL</span>
              <span>{COMPANY.PHONE_DISPLAY}</span>
            </div>
            <p className='footer__company_split'>|</p>
            <div className='footer__row'>
              <span>FAX</span>
              <span>{COMPANY.FAX}</span>
            </div>
          </div>
          <div className='footer__row'>
            <span>EMAIL</span>
            <span>{COMPANY.EMAIL}</span>
          </div>
        </div>
      </div>
      <p className='footer__copyright'>
        ⓒ 2000-2026 {COMPANY.NAME_EN_FULL}. All rights reserved.
      </p>
    </footer>
  );
}

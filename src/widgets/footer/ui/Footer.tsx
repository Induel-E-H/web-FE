import { COMPANY } from '@shared/constant';

import '../styles/Footer.css';

export function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__top'>
        <div className='footer__company'>
          <div className='footer__company-name'>
            <span className='footer__company-name-eng'>{COMPANY.NAME_EN}</span>
            <span className='footer__company-name-kor'>{COMPANY.NAME_KO}</span>
            <span className='footer__company-name-full'>
              {COMPANY.NAME_EN_FULL}
            </span>
          </div>

          <address className='footer__company-owner'>
            <div className='footer__company-row'>
              <span>대표</span>
              <p>{COMPANY.CEO}</p>
            </div>
            <div className='footer__company-row'>
              <span>사업자 등록 번호</span>
              <p>{COMPANY.BUSINESS_NO}</p>
            </div>
          </address>
        </div>

        <address className='footer__contact'>
          <span className='footer__title'>Contact</span>
          <div className='footer__contact-row'>
            <span>Tel</span>
            <a href={`tel:${COMPANY.PHONE}`}>{COMPANY.PHONE_DISPLAY}</a>
          </div>
          <div className='footer__contact-row'>
            <span>Fax</span>
            <p>{COMPANY.FAX}</p>
          </div>
          <div className='footer__contact-row'>
            <span>Email</span>
            <a href={`mailto:${COMPANY.EMAIL}`}>{COMPANY.EMAIL}</a>
          </div>
        </address>

        <address className='footer__address'>
          <span className='footer__title'>Address</span>
          <span>{COMPANY.ADDRESS_FULL}</span>
        </address>
      </div>

      <div className='footer__bottom'>
        <hr />
        <p>© 2000-2026 {COMPANY.NAME_EN_FULL}. All rights reserved. </p>
      </div>
    </footer>
  );
}

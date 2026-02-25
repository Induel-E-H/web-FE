import './styles/footer.css';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__top'>
        <div className='footer__company'>
          <div className='footer__company-name'>
            <span className='footer__company-name-eng'>Induel E&H</span>
            <span className='footer__company-name-kor'>인들이앤에이치</span>
            <span className='footer__company-name-full'>
              Induel Engineering & Holdings
            </span>
          </div>

          <address className='footer__company-owner'>
            <div className='footer__company-row'>
              <span>대표</span>
              <p>이선학</p>
            </div>
            <div className='footer__company-row'>
              <span>사업자 등록 번호</span>
              <p>617-81-27655</p>
            </div>
          </address>
        </div>

        <address className='footer__contact'>
          <h3>Contact</h3>
          <div className='footer__contact-row'>
            <span>Tel</span>
            <a href='tel:051-626-6277'>051-626-6277</a>
          </div>
          <div className='footer__contact-row'>
            <span>Fax</span>
            <a href='tel:051-625-6279'>051-625-6279</a>
          </div>
          <div className='footer__contact-row'>
            <span>Email</span>
            <a href='mailto:seven@induel.com'>seven@induel.com</a>
          </div>
        </address>

        <address className='footer__address'>
          <h3>Address</h3>
          <span>부산광역시 남구 수영로 274-16</span>
        </address>
      </div>

      <div className='footer__bottom'>
        <hr />
        <p>© 2000-2026 Induel Engineering & Holdings. All rights reserved. </p>
      </div>
    </footer>
  );
}
export default Footer;

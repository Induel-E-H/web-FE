import { IoIosArrowDown } from 'react-icons/io';

import { COMPANY } from '@shared/constant';

import induelIcon from '@assets/induel-icon.svg';

import { showScrollArrow } from '../model/heroConfig';
import '../styles/Hero.css';
import HeroBackground from './HeroBackground';

function Hero() {
  return (
    <section className='hero'>
      <HeroBackground />
      <div className='hero__company'>
        <img
          src={induelIcon}
          alt='인들이앤에이치 로고'
          className='hero__logo'
        />
        <div className='hero__company-text'>
          <hgroup>
            <h1 className='hero__company-name'>(주) {COMPANY.NAME_KO}</h1>
            <p className='hero__company-name-en'>{COMPANY.NAME_EN_FULL}</p>
          </hgroup>
          <time className='hero__established' dateTime={COMPANY.ESTABLISHED}>
            SINCE {COMPANY.ESTABLISHED_DISPLAY}
          </time>
        </div>
      </div>
      {showScrollArrow ? (
        <IoIosArrowDown className='hero__down-icon' aria-hidden='true' />
      ) : (
        <p
          style={{
            position: 'absolute',
            bottom: '2.34%',
            width: '100%',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: `
              0 0 40px rgba(0, 0, 0, 1),
              0 0 20px rgba(0, 0, 0, 1),
              0 0 60px rgba(0, 0, 0, 1)
            `,
          }}
        >
          현재 개발중입니다!
        </p>
      )}
    </section>
  );
}

export default Hero;

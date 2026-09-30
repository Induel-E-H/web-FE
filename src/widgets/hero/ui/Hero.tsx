import { COMPANY } from '@shared/constant';

import waveDesktopMp4 from '../assets/hero-wave-desktop.mp4';
import waveDesktopWebm from '../assets/hero-wave-desktop.webm';
import waveMobileMp4 from '../assets/hero-wave-mobile.mp4';
import waveMobileWebm from '../assets/hero-wave-mobile.webm';
import '../styles/Hero.css';

const MOBILE_MEDIA = '(max-width: 767px)';

export function Hero({ showScrollArrow }: { showScrollArrow: boolean }) {
  return (
    <section id='hero' className='hero' aria-label='회사 소개'>
      {/* Poster is a CSS background so it follows the breakpoint. */}
      <div className='hero__background' aria-hidden='true'>
        <video
          className='hero__video'
          autoPlay
          muted
          loop
          playsInline
          preload='auto'
        >
          <source src={waveMobileWebm} type='video/webm' media={MOBILE_MEDIA} />
          <source src={waveMobileMp4} type='video/mp4' media={MOBILE_MEDIA} />
          <source src={waveDesktopWebm} type='video/webm' />
          <source src={waveDesktopMp4} type='video/mp4' />
        </video>
      </div>
      <div className='hero__company'>
        <img
          src='/favicon.svg'
          alt='인들이앤에이치 로고'
          className='hero__logo'
          fetchPriority='high'
        />
        <div className='hero__company-text'>
          <hgroup>
            <h1 className='hero__company-name'>{COMPANY.NAME_KR}</h1>
            <p className='hero__company-name-en'>{COMPANY.NAME_EN_FULL}</p>
          </hgroup>
          <time className='hero__established' dateTime={COMPANY.ESTABLISHED}>
            SINCE {COMPANY.ESTABLISHED_DISPLAY}
          </time>
        </div>
      </div>
      {showScrollArrow ? (
        <span className='hero__scroll-cue' aria-hidden='true'>
          SCROLL
        </span>
      ) : (
        <p
          style={{
            position: 'absolute',
            bottom: '2.34%',
            width: '100%',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: `
              0 0 40px rgb(0, 0, 0, 1),
              0 0 20px rgb(0, 0, 0, 1),
              0 0 60px rgb(0, 0, 0, 1)
            `,
            color: 'white',
          }}
        >
          현재 개발중입니다!
        </p>
      )}
    </section>
  );
}

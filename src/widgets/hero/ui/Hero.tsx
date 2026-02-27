// import { IoIosArrowDown } from 'react-icons/io';
import '../styles/Hero.css';
import HeroBackground from './HeroBackground';

function Hero() {
  return (
    <section className='hero'>
      <HeroBackground />
      <div className='hero__company'>
        <img
          src='/induel-icon.svg'
          alt='인들이앤에이치 로고'
          className='hero__logo'
        />
        <div className='hero__company-text'>
          <h1 className='hero__company-name'>(주) 인들이앤에이치</h1>
          <p className='hero__company-name-en'>Induel Engineering & Holdings</p>
          <time className='hero__established' dateTime='2000-04-27'>
            SINCE 2000.04.27
          </time>
        </div>
      </div>
      {/* <IoIosArrowDown className='hero__down-icon' aria-hidden='true' /> */}
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
    </section>
  );
}

export default Hero;

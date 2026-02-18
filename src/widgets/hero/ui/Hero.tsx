import { IoIosArrowDown } from 'react-icons/io';

import '../styles/Hero.css';

function Hero() {
  return (
    <section className='hero'>
      <div className='hero__background' aria-hidden='true' />
      <div className='hero__company'>
        <img
          src='/induel-icon.svg'
          alt='인들이앤에이치 로고'
          className='hero__logo'
        />
        <div className='hero__company-text'>
          <h1 className='hero__company-name'>(주) 인들이앤에이치</h1>
          <p className='hero__company-name-en'>Induel Engineering & Holdings</p>
        </div>
      </div>
      <time className='hero__established' dateTime='2000-04-27'>
        SINCE 2000.04.27
      </time>
      <IoIosArrowDown className='hero__down-icon' aria-hidden='true' />
    </section>
  );
}

export default Hero;

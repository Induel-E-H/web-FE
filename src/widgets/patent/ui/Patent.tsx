import patent00 from '../assets/0.webp';
import patent01 from '../assets/1.webp';
import patent02 from '../assets/2.webp';
import patent03 from '../assets/3.webp';
import patent04 from '../assets/4.webp';
import '../styles/Patent.css';

function Patent() {
  return (
    <section className='patent'>
      <div className='patent__title'>
        <span className='patent__title-main'>Patent</span>
        <span className='patent__title-descript'>
          유효 특허 5건, 권리 소멸 10건
        </span>
      </div>

      <div className='patent__content'>
        <div className='patent__content-main'>
          <button className='nav__left'></button>

          <div className='patent__card'>
            <img className='card' src={patent00}></img>
            <img className='card' src={patent01}></img>
            <img className='card active' src={patent02}></img>
            <img className='card' src={patent03}></img>
            <img className='card' src={patent04}></img>
          </div>

          <button className='nav__right'></button>
        </div>

        <div className='patent__content-sub'>
          <div className='patent__content-sub-title'>
            <button></button>
            <span>권리 소멸 목록 (10건)</span>
          </div>
          <div className='patent__content-sub-list'></div>
        </div>
      </div>
    </section>
  );
}

export default Patent;

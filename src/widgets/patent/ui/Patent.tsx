import PATENT_IMG_DATA from '@entities/patent/model/patentImgData';
import PATENT_LIST_DATA from '@entities/patent/model/patentListData';

import '../styles/Patent.css';
import PatentCarousel from './PatentCarousel';
import PatentList from './PatentList';

function Patent() {
  return (
    <section className='patent'>
      <div className='patent__title'>
        <span className='patent__title-main'>Patent</span>
        <span className='patent__title-descript'>
          유효 특허 {PATENT_IMG_DATA.length}건, 권리 소멸{' '}
          {PATENT_LIST_DATA.length}건
        </span>
      </div>

      <div className='patent__content'>
        <PatentCarousel images={PATENT_IMG_DATA} />
        <PatentList />
      </div>
    </section>
  );
}

export default Patent;

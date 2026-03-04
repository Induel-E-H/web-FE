import { Fragment } from 'react';

import '../style/History.css';

function History() {
  const indexList = ['List', 'Content', 'History', 'Award'];
  return (
    <>
      <section className='history'>
        <h2 className='history__title'>History</h2>
        <ul className='history__category'>
          {indexList.map((item, index) => (
            <Fragment key={item}>
              <li>{item}</li>
              {index < indexList.length - 1 && <span>|</span>}
            </Fragment>
          ))}
        </ul>
        <div className='history__book'></div>
        <div className='history__last'>
          <p>공간을 문화로 창조하는 기업</p>
        </div>
      </section>
    </>
  );
}

export default History;

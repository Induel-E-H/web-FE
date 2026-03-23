import '../styles/Award.css';
import { AwardTitle } from './Title';
import { YearCategory } from './YearCategory';

function Award() {
  return (
    <section className='award'>
      <div className='award__top'>
        <AwardTitle></AwardTitle>
        <YearCategory></YearCategory>
      </div>
    </section>
  );
}

export default Award;

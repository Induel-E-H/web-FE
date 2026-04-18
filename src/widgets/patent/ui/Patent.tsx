import '../styles/Patent.css';
import { PatentExpireContent } from './ExpireContent';
import { PatentTitle } from './PatentTitle';
import { PatentValidContent } from './ValidContent';

function Patent() {
  return (
    <section className='patent'>
      <PatentTitle />
      <PatentValidContent />
      <PatentExpireContent />
    </section>
  );
}

export default Patent;

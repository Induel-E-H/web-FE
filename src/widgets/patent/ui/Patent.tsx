import '../styles/Patent.css';
import { PatentExpireContent } from './ExpireContent';
import { PatentTitle } from './PatentTitle';
import { PatentValidContent } from './ValidContent';

function Patent() {
  return (
    <section id='patent' className='patent' aria-label='특허 기록'>
      <PatentTitle />
      <PatentValidContent />
      <PatentExpireContent />
    </section>
  );
}

export default Patent;

import { FiPhoneCall } from 'react-icons/fi';

import { TRANSPORT_ITEMS } from '@entities/map';
import { COMPANY } from '@shared/constant';

import '../styles/MapCard.css';

export function MapCard() {
  return (
    <address className='map__card_content'>
      <h3>{COMPANY.NAME_KR} 본사</h3>

      <ul className='map__description'>
        {TRANSPORT_ITEMS.map(({ id, Icon, label, lines }) => (
          <li key={id}>
            <div className='map__icon_frame'>
              <Icon className='map__icon' id={id} aria-hidden='true' />
            </div>
            <div className='map__description_text'>
              <h4>{label}</h4>
              <div className='map__description__content'>
                {lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <hr aria-hidden='true' />

      <a href={`tel:${COMPANY.PHONE}`} className='map__description_call'>
        <FiPhoneCall aria-hidden='true' />
        <div className='map__description_call_text'>
          <span>문의 전화:</span>
          <span>{COMPANY.PHONE_DISPLAY}</span>
        </div>
      </a>
    </address>
  );
}

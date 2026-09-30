import { FiArrowUpRight, FiPhoneCall } from 'react-icons/fi';

import { TRANSPORT_ITEMS } from '@entities/map';
import { COMPANY } from '@shared/constant';

import { NAVER_DIRECTIONS_URL } from '../model/constant';
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

      <div className='map__actions'>
        <a href={`tel:${COMPANY.PHONE}`} className='map__description_call'>
          <FiPhoneCall aria-hidden='true' />
          <span>{COMPANY.PHONE_DISPLAY}</span>
        </a>
        <a
          href={NAVER_DIRECTIONS_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='map__directions'
          aria-label='네이버 지도 길찾기 (새 탭에서 열림)'
        >
          <span>길찾기</span>
          <FiArrowUpRight aria-hidden='true' />
        </a>
      </div>
    </address>
  );
}

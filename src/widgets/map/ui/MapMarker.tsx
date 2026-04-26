import { induelIcon } from '@shared/assets';

import '../styles/mapMarker.css';

export function MapMarker() {
  return (
    <svg
      className='map__marker'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 44 56'
    >
      <defs>
        <radialGradient id='pinGrad' cx='38%' cy='28%' r='62%'>
          <stop offset='0%' stopColor='#4a3527' />
          <stop offset='100%' stopColor='#241812' />
        </radialGradient>
      </defs>
      <ellipse
        className='map__marker__shadow'
        cx='22'
        cy='54'
        rx='7'
        ry='2.5'
      />
      <path
        className='map__marker__body'
        d='M22 1C10.95 1 2 9.95 2 21C2 34.5 22 54 22 54C22 54 42 34.5 42 21C42 9.95 33.05 1 22 1Z'
      />
      <path
        className='map__marker__highlight'
        d='M22 3C14.5 3 8 7.5 5.5 14C9 9 15 6 22 6C29 6 35 9 38.5 14C36 7.5 29.5 3 22 3Z'
      />
      <circle className='map__marker__circle' cx='22' cy='21' r='14' />
      <image
        x='15'
        y='12'
        width='16'
        height='18'
        href={induelIcon}
        preserveAspectRatio='xMidYMid meet'
      />
    </svg>
  );
}

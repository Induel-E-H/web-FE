import type { ReactNode } from 'react';

import '../styles/InfoCard.css';

export function InfoCard({
  icon,
  year,
  title,
  secondary,
  onClick,
  className,
}: {
  icon: ReactNode;
  year: { text: string; dateTime: string };
  title: string;
  secondary: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type='button'
      className={`info-card${className ? ` ${className}` : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        (e.currentTarget as HTMLButtonElement).focus();
        onClick();
      }}
      aria-label={`${title} - ${year.text}, ${secondary}`}
    >
      <div className='info-card__frame'>
        <div className='info-card__content'>
          <div className='info-card__icon' aria-hidden='true'>
            {icon}
          </div>
          <div className='info-card__text' aria-hidden='true'>
            <time className='info-card__text__year' dateTime={year.dateTime}>
              {year.text}
            </time>
            <p className='info-card__text__title'>{title}</p>
            <p className='info-card__text__secondary'>{secondary}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

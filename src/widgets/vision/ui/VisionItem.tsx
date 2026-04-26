import { useIntersectionAnimation } from '@shared/lib/useIntersectionAnimation';

import '../styles/VisionItem.css';

interface VisionItemProps {
  title: string;
  description: string;
  keyword: string;
  image: string;
  imageSrcSet?: string;
  index: number;
}

export function VisionItem({
  title,
  description,
  keyword,
  image,
  index,
}: VisionItemProps) {
  const isReverse = index % 2 !== 0;
  const ref = useIntersectionAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`vision__content${isReverse ? ' vision__content--reverse' : ''}`}
    >
      <div className='vision__content__image'>
        <img
          src={image}
          sizes='(max-width: 767px) 100vw, (max-width: 1024px) 67vw, 710px'
          width={710}
          height={473}
          alt={title}
          loading='lazy'
        />
      </div>
      <div className='vision__content__text'>
        <div className='vision__content__title'>
          <p className='vision__content__index'>VISION {index + 1}</p>
          <div className='vision__content__title__main'>
            <h3>{keyword}</h3>
            <h4>{title}</h4>
          </div>
          <hr aria-hidden='true' />
        </div>
        <p className='vision__content__description'>{description}</p>
      </div>
    </div>
  );
}

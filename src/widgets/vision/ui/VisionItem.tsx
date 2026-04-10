import { useEffect, useRef } from 'react';

import '../styles/VisionItem.css';

interface VisionItemProps {
  title: string;
  description: string;
  keyword: string;
  image: string;
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
        } else if (entry.boundingClientRect.top > 0) {
          el.classList.remove('is-visible');
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`vision__content${isReverse ? ' vision__content--reverse' : ''}`}
    >
      <div className='vision__content__image'>
        <img src={image} alt={title} />
      </div>
      <div className='vision__content_text'>
        <div className='vision__content__title'>
          <p className='vision__content__index'>VISION {index + 1}</p>
          <div className='vision__content__title__main'>
            <h3>{keyword}</h3>
            <h4>{title}</h4>
          </div>
          <hr />
        </div>
        <p className='vision__content__description'>{description}</p>
      </div>
    </div>
  );
}

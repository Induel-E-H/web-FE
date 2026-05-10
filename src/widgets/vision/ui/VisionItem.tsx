import { useScrollAnimation } from '@shared/lib/animation/useScrollAnimation';
import { motion } from 'framer-motion';

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
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={`vision__content${isReverse ? ' vision__content--reverse' : ''}`}
      initial={false}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
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
    </motion.div>
  );
}

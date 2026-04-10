import { useEffect, useRef } from 'react';

import visionInvest from '@entities/vision/assets/vision_invest.webp';
import visionParam from '@entities/vision/assets/vision_param.webp';
import visionSculpt from '@entities/vision/assets/vision_sculpt.webp';
import { VISION_DATA } from '@entities/vision/model/visionData';
import '@widgets/vision/styles/Vision.css';

import '../styles/Vision.css';
import { VisionTitle } from './Title';
import { VisionItem } from './VisionItem';

const imageMap = {
  'vision_param.webp': visionParam,
  'vision_sculpt.webp': visionSculpt,
  'vision_invest.webp': visionInvest,
};

export function Vision() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
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
    <section className='vision'>
      <VisionTitle ref={titleRef} />
      <div className='vision__main'>
        {VISION_DATA.map((item, index) => (
          <VisionItem
            key={item.keyword}
            title={item.title}
            description={item.description}
            keyword={item.keyword}
            image={imageMap[item.image as keyof typeof imageMap]}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

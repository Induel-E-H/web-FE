import { useEffect, useRef } from 'react';

import visionInvest from '@entities/vision/assets/vision_invest.webp';
import visionInvest480 from '@entities/vision/assets/vision_invest@480.webp';
import visionInvest768 from '@entities/vision/assets/vision_invest@768.webp';
import visionInvest1200 from '@entities/vision/assets/vision_invest@1200.webp';
import visionParam from '@entities/vision/assets/vision_param.webp';
import visionParam480 from '@entities/vision/assets/vision_param@480.webp';
import visionParam768 from '@entities/vision/assets/vision_param@768.webp';
import visionParam1200 from '@entities/vision/assets/vision_param@1200.webp';
import visionSculpt from '@entities/vision/assets/vision_sculpt.webp';
import visionSculpt480 from '@entities/vision/assets/vision_sculpt@480.webp';
import visionSculpt768 from '@entities/vision/assets/vision_sculpt@768.webp';
import visionSculpt1200 from '@entities/vision/assets/vision_sculpt@1200.webp';
import { VISION_DATA } from '@entities/vision/model/visionData';
import '@widgets/vision/styles/Vision.css';

import '../styles/Vision.css';
import { VisionItem } from './VisionItem';
import { VisionTitle } from './VisionTitle';

const imageMap = {
  'vision_param.webp': visionParam,
  'vision_sculpt.webp': visionSculpt,
  'vision_invest.webp': visionInvest,
};

const srcSetMap = {
  'vision_param.webp': `
    ${visionParam480} 480w,
    ${visionParam768} 768w,
    ${visionParam1200} 1200w
  `,
  'vision_sculpt.webp': `
    ${visionSculpt480} 480w,
    ${visionSculpt768} 768w,
    ${visionSculpt1200} 1200w
  `,
  'vision_invest.webp': `
    ${visionInvest480} 480w,
    ${visionInvest768} 768w,
    ${visionInvest1200} 1200w
  `,
};

export function Vision() {
  const titleRef = useRef<HTMLElement>(null);

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
            imageSrcSet={srcSetMap[item.image as keyof typeof srcSetMap]}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
